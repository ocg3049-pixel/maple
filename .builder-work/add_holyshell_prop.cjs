// 소환수 3종에 HolyShell 프로퍼티 선언을 추가한다(클라가 숫자를 그릴 필요는 없어 서버 전용).
const fs = require("fs");

const TARGETS = [
  { file: "RootDesk/MyDesk/Skills/HeroSummon.mlua",
    anchor: '\t@Sync property string MotionCmd = ""         -- "seq|모션명|재생속도" - 1회성 스킬 모션 명령' },
  { file: "RootDesk/MyDesk/Skills/HealerSummon.mlua",
    anchor: '\t@Sync property string MotionCmd = ""           -- "seq|모션명|재생속도" - 1회성 스킬 모션 명령' },
  { file: "RootDesk/MyDesk/Skills/SummonDragon.mlua",
    anchor: '\t@Sync property boolean Moving = false           -- 이동 클립 / 제자리 클립 선택용' },
];

const PROP = '\n\tproperty integer HolyShell = 0                 -- 서버 전용: 홀리 매직쉘 잔여 방어 횟수(개체별)';

for (const t of TARGETS) {
  let src = fs.readFileSync(t.file, "utf8");
  if (src.includes("property integer HolyShell")) { console.log("SKIP:", t.file); continue; }
  const n = src.split(t.anchor).length - 1;
  if (n !== 1) { console.log("!! anchor count=" + n + " in " + t.file); continue; }
  src = src.replace(t.anchor, t.anchor + PROP);
  fs.writeFileSync(t.file, src, "utf8");
  console.log("patched:", t.file);
}
