const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const SLOT_BG_RUID = '4fea64a3307cda641809ad8be0d4890b';
const b = UIBuilder.read(UI_PATH);

// ── Constants ────────────────────────────────────────────────────────────
const WIN_W = 650, WIN_H = 680;
const HALF_W = WIN_W / 2;   // 325
const HALF_H = WIN_H / 2;   // 340
const SLOT_SIZE = 66, CELL = 74;   // 66px slot + 8px gap
const VISIBLE_COLS = 8, VISIBLE_ROWS = 7;
const TOTAL_SLOTS = 128;

// Position anchors (relative to window center)
const TITLE_CY  = HALF_H - 25;       // +315  (title bar center)
const TAB_CY    = TITLE_CY - 50 - 4; // +261  (tab row center)
const SLOT_TOP  = TAB_CY - 22;       // +239  (top edge of slot area)
const SCROLL_X  = HALF_W - 18;       // +307  (scrollbar center x)
const BOTTOM_CY = -HALF_H + 30;      // -310  (bottom bar center)

// 8 column x-centers (symmetric around 0)
// 8 × 74 = 592px, leftmost center = -592/2 + 37 = -259
const COL_X = [];
for (let c = 0; c < VISIBLE_COLS; c++) COL_X.push(-259 + c * CELL);
// -259, -185, -111, -37, +37, +111, +185, +259

// 7 row y-centers (descending from SLOT_TOP)
const ROW_Y = [];
for (let r = 0; r < VISIBLE_ROWS; r++) ROW_Y.push(SLOT_TOP - 33 - r * CELL);
// +206, +132, +58, -16, -90, -164, -238

const SLOT_AREA_H = VISIBLE_ROWS * CELL; // 518
const SLOT_AREA_CY = (ROW_Y[0] + ROW_Y[VISIBLE_ROWS - 1]) / 2; // center of slot area

// ── Window ───────────────────────────────────────────────────────────────
b.patch('InvenWindow', { pos: [200, 0], rect_size: [WIN_W, WIN_H] });
b.patch('InvenWindow/BG', { pos: [0, 0], rect_size: [WIN_W, WIN_H] });

// ── Title bar ────────────────────────────────────────────────────────────
b.patch('InvenWindow/TitleText',            { pos: [0, TITLE_CY],   rect_size: [WIN_W, 50] });
b.patch('InvenWindow/TitleText/TitleBG',    { pos: [0, 0],          rect_size: [WIN_W, 50] });
b.patch('InvenWindow/TitleText/Label',      { pos: [-60, 0],        rect_size: [400, 50]   });

// CloseInven button: top-right corner
b.patch('InvenWindow/CloseInven', { pos: [HALF_W - 20, TITLE_CY] });

// Minimize button: left of close button
b.touchReceive('InvenWindow/InvenMinBtn', { anchor: 'middle-center', pos: [HALF_W - 62, TITLE_CY], rect_size: [36, 36] });
b.sprite('InvenWindow/InvenMinBtn/MinBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [36, 36], image_ruid: '' });
b.sprite('InvenWindow/InvenMinBtn/MinLbl', { anchor: 'middle-center', pos: [0, 0], rect_size: [36, 36], image_ruid: '' });
b.upsertComponent('InvenWindow/InvenMinBtn/MinLbl', 'MOD.Core.TextComponent', {
    Text: '—', Alignment: 4, AllowAutomaticTranslation: false, BestFit: false, Bold: true, ConstraintX: 100
});

// Move Divider / HintText off-screen (no longer needed)
b.patch('InvenWindow/Divider',  { pos: [3000, 3000] });
b.patch('InvenWindow/HintText', { pos: [3000, 3000] });

// ── Tab row ──────────────────────────────────────────────────────────────
// 6 tabs × 88px each, 8px gap → total span 580px, starting x = -290+44 = -246
const TAB_W = 88, TAB_H = 36;
const tabDefs = [
    { key: 'equip',    lbl: '장비' },
    { key: 'consume',  lbl: '소비' },
    { key: 'etc',      lbl: '기타' },
    { key: 'install',  lbl: '설치' },
    { key: 'cash',     lbl: '캐시' },
    { key: 'decorate', lbl: '치장' },
];
const TAB_STEP = TAB_W + 8;  // 96
const TAB_START = -(tabDefs.length * TAB_STEP - 8) / 2 + TAB_W / 2;  // -244

for (let i = 0; i < tabDefs.length; i++) {
    const td  = tabDefs[i];
    const tx  = TAB_START + i * TAB_STEP;
    const en  = `InvenWindow/InvenTab_${td.key}`;
    b.touchReceive(en, { anchor: 'middle-center', pos: [tx, TAB_CY], rect_size: [TAB_W, TAB_H] });
    b.sprite(`${en}/TabBG`,  { anchor: 'middle-center', pos: [0, 0], rect_size: [TAB_W, TAB_H], image_ruid: '' });
    b.sprite(`${en}/TabLbl`, { anchor: 'middle-center', pos: [0, 0], rect_size: [TAB_W, TAB_H], image_ruid: '' });
    b.upsertComponent(`${en}/TabLbl`, 'MOD.Core.TextComponent', {
        Text: td.lbl, Alignment: 4, AllowAutomaticTranslation: false, BestFit: false, Bold: false, ConstraintX: 100
    });
}

// Slot count label (top-right of tab area)
b.sprite('InvenWindow/InvenSlotCount', { anchor: 'middle-center', pos: [HALF_W - 60, TAB_CY], rect_size: [100, 30], image_ruid: '' });
b.upsertComponent('InvenWindow/InvenSlotCount', 'MOD.Core.TextComponent', {
    Text: '0/128', Alignment: 6, AllowAutomaticTranslation: false, BestFit: false, Bold: false, ConstraintX: 100
});

// ── Visual slot grid: 56 slots (8 cols × 7 rows) ─────────────────────────
for (let i = 1; i <= 56; i++) {
    const col = (i - 1) % VISIBLE_COLS;
    const row = Math.floor((i - 1) / VISIBLE_COLS);
    const sx = COL_X[col];
    const sy = ROW_Y[row];
    b.patch(`InvenWindow/InvenSlot${i}`, { pos: [sx, sy], rect_size: [SLOT_SIZE, SLOT_SIZE] });
    b.patch(`InvenWindow/InvenSlot${i}/SlotBG`,    { rect_size: [SLOT_SIZE, SLOT_SIZE] });
    b.patch(`InvenWindow/InvenSlot${i}/Icon`,      { pos: [0, -9], rect_size: [51, 51] });
    b.patch(`InvenWindow/InvenSlot${i}/ItemName`,  { pos: [0, -6], rect_size: [SLOT_SIZE, 15] });
    b.patch(`InvenWindow/InvenSlot${i}/StarLabel`, { pos: [0, 49], rect_size: [SLOT_SIZE, 15] });
    b.patch(`InvenWindow/InvenSlot${i}/Touch`,     { rect_size: [SLOT_SIZE, SLOT_SIZE] });
}

// Move slots 57-128 off-screen (not used as visual slots)
for (let i = 57; i <= 128; i++) {
    b.patch(`InvenWindow/InvenSlot${i}`, { pos: [3000, 3000] });
}

// ── Scrollbar ─────────────────────────────────────────────────────────────
// Track spans the slot area height
const TRACK_H = SLOT_AREA_H;  // 518
const THUMB_H = Math.round(TRACK_H * VISIBLE_ROWS / (TOTAL_SLOTS / VISIBLE_COLS));  // 7/16 * 518 ≈ 227

b.sprite('InvenWindow/InvenScrollTrack', {
    anchor: 'middle-center', pos: [SCROLL_X, SLOT_AREA_CY], rect_size: [16, TRACK_H], image_ruid: ''
});
// Scroll up button
b.touchReceive('InvenWindow/InvenScrollUp', {
    anchor: 'middle-center', pos: [SCROLL_X, ROW_Y[0] + 33 + 15], rect_size: [24, 24]
});
b.sprite('InvenWindow/InvenScrollUp/UpBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], image_ruid: '' });
b.sprite('InvenWindow/InvenScrollUp/UpLbl', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], image_ruid: '' });
b.upsertComponent('InvenWindow/InvenScrollUp/UpLbl', 'MOD.Core.TextComponent', {
    Text: '▲', Alignment: 4, AllowAutomaticTranslation: false, BestFit: false, Bold: false, ConstraintX: 100
});
// Scroll down button
b.touchReceive('InvenWindow/InvenScrollDown', {
    anchor: 'middle-center', pos: [SCROLL_X, ROW_Y[VISIBLE_ROWS - 1] - 33 - 15], rect_size: [24, 24]
});
b.sprite('InvenWindow/InvenScrollDown/DownBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], image_ruid: '' });
b.sprite('InvenWindow/InvenScrollDown/DownLbl', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], image_ruid: '' });
b.upsertComponent('InvenWindow/InvenScrollDown/DownLbl', 'MOD.Core.TextComponent', {
    Text: '▼', Alignment: 4, AllowAutomaticTranslation: false, BestFit: false, Bold: false, ConstraintX: 100
});
// Scroll thumb (starts at top)
b.touchReceive('InvenWindow/InvenScrollThumb', {
    anchor: 'middle-center', pos: [SCROLL_X, ROW_Y[0] + 33 - THUMB_H / 2], rect_size: [16, THUMB_H]
});
b.sprite('InvenWindow/InvenScrollThumb/ThumbBG', {
    anchor: 'middle-center', pos: [0, 0], rect_size: [16, THUMB_H], image_ruid: ''
});

// ── Bottom bar (MesoBar) ──────────────────────────────────────────────────
b.patch('InvenWindow/MesoBar', { pos: [-20, BOTTOM_CY], rect_size: [WIN_W - 20, 50] });

b.write(UI_PATH, { lint: false });

// Print layout summary
console.log('[redesign_inven] Done!');
console.log(`  Window: ${WIN_W}×${WIN_H} at pos (200, 0)`);
console.log(`  Title bar: y=${TITLE_CY}`);
console.log(`  Tab row: y=${TAB_CY}`);
console.log(`  Slot area: top=${SLOT_TOP}, rows=${ROW_Y.join(',')}`);
console.log(`  Scrollbar: x=${SCROLL_X}, track_h=${TRACK_H}, thumb_h=${THUMB_H}`);
console.log(`  Bottom bar: y=${BOTTOM_CY}`);
