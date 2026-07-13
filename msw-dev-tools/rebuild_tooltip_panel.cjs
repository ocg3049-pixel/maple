// TooltipPanel 원작(메이플) 스타일 재구축
// - 기존 자식(TooltipBG/TooltipTitle/TpStarFull/StarText/ReqText/Job1-4/AtkPanel/Divider1-3/TooltipIcon/TooltipInfo) 제거
// - Main / Cmp 두 패널(동일 구조): 패널 자체가 네이비 BG 스프라이트, 자식은 런타임에서 전부 재배치
//   Title / Stars / CPLabel / CPValue / IconSlot / Icon / Meta / Pill1(+Text) / Pill2(+Text) / Divider / Info
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

const ROOT = 'TooltipPanel';
const oldChildren = ['AtkPanel', 'Divider1', 'Divider2', 'Divider3', 'Job1', 'Job2', 'Job3', 'Job4',
  'ReqText', 'StarText', 'TooltipBG', 'TooltipIcon', 'TooltipInfo', 'TooltipTitle', 'TpStarFull'];
for (const c of oldChildren) {
  if (b.find(`${ROOT}/${c}`)) b.remove(`${ROOT}/${c}`);
}

// 루트는 앵커 포인트 역할만 (렌더러 없음)
b.patch(ROOT, { pos: [400, 100], rect_size: [10, 10] });

const NAVY = { r: 0.055, g: 0.07, b: 0.11, a: 0.96 };
const SLOT = { r: 0.14, g: 0.17, b: 0.24, a: 1 };
const PILL = { r: 0.22, g: 0.26, b: 0.34, a: 1 };
const DIVC = { r: 0.35, g: 0.4, b: 0.48, a: 0.55 };

function buildPanel(side, dispOrder) {
  const P = `${ROOT}/${side}`;
  b.sprite(P, { pos: [0, 0], rect_size: [340, 400], color: NAVY });
  b.patch(P, { display_order: dispOrder });
  b.text(`${P}/Title`, '', { size: 17, bold: true, color: '#FFFFFF', alignment: 4, pos: [0, 170], rect_size: [320, 30] });
  b.patch(`${P}/Title`, { display_order: 5 });
  b.text(`${P}/Stars`, '', { size: 14, color: '#FFD700', alignment: 4, pos: [0, 140], rect_size: [320, 20] });
  b.patch(`${P}/Stars`, { display_order: 5 });
  b.text(`${P}/CPLabel`, '전투력 증가량', { size: 12, color: '#A8B4C4', alignment: 4, pos: [0, 110], rect_size: [320, 16] });
  b.patch(`${P}/CPLabel`, { display_order: 5 });
  b.text(`${P}/CPValue`, '', { size: 24, bold: true, color: '#FFFFFF', alignment: 4, pos: [0, 84], rect_size: [320, 32] });
  b.patch(`${P}/CPValue`, { display_order: 5 });
  b.sprite(`${P}/IconSlot`, { pos: [-115, 10], rect_size: [78, 78], color: SLOT });
  b.patch(`${P}/IconSlot`, { display_order: 4 });
  b.sprite(`${P}/Icon`, { pos: [-115, 10], rect_size: [66, 66], color: { r: 1, g: 1, b: 1, a: 0 } });
  b.patch(`${P}/Icon`, { display_order: 5 });
  b.text(`${P}/Meta`, '', { size: 13, color: '#C8D2DE', alignment: 3, pos: [52, 10], rect_size: [230, 80] });
  b.patch(`${P}/Meta`, { display_order: 5 });
  b.sprite(`${P}/Pill1`, { pos: [60, -40], rect_size: [70, 22], color: PILL });
  b.patch(`${P}/Pill1`, { display_order: 5 });
  b.text(`${P}/Pill1Text`, '', { size: 12, color: '#DDE6EF', alignment: 4, pos: [60, -40], rect_size: [70, 22] });
  b.patch(`${P}/Pill1Text`, { display_order: 6 });
  b.sprite(`${P}/Pill2`, { pos: [138, -40], rect_size: [70, 22], color: PILL });
  b.patch(`${P}/Pill2`, { display_order: 5 });
  b.text(`${P}/Pill2Text`, '', { size: 12, color: '#DDE6EF', alignment: 4, pos: [138, -40], rect_size: [70, 22] });
  b.patch(`${P}/Pill2Text`, { display_order: 6 });
  b.sprite(`${P}/Divider`, { pos: [0, -60], rect_size: [312, 2], color: DIVC });
  b.patch(`${P}/Divider`, { display_order: 4 });
  b.text(`${P}/Info`, '', { size: 14, color: '#E6ECF2', alignment: 3, pos: [0, -120], rect_size: [308, 100] });
  b.patch(`${P}/Info`, { display_order: 5 });
}

buildPanel('Main', 1);
buildPanel('Cmp', 2);
b.patch(`${ROOT}/Cmp`, { enable: false, pos: [350, 0] });

b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done');
