// 스킬창(K) 원작 스타일 리디자인 (10.png 참조)
// - 창 560×600 확대, 2열×5행 스킬 카드 그리드 (SkillCard1~10)
// - 기존 SkillRow1~5 제거 (SkillManager.mlua도 함께 SkillCard 기준으로 수정됨)
// - SKILL POINT / 라이딩 / 길드스킬 / 링크스킬 / 버프즐겨찾기 / 매크로 없음 (요청사항)
const { UIBuilder } = require(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
);

const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
const W = "SkillWindow/";
const RUID = "4fea64a3307cda641809ad8be0d4890b";

const NAVY_WINDOW = { r: 0.090, g: 0.106, b: 0.157, a: 0.97 };
const NAVY_TITLE  = { r: 0.067, g: 0.078, b: 0.118, a: 1 };
const CARD_GRAY   = { r: 0.725, g: 0.745, b: 0.78, a: 0.92 };   // 카드 배경
const ICONBOX_W   = { r: 0.957, g: 0.961, b: 0.969, a: 1 };     // 아이콘 박스
const PILL_GRAY   = { r: 0.525, g: 0.553, b: 0.60, a: 0.95 };   // 이름 캡슐

// ── 기존 5행 리스트 제거 ──
for (let i = 1; i <= 5; i++) {
  if (b.find(W + "SkillRow" + i)) b.remove(W + "SkillRow" + i);
}

// ── 창/타이틀 ──
b.patch(W.slice(0, -1), { rect_size: [560, 600] });
b.patch(W + "WindowBG", { rect_size: [560, 600] });
b.patchComponent(W + "WindowBG", "MOD.Core.SpriteGUIRendererComponent", { Color: NAVY_WINDOW });
b.patch(W + "TitleBarBG", { pos: [0, 282], rect_size: [560, 36] });
b.patchComponent(W + "TitleBarBG", "MOD.Core.SpriteGUIRendererComponent", { Color: NAVY_TITLE });
b.patch(W + "TitleLabelText", { pos: [-190, 282], rect_size: [160, 36] });
b.patchComponent(W + "TitleLabelText", "MOD.Core.TextComponent", {
  Text: "SKILL", FontColor: { r: 1, g: 0.894, b: 0.302, a: 1 }, FontSize: 16, Bold: true, Alignment: 3,
});
b.patch(W + "TitleBar", { pos: [0, 282], rect_size: [480, 36] });
b.patch(W + "CloseSkill", { pos: [258, 282], rect_size: [36, 36] });
b.patch(W + "CloseSkillLabel", { pos: [258, 282], rect_size: [36, 36] });
b.patchComponent(W + "CloseSkillLabel", "MOD.Core.TextComponent", {
  Text: "×", FontColor: { r: 0.78, g: 0.8, b: 0.84, a: 1 }, FontSize: 22, Bold: true, Alignment: 4,
});

// ── 탭 8개 재배치 (x = -231 + 66k, y=240, 62×28) ──
for (let k = 0; k <= 7; k++) {
  const x = -231 + 66 * k;
  b.patch(W + "Tab_" + k + "_BG", { pos: [x, 240], rect_size: [62, 28] });
  b.patch(W + "Tab_" + k + "_Label", { pos: [x, 240], rect_size: [62, 28] });
}

// ── 책 제목 행 ──
b.sprite(W + "BookIcon", { anchor: "middle-center", pos: [-245, 204], rect_size: [20, 20], color: "#A0622D", image_ruid: RUID });
b.patch(W + "SkillBookTitle", { pos: [-125, 204], rect_size: [220, 28] });
b.patchComponent(W + "SkillBookTitle", "MOD.Core.TextComponent", {
  FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 16, Bold: true, Alignment: 3,
});

// ── 스킬 카드 2열×5행 (SkillCard1~10) ──
for (let i = 1; i <= 10; i++) {
  const col = (i - 1) % 2;              // 0=왼쪽, 1=오른쪽
  const row = Math.floor((i - 1) / 2);  // 0..4
  const cx = col === 0 ? -132 : 132;
  const cy = 156 - 72 * row;
  const C = W + "SkillCard" + i;
  b.panel(C, { anchor: "middle-center", pos: [cx, cy], rect_size: [254, 64] });
  b.sprite(C + "/CardBG", { anchor: "middle-center", pos: [0, 0], rect_size: [254, 64], color: "#B9BEC7", image_ruid: RUID });
  b.patchComponent(C + "/CardBG", "MOD.Core.SpriteGUIRendererComponent", { Color: CARD_GRAY });
  b.sprite(C + "/IconBox", { anchor: "middle-center", pos: [-96, 0], rect_size: [46, 46], color: "#F4F5F7", image_ruid: RUID });
  b.patchComponent(C + "/IconBox", "MOD.Core.SpriteGUIRendererComponent", { Color: ICONBOX_W });
  b.sprite(C + "/Icon", { anchor: "middle-center", pos: [-96, 0], rect_size: [40, 40], alpha: 0, image_ruid: RUID });
  b.sprite(C + "/NamePill", { anchor: "middle-center", pos: [35, 12], rect_size: [150, 24], color: "#868D99", image_ruid: RUID });
  b.patchComponent(C + "/NamePill", "MOD.Core.SpriteGUIRendererComponent", { Color: PILL_GRAY });
  b.text(C + "/Name", "", { anchor: "middle-center", pos: [35, 12], rect_size: [150, 24], size: 13, alignment: 4, color: "#FFFFFF" });
  b.patchComponent(C + "/Name", "MOD.Core.TextComponent", { Bold: true });
  b.text(C + "/Level", "", { anchor: "middle-center", pos: [35, -14], rect_size: [150, 20], size: 12, alignment: 4, color: "#8A6320" });
  b.patchComponent(C + "/Level", "MOD.Core.TextComponent", { Bold: true });
  b.text(C + "/Leaf", "✦", { anchor: "middle-center", pos: [0, 0], rect_size: [254, 64], size: 24, alignment: 4, color: "#8D939D" });
  b.touchReceive(C + "/Touch", { anchor: "middle-center", pos: [0, 0], rect_size: [254, 64] });
  // 자식 z-order
  b.patch(C + "/CardBG", { display_order: 0 });
  b.patch(C + "/IconBox", { display_order: 1 });
  b.patch(C + "/Icon", { display_order: 2 });
  b.patch(C + "/NamePill", { display_order: 1 });
  b.patch(C + "/Name", { display_order: 3 });
  b.patch(C + "/Level", { display_order: 3 });
  b.patch(C + "/Leaf", { display_order: 2 });
  b.patch(C + "/Touch", { display_order: 5 });
}

// ── 스크롤바 (x=268, topLimit 141 / botLimit -117) ──
b.patch(W + "SkillScrollTrack", { pos: [268, 12], rect_size: [8, 288] });
b.patch(W + "SkillScrollTrackTouch", { pos: [268, 12], rect_size: [28, 288] });
b.patch(W + "SkillScrollThumb", { pos: [268, 141], rect_size: [8, 30] });
b.patch(W + "SkillScrollThumbTouch", { pos: [268, 141], rect_size: [28, 30] });

// ── 창 자식 z-order ──
b.patch(W + "WindowBG", { display_order: 0 });
b.patch(W + "TitleBarBG", { display_order: 1 });
b.patch(W + "TitleLabelText", { display_order: 3 });
b.patch(W + "BookIcon", { display_order: 3 });
b.patch(W + "SkillBookTitle", { display_order: 3 });

// ⚠️ 절대 규칙: strict:false
b.write(P, { strict: false });
console.log("SKILLWINDOW REDESIGN OK");
