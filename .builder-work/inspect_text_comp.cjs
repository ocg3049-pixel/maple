const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
for (const p of [
  "/ui/DefaultGroup/SkillWindow/SkillBookTitle",
  "/ui/DefaultGroup/SkillWindow/SkillCard1/Level",
  "/ui/DefaultGroup/SkillWindow/SkillCard1/NamePill",
  "/ui/DefaultGroup/SkillWindow/Tab_0_BG",
  "/ui/DefaultGroup/SkillWindow/Tab_0_Label",
]) {
  const e = b.find(p);
  if (!e) { console.log(p, "=> NOT FOUND"); continue; }
  console.log("\n===", p, "| componentNames:", e.componentNames);
  for (const c of e.jsonString["@components"]) {
    console.log("   ", JSON.stringify(c).slice(0, 320));
  }
}
