const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');
const W = '/ui/DefaultGroup/InvenWindow';

// 그리드 상수 (16열 × 8행 = 128슬롯) — 가로 1.5배
const COLS = 16, CELL = 75;
const GRID_X0 = -562.5, GRID_Y0 = 155;

function slotXY(i) {
    const col = (i - 1) % COLS;
    const row = Math.floor((i - 1) / COLS);
    return [GRID_X0 + col * CELL, GRID_Y0 - row * CELL];
}

// ─── 1. InvenWindow 크기 변경 (850×570) ─────────────────────────────
b.upsertComponent(W, 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0.5, y: 0.5 },
    AnchorsMax: { x: 0.5, y: 0.5 },
    Pivot: { x: 0.5, y: 0.5 },
    anchoredPosition: { x: 100, y: 0 },
    OffsetMin: { x: -537.5, y: -285 },
    OffsetMax: { x: 737.5, y: 285 },
    RectSize: { x: 1275, y: 570 },
});

// ─── 2. BG 리사이즈 ─────────────────────────────────────────────────
b.upsertComponent(W + '/BG', 'MOD.Core.UITransformComponent', {
    anchoredPosition: { x: 0, y: 0 },
    OffsetMin: { x: -637.5, y: -285 },
    OffsetMax: { x: 637.5, y: 285 },
    RectSize: { x: 1275, y: 570 },
});

// ─── 3. TitleText → "INVENTORY" 녹색 (좌상단) ──────────────────────
b.upsertComponent(W + '/TitleText', 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0.5, y: 0.5 },
    AnchorsMax: { x: 0.5, y: 0.5 },
    Pivot: { x: 0.5, y: 0.5 },
    anchoredPosition: { x: -450, y: 255 },
    OffsetMin: { x: -600, y: 240 },
    OffsetMax: { x: -300, y: 270 },
    RectSize: { x: 300, y: 30 },
});
b.upsertComponent(W + '/TitleText/TitleBG', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 1, g: 1, b: 1, a: 0 },
});
b.upsertComponent(W + '/TitleText/Label', 'MOD.Core.TextComponent', {
    Text: 'INVENTORY',
    FontColor: { r: 0.2, g: 0.9, b: 0.4, a: 1 },
    FontSize: 20,
    Bold: true,
});

// ─── 4. CloseInven 우상단으로 이동 + 빨간색 강조 ────────────────────
b.upsertComponent(W + '/CloseInven', 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0.5, y: 0.5 },
    AnchorsMax: { x: 0.5, y: 0.5 },
    Pivot: { x: 0.5, y: 0.5 },
    anchoredPosition: { x: 611, y: 261 },
    OffsetMin: { x: 597, y: 250 },
    OffsetMax: { x: 625, y: 272 },
    RectSize: { x: 28, y: 22 },
});
b.upsertComponent(W + '/CloseInven', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.85, g: 0.2, b: 0.2, a: 1 },
});

// ─── 5. Divider → 필요없으므로 투명하게 숨김 ──────────────────────
b.upsertComponent(W + '/Divider', 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0.5, y: 0.5 },
    AnchorsMax: { x: 0.5, y: 0.5 },
    Pivot: { x: 0.5, y: 0.5 },
    anchoredPosition: { x: 0, y: 233 },
    OffsetMin: { x: -630, y: 232 },
    OffsetMax: { x: 630, y: 234 },
    RectSize: { x: 1260, y: 2 },
});
b.upsertComponent(W + '/Divider', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0, g: 0, b: 0, a: 0 },
});

// ─── 7. 최소화 버튼 (InvenMinBtn) — panel + 자체 색상 (Label이 자동으로 위에 렌더링) ──
b.panel(W + '/InvenMinBtn', {
    anchor: 'middle-center', pos: [543, 261], rect_size: [54, 22],
});
b.upsertComponent(W + '/InvenMinBtn', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(W + '/InvenMinBtn', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.3, g: 0.5, b: 0.8, a: 1 },
});
b.text(W + '/InvenMinBtn/Label', '_', {
    anchor: 'middle-center', pos: [0, 4], rect_size: [36, 22],
    size: 14, bold: true, color: { r: 1, g: 1, b: 1 },
});

// ─── 8. 카테고리 탭 6개 — panel + 자체 색상 (Label이 자동으로 위에 렌더링) ──
const TABS = [
    { name: 'InvenTabEquip',    label: '장비', x: -487.5 },
    { name: 'InvenTabConsume',  label: '소비', x: -292.5 },
    { name: 'InvenTabEtc',      label: '기타', x: -97.5  },
    { name: 'InvenTabInstall',  label: '설치', x: 97.5   },
    { name: 'InvenTabCash',     label: '캐시', x: 292.5  },
    { name: 'InvenTabDecorate', label: '치장', x: 487.5  },
];
for (const t of TABS) {
    b.panel(W + '/' + t.name, {
        anchor: 'middle-center', pos: [t.x, 210], rect_size: [180, 32],
    });
    b.upsertComponent(W + '/' + t.name, 'MOD.Core.UITouchReceiveComponent', {});
    // panel 자체에 SpriteGUIRendererComponent 없음 → 자식 TabBG가 배경, Label이 그 위에 렌더링
    b.sprite(W + '/' + t.name + '/TabBG', {
        anchor: 'middle-center', pos: [0, 0], rect_size: [180, 32],
        color: { r: 0.38, g: 0.38, b: 0.48, a: 1 },
    });
    b.text(W + '/' + t.name + '/Label', t.label, {
        anchor: 'middle-center', pos: [0, 0], rect_size: [180, 32],
        size: 15, bold: false, color: { r: 0.85, g: 0.85, b: 0.85 },
    });
}

// ─── 9. 탭 하단 구분선 → 숨김 처리 ─────────────────────────────────
b.upsertComponent(W + '/TabDivider', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0, g: 0, b: 0, a: 0 },
});

// ─── 10. 장비 강화 버튼 (InvenEnhanceBtn) — panel + 자체 색상 ─────
b.panel(W + '/InvenEnhanceBtn', {
    anchor: 'middle-center', pos: [503, -255], rect_size: [210, 34],
});
b.upsertComponent(W + '/InvenEnhanceBtn', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(W + '/InvenEnhanceBtn', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.2, g: 0.5, b: 0.9, a: 1 },
});
b.text(W + '/InvenEnhanceBtn/Label', '🔧 장비 강화', {
    anchor: 'middle-center', pos: [0, 0], rect_size: [210, 34],
    size: 14, bold: true, color: { r: 1, g: 1, b: 1 },
});

// ─── 11. InvenSlot1-20: 기존 슬롯 위치/크기 + 색상 업데이트 ─────────────
for (let i = 1; i <= 20; i++) {
    const [x, y] = slotXY(i);
    const sp = `${W}/InvenSlot${i}`;
    b.upsertComponent(sp, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x, y },
        OffsetMin: { x: x - 22, y: y - 22 },
        OffsetMax: { x: x + 22, y: y + 22 },
        RectSize: { x: 44, y: 44 },
    });
    b.upsertComponent(`${sp}/SlotBG`, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: 0, y: 0 },
        OffsetMin: { x: -22, y: -22 }, OffsetMax: { x: 22, y: 22 }, RectSize: { x: 44, y: 44 },
    });
    b.upsertComponent(`${sp}/SlotBG`, 'MOD.Core.SpriteGUIRendererComponent', {
        Color: { r: 0.72, g: 0.72, b: 0.76, a: 1 },
    });
    b.upsertComponent(`${sp}/Icon`, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: 0, y: -2 },
        OffsetMin: { x: -17, y: -19 }, OffsetMax: { x: 17, y: 15 }, RectSize: { x: 34, y: 34 },
    });
    b.upsertComponent(`${sp}/ItemName`, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: 0, y: -18 },
        OffsetMin: { x: -22, y: -23 }, OffsetMax: { x: 22, y: -13 }, RectSize: { x: 44, y: 10 },
    });
    b.upsertComponent(`${sp}/StarLabel`, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: 0, y: 18 },
        OffsetMin: { x: -22, y: 13 }, OffsetMax: { x: 22, y: 23 }, RectSize: { x: 44, y: 10 },
    });
    b.upsertComponent(`${sp}/Touch`, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: 0, y: 0 },
        OffsetMin: { x: -22, y: -22 }, OffsetMax: { x: 22, y: 22 }, RectSize: { x: 44, y: 44 },
    });
}

// ─── 12. InvenSlot21-128 신규 생성 ──────────────────────────────────
for (let i = 21; i <= 128; i++) {
    const [x, y] = slotXY(i);
    const sp = `${W}/InvenSlot${i}`;
    b.panel(sp, { anchor: 'middle-center', pos: [x, y], rect_size: [44, 44] });
    b.sprite(`${sp}/SlotBG`, {
        anchor: 'middle-center', pos: [0, 0], rect_size: [44, 44],
        color: { r: 0.72, g: 0.72, b: 0.76, a: 1 },
    });
    b.sprite(`${sp}/Icon`, { anchor: 'middle-center', pos: [0, -2], rect_size: [34, 34] });
    b.text(`${sp}/ItemName`, '', { anchor: 'middle-center', pos: [0, -18], rect_size: [44, 10], size: 8 });
    b.text(`${sp}/StarLabel`, '', { anchor: 'middle-center', pos: [0, 18], rect_size: [44, 10], size: 8 });
    b.panel(`${sp}/Touch`, { anchor: 'middle-center', pos: [0, 0], rect_size: [44, 44] });
}

// ─── 13. MesoBar 위치 업데이트 (middle-center 앵커) ─────────────────
b.upsertComponent(W + '/MesoBar', 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0.5, y: 0.5 },
    AnchorsMax: { x: 0.5, y: 0.5 },
    Pivot: { x: 0.5, y: 0.5 },
    anchoredPosition: { x: 0, y: -250 },
    OffsetMin: { x: -315, y: -265 },
    OffsetMax: { x: 315, y: -235 },
    RectSize: { x: 630, y: 30 },
});

b.write('./ui/DefaultGroup.ui');
console.log('✅ 인벤토리 UI 재설계 완료: 850×570, 128슬롯(16×8), 6탭, 최소화버튼');
