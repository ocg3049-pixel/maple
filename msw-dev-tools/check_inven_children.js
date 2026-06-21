const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
// Show direct children of InvenWindow (not InvenSlot children)
const direct = ents.filter(e => {
  if (!e.path || !e.path.includes('InvenWindow/')) return false;
  const rel = e.path.replace('/ui/DefaultGroup/InvenWindow/', '');
  return !rel.includes('/');
});
console.log('InvenWindow direct children:');
direct.forEach(e => {
  const tf = b.getComponent('InvenWindow/' + e.name, 'MOD.Core.UITransformComponent');
  console.log(e.name + ': pos=' + JSON.stringify(tf?.anchoredPosition) + ' size=' + JSON.stringify(tf?.RectSize));
});
