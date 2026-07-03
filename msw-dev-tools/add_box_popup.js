const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// ===== Popup1: 아이템 종류 선택 팝업 =====
b.sprite("ItemTypeSelectPopup", {
    anchor: "stretch", enable: false,
    color: "#000000", alpha: 0.0, raycast: false
});
b.patch("ItemTypeSelectPopup", { display_order: 200 });

b.sprite("ItemTypeSelectPopup/Overlay", {
    anchor: "stretch", color: "#000000", alpha: 0.6, raycast: true
});

b.sprite("ItemTypeSelectPopup/Dialog", {
    anchor: "middle-center", pos: [0, 0], rect_size: [580, 500],
    color: "#F7F7F7", alpha: 1.0, raycast: true
});

// TitleBar
b.sprite("ItemTypeSelectPopup/Dialog/TitleBar", {
    anchor: "top-center", pos: [0, 0], rect_size: [580, 50], color: "#333333"
});
b.text("ItemTypeSelectPopup/Dialog/TitleBar/TitleLabel", "아이템 변환", {
    anchor: "middle-center", pos: [0, 0], size: 20, bold: true, color: "#FFFFFF"
});

// Close button (X)
b.button("ItemTypeSelectPopup/Dialog/CloseBtn", "X", {
    anchor: "top-right", pos: [0, 0], rect_size: [50, 50], font_size: 22, color: "#FFFFFF"
});
b.patchComponent("ItemTypeSelectPopup/Dialog/CloseBtn", "MOD.Core.SpriteGUIRendererComponent", {
    Color: { r: 0.70, g: 0.15, b: 0.15, a: 1.0 }
});

// Item icon (런타임에서 RUID 설정)
b.sprite("ItemTypeSelectPopup/Dialog/ItemIcon", {
    anchor: "top-left", pos: [20, -58], rect_size: [100, 100],
    color: "#FFFFFF", alpha: 1.0
});

// Description text
b.text("ItemTypeSelectPopup/Dialog/DescText", "변환할 아이템의 종류를 선택해주세요", {
    anchor: "top-left", pos: [130, -65], rect_size: [430, 90],
    size: 18, color: "#000000", alignment: 0
});

// Type buttons: 14개, 2열×7행
const types = ["모자","망토","상의","장갑","하의","신발","무기","펜던트","반지","견장","귀고리","눈장식","얼굴장식","밸트"];
for (let i = 0; i < 14; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const btnX = 20 + col * 290;
    const btnY = 175 + row * 41;
    const btnName = `TypeBtn_${i}`;
    b.button(`ItemTypeSelectPopup/Dialog/${btnName}`, types[i], {
        anchor: "top-left",
        pos: [btnX, -btnY],
        rect_size: [255, 36],
        font_size: 20, color: "#0044CC"
    });
    b.patchComponent(`ItemTypeSelectPopup/Dialog/${btnName}`, "MOD.Core.SpriteGUIRendererComponent", {
        Color: { r: 0.92, g: 0.95, b: 1.0, a: 1.0 }
    });
}

// ===== Popup2: 수량 입력 팝업 =====
b.sprite("BoxQuantityPopup", {
    anchor: "stretch", enable: false,
    color: "#000000", alpha: 0.0, raycast: false
});
b.patch("BoxQuantityPopup", { display_order: 210 });

b.sprite("BoxQuantityPopup/Overlay", {
    anchor: "stretch", color: "#000000", alpha: 0.6, raycast: true
});

b.sprite("BoxQuantityPopup/Dialog", {
    anchor: "middle-center", pos: [0, 0], rect_size: [440, 300],
    color: "#F7F7F7", alpha: 1.0, raycast: true
});

// TitleBar
b.sprite("BoxQuantityPopup/Dialog/TitleBar", {
    anchor: "top-center", pos: [0, 0], rect_size: [440, 50], color: "#333333"
});
b.text("BoxQuantityPopup/Dialog/TitleBar/TitleLabel", "수량 선택", {
    anchor: "middle-center", pos: [0, 0], size: 20, bold: true, color: "#FFFFFF"
});

// Close button
b.button("BoxQuantityPopup/Dialog/CloseBtn", "X", {
    anchor: "top-right", pos: [0, 0], rect_size: [50, 50], font_size: 22, color: "#FFFFFF"
});
b.patchComponent("BoxQuantityPopup/Dialog/CloseBtn", "MOD.Core.SpriteGUIRendererComponent", {
    Color: { r: 0.70, g: 0.15, b: 0.15, a: 1.0 }
});

// Item icon
b.sprite("BoxQuantityPopup/Dialog/ItemIcon", {
    anchor: "top-left", pos: [20, -60], rect_size: [80, 80], color: "#FFFFFF"
});

// Item name text
b.text("BoxQuantityPopup/Dialog/ItemNameText", "아이템명", {
    anchor: "top-left", pos: [112, -72], rect_size: [298, 50],
    size: 20, bold: true, color: "#000000", alignment: 0
});

// Max quantity hint
b.text("BoxQuantityPopup/Dialog/MaxQtyText", "최대 0개 사용 가능", {
    anchor: "top-left", pos: [20, -152], rect_size: [390, 30],
    size: 17, color: "#555555", alignment: 0
});

// Quantity text input
b.textInput("BoxQuantityPopup/Dialog/QuantityInput", {
    anchor: "top-left", pos: [20, -192], rect_size: [390, 50],
    font_size: 22, color: "#000000", char_limit: 4, content_type: 0,
    placeholder: "수량 입력"
});

// Confirm button (green)
b.button("BoxQuantityPopup/Dialog/ConfirmBtn", "확인", {
    anchor: "bottom-left", pos: [20, 20], rect_size: [190, 50],
    font_size: 22, color: "#FFFFFF"
});
b.patchComponent("BoxQuantityPopup/Dialog/ConfirmBtn", "MOD.Core.SpriteGUIRendererComponent", {
    Color: { r: 0.10, g: 0.55, b: 0.10, a: 1.0 }
});

// Cancel button (gray)
b.button("BoxQuantityPopup/Dialog/CancelBtn", "취소", {
    anchor: "bottom-right", pos: [-20, 20], rect_size: [190, 50],
    font_size: 22, color: "#FFFFFF"
});
b.patchComponent("BoxQuantityPopup/Dialog/CancelBtn", "MOD.Core.SpriteGUIRendererComponent", {
    Color: { r: 0.45, g: 0.45, b: 0.45, a: 1.0 }
});

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('✓ 박스 사용 팝업 UI 추가 완료 (ItemTypeSelectPopup, BoxQuantityPopup)');
