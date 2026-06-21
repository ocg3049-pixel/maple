const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(UI_PATH);

const SLOT_SIZE = 66;
const TAB_W = 88, TAB_H = 36;
const tabKeys = ['equip','consume','etc','install','cash','decorate'];

function tryRemoveUTR(path) {
    try {
        b.removeComponent(path, 'MOD.Core.UITouchReceiveComponent');
        console.log(`  Removed UTR from ${path}`);
    } catch(e) {
        // 이미 없으면 무시
    }
}

// ── 슬롯 21-128: 부모 UTR 제거 + Touch 자식을 STRETCH anchor로 변경 ──────────
// 슬롯 1-20은 이미 STRETCH anchor이므로 건드리지 않음
for (let i = 21; i <= 128; i++) {
    tryRemoveUTR(`InvenWindow/InvenSlot${i}`);
    // STRETCH anchor (default) + pos=[0,0] → OffsetMin={0,0}, OffsetMax={0,0} → 부모를 꽉 채움
    b.touchReceive(`InvenWindow/InvenSlot${i}/Touch`, { pos: [0, 0], rect_size: [SLOT_SIZE, SLOT_SIZE] });
}
console.log('[fix] Slots 21-128 done');

// ── 탭 버튼 6개: 부모 UTR 제거 + Touch 자식을 STRETCH anchor로 변경 ─────────
for (const tk of tabKeys) {
    tryRemoveUTR(`InvenWindow/InvenTab_${tk}`);
    b.touchReceive(`InvenWindow/InvenTab_${tk}/Touch`, { pos: [0, 0], rect_size: [TAB_W, TAB_H] });
}
console.log('[fix] Tabs done');

// ── 스크롤 버튼: 부모 UTR 제거 + Touch 자식을 STRETCH anchor로 변경 ──────────
tryRemoveUTR('InvenWindow/InvenScrollUp');
b.touchReceive('InvenWindow/InvenScrollUp/Touch', { pos: [0, 0], rect_size: [24, 24] });

tryRemoveUTR('InvenWindow/InvenScrollDown');
b.touchReceive('InvenWindow/InvenScrollDown/Touch', { pos: [0, 0], rect_size: [24, 24] });
console.log('[fix] Scroll buttons done');

// ── 최소화 버튼: 부모 UTR 제거 + Touch 자식을 STRETCH anchor로 변경 ──────────
tryRemoveUTR('InvenWindow/InvenMinBtn');
b.touchReceive('InvenWindow/InvenMinBtn/Touch', { pos: [0, 0], rect_size: [36, 36] });
console.log('[fix] MinBtn done');

b.write(UI_PATH, { lint: false });
console.log('[fix_touch_structure] Complete! All interactive elements now match slots 1-20 structure.');
