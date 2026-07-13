// 강화창 개선 패치 (2026-07-13)
// 1) 별 그리드: 행간 30% 축소(30→21) + 블록 세로 중앙 재정렬, 각 별에 빈 별(☆) 텍스트 추가
// 2) RANKUP 장식 바 제거
// 3) 스타포스/주문서 탭 EVENT 배지 제거
// 4) 주문서 탭(ScrollContent)에 전용 주문서 그리드 + 사용하기 버튼 신설
// 5) 치장창(DecoWindow) 타이틀 드래그 스트립 신설
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

const W = 'EnhanceWindow';
const SF = `${W}/RightPanel/ContentArea/StarforceContent`;
const SC = `${W}/RightPanel/ContentArea/ScrollContent`;
const SA = `${W}/RightPanel/SlotArea`;
const BOX  = { r: 0.10, g: 0.15, b: 0.21, a: 0.85 };
const STAR_EMPTY = { r: 0.55, g: 0.58, b: 0.65, a: 1 };

// ── 1) 별 그리드 행간 30% 축소 + 세로 중앙 정렬 ─────────────────────────
// 기존: 7행 y=300,270,240,210,180,150,120 (간격 30, 중심 210)
// 신규: 간격 21, 중심 210 유지 → y=273,252,231,210,189,168,147
const rowY = [273, 252, 231, 210, 189, 168, 147];
for (let i = 1; i <= 100; i++) {
  const row = Math.ceil(i / 15) <= 6 ? Math.ceil(i / 15) : 7;
  const path = `${SF}/Star_${i}`;
  const tr = b.getComponent(path, 'MOD.Core.UITransformComponent');
  const x = tr.anchoredPosition.x;
  b.patch(path, { pos: [x, rowY[row - 1]] });
  // 미강화 별 표시용 빈 별(☆) 텍스트 — 채워진 별일 때는 런타임이 알파 0으로 숨김
  b.upsertComponent(path, 'MOD.Core.TextComponent', {
    Text: '☆', FontSize: 19, Alignment: 4, Bold: false,
    FontColor: STAR_EMPTY,
  });
}

// ── 2) RANKUP 장식 바 제거 ──────────────────────────────────────────────
for (const n of ['RankupBarBG', 'RankupTag']) {
  if (b.find(`${SA}/${n}`)) b.remove(`${SA}/${n}`);
}

// ── 3) EVENT 배지 제거 ──────────────────────────────────────────────────
for (const tab of ['EnhanceTab_Starforce', 'EnhanceTab_Scroll']) {
  for (const n of ['EventBadge', 'EventBadgeText']) {
    const p = `${W}/LeftPanel/${tab}/${n}`;
    if (b.find(p)) b.remove(p);
  }
}

// ── 4) 주문서 탭 컨텐츠 (ScrollMain) ────────────────────────────────────
const SM = `${SC}/ScrollMain`;
if (b.find(SM)) b.remove(SM);
b.panel(SM, { pos: [0, 0], rect_size: [560, 700], enable: true });
b.patch(SM, { display_order: 10 });

// 전용 주문서 박스
b.sprite(`${SM}/ScrollBoxBG`, { pos: [0, 208], rect_size: [544, 196], color: BOX });
b.patch(`${SM}/ScrollBoxBG`, { display_order: 1 });
b.text(`${SM}/ScrollHeader`, '전용 주문서', {
  size: 13, alignment: 3, color: '#96A3B0', pos: [12, 285], rect_size: [520, 22] });
b.patch(`${SM}/ScrollHeader`, { display_order: 12 });

// 주문서 슬롯 8개 (1행)
for (let i = 1; i <= 8; i++) {
  const x = -196 + 56 * (i - 1);
  const S = `${SM}/ScrollSlot${i}`;
  b.panel(S, { pos: [x, 222], rect_size: [52, 52] });
  b.patch(S, { display_order: 10 });
  b.sprite(`${S}/SlotBG`, { pos: [0, 0], rect_size: [52, 52], color: { r: 0.98, g: 0.98, b: 1.0, a: 1 } });
  b.patch(`${S}/SlotBG`, { display_order: 1 });
  b.sprite(`${S}/SlotIcon`, { pos: [0, 0], rect_size: [44, 44], alpha: 0 });
  b.patch(`${S}/SlotIcon`, { display_order: 2 });
  b.text(`${S}/CountText`, '', { size: 13, bold: true, alignment: 8, color: '#26303A', pos: [-2, 2], rect_size: [48, 48] });
  b.patch(`${S}/CountText`, { display_order: 3 });
}
b.text(`${SM}/ScrollEmptyText`, '사용할 주문서가 없습니다.', {
  size: 14, color: '#8C99A6', pos: [0, 222], rect_size: [420, 24] });
b.patch(`${SM}/ScrollEmptyText`, { display_order: 12 });
b.text(`${SM}/ScrollDescText`, '', {
  size: 14, color: '#FFFFFF', pos: [0, 140], rect_size: [520, 30] });
b.patch(`${SM}/ScrollDescText`, { display_order: 12 });

// 효과/확률 박스
b.sprite(`${SM}/ScrollInfoBoxBG`, { pos: [0, 20], rect_size: [544, 140], color: BOX });
b.patch(`${SM}/ScrollInfoBoxBG`, { display_order: 1 });
b.text(`${SM}/ScrollInfoHeader`, '주문서 효과', {
  size: 13, alignment: 3, color: '#96A3B0', pos: [12, 72], rect_size: [520, 22] });
b.patch(`${SM}/ScrollInfoHeader`, { display_order: 12 });
b.text(`${SM}/ScrollInfoText`, '', { size: 14, color: '#FFFFFF', pos: [0, 8], rect_size: [500, 90] });
b.patch(`${SM}/ScrollInfoText`, { display_order: 12 });

// 사용하기 버튼
b.sprite(`${SM}/ScrollUseBtn`, { pos: [0, -252], rect_size: [300, 54], color: { r: 0.16, g: 0.18, b: 0.22, a: 1 }, raycast: true });
b.patch(`${SM}/ScrollUseBtn`, { display_order: 12 });
b.text(`${SM}/ScrollUseBtnText`, '사용하기', {
  size: 22, bold: true, color: '#FFFFFF', pos: [0, -252], rect_size: [300, 54] });
b.patch(`${SM}/ScrollUseBtnText`, { display_order: 13 });

// 결과 로그
b.sprite(`${SM}/ScrollLogBG`, { pos: [0, -298], rect_size: [544, 44], color: { r: 0.03, g: 0.05, b: 0.08, a: 0.7 } });
b.patch(`${SM}/ScrollLogBG`, { display_order: 5 });
b.text(`${SM}/ScrollLogText`, '', { size: 12, color: '#A6B4C2', pos: [0, -298], rect_size: [520, 40] });
b.patch(`${SM}/ScrollLogText`, { display_order: 12 });

// ── 5) 치장창 타이틀 드래그 스트립 ──────────────────────────────────────
// CloseDeco(x244) 영역을 피해서 좌측/중앙만 커버
if (!b.find('DecoWindow/TitleText')) {
  b.touchReceive('DecoWindow/TitleText', { pos: [-30, 330], rect_size: [440, 40] });
}

b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done');
