const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("ui/DefaultGroup.ui");
for (const p of ["SkillBar/RestorationSlotCD_Gray", "SkillBar/RestorationSlotCD_Text"]) {
  const e = b.find(p);
  console.log("=== " + p + " id=" + e.id);
  console.log(JSON.stringify(e.jsonString, null, 1));
}
