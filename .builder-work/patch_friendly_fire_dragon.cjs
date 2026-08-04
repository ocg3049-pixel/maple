// 투사체 공격 컴포넌트의 아군 오폭 필터에 용 소환수(script.SummonDragon)를 추가한다.
const fs = require("fs");

const TAB_FILES = [
  "ArrowBlowProjectileAttack", "FireArrowProjectileAttack", "DoubleShotProjectileAttack",
  "IronArrowProjectileAttack", "SnipingProjectileAttack", "RapidFireProjectileAttack",
  "StrafeProjectileAttack", "HurricaneProjectileAttack", "AvengerProjectileAttack",
];

const OLD_TAB = '\t\tif defender:GetComponent("script.HealerSummon") ~= nil then return false end';
const NEW_TAB = OLD_TAB + '\n\t\tif defender:GetComponent("script.SummonDragon") ~= nil then return false end';

for (const name of TAB_FILES) {
  const p = `RootDesk/MyDesk/Skills/${name}.mlua`;
  let src = fs.readFileSync(p, "utf8");
  if (src.includes("script.SummonDragon")) { console.log("SKIP (already patched):", name); continue; }
  if ((src.split(OLD_TAB).length - 1) !== 1) { console.log("!! unexpected match in " + name); continue; }
  src = src.replace(OLD_TAB, NEW_TAB);
  src = src.replace("아군 소환수(용사/힐러)는 판정에서 제외한다", "아군 소환수(용사/힐러/용)는 판정에서 제외한다");
  fs.writeFileSync(p, src, "utf8");
  console.log("patched:", name);
}

{
  const p = "RootDesk/MyDesk/Skills/SnailSkillProjectileAttack.mlua";
  let src = fs.readFileSync(p, "utf8");
  const OLD = '        if defender:GetComponent("script.HealerSummon") ~= nil then\n            return false\n        end';
  const NEW = OLD + '\n        if defender:GetComponent("script.SummonDragon") ~= nil then\n            return false\n        end';
  if (src.includes("script.SummonDragon")) {
    console.log("SKIP (already patched): SnailSkillProjectileAttack");
  } else if ((src.split(OLD).length - 1) !== 1) {
    console.log("!! unexpected match in SnailSkillProjectileAttack");
  } else {
    src = src.replace(OLD, NEW);
    src = src.replace("아군 소환수(용사/힐러)는 판정에서 제외한다", "아군 소환수(용사/힐러/용)는 판정에서 제외한다");
    fs.writeFileSync(p, src, "utf8");
    console.log("patched: SnailSkillProjectileAttack");
  }
}
