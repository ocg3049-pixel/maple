const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// ─── 1. EnhanceWindow 리사이즈 ─────────────────────────────────────────────
b.patch('EnhanceWindow',       { pos: [550, 0],    rect_size: [800, 900] });
b.patch('EnhanceWindow/BG',   { pos: [0, 0],      rect_size: [800, 900] });
b.patch('EnhanceWindow/TitleText',   { pos: [-100, 430] });
b.patch('EnhanceWindow/CloseEnhance', { pos: [360, 430] });

// 기존 창 레벨 엔티티 → 화면 밖 이동 (새 구조의 동일 경로 사용)
b.patch('EnhanceWindow/EnhanceLevelText', { pos: [0, 9999] });
b.patch('EnhanceWindow/LogBG',            { pos: [0, 9999] });
b.patch('EnhanceWindow/EnhanceBtn',       { pos: [0, 9999] });
b.patch('EnhanceWindow/TargetSlotBG',     { pos: [0, 9999] });
b.patch('EnhanceWindow/TargetNameLabel',  { pos: [0, 9999] });
b.patch('EnhanceWindow/SlotLabel',        { pos: [0, 9999] });

console.log('Step 1: EnhanceWindow resized');

// ─── 2. LeftPanel + 5개 탭 ─────────────────────────────────────────────────
b.panel('EnhanceWindow/LeftPanel', { pos: [-285, 176], rect_size: [170, 420] });

const TAB_NAMES   = ['EnhanceTab_Starforce','EnhanceTab_Scroll','EnhanceTab_AddOption','EnhanceTab_Potential','EnhanceTab_Additional'];
const TAB_LABELS  = ['스타포스','주문서','추가옵션','잠재능력','에디셔널'];
const TAB_Y       = [184, 92, 0, -92, -184];

TAB_NAMES.forEach((name, i) => {
    const tp = 'EnhanceWindow/LeftPanel/' + name;
    b.panel  (tp,              { pos: [0, TAB_Y[i]], rect_size: [164, 80] });
    b.sprite (tp + '/TabBG',   { pos: [0, 0],        rect_size: [164, 80] });
    // TabBG 색상: 기본값 TAB_NORMAL
    b.patchComponent(tp + '/TabBG', 'MOD.Core.SpriteGUIRendererComponent', {
        Color: { r: 0.22, g: 0.22, b: 0.28, a: 1.0 },
    });
    b.text   (tp + '/TabLbl',  TAB_LABELS[i], { pos: [0, 0], rect_size: [148, 70], size: 15, alignment: 4 });
    // ClickZone: 탭 전체를 덮는 터치 수신 엔티티
    b.touchReceive(tp + '/ClickZone', { pos: [0, 0], rect_size: [164, 80] });
});
console.log('Step 2: LeftPanel + tabs created');

// ─── 3. RightPanel ─────────────────────────────────────────────────────────
b.panel('EnhanceWindow/RightPanel', { pos: [92, 0], rect_size: [580, 900] });
console.log('Step 3: RightPanel created');

// ─── 4. SlotArea ───────────────────────────────────────────────────────────
const SA = 'EnhanceWindow/RightPanel/SlotArea';
b.panel(SA,                         { pos: [0, 340],  rect_size: [560, 140] });
b.panel(SA + '/TargetSlotBG',       { pos: [0, 10],   rect_size: [100, 100] });
b.sprite(SA + '/TargetSlotBG/SlotBG',        { pos: [0, 0], rect_size: [100, 100] });
b.patchComponent(SA + '/TargetSlotBG/SlotBG', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.15, g: 0.15, b: 0.20, a: 1.0 },
});
b.sprite(SA + '/TargetSlotBG/TargetIcon',    { pos: [0, 0], rect_size: [80, 80] });
b.patchComponent(SA + '/TargetSlotBG/TargetIcon', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 1, g: 1, b: 1, a: 0.0 },  // 초기에는 투명
});
b.sprite(SA + '/TargetSlotBG/PlaceholderIcon', { pos: [0, 0], rect_size: [60, 60] });
b.patchComponent(SA + '/TargetSlotBG/PlaceholderIcon', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.4, g: 0.4, b: 0.5, a: 1.0 },
});
b.text(SA + '/TargetSlotBG/StarLabel', '', { pos: [0, 40], rect_size: [90, 20], size: 12, alignment: 4 });
b.text(SA + '/SlotPromptText', '아이템을 드래그하여 올려주세요', {
    pos: [160, 10], rect_size: [290, 50], size: 13, color: '#888899', alignment: 3
});
b.text(SA + '/TargetNameLabel', '', { pos: [160, -45], rect_size: [290, 30], size: 15, alignment: 3 });
b.patchComponent(SA + '/TargetNameLabel', 'MOD.Core.UITransformComponent', { Enable: false });
console.log('Step 4: SlotArea created');

// ─── 5. ContentArea ────────────────────────────────────────────────────────
const CA = 'EnhanceWindow/RightPanel/ContentArea';
b.panel(CA, { pos: [0, -80], rect_size: [560, 700] });

// DefaultContent (기본: 탭 미선택 시)
b.panel(CA + '/DefaultContent', { pos: [0, 0], rect_size: [560, 700] });
b.text(CA + '/DefaultContent/Hint', '탭을 선택하세요', { pos: [0, 0], rect_size: [300, 50], size: 20, color: '#777788', alignment: 4 });

// 미구현 콘텐츠 패널
['ScrollContent','AddOptionContent','PotentialContent','AdditionalContent'].forEach(name => {
    b.panel(CA + '/' + name, { pos: [0, 0], rect_size: [560, 700] });
    b.text(CA + '/' + name + '/PlaceholderText', '준비 중', { pos: [0, 0], rect_size: [300, 50], size: 22, color: '#777788', alignment: 4 });
});
console.log('Step 5: ContentArea + sub-panels created');

// ─── 6. StarforceContent ───────────────────────────────────────────────────
const SC = CA + '/StarforceContent';
b.panel(SC, { pos: [0, 0], rect_size: [560, 700] });

// ── 6-1. 100개 별: 7행 (1~6행=15개씩 5+5+5, 7행=10개 5+5) ─────────────
const STAR_RUID = '58274544478d4475b6f33f1f2ecca764';
const HALF = 14; // 28/2

const starPositions = {};
// 행 1~6: 그룹 중심 x = -190, 0, +190
for (let row = 0; row < 6; row++) {
    const y = 300 - row * 30; // 300, 270, 240, 210, 180, 150
    [-190, 0, 190].forEach((gx, g) => {
        for (let s = 0; s < 5; s++) {
            const num = row * 15 + g * 5 + s + 1;
            starPositions[num] = { x: gx + (s - 2) * 30, y };
        }
    });
}
// 행 7: 그룹 중심 x = -95, +95
[-95, 95].forEach((gx, g) => {
    for (let s = 0; s < 5; s++) {
        const num = 90 + g * 5 + s + 1;
        starPositions[num] = { x: gx + (s - 2) * 30, y: 120 };
    }
});

for (let i = 1; i <= 100; i++) {
    const { x, y } = starPositions[i];
    const sp = SC + '/Star_' + i;
    b.sprite(sp, { pos: [x, y], rect_size: [28, 28] });
    b.patchComponent(sp, 'MOD.Core.SpriteGUIRendererComponent', {
        ImageRUID: { DataId: STAR_RUID },
        Color: { r: 0.55, g: 0.55, b: 0.60, a: 0.85 },
        RaycastTarget: false,
    });
}
console.log('Step 6-1: Stars 1-100 created with RUID');

// ── 6-2. 텍스트 요소 ────────────────────────────────────────────────────────
b.text(SC + '/LevelArrow',       '★0  >>>  ★1', { pos: [0,  76], rect_size: [420, 36], size: 20, alignment: 4, bold: true });
b.text(SC + '/EnhanceLevelText', '+0강',          { pos: [0,  35], rect_size: [300, 30], size: 22, alignment: 4, bold: true });
b.text(SC + '/StatHeader',       '강화 스텟',     { pos: [0,   0], rect_size: [300, 26], size: 18, color: '#AAAACC', alignment: 4, bold: true });
b.text(SC + '/StatsText', 'STR  +3\nDEX  +3\nINT  +3\nLUK  +3\nHP  +25', {
    pos: [0, -72], rect_size: [380, 110], size: 16, alignment: 4
});
b.text(SC + '/RateHeader', '강화 확률', { pos: [0, -146], rect_size: [300, 26], size: 18, color: '#AAAACC', alignment: 4, bold: true });
b.text(SC + '/RateText', '성공 60% | 유지 20% | 파괴 20%', { pos: [0, -181], rect_size: [420, 36], size: 16, alignment: 4 });

// ── 6-3. 강화하기 버튼 ─────────────────────────────────────────────────────
b.button(SC + '/EnhanceBtn', '강화하기', { pos: [0, -239], rect_size: [320, 60], size: 20, bold: true });

// ── 6-4. 로그 영역 ─────────────────────────────────────────────────────────
b.panel(SC + '/LogBG', { pos: [0, -313], rect_size: [500, 72] });
b.sprite(SC + '/LogBG/LogBGSprite', { pos: [0, 0], rect_size: [500, 72] });
b.patchComponent(SC + '/LogBG/LogBGSprite', 'MOD.Core.SpriteGUIRendererComponent', {
    Color: { r: 0.1, g: 0.1, b: 0.15, a: 0.85 },
});
b.text(SC + '/LogBG/EnhanceLogText', '', { pos: [0, 0], rect_size: [490, 60], size: 14, alignment: 3 }); // 좌상단 정렬

console.log('Step 6: StarforceContent complete');

// ─── 7. 저장 (기존 InvenWindow 린트 오류 무시) ─────────────────────────────
b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('\n✓ DefaultGroup.ui 저장 완료');

// ─── 검증 ─────────────────────────────────────────────────────────────────
console.log('\n=== 레이아웃 검증 ===');
console.log('별 행1 꼭대기 → window y:', -80 + (300 + 14), '  SlotArea 바닥=270, 갭=', 270 - (-80 + 314), 'px');
console.log('별 행7 중심   → window y:', -80 + 120);
console.log('EnhanceBtn 바닥 → window y:', -80 + (-239 - 30), '  window 바닥=-450, 마진=', (-80 + (-239 - 30)) - (-450), 'px');
console.log('LogBG 바닥      → window y:', -80 + (-313 - 36), '  window 바닥=-450, 마진=', (-80 + (-313 - 36)) - (-450), 'px');
