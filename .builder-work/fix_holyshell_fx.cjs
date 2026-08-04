// 홀리 매직쉘 가드 연출 조정(소환수 3종):
//  - 막을 때 사운드 제거(요청)
//  - 쉴드 이펙트를 더 아래로 (y 0.2 -> -0.1)
const fs = require("fs");

const FILES = [
  "RootDesk/MyDesk/Skills/HeroSummon.mlua",
  "RootDesk/MyDesk/Skills/HealerSummon.mlua",
  "RootDesk/MyDesk/Skills/SummonDragon.mlua",
];

const OLD_SOUND = '\t\t_SoundService:PlaySound("299081e8a23d4f09b9e9858b94662cb2", 1.0)\n';
const OLD_FX = 'local serial = _EffectService:PlayEffectAttached("ec0acf34d59043f695f43c55222a7b0e", self.Entity, Vector3(0, 0.2, 0), 0, Vector3(1, 1, 1), false, { ["OrderInLayer"] = 8 })';
const NEW_FX = 'local serial = _EffectService:PlayEffectAttached("ec0acf34d59043f695f43c55222a7b0e", self.Entity, Vector3(0, -0.1, 0), 0, Vector3(1, 1, 1), false, { ["OrderInLayer"] = 8 })';

const OLD_COMMENT = '\t\t-- 쉴드 성공 연출: 막은 개체 몸에서 쉴드 이펙트 + "Guard" 표시 + 머리 위 남은 개수 숫자';
const NEW_COMMENT = '\t\t-- 쉴드 성공 연출: 막은 개체 몸에서 쉴드 이펙트 + "Guard" 표시 + 머리 위 남은 개수 숫자.\n\t\t-- (피드백) 막을 때 사운드는 재생하지 않는다. 이펙트 높이도 0.2 → -0.1로 더 내렸다.';

for (const f of FILES) {
  let src = fs.readFileSync(f, "utf8");
  let changed = 0;
  if (src.includes(OLD_SOUND)) { src = src.replace(OLD_SOUND, ""); changed++; }
  if (src.includes(OLD_FX)) { src = src.replace(OLD_FX, NEW_FX); changed++; }
  if (src.includes(OLD_COMMENT)) { src = src.replace(OLD_COMMENT, NEW_COMMENT); changed++; }
  fs.writeFileSync(f, src, "utf8");
  console.log(f + " -> " + changed + "곳 수정");
}
