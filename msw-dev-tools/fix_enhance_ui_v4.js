const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const STAR_RUID = '58274544478d4475b6f33f1f2ecca764';
const SC_PATH = 'EnhanceWindow/RightPanel/ContentArea/StarforceContent';
const STAR_SIZE = 28;
const HALF = STAR_SIZE / 2; // 14

// === 별 위치 계산 ===
// 행 1-6: 15개씩 (5+5+5), 행 7: 10개 (5+5)
// 행 1 중심 y=300, 행 간격 30px
const starPositions = {};

// 행 1~6: 그룹 중심 x = -190, 0, +190
for (let row = 0; row < 6; row++) {
    const y = 300 - row * 30; // 300, 270, 240, 210, 180, 150
    const groupCenters = [-190, 0, 190];
    for (let g = 0; g < 3; g++) {
        for (let s = 0; s < 5; s++) {
            const starNum = row * 15 + g * 5 + s + 1; // 1~90
            const x = groupCenters[g] + (s - 2) * 30;  // -60,-30,0,+30,+60
            starPositions[starNum] = { x, y };
        }
    }
}

// 행 7: 그룹 중심 x = -95, +95
for (let g = 0; g < 2; g++) {
    for (let s = 0; s < 5; s++) {
        const starNum = 90 + g * 5 + s + 1; // 91~100
        const x = [-95, 95][g] + (s - 2) * 30;
        starPositions[starNum] = { x, y: 120 };
    }
}

// 100개 별: 위치 + RUID 업데이트
for (let i = 1; i <= 100; i++) {
    const { x, y } = starPositions[i];
    const path = SC_PATH + '/Star_' + i;

    b.patchComponent(path, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x, y },
        OffsetMin: { x: x - HALF, y: y - HALF },
        OffsetMax: { x: x + HALF, y: y + HALF },
    });

    b.patchComponent(path, 'MOD.Core.SpriteGUIRendererComponent', {
        ImageRUID: { DataId: STAR_RUID },
    });
}
console.log('Stars: 100개 위치 + RUID 업데이트 완료');

// === StarforceContent 하위 요소 재배치 ===
// 행 7 바닥: y=120-14=106, 그 아래로 순서대로 배치
// 레이아웃 (모두 StarforceContent 로컬 좌표):
//   LevelArrow   : y= 76, h=36  (gap 12 from stars bottom)
//   EnhanceLvlTxt: y= 35, h=30  (gap  8)
//   StatHeader   : y=  0, h=26  (gap  7)
//   StatsText    : y=-72, h=110 (gap  4)
//   RateHeader   : y=-146, h=26 (gap  6)
//   RateText     : y=-181, h=36 (gap  4)
//   EnhanceBtn   : y=-239, h=60 (gap 10)
//   LogBG        : y=-313, h=72 (gap  8)  ← AppendLog 사용, 화면에 표시 필요

function patch(relPath, cx, cy, w, h) {
    b.patchComponent(SC_PATH + '/' + relPath, 'MOD.Core.UITransformComponent', {
        anchoredPosition: { x: cx, y: cy },
        OffsetMin: { x: cx - w / 2, y: cy - h / 2 },
        OffsetMax: { x: cx + w / 2, y: cy + h / 2 },
    });
}

patch('LevelArrow',       0,   76, 420, 36);
patch('EnhanceLevelText', 0,   35, 300, 30);
patch('StatHeader',       0,    0, 300, 26);
patch('StatsText',        0,  -72, 380, 110);
patch('RateHeader',       0, -146, 300, 26);
patch('RateText',         0, -181, 420, 36);
patch('EnhanceBtn',       0, -239, 320, 60);
patch('LogBG',            0, -313, 500, 72);

// CostText: 사용하지 않는 요소 → Enable=false로 숨김 (오프스크린 방지)
b.patchComponent(SC_PATH + '/CostText', 'MOD.Core.UITransformComponent', {
    Enable: false,
});

console.log('StarforceContent 하위 요소 재배치 완료');

// === 파일 저장 (pre-existing lint 오류 무시) ===
b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('DefaultGroup.ui 저장 완료 (strict=false)');

// === 레이아웃 검증 ===
console.log('\n=== 레이아웃 검증 ===');
const starTopWindow = -80 + (300 + 14);
const slotBottom = 270;
console.log('별 행1 꼭대기 (window y):', starTopWindow, '| SlotArea 바닥:', slotBottom, '| 갭:', slotBottom - starTopWindow, 'px');
const btnBottom = -80 + (-239 - 30);
const windowBottom = -450;
console.log('EnhanceBtn 바닥 (window y):', btnBottom, '| window 바닥:', windowBottom, '| 마진:', btnBottom - windowBottom, 'px');
const logBottom = -80 + (-313 - 36);
console.log('LogBG 바닥 (window y):', logBottom, '| window 바닥:', windowBottom, '| 마진:', logBottom - windowBottom, 'px');
