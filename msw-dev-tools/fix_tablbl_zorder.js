const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const ents = b.listEntities();
console.log('Total entities:', ents.length);
const invenEnts = ents.filter(e => e.path && e.path.includes('/InvenWindow'));
console.log('InvenWindow entities:', invenEnts.length);
invenEnts.slice(0, 40).forEach((e, i) => console.log('  ['+i+']', e.path));
