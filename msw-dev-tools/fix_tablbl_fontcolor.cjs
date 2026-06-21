// TabLbl TextComponent.FontColor.a = 0 → 1 로 수정
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
  const tc = comps.find(c => c['@type'] && c['@type'].includes('TextComponent'));
  if (!tc) { console.log('[' + tk + '] TextComponent NOT FOUND'); continue; }

  const before = tc.FontColor ? JSON.stringify(tc.FontColor) : 'N/A';
  if (!tc.FontColor) {
    tc.FontColor = { r: 1, g: 1, b: 1, a: 1 };
  } else {
    tc.FontColor.a = 1;
  }
  console.log('[' + tk + '] FontColor: ' + before + ' → a=1');
  fixed++;
}

console.log('\n수정 완료:', fixed + '개');
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('저장 완료');
