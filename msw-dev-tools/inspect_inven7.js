const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

// Show full UITransform component for InvenSlot1 to understand size storage
const tf = b.getComponent('InvenWindow/InvenSlot1', 'MOD.Core.UITransformComponent');
console.log('=== InvenSlot1 Full UITransform ===');
console.log(JSON.stringify(tf, null, 2));

const tf2 = b.getComponent('InvenWindow/InvenSlot1/Icon', 'MOD.Core.UITransformComponent');
console.log('\n=== Icon Full UITransform ===');
console.log(JSON.stringify(tf2, null, 2));

const tf3 = b.getComponent('InvenWindow/InvenSlot1/ItemName', 'MOD.Core.UITransformComponent');
console.log('\n=== ItemName Full UITransform ===');
console.log(JSON.stringify(tf3, null, 2));
