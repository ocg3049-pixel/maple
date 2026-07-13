// 스킬창 높이 압축 600→540 (하단 빈 공간 제거) — 모든 요소 y를 -30 이동
const { UIBuilder } = require(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
);
const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
const W = "SkillWindow/";

b.patch(W.slice(0, -1), { rect_size: [560, 540] });
b.patch(W + "WindowBG", { rect_size: [560, 540] });
b.patch(W + "TitleBarBG", { pos: [0, 252] });
b.patch(W + "TitleLabelText", { pos: [-190, 252] });
b.patch(W + "TitleBar", { pos: [0, 252] });
b.patch(W + "CloseSkill", { pos: [258, 252] });
b.patch(W + "CloseSkillLabel", { pos: [258, 252] });
for (let k = 0; k <= 7; k++) {
  const x = -231 + 66 * k;
  b.patch(W + "Tab_" + k + "_BG", { pos: [x, 210] });
  b.patch(W + "Tab_" + k + "_Label", { pos: [x, 210] });
}
b.patch(W + "BookIcon", { pos: [-245, 174] });
b.patch(W + "SkillBookTitle", { pos: [-125, 174] });
for (let i = 1; i <= 10; i++) {
  const col = (i - 1) % 2;
  const row = Math.floor((i - 1) / 2);
  const cx = col === 0 ? -132 : 132;
  const cy = 126 - 72 * row;
  b.patch(W + "SkillCard" + i, { pos: [cx, cy] });
}
b.patch(W + "SkillScrollTrack", { pos: [268, -18] });
b.patch(W + "SkillScrollTrackTouch", { pos: [268, -18] });
b.patch(W + "SkillScrollThumb", { pos: [268, 111] });
b.patch(W + "SkillScrollThumbTouch", { pos: [268, 111] });

// ⚠️ 절대 규칙: strict:false
b.write(P, { strict: false });
console.log("COMPACT OK");
