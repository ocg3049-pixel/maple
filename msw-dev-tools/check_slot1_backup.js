const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const slot1 = ents.filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/InvenWindow/InvenSlot1'));
console.log('=== InvenSlot1 children in backup ===');
slot1.forEach(e => {
  const tf = b.getComponent(e.path.replace('/ui/DefaultGroup/', ''), 'MOD.Core.UITransformComponent');
  console.log(e.name + ': pos=' + JSON.stringify(tf?.anchoredPosition) + ' size=' + JSON.stringify(tf?.RectSize));
});
