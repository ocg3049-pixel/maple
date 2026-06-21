const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(UI_PATH);

// 슬롯 20의 Touch와 동일한 SpriteGUIRendererComponent (투명하지만 RaycastTarget=true)
const SPRITE_RAYCAST = {
    "@type": "MOD.Core.SpriteGUIRendererComponent",
    AnimClipPlayType: 0,
    EndFrameIndex: 2147483647,
    IgnoreMapLayerCheck: false,
    ImageRUID: { DataId: "4fea64a3307cda641809ad8be0d4890b" },
    LocalPosition: { x: 0, y: 0 },
    LocalScale: { x: 1, y: 1 },
    MaterialId: "",
    OrderInLayer: 0,
    OverrideSorting: false,
    PlayRate: 1,
    PreserveSprite: 0,
    SortingLayer: "UI",
    StartFrameIndex: 0,
    Color: { r: 0, g: 0, b: 0, a: 0 },  // 완전 투명
    DropShadow: false,
    DropShadowAngle: 120,
    DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 },
    DropShadowDistance: 3,
    FillAmount: 1,
    FillCenter: true,
    FillClockWise: true,
    FillMethod: 0,
    FillOrigin: 0,
    FlipX: false,
    FlipY: false,
    FrameColumn: 1,
    FrameRate: 0,
    FrameRow: 1,
    Outline: false,
    OutlineColor: { r: 0, g: 0, b: 0, a: 1 },
    OutlineWidth: 3,
    RaycastTarget: true,   // ← 클릭 감지의 핵심
    Type: 0,
    Enable: true
};

const tabKeys = ['equip','consume','etc','install','cash','decorate'];

// 슬롯 21-128 Touch에 SpriteGUIRendererComponent 추가
for (let i = 21; i <= 128; i++) {
    b.upsertComponent(`InvenWindow/InvenSlot${i}/Touch`, 'MOD.Core.SpriteGUIRendererComponent', SPRITE_RAYCAST);
}
console.log('[fix] Slots 21-128 Touch → SpriteGUIRenderer added');

// 탭 Touch
for (const tk of tabKeys) {
    b.upsertComponent(`InvenWindow/InvenTab_${tk}/Touch`, 'MOD.Core.SpriteGUIRendererComponent', SPRITE_RAYCAST);
}
console.log('[fix] Tab Touch → SpriteGUIRenderer added');

// 스크롤/최소화 Touch
b.upsertComponent('InvenWindow/InvenScrollUp/Touch', 'MOD.Core.SpriteGUIRendererComponent', SPRITE_RAYCAST);
b.upsertComponent('InvenWindow/InvenScrollDown/Touch', 'MOD.Core.SpriteGUIRendererComponent', SPRITE_RAYCAST);
b.upsertComponent('InvenWindow/InvenMinBtn/Touch', 'MOD.Core.SpriteGUIRendererComponent', SPRITE_RAYCAST);
console.log('[fix] Scroll/MinBtn Touch → SpriteGUIRenderer added');

b.write(UI_PATH, { lint: false });
console.log('[fix_touch_raycast] Complete!');
