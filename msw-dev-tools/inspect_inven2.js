const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

// InvenSlot1 and its children details
const slot1 = b.find('InvenWindow/InvenSlot1');
console.log('=== InvenSlot1 ===');
console.log(JSON.stringify(slot1?.jsonString?.['@components'], null, 2));

const slotBG = b.find('InvenWindow/InvenSlot1/SlotBG');
console.log('\n=== SlotBG ===');
console.log(JSON.stringify(slotBG?.jsonString?.['@components'], null, 2));

const icon = b.find('InvenWindow/InvenSlot1/Icon');
console.log('\n=== Icon ===');
console.log(JSON.stringify(icon?.jsonString?.['@components'], null, 2));

const itemName = b.find('InvenWindow/InvenSlot1/ItemName');
console.log('\n=== ItemName ===');
console.log(JSON.stringify(itemName?.jsonString?.['@components'], null, 2));

const starLabel = b.find('InvenWindow/InvenSlot1/StarLabel');
console.log('\n=== StarLabel ===');
console.log(JSON.stringify(starLabel?.jsonString?.['@components'], null, 2));

const touch = b.find('InvenWindow/InvenSlot1/Touch');
console.log('\n=== Touch ===');
console.log(JSON.stringify(touch?.jsonString?.['@components'], null, 2));

// Also check InvenEnhanceBtn
const enhBtn = b.find('InvenWindow/InvenEnhanceBtn');
console.log('\n=== InvenEnhanceBtn transform ===');
const tf = b.getComponent('InvenWindow/InvenEnhanceBtn', 'MOD.Core.UITransformComponent');
console.log(JSON.stringify(tf, null, 2));

const minBtn = b.find('InvenWindow/InvenMinBtn');
const tf2 = b.getComponent('InvenWindow/InvenMinBtn', 'MOD.Core.UITransformComponent');
console.log('\n=== InvenMinBtn transform ===');
console.log(JSON.stringify(tf2, null, 2));
