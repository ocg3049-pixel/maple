"""Persist real Maker combat-analysis measurements and report completed groups."""
import datetime
import json
import os
from pathlib import Path
import select
import subprocess
import time

ROOT = Path(__file__).resolve().parent
BINARY = "/Library/Application Support/Nexon/MapleStory Worlds/MapleStory Worlds.app/Contents/MacOS/MakerMCP"
JOBS = ["히어로", "팔라딘", "다크나이트", "비숍", "아크메이지(썬,콜)", "아크메이지(불,독)", "신궁", "보우마스터", "나이트로드", "섀도어"]
LEVELS = [40, 60, 80, 100, 140]
MAPS = {40: ["101030100", "101073000"], 60: ["100040000", "211050000"], 80: ["105030500", "211040700"], 100: ["240030200", "240030100"], 140: ["100051025", "100051026"]}
TOTAL = len(JOBS) * len(LEVELS) * 2


class Maker:
    def __init__(self):
        self.seq = 0
        self.proc = subprocess.Popen([BINARY], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, bufsize=1)
        self.rpc("initialize", {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "hunting-benchmark-recorder", "version": "1"}})
        self.proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
        self.proc.stdin.flush()

    def rpc(self, method, params):
        self.seq += 1
        seq = self.seq
        self.proc.stdin.write(json.dumps({"jsonrpc": "2.0", "id": seq, "method": method, "params": params}, ensure_ascii=False) + "\n")
        self.proc.stdin.flush()
        deadline = time.monotonic() + 45
        while time.monotonic() < deadline:
            ready, _, _ = select.select([self.proc.stdout], [], [], max(0, deadline-time.monotonic()))
            if not ready:
                break
            line = self.proc.stdout.readline()
            if not line:
                raise RuntimeError("Maker MCP closed")
            data = json.loads(line)
            if data.get("id") == seq:
                if "error" in data:
                    raise RuntimeError(str(data["error"]))
                return data["result"]
        raise TimeoutError(method)

    def call(self, name, arguments):
        result = self.rpc("tools/call", {"name": name, "arguments": arguments})
        if result.get("isError"):
            raise RuntimeError(str(result))
        return json.loads(next(c["text"] for c in result["content"] if c["type"] == "text"))


def atomic(name, value):
    tmp = ROOT / (name + ".tmp")
    tmp.write_text(value, encoding="utf-8")
    tmp.replace(ROOT / name)


def main():
    (ROOT / "recorder.pid").write_text(str(os.getpid()))
    keep_awake = subprocess.Popen(["/usr/bin/caffeinate", "-i", "-w", str(os.getpid())])
    rows, builds, events, seen = {}, {}, [], set()
    eventfile = ROOT / "events.jsonl"
    if eventfile.exists():
        for line in eventfile.read_text(encoding="utf-8").splitlines():
            event = json.loads(line)
            events.append(event)
            seen.add((event["time"], event["message"]))
    maker = None
    status = {"phase": "waiting_for_runner", "completed": 0, "total": TOTAL}
    finished = False
    retries = {}
    last_recovery_event = None
    try:
        while not finished:
            try:
                if maker is None:
                    maker = Maker()
                result = maker.call("maker_logs", {"kind": "normal"})
                new_combat_errors = []
                for item in result.get("logs", []):
                    message = item.get("message", "")
                    if item.get("logType") == "Error":
                        error_key = (item.get("dateTime", ""), message)
                        if error_key not in seen:
                            seen.add(error_key)
                            if any(any(name in frame.get("methodName", "") for name in ("AutoHuntManager", "PlayerAttack", "SkillManager", "LuckySevenProjectile", "Monster")) for frame in (item.get("stackTrace", []) or [])):
                                new_combat_errors.append(item)
                            with (ROOT / "runtime_errors.jsonl").open("a", encoding="utf-8") as out:
                                out.write(json.dumps(item, ensure_ascii=False)+"\n")
                    if "[HUNTBENCH:" not in message:
                        continue
                    key = (item.get("dateTime", ""), message)
                    if key in seen:
                        continue
                    seen.add(key)
                    event = {"time": key[0], "message": message, "server": item.get("isGeneratedFromServer", False)}
                    events.append(event)
                    with eventfile.open("a", encoding="utf-8") as out:
                        out.write(json.dumps(event, ensure_ascii=False) + "\n")
                for event in events:
                    message = event["message"].split("[HUNTBENCH:", 1)[1]
                    tag, payload = message.split("] ", 1)
                    data = json.loads(payload)
                    if tag == "RESULT" and data.get("revision") == "motion-ai-fix-20261014":
                        rows[(data["job"], data["level"], data["map"])] = data
                    elif tag == "BUILD":
                        builds[(data["job"], data["level"])] = data
                    elif tag in ("STATUS", "ERROR", "DONE"):
                        status = dict(data, phase=tag.lower() if tag != "STATUS" else data["phase"])
                if new_combat_errors and status.get("phase") in ("settle", "hunting", "travel", "build"):
                    maker.call("maker_execute_script", {"context": "client", "script": "local b=_BattleStatsManager._T.huntBenchmark; if b and b.running then b.abortReason='Combat runtime error; see runtime_errors.jsonl'; b.running=false end"})
                ordered = sorted((r for r in rows.values() if r["map"] in MAPS.get(r["level"], [])), key=lambda x: (x["level"], x["job"], MAPS[x["level"]].index(x["map"])))
                additional = [r for r in rows.values() if r["map"] not in MAPS.get(r["level"], [])]
                atomic("additional_results.jsonl", "".join(json.dumps(r, ensure_ascii=False)+"\n" for r in additional))
                atomic("results.jsonl", "".join(json.dumps(r, ensure_ascii=False)+"\n" for r in ordered))
                atomic("builds.json", json.dumps(list(builds.values()), ensure_ascii=False, indent=2))
                status["completed"] = len(ordered)
                status["total"] = TOTAL
                status["mapsPerLevel"] = 2
                status["recordedAt"] = datetime.datetime.now().astimezone().isoformat()
                atomic("status.json", json.dumps(status, ensure_ascii=False, indent=2))
                lines = ["직업별 5분 자동사냥 실제 측정 메모", "", "조건: HP·MP 무제한, 해금된 해당 직업 스킬 최대 투자(차수별 10,000 SP).", "기존 자동사냥 AI 및 실제 전투분석 사용. 분석 6분 = 준비 1분 + 사냥 5분.", "동일 레벨에서는 모든 직업에 같은 2개 사냥터 사용. 정확한 -5레벨 사냥터가 부족하면 인접 레벨을 사용하며 results.jsonl에 실제 몬스터 레벨 기록.", "2개 사냥터의 측정이 모두 끝난 직업·레벨만 평균 표시. 진행 중 값은 최종 평균이 아님.", "160레벨 제외. 수정 전 99건은 before-fix/results.jsonl에 보존하며 이 평균에서 제외.", "모션·자동사냥 스킬·나이트로드 처치 오류 수정 후 재측정. 10직업 × 5레벨 × 2사냥터 = 100회.", "", "진행: {}/{}, 상태: {}".format(len(ordered), TOTAL, status.get("phase")), "최종 기록: " + status["recordedAt"], "", "직업 | 40 | 60 | 80 | 100 | 140 (단위: 마리/5분)"]
                for job, name in enumerate(JOBS, 1):
                    cells = [name]
                    for level in LEVELS:
                        group = [r for r in ordered if r["job"] == job and r["level"] == level]
                        cells.append("{:.1f}".format(sum(r["kills"] for r in group)/2) if len(group)==2 else "미완료({}/2)".format(len(group)))
                    lines.append(" | ".join(cells))
                if status.get("phase") == "error":
                    lines += ["", "측정 중단 원인: " + str(status.get("message", "확인 필요"))]
                atomic("사냥능력_측정메모.txt", "\n".join(lines)+"\n")
                if status.get("phase") == "error":
                    error_event = next((e for e in reversed(events) if "[HUNTBENCH:ERROR]" in e["message"]), None)
                    error_key = (error_event["time"], error_event["message"]) if error_event else None
                    retry_key = (status.get("job"), status.get("level"), status.get("map"))
                    if error_key and error_key != last_recovery_event and retries.get(retry_key, 0) < 3:
                        retries[retry_key] = retries.get(retry_key, 0) + 1
                        last_recovery_event = error_key
                        runner = (ROOT / "run_benchmark.lua").read_text(encoding="utf-8")
                        maker.call("maker_execute_script", {"context": "client", "script": runner})
                        with (ROOT / "recovery.log").open("a", encoding="utf-8") as out:
                            out.write(datetime.datetime.now().isoformat()+" retry "+repr(retry_key)+" attempt "+str(retries[retry_key])+"\n")
                if len(result.get("logs", [])) > 25000:
                    maker.call("maker_clear_logs", {})
                finished = status.get("phase") == "done" and len(ordered) == TOTAL
                if finished:
                    maker.call("maker_stop", {})
            except Exception as exc:
                with (ROOT / "recorder_errors.log").open("a", encoding="utf-8") as out:
                    out.write(datetime.datetime.now().isoformat()+" "+repr(exc)+"\n")
                if maker:
                    maker.proc.terminate()
                    maker = None
            if not finished:
                time.sleep(15)
    finally:
        keep_awake.terminate()
        if maker:
            maker.proc.terminate()


if __name__ == "__main__":
    main()
