const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(UI_PATH);

// ── Constants ────────────────────────────────────────────────────────────────
// Expanded:  1200×760  (16 cols × 8 rows = 128 slots, no scroll)
// Minimized: 650×760   (4 cols × 8 rows = 32 visible, scroll by Lua)
const WIN_W_EXP = 1200, WIN_H = 760;
const HALF_W = WIN_W_EXP / 2;    // 600
const HALF_H = WIN_H / 2;        // 380
const SLOT_SIZE = 66, CELL = 70;  // 66px slot + 4px gap

const TITLE_CY  = HALF_H - 25;       // 355
const TAB_CY    = TITLE_CY - 54;     // 301  (title_half + gap4 + tab_half18 + extra7 = 54)
const SLOT_TOP  = 279;               // TAB_CY - TAB_H/2 - 4 = 301-18-4 = 279
const BOTTOM_CY = -HALF_H + 30;      // -350
const SCROLL_X  = 307;

// 16-col x-centers for expanded (symmetric, leftmost = -525)
const COL_X_EXP = [];
for (let c = 0; c < 16; c++) COL_X_EXP.push(-525 + c * CELL);
// -525,-455,-385,-315,-245,-175,-105,-35,35,105,175,245,315,385,455,525

// 8-row y-centers (shared by both modes)
const ROW_Y = [];
for (let r = 0; r < 8; r++) ROW_Y.push(SLOT_TOP - 33 - r * CELL);
// 246,176,106,36,-34,-104,-174,-244

const SCROLL_UP_Y   = ROW_Y[0] + 33 + 15;         // 294
const SCROLL_DOWN_Y = ROW_Y[7] - 33 - 15;         // -302

const TAB_W = 88, TAB_H = 36, TAB_STEP = 96;
const TAB_START = -240;
const tabDefs = [
    {key:'equip',lbl:'장비'}, {key:'consume',lbl:'소비'}, {key:'etc',lbl:'기타'},
    {key:'install',lbl:'설치'}, {key:'cash',lbl:'캐시'}, {key:'decorate',lbl:'치장'}
];

// ── Window (expanded default) ─────────────────────────────────────────────────
b.patch('InvenWindow', { pos: [200, 0], rect_size: [WIN_W_EXP, WIN_H] });
b.patch('InvenWindow/BG', { pos: [0, 0], rect_size: [WIN_W_EXP, WIN_H] });

// ── Title bar ─────────────────────────────────────────────────────────────────
b.patch('InvenWindow/TitleText',         { pos: [0, TITLE_CY],   rect_size: [WIN_W_EXP, 50] });
b.patch('InvenWindow/TitleText/TitleBG', { pos: [0, 0],          rect_size: [WIN_W_EXP, 50] });
b.patch('InvenWindow/TitleText/Label',   { pos: [-60, 0],        rect_size: [400, 50] });

// Close & Minimize buttons (expanded positions)
b.patch('InvenWindow/CloseInven', { pos: [HALF_W - 20, TITLE_CY] });
b.patch('InvenWindow/InvenMinBtn', { pos: [HALF_W - 62, TITLE_CY] });
// Add Touch child to InvenMinBtn so clicks aren't blocked by MinBG/MinLbl sprites
b.touchReceive('InvenWindow/InvenMinBtn/Touch', {
    anchor: 'middle-center', pos: [0, 0], rect_size: [36, 36]
});

// ── Off-screen decorative elements ────────────────────────────────────────────
b.patch('InvenWindow/Divider',  { pos: [3000, 3000] });
b.patch('InvenWindow/HintText', { pos: [3000, 3000] });

// ── Slot count label ─────────────────────────────────────────────────────────
b.patch('InvenWindow/InvenSlotCount', { pos: [170, TITLE_CY] });

// ── Tab row (Touch child added after TabBG/TabLbl so it's topmost = receives clicks) ──
for (let i = 0; i < tabDefs.length; i++) {
    const td = tabDefs[i];
    const tx = TAB_START + i * TAB_STEP;
    const en = `InvenWindow/InvenTab_${td.key}`;
    b.patch(en, { pos: [tx, TAB_CY] });
    // Touch child: same size as tab, on top → UITouchDownEvent fires → bubbles to parent
    b.touchReceive(`${en}/Touch`, {
        anchor: 'middle-center', pos: [0, 0], rect_size: [TAB_W, TAB_H]
    });
}

// ── Bottom bar ────────────────────────────────────────────────────────────────
b.patch('InvenWindow/MesoBar', { pos: [-20, BOTTOM_CY], rect_size: [WIN_W_EXP - 20, 50] });

// ── Scrollbar (off-screen in expanded default; Lua repositions on minimize) ───
b.patch('InvenWindow/InvenScrollTrack', { pos: [3000, 3000] });
b.patch('InvenWindow/InvenScrollUp',    { pos: [3000, 3000] });
// Touch child for scroll up button
b.touchReceive('InvenWindow/InvenScrollUp/Touch', {
    anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24]
});
b.patch('InvenWindow/InvenScrollDown',  { pos: [3000, 3000] });
// Touch child for scroll down button
b.touchReceive('InvenWindow/InvenScrollDown/Touch', {
    anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24]
});
b.patch('InvenWindow/InvenScrollThumb', { pos: [3000, 3000] });

// ── All 128 slots in 16×8 expanded grid ──────────────────────────────────────
for (let i = 1; i <= 128; i++) {
    const col = (i - 1) % 16;
    const row = Math.floor((i - 1) / 16);
    b.patch(`InvenWindow/InvenSlot${i}`, {
        pos: [COL_X_EXP[col], ROW_Y[row]], rect_size: [SLOT_SIZE, SLOT_SIZE]
    });
    b.patch(`InvenWindow/InvenSlot${i}/SlotBG`,    { rect_size: [SLOT_SIZE, SLOT_SIZE] });
    b.patch(`InvenWindow/InvenSlot${i}/Icon`,      { pos: [0, -9], rect_size: [51, 51] });
    b.patch(`InvenWindow/InvenSlot${i}/ItemName`,  { pos: [0, -6], rect_size: [SLOT_SIZE, 15] });
    b.patch(`InvenWindow/InvenSlot${i}/StarLabel`, { pos: [0, 49], rect_size: [SLOT_SIZE, 15] });
    b.patch(`InvenWindow/InvenSlot${i}/Touch`,     { rect_size: [SLOT_SIZE, SLOT_SIZE] });
}

b.write(UI_PATH, { lint: false });

console.log('[redesign_inven2] Done!');
console.log(`  Expanded window: ${WIN_W_EXP}×${WIN_H}`);
console.log(`  TITLE_CY=${TITLE_CY}, TAB_CY=${TAB_CY}`);
console.log(`  ROW_Y=[${ROW_Y.join(',')}]`);
console.log(`  COL_X_EXP=[${COL_X_EXP.join(',')}]`);
console.log(`  SCROLL_UP_Y=${SCROLL_UP_Y}, SCROLL_DOWN_Y=${SCROLL_DOWN_Y}`);
console.log(`  BOTTOM_CY=${BOTTOM_CY}`);
console.log(`  Touch children added to: InvenMinBtn, InvenTab_*, InvenScrollUp, InvenScrollDown`);
