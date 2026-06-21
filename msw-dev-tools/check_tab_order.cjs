const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

// equip 탭의 TabBG와 TabLbl 배열 인덱스 확인
const bgIdx  = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenTab_equip/TabBG');
const lblIdx = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenTab_equip/TabLbl');
const tabIdx = raw.findIndex(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenTab_equip');

console.log('InvenTab_equip 배열 인덱스:', tabIdx);
console.log('TabBG 배열 인덱스:', bgIdx);
console.log('TabLbl 배열 인덱스:', lblIdx);
console.log('TabBG displayOrder:', raw[bgIdx].jsonString.displayOrder);
console.log('TabLbl displayOrder:', raw[lblIdx].jsonString.displayOrder);
console.log('');
console.log('MSW 렌더링: 배열 뒤에 있을수록 앞에 그려짐 (높은 인덱스 = 앞)');
console.log('TabBG idx=' + bgIdx + ' < TabLbl idx=' + lblIdx + ' → TabLbl이 앞에? → ' + (lblIdx > bgIdx ? 'YES (TabLbl 앞)' : 'NO (TabBG 앞)'));
