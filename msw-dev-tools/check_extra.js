const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();

// Show all InvenWindow entities
const inven = ents.filter(e => e.path && e.path.includes('InvenWindow'));
console.log('Total InvenWindow entities:', inven.length);
// Show InvenSlot names sorted
const slots = inven.filter(e => e.name.startsWith('InvenSlot') && !e.path.includes('InvenSlot') !== (e.name === e.path.split('/').slice(-1)[0])).map(e => e.name);
// Show unique InvenSlot parent names
const slotParents = inven.filter(e => e.name.startsWith('InvenSlot') && !e.path.replace('/ui/DefaultGroup/InvenWindow/', '').includes('/'));
console.log('InvenSlot count:', slotParents.length);
slotParents.forEach(e => {
  const tf = b.getComponent(e.path.replace('/ui/DefaultGroup/', ''), 'MOD.Core.UITransformComponent');
  console.log(e.name + ': pos=' + JSON.stringify(tf?.anchoredPosition) + ' size=' + JSON.stringify(tf?.RectSize));
});
