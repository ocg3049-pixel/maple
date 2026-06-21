const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const invenEnts = ents.filter(e => e.path && e.path.includes('InvenWindow'));
// Show all direct children of InvenWindow (not InvenSlot children)
invenEnts.filter(e => {
  const rel = e.path.replace('/ui/DefaultGroup/InvenWindow/', '');
  return !rel.includes('/') || rel.startsWith('TitleText/') || rel.startsWith('MesoBar') || rel.startsWith('InvenEnhance') || rel.startsWith('InvenMin');
}).forEach(e => {
  console.log(e.name + ' | size=' + JSON.stringify(e.size) + ' | pos=' + JSON.stringify(e.pos) + ' | depth=' + e.depth);
});
