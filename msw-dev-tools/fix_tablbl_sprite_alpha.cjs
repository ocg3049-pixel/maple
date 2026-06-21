// TabLbl의 SpriteGUIRendererComponent.Color.a를 0→0.001로 설정
// MSW에서 Color.a=0이면 TextComponent 렌더링도 차단됨
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
  if (!spr) { console.log('[' + tk + '] SpriteGUIRendererComponent NOT FOUND'); continue; }

  const before = spr.Color ? spr.Color.a : 'N/A';
  if (!spr.Color) spr.Color = { r: 0, g: 0, b: 0, a: 0.001 };
  else spr.Color.a = 0.001;

  console.log('[' + tk + '] SpriteGUI Color.a: ' + before + ' → 0.001');
  fixed++;
}

console.log('\n수정 완료:', fixed + '개');
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('저장 완료');
