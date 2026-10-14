import json
import time
from pathlib import Path
from record_benchmark import Maker, atomic

ROOT = Path(__file__).resolve().parent
maker = Maker()
seen = set()
events = []
try:
    while True:
        logs = maker.call('maker_logs', {'kind': 'normal'}).get('logs', [])
        for item in logs:
            key = (item.get('dateTime'), item.get('message'))
            if key in seen:
                continue
            seen.add(key)
            message = item.get('message', '')
            if item.get('logType') == 'Error' or any(s in message for s in ('HUNTDIAG:', '[CombatMotion]', '[VRF] CombatMotion', '[SkillManager]', '[AutoHunt] 속성', '[ColdBeam]', '[IceDemon]', '[IceStrike]', '[MagicBooster')):
                events.append(item)
                with (ROOT/'nightlord-diagnostic-events.jsonl').open('a') as out:
                    out.write(json.dumps(item, ensure_ascii=False)+'\n')
        rows = []
        done = None
        current = None
        for item in events:
            message = item['message']
            if '[HUNTDIAG:START] ' in message:
                current = json.loads(message.split('[HUNTDIAG:START] ', 1)[1])
            if '[HUNTDIAG:AFTER] ' in message:
                rows.append(json.loads(message.split('[HUNTDIAG:AFTER] ', 1)[1]))
            if '[HUNTDIAG:AFTER_DONE] ' in message:
                done = json.loads(message.split('[HUNTDIAG:AFTER_DONE] ', 1)[1])
        errors = [e for e in events if e.get('logType') == 'Error']
        atomic('diagnostics-nightlord.json', json.dumps({'current': current, 'rows': rows, 'done': done, 'errors': errors}, ensure_ascii=False, indent=2))
        if done is not None:
            break
        time.sleep(10)
finally:
    maker.proc.terminate()
