const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
const ents = b.listEntities();
for (const e of ents) {
  if (/SlotCD/i.test(e.path)) {
    console.log(JSON.stringify(e));
  }
}
// Detail of one existing pair for cloning
const g = b.find("SkillBar/ShiningRaySlotCD_Gray");
if (g) console.log("GRAY:", JSON.stringify(g.jsonString["@components"]));
const t = b.find("SkillBar/ShiningRaySlotCD_Text");
if (t) console.log("TEXT:", JSON.stringify(t.jsonString["@components"]));
