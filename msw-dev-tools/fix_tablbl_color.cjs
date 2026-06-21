// TabLbl SpriteGUIRendererComponent.Color를 탭 배경색(0.22,0.22,0.28,1)으로 설정
// TabLbl(높은 배열 인덱스) → TabBG 위에 그려짐 → 같은 색상으로 통일 + 텍스트 표시
const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

const tabKeys = ['equip','consume','etc','install','cash','decorate'];
let fixed = 0;

for (const tk of tabKeys) {
  const lblPath = '/ui/DefaultGroup/InvenWindow/InvenTab_' + tk + '/TabLbl';
  const ent = raw.find(e => e.jsonString.path === lblPath);
  if (!ent) { console.log('[' + tk + '] TabLbl NOT FOUND'); continue; }

  const comps = ent.jsonString['@components'] || [];
  const spr = comps.find(c => c['@type'] && c['@type'].includes('SpriteGUIRenderer'));
  if (!spr) { console.log('[' + tk + '] SpriteGUI NOT FOUND'); continue; }

  // 기본 탭 배경색으로 설정 (탭 비선택 상태와 동일)
  spr.Color = { r: 0.22, g: 0.22, b: 0.28, a: 1 };
  console.log('[' + tk + '] SpriteGUI Color → (0.22,0.22,0.28,1)');
  fixed++;
}

console.log('\n수정 완료:', fixed + '개');
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('저장 완료');
