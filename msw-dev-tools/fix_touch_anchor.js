const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(UI_PATH);

// 슬롯 1과 동일한 STRETCH anchor 값
const STRETCH = {
    AlignmentOption: 15,
    AnchorsMin: { x: 0, y: 0 },
    AnchorsMax: { x: 1, y: 1 },
    OffsetMin: { x: 0, y: 0 },
    OffsetMax: { x: 0, y: 0 },
    anchoredPosition: { x: 0, y: 0 },
    Pivot: { x: 0.5, y: 0.5 }
};

const tabKeys = ['equip','consume','etc','install','cash','decorate'];

// 슬롯 21-128 Touch 자식: UITransformComponent 직접 패치
for (let i = 21; i <= 128; i++) {
    b.patchComponent(`InvenWindow/InvenSlot${i}/Touch`, 'MOD.Core.UITransformComponent', STRETCH);
}
console.log('[fix] Slots 21-128 Touch → STRETCH done');

// 탭 Touch: 동일하게 STRETCH
for (const tk of tabKeys) {
    b.patchComponent(`InvenWindow/InvenTab_${tk}/Touch`, 'MOD.Core.UITransformComponent', STRETCH);
}
console.log('[fix] Tab Touch → STRETCH done');

// 스크롤/최소화 Touch
b.patchComponent('InvenWindow/InvenScrollUp/Touch', 'MOD.Core.UITransformComponent', STRETCH);
b.patchComponent('InvenWindow/InvenScrollDown/Touch', 'MOD.Core.UITransformComponent', STRETCH);
b.patchComponent('InvenWindow/InvenMinBtn/Touch', 'MOD.Core.UITransformComponent', STRETCH);
console.log('[fix] Scroll/MinBtn Touch → STRETCH done');

b.write(UI_PATH, { lint: false });
console.log('[fix_touch_anchor] Complete!');
