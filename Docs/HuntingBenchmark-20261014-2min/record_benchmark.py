"""Persist actual 120-second Maker trials; reset monsters before each start."""
import datetime, importlib.util, json, os, subprocess, time, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("old_recorder",ROOT.parent/"HuntingBenchmark-20261013"/"record_benchmark.py")
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
JOBS=mod.JOBS

def save(name,data):
 p=ROOT/(name+".tmp");p.write_text(data,encoding="utf-8");p.replace(ROOT/name)

def main():
 (ROOT/"recorder.pid").write_text(str(os.getpid()))
 awake=subprocess.Popen(["/usr/bin/caffeinate","-i","-w",str(os.getpid())])
 maker=mod.Maker();seen=set();rows={};builds={};status={"phase":"starting","completed":0,"total":30};reset=set();started=time.monotonic()
 try:
  if "--attach" not in sys.argv:
   maker.call("maker_execute_script",{"context":"client","script":(ROOT/"run_benchmark.lua").read_text()})
  else:
   for line in (ROOT/"results.jsonl").read_text().splitlines():
    r=json.loads(line);rows[(r["level"],r["job"])]=r
   for r in json.loads((ROOT/"builds.json").read_text()):builds[(r["level"],r["job"])]=r
   for line in (ROOT/"events.jsonl").read_text().splitlines():
    e=json.loads(line)
    if e["tag"]=="PREPARED":reset.add(e["data"]["seq"])
   for item in maker.call("maker_logs",{"kind":"normal"}).get("logs",[]):seen.add((item.get("dateTime"),item.get("message","")))
  while True:
   logs=maker.call("maker_logs",{"kind":"normal"}).get("logs",[])
   for item in logs:
    msg=item.get("message","");key=(item.get("dateTime"),msg)
    if key in seen: continue
    seen.add(key)
    if item.get("logType")=="Error":
     with (ROOT/"runtime_errors.jsonl").open("a") as f:f.write(json.dumps(item,ensure_ascii=False)+"\n")
    if "[HUNT2:" not in msg: continue
    tag,payload=msg.split("[HUNT2:",1)[1].split("] ",1);data=json.loads(payload)
    with (ROOT/"events.jsonl").open("a") as f:f.write(json.dumps({"time":key[0],"tag":tag,"data":data},ensure_ascii=False)+"\n")
    if tag=="RESULT":
     rows[(data["level"],data["job"])]=data
     print("RESULT",data["level"],data["jobName"],data["kills"],data["status"],flush=True)
    elif tag=="BUILD": builds[(data["level"],data["job"])]=data
    elif tag in ("STATUS","ERROR","DONE"):
     status=dict(data,phase=data.get("phase",tag.lower()))
     if tag!="STATUS":print(tag,json.dumps(data,ensure_ascii=False),flush=True)
    if (tag=="PREPARED" or (tag=="STATUS" and data.get("phase")=="prepared")) and data["seq"] not in reset:
     seq=data["seq"];reset.add(seq)
     script="""local player=_UserService:GetUserEntityByUserId('20372000503737989')
if not isvalid(player) or player.CurrentMap.Name~='%s' then error('Benchmark reset wrong map') end
local count=0
local visit
visit=function(e)
 if not isvalid(e) then return end
 local m=e:GetComponent('script.Monster')
 if isvalid(m) then m:Respawn();count=count+1 end
 for _,child in ipairs(e.Children:ToTable()) do visit(child) end
end
visit(player.CurrentMap)
log('[HUNT2:RESET] '.._HttpService:JSONEncode({seq=%d,count=count,map=player.CurrentMap.Name}))"""%(data["map"],seq)
     maker.call("maker_execute_script",{"context":"server_main","script":script})
    elif tag=="RESET":
     if data["count"]<=0:raise RuntimeError("No monsters reset")
     maker.call("maker_execute_script",{"context":"client","script":"local b=_BattleStatsManager._T.twoMinuteBenchmark;if b and b.running and b.seq==%d and b.phase=='prepared' then b.ready=true end"%data["seq"]})
   ordered=[rows[k] for k in sorted(rows)]
   save("results.jsonl","".join(json.dumps(r,ensure_ascii=False)+"\n" for r in ordered))
   save("builds.json",json.dumps(list(builds.values()),ensure_ascii=False,indent=2))
   status.update(completed=len(rows),total=30,recordedAt=datetime.datetime.now().astimezone().isoformat())
   save("status.json",json.dumps(status,ensure_ascii=False,indent=2))
   lines=["직업별 2분 자동사냥 측정", "HP·MP 무제한, 해금된 직업 스킬 최대 투자, 동일 레벨 동일 사냥터.","60: 골렘의 사원 입구(Lv.55), 100: 용의 숲2(Lv.95), 150: 지하 1층 전자 매장 <1>(Lv.146)","각 회차 몬스터 초기화·동일 입장 위치, 실제 전투분석 120초. 순위는 해당 레벨 내 처치수 기준.","진행: %d/30, 상태: %s"%(len(rows),status.get("phase")),"직업 | 60레벨 | 100레벨 | 150레벨 (마리/2분)"]
   for job,name in enumerate(JOBS,1):lines.append(" | ".join([name]+[str(rows[(lv,job)]["kills"]) if (lv,job) in rows else "미측정" for lv in (60,100,150)]))
   save("사냥효율_측정기록.txt","\n".join(lines)+"\n")
   if status.get("phase")=="error":raise RuntimeError(status)
   if len(rows)==30 and status.get("phase")=="done":
    maker.call("maker_stop",{});print("COMPLETE 30/30",flush=True);break
   if time.monotonic()-started>9000:raise RuntimeError("Recorder exceeded 150 minutes")
   # Keep logs until completion; clearing could race with newly emitted trial events.
   time.sleep(5)
 finally:
  awake.terminate();maker.proc.terminate()

if __name__=="__main__":main()
