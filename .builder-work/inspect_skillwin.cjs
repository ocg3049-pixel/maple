const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
const list = b.listEntities();
const rows = list.filter((e) => e.path.indexOf("/SkillWindow") !== -1);
console.log("total under SkillWindow:", rows.length);
for (const e of rows) {
  if (/SkillCard\d/.test(e.path) && !/SkillCard1(\/|$)/.test(e.path)) continue;
  console.log(e.path, "| pos", JSON.stringify(e.pos), "| size", JSON.stringify(e.size), "| enable", e.enable);
}
