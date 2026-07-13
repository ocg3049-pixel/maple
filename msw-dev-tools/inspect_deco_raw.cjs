const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

const list = b.listEntities().filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/DecoWindow'));
for (const e of list) {
  console.log(e.path, 'displayOrder=' + e.displayOrder, 'enable=' + e.enable);
}
