const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const SC = 'EnhanceWindow/RightPanel/ContentArea/StarforceContent';
const STAR_SIZE = 20; // 28 * 0.7 = 19.6 → 20

// 새 별 위치 계산
// - 그룹 내 간격: 22px (기존 30px)
// - 그룹 중심 (1~6행): x = -120, 0, +120 (기존 ±190)
// - 그룹 중심 (7행): x = -60, +60 (기존 ±95)
// - 행 y: 변경없음 (300, 270, 240, 210, 180, 150, 120)
const starPositions = {};

// 행 1~6
for (let row = 0; row < 6; row++) {
    const y = 300 - row * 30;
    [-120, 0, 120].forEach((gx, g) => {
        for (let s = 0; s < 5; s++) {
            const num = row * 15 + g * 5 + s + 1;
            starPositions[num] = { x: gx + (s - 2) * 22, y };
        }
    });
}

// 행 7 (5+5=10개)
[-60, 60].forEach((gx, g) => {
    for (let s = 0; s < 5; s++) {
        const num = 90 + g * 5 + s + 1;
        starPositions[num] = { x: gx + (s - 2) * 22, y: 120 };
    }
});

// 100개 별 패치
for (let i = 1; i <= 100; i++) {
    const { x, y } = starPositions[i];
    const sp = SC + '/Star_' + i;
    b.patch(sp, { pos: [x, y], rect_size: [STAR_SIZE, STAR_SIZE] });
}

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });

// 검증
console.log('=== 레이아웃 검증 ===');
console.log('행1 x 범위: ' + (-120-44) + ' ~ ' + (120+44) + ' (너비 ' + (2*(120+44)) + 'px, 컨텐츠 560px)');
console.log('그룹1 우단(-76) ~ 그룹2 좌단(-44): 중심 간격 32px, 시각 간격 ' + (32-STAR_SIZE) + 'px');
console.log('행7 x 범위: ' + (-60-44) + ' ~ ' + (60+44));
console.log('행1 상단 y: ' + (300+STAR_SIZE/2) + ', 행7 하단 y: ' + (120-STAR_SIZE/2));
console.log('✓ 별 패치 완료 (크기 20×20, 그룹 간격 축소)');
