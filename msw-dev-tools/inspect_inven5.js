const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

// Get all InvenSlot1 descendants with full transform info
const ents = b.listEntities();
const slot1Children = ents.filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/InvenWindow/InvenSlot1'));
console.log('=== InvenSlot1 and children ===');
slot1Children.forEach(e => {
  const tf = b.getComponent(e.path.replace('/ui/DefaultGroup/', ''), 'MOD.Core.UITransformComponent');
  console.log(e.name + ' | size=' + JSON.stringify(e.size) + ' | pos=' + JSON.stringify(e.pos) + ' | anchors=min' + JSON.stringify(tf?.AnchorsMin) + ' max' + JSON.stringify(tf?.AnchorsMax));
});
