const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
for (const p of [
  "/ui/DefaultGroup/SkillWindow/Tab_0_Label",
  "/ui/DefaultGroup/SkillWindow/Tab_0_BG",
]) {
  const e = b.find(p);
  console.log("\n=====", p);
  console.log(JSON.stringify(e.jsonString, null, 1));
}
