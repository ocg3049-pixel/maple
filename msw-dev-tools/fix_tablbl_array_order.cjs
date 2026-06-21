const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

const tabKeys = ['equip','consume','etc','install','cash','decorate'];
let moved = 0;

for (const tk of tabKeys) {
  const bgPath  = '/ui/DefaultGroup/InvenWindow/InvenTab_' + tk + '/TabBG';
  const lblPath = '/ui/DefaultGroup/InvenWindow/InvenTab_' + tk + '/TabLbl';

  const lblIdx = raw.findIndex(e => e.jsonString.path === lblPath);
  const bgIdx  = raw.findIndex(e => e.jsonString.path === bgPath);

  if (lblIdx < 0 || bgIdx < 0) {
    console.log('[' + tk + '] 못 찾음 lbl=' + lblIdx + ' bg=' + bgIdx);
    continue;
  }

  if (lblIdx > bgIdx) {
    console.log('[' + tk + '] 이미 올바른 순서 (lbl=' + lblIdx + ' > bg=' + bgIdx + ')');
    continue;
  }

  // TabLbl을 배열에서 꺼내서 TabBG 바로 뒤에 삽입
  const lblEnt = raw.splice(lblIdx, 1)[0];
  // splice 후 bgIdx가 1 감소
  const newBgIdx = raw.findIndex(e => e.jsonString.path === bgPath);
  raw.splice(newBgIdx + 1, 0, lblEnt);

  const finalLblIdx = raw.findIndex(e => e.jsonString.path === lblPath);
  const finalBgIdx  = raw.findIndex(e => e.jsonString.path === bgPath);
  console.log('[' + tk + '] 이동 완료: bg=' + finalBgIdx + ' lbl=' + finalLblIdx + ' (lbl이 bg보다 뒤에 = 앞에 그려짐)');
  moved++;
}

console.log('\n총 ' + moved + '개 이동');
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('저장 완료');
