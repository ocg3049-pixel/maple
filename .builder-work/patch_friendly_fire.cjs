// 투사체 공격 컴포넌트의 아군 오폭 필터에 힐러 소환수(script.HealerSummon)를 추가한다.
const fs = require("fs");

const TAB_FILES = [
  "ArrowBlowProjectileAttack", "FireArrowProjectileAttack", "DoubleShotProjectileAttack",
  "IronArrowProjectileAttack", "SnipingProjectileAttack", "RapidFireProjectileAttack",
  "StrafeProjectileAttack", "HurricaneProjectileAttack", "AvengerProjectileAttack",
];

const OLD_TAB = '\t\tif defender:GetComponent("script.HeroSummon") ~= nil then return false end';
const NEW_TAB = OLD_TAB + '\n\t\tif defender:GetComponent("script.HealerSummon") ~= nil then return false end';

for (const name of TAB_FILES) {
  const p = `RootDesk/MyDesk/Skills/${name}.mlua`;
  let src = fs.readFileSync(p, "utf8");
  if (src.includes('script.HealerSummon')) { console.log("SKIP (already patched):", name); continue; }
  const count = src.split(OLD_TAB).length - 1;
  if (count !== 1) { console.log("!! unexpected match count " + count + " in " + name); continue; }
  src = src.replace(OLD_TAB, NEW_TAB);
  src = src.replace("아군 소환수(용사)는 판정에서 제외한다", "아군 소환수(용사/힐러)는 판정에서 제외한다");
  fs.writeFileSync(p, src, "utf8");
  console.log("patched:", name);
}

// SnailSkillProjectileAttack 만 공백 들여쓰기 + 여러 줄 형태다.
{
  const p = "RootDesk/MyDesk/Skills/SnailSkillProjectileAttack.mlua";
  let src = fs.readFileSync(p, "utf8");
  const OLD = '        if defender:GetComponent("script.HeroSummon") ~= nil then\n            return false\n        end';
  const NEW = OLD + '\n        if defender:GetComponent("script.HealerSummon") ~= nil then\n            return false\n        end';
  if (src.includes("script.HealerSummon")) {
    console.log("SKIP (already patched): SnailSkillProjectileAttack");
  } else if ((src.split(OLD).length - 1) !== 1) {
    console.log("!! unexpected match in SnailSkillProjectileAttack");
  } else {
    src = src.replace(OLD, NEW);
    src = src.replace("아군 소환수(용사)는 판정에서 제외한다", "아군 소환수(용사/힐러)는 판정에서 제외한다");
    fs.writeFileSync(p, src, "utf8");
    console.log("patched: SnailSkillProjectileAttack");
  }
}
