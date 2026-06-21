const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities; // internal

function findEnt(path) {
  return raw.find(e => (e.jsonString || e).path === path);
}

const slot1  = findEnt('/ui/DefaultGroup/InvenWindow/InvenSlot1');
const slot21 = findEnt('/ui/DefaultGroup/InvenWindow/InvenSlot21');
const bg1    = findEnt('/ui/DefaultGroup/InvenWindow/InvenSlot1/SlotBG');
const bg21   = findEnt('/ui/DefaultGroup/InvenWindow/InvenSlot21/SlotBG');

console.log('=== InvenSlot1 (재생성) ===');
console.log('id:', slot1 && slot1.id);
console.log('displayOrder:', slot1 && slot1.jsonString.displayOrder);
console.log('pathConstraints:', slot1 && slot1.jsonString.pathConstraints);

console.log('\n=== InvenSlot21 (기존) ===');
console.log('id:', slot21 && slot21.id);
console.log('displayOrder:', slot21 && slot21.jsonString.displayOrder);
console.log('pathConstraints:', slot21 && slot21.jsonString.pathConstraints);

console.log('\n=== SlotBG under Slot1 ===');
console.log('id:', bg1 && bg1.id);
console.log('displayOrder:', bg1 && bg1.jsonString.displayOrder);
console.log('pathConstraints:', bg1 && bg1.jsonString.pathConstraints);

console.log('\n=== SlotBG under Slot21 ===');
console.log('id:', bg21 && bg21.id);
console.log('displayOrder:', bg21 && bg21.jsonString.displayOrder);
console.log('pathConstraints:', bg21 && bg21.jsonString.pathConstraints);
