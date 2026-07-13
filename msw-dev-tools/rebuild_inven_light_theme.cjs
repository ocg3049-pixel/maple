// 인벤토리 원작 라이트 테마 재구축 (유실된 2026-07-13 리디자인의 .ui 부분 복원)
// 스펙 출처: memory project_msw_status.md 섹션 (4)/(4-1)
// .mlua(ApplyInvenLayout/UpdateTabColors/FormatMeso/VisualToDataIdx)는 살아있으므로 .ui 정적 스타일만 복원
const path = require("path");
const { UIBuilder } = require(path.join(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
));

const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
const W = "InvenWindow/";

const SLATE_DARK = { r: 0.247, g: 0.275, b: 0.322, a: 1 };     // 타이틀바
const WINDOW_BG  = { r: 0.918, g: 0.918, b: 0.925, a: 1 };     // #EAEAEC
const WHITE      = { r: 1, g: 1, b: 1, a: 1 };
const DARK_TEXT  = { r: 0.173, g: 0.212, b: 0.267, a: 1 };     // 슬레이트 글씨
const BLUE_BTN   = { r: 0.294, g: 0.557, b: 0.863, a: 1 };     // #4B8EDC
const GOLD       = { r: 1.0, g: 0.84, b: 0.35, a: 1 };
const LIGHT_GRAY = { r: 0.80, g: 0.82, b: 0.86, a: 1 };        // 스크롤 버튼/트랙
const MID_GRAY   = { r: 0.58, g: 0.61, b: 0.66, a: 1 };        // 스크롤 썸
const ALPHA0     = { r: 1, g: 1, b: 1, a: 0 };
const PLACEHOLDER = { DataId: "4fea64a3307cda641809ad8be0d4890b" };
const MESO_COIN   = { DataId: "02a489cccff24a139a6c3582a5871f58" };

// 1. 창 배경: 라이트 #EAEAEC 불투명
b.patchComponent(W + "BG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: WINDOW_BG, ImageRUID: PLACEHOLDER,
});

// 2. 타이틀바: 짙은 슬레이트 + INVENTORY 흰 볼드 22pt 좌측정렬
b.patchComponent(W + "TitleText/TitleBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: SLATE_DARK, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "TitleText/Label", "MOD.Core.TextComponent", {
  Text: "INVENTORY", FontColor: WHITE, FontSize: 22, Bold: true, Alignment: 3,
});

// 3. 닫기 ×: 박스 없는 흰 글리프 (sprite alpha 0)
b.patchComponent(W + "CloseInven", "MOD.Core.SpriteGUIRendererComponent", { Color: ALPHA0 });
b.patch(W + "CloseInven", { pivot: [0.5, 0.5] });
b.patchComponent(W + "CloseInven/Label", "MOD.Core.TextComponent", {
  Text: "×", FontColor: WHITE, FontSize: 26, Bold: true, Alignment: 4,
});

// 4. 축소 −/+ 글리프: 박스 없는 흰 글리프 (텍스트 자체는 ApplyInvenLayout이 런타임 설정)
b.patchComponent(W + "InvenMinBtn", "MOD.Core.SpriteGUIRendererComponent", { Color: ALPHA0 });
b.patchComponent(W + "InvenMinBtn/Label", "MOD.Core.TextComponent", {
  FontColor: WHITE, FontSize: 22, Bold: true, Alignment: 4,
});

// 5. 슬롯 카운트: 우측정렬, 라이트 BG 위 짙은 글씨
b.patchComponent(W + "InvenSlotCount", "MOD.Core.TextComponent", {
  FontColor: DARK_TEXT, FontSize: 14, Alignment: 5, Bold: true,
});

// 6. 메소바: 흰 필드 + 금색 메소코인 + 우측정렬 짙은 금액 + 파란 장비강화 버튼
b.patchComponent(W + "MesoBar/BarBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: { r: 0.973, g: 0.98, b: 0.988, a: 1 }, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "MesoBar/MesoIcon", "MOD.Core.SpriteGUIRendererComponent", {
  Color: WHITE, ImageRUID: MESO_COIN,
});
b.patchComponent(W + "MesoBar/MesoText", "MOD.Core.TextComponent", {
  FontColor: DARK_TEXT, FontSize: 16, Alignment: 5, Bold: true,
});
b.patchComponent(W + "MesoBar/EnhanceOpenBtn", "MOD.Core.SpriteGUIRendererComponent", {
  Color: BLUE_BTN, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "MesoBar/EnhanceOpenBtn/BtnBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: BLUE_BTN, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "MesoBar/EnhanceOpenBtn/BtnLabel", "MOD.Core.TextComponent", {
  Text: "장비강화", FontColor: WHITE, FontSize: 16, Bold: true, Alignment: 4,
});

// 7. 스크롤 컬럼: 라이트 톤
b.patchComponent(W + "InvenScrollUp/UpBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: LIGHT_GRAY, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "InvenScrollDown/DownBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: LIGHT_GRAY, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "InvenScrollUp/UpLbl", "MOD.Core.TextComponent", { FontColor: DARK_TEXT });
b.patchComponent(W + "InvenScrollDown/DownLbl", "MOD.Core.TextComponent", { FontColor: DARK_TEXT });
b.patchComponent(W + "InvenScrollTrack", "MOD.Core.SpriteGUIRendererComponent", {
  Color: { r: 0.86, g: 0.88, b: 0.91, a: 1 }, ImageRUID: PLACEHOLDER,
});
b.patchComponent(W + "InvenScrollThumb/ThumbBG", "MOD.Core.SpriteGUIRendererComponent", {
  Color: MID_GRAY, ImageRUID: PLACEHOLDER,
});

// 8. 탭 6종: TabLbl의 빈 RUID 스프라이트 알파 0 (불투명 덮임 함정 수정) — 색상 자체는 UpdateTabColors가 런타임 관리
const tabKeys = ["equip", "consume", "etc", "install", "cash", "decorate"];
for (const tk of tabKeys) {
  b.patchComponent(W + "InvenTab_" + tk + "/TabLbl", "MOD.Core.SpriteGUIRendererComponent", { Color: ALPHA0 });
  b.patchComponent(W + "InvenTab_" + tk + "/TabBG", "MOD.Core.SpriteGUIRendererComponent", { ImageRUID: PLACEHOLDER });
}

// 9. 슬롯 1~128: 수량텍스트 흰색+짙은 외곽선 18pt, 스타라벨 골드
for (let i = 1; i <= 128; i++) {
  b.patchComponent(W + "InvenSlot" + i + "/ItemName", "MOD.Core.TextComponent", {
    FontColor: WHITE, FontSize: 18, UseOutLine: true,
    OutlineColor: { r: 0.15, g: 0.15, b: 0.18, a: 1 }, OutlineWidth: 2,
  });
  b.patchComponent(W + "InvenSlot" + i + "/StarLabel", "MOD.Core.TextComponent", { FontColor: GOLD });
}

// 10. 슬롯 21~128: displayOrder 수정 (SlotBG=0/Icon=1/ItemName=2/StarLabel=3/Touch=4)
//     — 흰 SlotBG가 아이콘 위에 그려져 아이템이 안 보이던 z-order 버그 재수정
for (let i = 21; i <= 128; i++) {
  const base = W + "InvenSlot" + i + "/";
  b.patch(base + "SlotBG", { display_order: 0 });
  b.patch(base + "Icon", { display_order: 1 });
  b.patch(base + "ItemName", { display_order: 2 });
  b.patch(base + "StarLabel", { display_order: 3 });
  b.patch(base + "Touch", { display_order: 4 });
}

// ⚠️ 절대 규칙: 이 프로젝트의 .ui write()는 예외 없이 strict:false (기존 22개 무관 lint 에러로 파일 삭제 방지)
b.write(P, { strict: false });
console.log("REBUILD OK");
