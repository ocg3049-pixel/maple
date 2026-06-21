const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(UI_PATH);

const WHITE = { r: 1, g: 1, b: 1, a: 1 };

// 슬롯 1-20 SlotBG 색상을 흰색으로 변경
for (let i = 1; i <= 20; i++) {
    b.upsertComponent(`InvenWindow/InvenSlot${i}/SlotBG`, 'MOD.Core.SpriteGUIRendererComponent', { Color: WHITE });
}
console.log('[fix] Slots 1-20 SlotBG → white');

b.write(UI_PATH, { lint: false });
console.log('[fix_slot_color] Complete!');
