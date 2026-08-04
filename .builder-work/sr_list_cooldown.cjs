const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("ui/DefaultGroup.ui");
for (const e of b.listEntities()) {
  if (/Cooldown|Restoration|ArcherSupport/i.test(e.path)) console.log(e.path);
}
