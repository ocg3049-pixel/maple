const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

const tabKeys = ['equip','consume','etc','install','cash','decorate'];
let fixed = 0;
for (const tk of tabKeys) {
  const lblPath = '/ui/DefaultGroup/InvenWindow/InvenTab_' + tk + '/TabLbl';
  const ent = raw.find(e => e.jsonString.path === lblPath);
  if (!ent) { console.log('[' + tk + '] TabLbl NOT FOUND'); continue; }
  const before = ent.jsonString.displayOrder;
  ent.jsonString.displayOrder = 3;
  console.log('[' + tk + '] TabLbl displayOrder: ' + before + ' → 3');
  fixed++;
}

console.log('수정 완료:', fixed + '개');
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('저장 완료');
