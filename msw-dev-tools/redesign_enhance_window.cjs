// 강화창(EnhanceWindow) 원작(ENCHANT) 스타일 리디자인
// - 기존 엔티티 경로/기능 전부 유지 (patch만), 장식용 신규 엔티티 추가
// - 좌: ENCHANT 사이드바(탭 5개 + EVENT 배지 + 보유 메소), 우: 기능 패널(제목/장비 슬롯/섹션 박스/강화하기/확인 다이얼로그)
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

const W = 'EnhanceWindow';
const NAVY  = { r: 0.045, g: 0.075, b: 0.115, a: 0.96 }; // 패널 바탕
const BOX   = { r: 0.10,  g: 0.15,  b: 0.21,  a: 0.85 }; // 섹션 박스
const PILL  = { r: 0.03,  g: 0.05,  b: 0.08,  a: 0.92 }; // 어두운 알약
const GOLD  = '#F2D440';

// ── 루트: 배경 투명화(두 패널 분리 룩), 타이틀(드래그 핸들)/닫기 재배치 ──
b.patchComponent(`${W}/BG`, 'MOD.Core.SpriteGUIRendererComponent', { Color: { r: 0, g: 0, b: 0, a: 0 } });
b.patch(`${W}/TitleText`, { pos: [92, 428], rect_size: [580, 44] });
b.patchComponent(`${W}/TitleText/TitleBG`, 'MOD.Core.SpriteGUIRendererComponent', { Color: { r: 0, g: 0, b: 0, a: 0 } });
b.patchComponent(`${W}/TitleText/Label`, 'MOD.Core.TextComponent', { Text: '' });
b.patch(`${W}/CloseEnhance`, { pos: [362, 428] });
b.patchComponent(`${W}/CloseEnhance/XLabel`, 'MOD.Core.TextComponent', {
  FontSize: 20, FontColor: { r: 0.72, g: 0.78, b: 0.84, a: 1 } });

// ── 좌측 ENCHANT 사이드바 ──────────────────────────────────────────────
b.patch(`${W}/LeftPanel`, { pos: [-290, 0], rect_size: [200, 880] });
b.sprite(`${W}/LeftPanel/SideBG`, { pos: [0, 0], rect_size: [200, 880], color: NAVY });
b.patch(`${W}/LeftPanel/SideBG`, { display_order: 1 });
b.text(`${W}/LeftPanel/SideHeader`, 'ENCHANT', {
  size: 20, bold: true, color: GOLD, alignment: 3, pos: [10, 408], rect_size: [180, 30] });
b.patch(`${W}/LeftPanel/SideHeader`, { display_order: 20 });
// 상/하 장식 화살표 알약
b.sprite(`${W}/LeftPanel/ArrowTop`, { pos: [0, 370], rect_size: [164, 20], color: { r: 0.10, g: 0.16, b: 0.24, a: 0.9 } });
b.patch(`${W}/LeftPanel/ArrowTop`, { display_order: 2 });
b.text(`${W}/LeftPanel/ArrowTopLbl`, '▲', { size: 10, color: '#7A8794', pos: [0, 370], rect_size: [164, 20] });
b.patch(`${W}/LeftPanel/ArrowTopLbl`, { display_order: 3 });
b.sprite(`${W}/LeftPanel/ArrowBottom`, { pos: [0, -300], rect_size: [164, 20], color: { r: 0.10, g: 0.16, b: 0.24, a: 0.9 } });
b.patch(`${W}/LeftPanel/ArrowBottom`, { display_order: 2 });
b.text(`${W}/LeftPanel/ArrowBottomLbl`, '▼', { size: 10, color: '#7A8794', pos: [0, -300], rect_size: [164, 20] });
b.patch(`${W}/LeftPanel/ArrowBottomLbl`, { display_order: 3 });
// 보유 메소 박스 (값은 EnhancementManager.UpdateMesoDisplay가 갱신)
b.sprite(`${W}/LeftPanel/MesoBoxBG`, { pos: [0, -350], rect_size: [176, 64], color: PILL });
b.patch(`${W}/LeftPanel/MesoBoxBG`, { display_order: 2 });
b.text(`${W}/LeftPanel/MesoTitleText`, '● 보유 메소', { size: 13, color: GOLD, pos: [0, -336], rect_size: [160, 20] });
b.patch(`${W}/LeftPanel/MesoTitleText`, { display_order: 3 });
b.text(`${W}/LeftPanel/MesoValueText`, '0', { size: 16, bold: true, color: '#FFFFFF', pos: [0, -362], rect_size: [168, 24] });
b.patch(`${W}/LeftPanel/MesoValueText`, { display_order: 3 });

// 탭 5개 재배치 (색상은 SelectTab 런타임 제어)
const tabs = [
  ['EnhanceTab_Starforce', 300, true],
  ['EnhanceTab_Scroll', 214, true],
  ['EnhanceTab_AddOption', 128, false],
  ['EnhanceTab_Potential', 42, false],
  ['EnhanceTab_Additional', -44, false],
];
for (const [name, y, hasEvent] of tabs) {
  b.patch(`${W}/LeftPanel/${name}`, { pos: [0, y], display_order: 10 });
  b.patchComponent(`${W}/LeftPanel/${name}/TabLbl`, 'MOD.Core.TextComponent', { FontSize: 16, Bold: true });
  if (hasEvent) {
    b.sprite(`${W}/LeftPanel/${name}/EventBadge`, { pos: [52, 30], rect_size: [44, 16], color: { r: 1, g: 0.85, b: 0.1, a: 1 } });
    b.patch(`${W}/LeftPanel/${name}/EventBadge`, { display_order: 20 });
    b.text(`${W}/LeftPanel/${name}/EventBadgeText`, 'EVENT', { size: 9, bold: true, color: '#332800', pos: [52, 30], rect_size: [44, 16] });
    b.patch(`${W}/LeftPanel/${name}/EventBadgeText`, { display_order: 21 });
  }
}

// ── 우측 패널 공통 ──────────────────────────────────────────────────────
b.sprite(`${W}/RightPanel/MainBG`, { pos: [0, 0], rect_size: [580, 900], color: NAVY });
b.patch(`${W}/RightPanel/MainBG`, { display_order: 1 });
b.text(`${W}/RightPanel/RightTitleText`, 'STARFORCE', {
  size: 20, bold: true, color: GOLD, alignment: 3, pos: [0, 428], rect_size: [540, 32] });
b.patch(`${W}/RightPanel/RightTitleText`, { display_order: 20 });
b.patch(`${W}/RightPanel/SlotArea`, { pos: [0, 300], rect_size: [560, 240], display_order: 10 });
b.patch(`${W}/RightPanel/ContentArea`, { pos: [0, -120], rect_size: [560, 610], display_order: 11 });

// ── 장비 슬롯 섹션 ─────────────────────────────────────────────────────
const SA = `${W}/RightPanel/SlotArea`;
b.sprite(`${SA}/SlotSectionBG`, { pos: [0, 0], rect_size: [544, 220], color: BOX });
b.patch(`${SA}/SlotSectionBG`, { display_order: 1 });
b.patch(`${SA}/TargetSlotBG`, { pos: [0, 45], rect_size: [96, 96], display_order: 10 });
b.patchComponent(`${SA}/TargetSlotBG/SlotBG`, 'MOD.Core.SpriteGUIRendererComponent', {
  Color: { r: 0.06, g: 0.09, b: 0.13, a: 1 } });
b.patch(`${SA}/TargetSlotBG/SlotBG`, { rect_size: [96, 96] });
b.patch(`${SA}/TargetSlotBG/TargetIcon`, { rect_size: [76, 76] });
b.patch(`${SA}/TargetSlotBG/PlaceholderIcon`, { rect_size: [48, 48] });
b.patchComponent(`${SA}/TargetSlotBG/PlaceholderIcon`, 'MOD.Core.SpriteGUIRendererComponent', {
  Color: { r: 0.35, g: 0.42, b: 0.52, a: 1 } });
// 흰색 테두리(원작 점선 프레임 느낌) - 아이콘을 가리지 않도록 4변 얇은 선
const FRAME = { r: 0.85, g: 0.92, b: 1, a: 0.9 };
b.sprite(`${SA}/TargetSlotBG/FrameT`, { pos: [0, 51], rect_size: [104, 2], color: FRAME });
b.sprite(`${SA}/TargetSlotBG/FrameB`, { pos: [0, -51], rect_size: [104, 2], color: FRAME });
b.sprite(`${SA}/TargetSlotBG/FrameL`, { pos: [-51, 0], rect_size: [2, 104], color: FRAME });
b.sprite(`${SA}/TargetSlotBG/FrameR`, { pos: [51, 0], rect_size: [2, 104], color: FRAME });
for (const f of ['FrameT', 'FrameB', 'FrameL', 'FrameR']) b.patch(`${SA}/TargetSlotBG/${f}`, { display_order: 15 });
b.patch(`${SA}/TargetSlotBG/StarLabel`, { pos: [0, -66], rect_size: [400, 20] });
b.patchComponent(`${SA}/TargetSlotBG/StarLabel`, 'MOD.Core.TextComponent', {
  FontSize: 13, Alignment: 4, FontColor: { r: 1, g: 0.85, b: 0.25, a: 1 } });
// 이름 알약 + 프롬프트
b.sprite(`${SA}/NamePillBG`, { pos: [0, -60], rect_size: [400, 36], color: PILL });
b.patch(`${SA}/NamePillBG`, { display_order: 2 });
b.patch(`${SA}/TargetNameLabel`, { pos: [0, -60], rect_size: [380, 30], display_order: 12 });
b.patchComponent(`${SA}/TargetNameLabel`, 'MOD.Core.TextComponent', { FontSize: 16, Bold: true, Alignment: 4 });
b.patch(`${SA}/SlotPromptText`, { pos: [0, -60], rect_size: [380, 30], display_order: 12 });
b.patchComponent(`${SA}/SlotPromptText`, 'MOD.Core.TextComponent', {
  Text: '강화할 장비를 올려주세요.', FontSize: 14, Alignment: 4,
  FontColor: { r: 0.6, g: 0.66, b: 0.75, a: 1 } });
// RANKUP 장식 바
b.sprite(`${SA}/RankupBarBG`, { pos: [30, -95], rect_size: [420, 10], color: { r: 0.03, g: 0.05, b: 0.08, a: 0.9 } });
b.patch(`${SA}/RankupBarBG`, { display_order: 2 });
b.text(`${SA}/RankupTag`, 'RANKUP', { size: 9, bold: true, color: '#8C99A6', pos: [-222, -95], rect_size: [70, 14] });
b.patch(`${SA}/RankupTag`, { display_order: 3 });

// ── 스타포스 컨텐츠 ────────────────────────────────────────────────────
const SF = `${W}/RightPanel/ContentArea/StarforceContent`;
b.sprite(`${SF}/StarBoxBG`, { pos: [0, 208], rect_size: [544, 196], color: BOX });
b.patch(`${SF}/StarBoxBG`, { display_order: 1 });
for (let i = 1; i <= 100; i++) b.patch(`${SF}/Star_${i}`, { display_order: 10 });
b.sprite(`${SF}/ArrowPillBG`, { pos: [0, 72], rect_size: [420, 40], color: PILL });
b.patch(`${SF}/ArrowPillBG`, { display_order: 2 });
b.patch(`${SF}/LevelArrow`, { pos: [0, 72], display_order: 12 });
b.patchComponent(`${SF}/LevelArrow`, 'MOD.Core.TextComponent', {
  FontSize: 20, Bold: true, FontColor: { r: 1, g: 0.85, b: 0.25, a: 1 } });
b.sprite(`${SF}/StatBoxBG`, { pos: [0, -22], rect_size: [544, 148], color: BOX });
b.patch(`${SF}/StatBoxBG`, { display_order: 1 });
b.patch(`${SF}/StatHeader`, { pos: [0, 38], rect_size: [520, 22], display_order: 12 });
b.patchComponent(`${SF}/StatHeader`, 'MOD.Core.TextComponent', {
  Text: '상승 수치', FontSize: 13, Alignment: 3, FontColor: { r: 0.6, g: 0.68, b: 0.78, a: 1 } });
b.patch(`${SF}/StatsText`, { pos: [0, -30], rect_size: [380, 100], display_order: 12 });
b.patchComponent(`${SF}/StatsText`, 'MOD.Core.TextComponent', { FontSize: 14, Alignment: 4 });
b.sprite(`${SF}/RateBoxBG`, { pos: [0, -136], rect_size: [544, 64], color: BOX });
b.patch(`${SF}/RateBoxBG`, { display_order: 1 });
b.patch(`${SF}/RateHeader`, { pos: [0, -118], rect_size: [520, 20], display_order: 12 });
b.patchComponent(`${SF}/RateHeader`, 'MOD.Core.TextComponent', {
  Text: '성공 확률', FontSize: 13, Alignment: 3, FontColor: { r: 0.6, g: 0.68, b: 0.78, a: 1 } });
b.patch(`${SF}/RateText`, { pos: [0, -146], rect_size: [420, 26], display_order: 12 });
b.patchComponent(`${SF}/RateText`, 'MOD.Core.TextComponent', { FontSize: 15, FontColor: { r: 1, g: 1, b: 1, a: 1 } });
b.sprite(`${SF}/CostBoxBG`, { pos: [0, -196], rect_size: [544, 44], color: BOX });
b.patch(`${SF}/CostBoxBG`, { display_order: 1 });
// CostText: UpdateStarforceUI가 참조하지만 기존 .ui에 없던 엔티티 - 신규 추가
b.text(`${SF}/CostText`, '사용 재화', { size: 15, color: '#FFE566', pos: [0, -196], rect_size: [520, 30] });
b.patch(`${SF}/CostText`, { display_order: 12 });
b.patch(`${SF}/EnhanceBtn`, { pos: [0, -252], rect_size: [300, 54], display_order: 12 });
b.patchComponent(`${SF}/EnhanceBtn`, 'MOD.Core.SpriteGUIRendererComponent', {
  Color: { r: 0.16, g: 0.18, b: 0.22, a: 1 } });
b.patchComponent(`${SF}/EnhanceBtn`, 'MOD.Core.TextComponent', {
  FontSize: 22, Bold: true, FontColor: { r: 1, g: 1, b: 1, a: 1 } });
b.patch(`${SF}/LogBG`, { pos: [0, -298], rect_size: [544, 44], display_order: 5 });
b.patch(`${SF}/LogBG/LogBGSprite`, { rect_size: [544, 44] });
b.patchComponent(`${SF}/LogBG/LogBGSprite`, 'MOD.Core.SpriteGUIRendererComponent', {
  Color: { r: 0.03, g: 0.05, b: 0.08, a: 0.7 } });
b.patch(`${SF}/LogBG/EnhanceLogText`, { rect_size: [520, 40] });
b.patchComponent(`${SF}/LogBG/EnhanceLogText`, 'MOD.Core.TextComponent', {
  FontSize: 12, FontColor: { r: 0.65, g: 0.72, b: 0.8, a: 1 } });
// 중복 표시였던 "+N강" 텍스트는 숨김 (별 그리드/화살표가 동일 정보 표시)
b.patch(`${SF}/EnhanceLevelText`, { enable: false });

// ── 대기(Default) 컨텐츠 ───────────────────────────────────────────────
const DC = `${W}/RightPanel/ContentArea/DefaultContent`;
b.text(`${DC}/DefaultChevron`, '≪', { size: 42, bold: true, color: '#D8E4EE', pos: [0, 60], rect_size: [200, 60] });
b.patch(`${DC}/DefaultChevron`, { display_order: 12 });
b.patch(`${DC}/Hint`, { pos: [0, 0], rect_size: [400, 40], display_order: 12 });
b.patchComponent(`${DC}/Hint`, 'MOD.Core.TextComponent', {
  Text: '강화 종류를 선택해 주세요.', FontSize: 18, FontColor: { r: 0.75, g: 0.8, b: 0.88, a: 1 } });

// ── 주문서/추가옵션 placeholder ────────────────────────────────────────
const placeholders = [
  ['ScrollContent', '주문서를 사용할\n장비를 올려주세요.'],
  ['AddOptionContent', '추가옵션을 재설정할\n장비를 올려주세요.'],
];
for (const [content, msg] of placeholders) {
  const CP = `${W}/RightPanel/ContentArea/${content}`;
  b.text(`${CP}/PlaceholderChevron`, '≪', { size: 36, bold: true, color: '#D8E4EE', pos: [0, 70], rect_size: [200, 50] });
  b.patch(`${CP}/PlaceholderChevron`, { display_order: 12 });
  b.text(`${CP}/PlaceholderMsg`, msg, { size: 16, color: '#BFCBD8', pos: [0, 0], rect_size: [420, 60] });
  b.patch(`${CP}/PlaceholderMsg`, { display_order: 12 });
}

// ── 잠재능력/에디셔널 컨텐츠 ───────────────────────────────────────────
for (const content of ['PotentialContent', 'AdditionalContent']) {
  const CP = `${W}/RightPanel/ContentArea/${content}`;
  b.patch(`${CP}/NoItemPanel`, { pos: [0, 190], rect_size: [544, 230], display_order: 8 });
  b.patchComponent(`${CP}/NoItemPanel`, 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.02, g: 0.035, b: 0.055, a: 0.5 } });
  b.patchComponent(`${CP}/NoItemPanel/MsgText`, 'MOD.Core.TextComponent', {
    FontSize: 15, FontColor: { r: 0.8, g: 0.86, b: 0.93, a: 1 } });
  b.patch(`${CP}/IncompatiblePanel`, { pos: [0, 190], rect_size: [544, 230], display_order: 8 });
  b.patchComponent(`${CP}/IncompatiblePanel`, 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.02, g: 0.035, b: 0.055, a: 0.5 } });
  b.patchComponent(`${CP}/IncompatiblePanel/MsgText`, 'MOD.Core.TextComponent', {
    FontSize: 15, FontColor: { r: 0.8, g: 0.86, b: 0.93, a: 1 } });
  b.patch(`${CP}/ItemInfoPanel`, { pos: [0, 180], display_order: 9 });
  b.patchComponent(`${CP}/ItemInfoPanel/GradeTitleText`, 'MOD.Core.TextComponent', {
    FontSize: 18, Bold: true, FontColor: { r: 1, g: 1, b: 1, a: 1 } });
  // 등급명을 등급 바 위 중앙에 겹쳐 표시 (원작과 동일)
  b.patch(`${CP}/ItemInfoPanel/GradeBarBG`, { display_order: 1 });
  b.patch(`${CP}/ItemInfoPanel/GradeTitleText`, { pos: [0, 100], display_order: 10 });
  for (const opt of ['Opt1Text', 'Opt2Text', 'Opt3Text']) {
    b.patch(`${CP}/ItemInfoPanel/${opt}`, { display_order: 10 });
    b.patchComponent(`${CP}/ItemInfoPanel/${opt}`, 'MOD.Core.TextComponent', { FontSize: 15 });
  }
  b.patch(`${CP}/CurrencyTabRow`, { display_order: 10 });
  // 큐브 패널: 밝은 회백색 판 + 흰 슬롯 (원작 느낌)
  b.patch(`${CP}/CubePanel`, { display_order: 6 });
  b.sprite(`${CP}/CubePanel/CubePanelBG`, { pos: [0, 0], rect_size: [534, 184], color: { r: 0.90, g: 0.92, b: 0.95, a: 0.92 } });
  b.patch(`${CP}/CubePanel/CubePanelBG`, { display_order: 1 });
  b.patch(`${CP}/CubePanel/CubeGrid`, { display_order: 10 });
  for (let i = 1; i <= 18; i++) {
    // .ui에는 큐브 슬롯이 12개만 존재 (매니저는 최대 18개까지 탐색하지만 실재하는 것만 패치)
    if (!b.find(`${CP}/CubePanel/CubeGrid/CubeSlot${i}`)) continue;
    b.patchComponent(`${CP}/CubePanel/CubeGrid/CubeSlot${i}/CountText`, 'MOD.Core.TextComponent', {
      Bold: true, FontColor: { r: 0.15, g: 0.18, b: 0.22, a: 1 } });
  }
  b.patch(`${CP}/MesoPanel`, { display_order: 6 });
  b.sprite(`${CP}/MesoPanel/MesoPanelBG`, { pos: [0, 0], rect_size: [534, 184], color: { r: 0.90, g: 0.92, b: 0.95, a: 0.92 } });
  b.patch(`${CP}/MesoPanel/MesoPanelBG`, { display_order: 1 });
  b.text(`${CP}/MesoPanel/MesoUseLabel`, '사용 재화', { size: 13, alignment: 3, color: '#4A555F', pos: [0, 70], rect_size: [500, 20] });
  b.patch(`${CP}/MesoPanel/MesoUseLabel`, { display_order: 10 });
  b.text(`${CP}/MesoPanel/MesoCostText`, '●  - 메소', { size: 16, bold: true, color: '#8A6D1E', pos: [0, 0], rect_size: [400, 30] });
  b.patch(`${CP}/MesoPanel/MesoCostText`, { display_order: 10 });
  // 안내 문구 + 재설정 버튼
  b.text(`${CP}/InfoFooterText`, '재설정한 잠재능력이 즉시 적용됩니다.', { size: 12, color: '#96A3B0', pos: [0, -222], rect_size: [500, 20] });
  b.patch(`${CP}/InfoFooterText`, { display_order: 10 });
  b.patch(`${CP}/ResetBtnBG`, { pos: [0, -262], rect_size: [240, 52], display_order: 12 });
  b.patchComponent(`${CP}/ResetBtnBG`, 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.16, g: 0.18, b: 0.22, a: 1 } });
  b.patchComponent(`${CP}/ResetBtnBG/ResetBtnText`, 'MOD.Core.TextComponent', {
    FontSize: 20, Bold: true, FontColor: { r: 1, g: 1, b: 1, a: 1 } });
}

// ── 강화 확인 다이얼로그 (원작 이미지 1 스타일) ─────────────────────────
const DLG = `${W}/RightPanel/ConfirmDialog`;
b.panel(DLG, { pos: [0, 0], rect_size: [380, 210], enable: false });
b.patch(DLG, { display_order: 40 });
b.sprite(`${DLG}/DlgTopBG`, { pos: [0, 30], rect_size: [380, 150], color: { r: 0.63, g: 0.85, b: 0.91, a: 1 } });
b.sprite(`${DLG}/DlgBottomBG`, { pos: [0, -75], rect_size: [380, 60], color: { r: 0.91, g: 0.91, b: 0.91, a: 1 } });
b.text(`${DLG}/DlgText`, '', { size: 15, color: '#1A262E', pos: [0, 30], rect_size: [340, 130] });
b.sprite(`${DLG}/DlgOkBG`, { pos: [-58, -75], rect_size: [100, 36], color: { r: 0.48, g: 0.72, b: 0.15, a: 1 } });
b.text(`${DLG}/DlgOkText`, '확인', { size: 16, bold: true, color: '#FFFFFF', pos: [-58, -75], rect_size: [100, 36] });
b.sprite(`${DLG}/DlgCancelBG`, { pos: [58, -75], rect_size: [100, 36], color: { r: 0.72, g: 0.72, b: 0.72, a: 1 } });
b.text(`${DLG}/DlgCancelText`, '취소', { size: 16, bold: true, color: '#FFFFFF', pos: [58, -75], rect_size: [100, 36] });

b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done. ConfirmDialog id=' + b.getId(DLG));
