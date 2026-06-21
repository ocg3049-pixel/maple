// InvenSlot1-20과 자식들을 .ui에서 완전히 제거
const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const IW = '/ui/DefaultGroup/InvenWindow/InvenSlot';

let removed = 0;
for (let i = 1; i <= 20; i++) {
  try {
    b.remove(IW + i);
    removed++;
  } catch(e) {
    // 이미 없으면 무시
  }
}

console.log('제거된 슬롯 수:', removed);

b.write('ui/DefaultGroup.ui', { lint: false });
console.log('Done: InvenSlot1-20 제거 완료');

// 확인
const b2 = UIBuilder.read('ui/DefaultGroup.ui');
const check = b2.listEntities().filter(e => {
  if (!e.path) return false;
  const m = e.path.match(/\/InvenSlot(\d+)/);
  if (!m) return false;
  const n = parseInt(m[1]);
  return n >= 1 && n <= 20;
});
console.log('남은 InvenSlot1-19 관련 엔티티:', check.length, '(0이어야 함)');
const slot20 = b2.listEntities().filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/InvenWindow/InvenSlot20'));
console.log('남은 InvenSlot20 관련 엔티티:', slot20.length, '(0이어야 함)');
