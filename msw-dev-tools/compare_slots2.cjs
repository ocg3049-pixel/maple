const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

function findEnt(path) {
  return raw.find(e => (e.jsonString || e).path === path);
}

const items = [
  '/ui/DefaultGroup/InvenWindow/InvenSlot1',
  '/ui/DefaultGroup/InvenWindow/InvenSlot1/SlotBG',
  '/ui/DefaultGroup/InvenWindow/InvenSlot21',
  '/ui/DefaultGroup/InvenWindow/InvenSlot21/SlotBG',
  '/ui/DefaultGroup/InvenWindow/InvenTab_equip',
  '/ui/DefaultGroup/InvenWindow/InvenTab_equip/TabBG',
];

for (const p of items) {
  const e = findEnt(p);
  if (!e) { console.log(p + ' NOT FOUND'); continue; }
  const js = e.jsonString;
  console.log('\n=== ' + p.split('/').pop() + ' (' + p + ') ===');
  console.log('  id:', e.id);
  console.log('  displayOrder:', js.displayOrder);
  console.log('  pathConstraints:', js.pathConstraints);
  console.log('  modelId:', js.modelId);
  console.log('  origin:', JSON.stringify(js.origin));
  console.log('  enable:', js.enable);
}

// 배열에서 Slot1과 SlotBG1의 인덱스 순서 확인
const slot1Idx  = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenSlot1');
const bg1Idx    = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenSlot1/SlotBG');
const slot21Idx = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenSlot21');
const bg21Idx   = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenSlot21/SlotBG');
console.log('\n=== 배열 인덱스 ===');
console.log('InvenSlot1 idx:', slot1Idx, 'SlotBG1 idx:', bg1Idx, '(parent 먼저 나와야 함)');
console.log('InvenSlot21 idx:', slot21Idx, 'SlotBG21 idx:', bg21Idx);
