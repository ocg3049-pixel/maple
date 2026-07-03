const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const PW = 380;

// === 별 레이아웃 설정 ===
const STAR_W   = 16;   // 별 엔티티 너비
const GROUP_GAP = 8;   // 5개 그룹 사이 픽셀 간격
const ROW_GAP   = 4;   // 행 사이 픽셀 간격
const STARS_TOP = 8;   // 별 섹션 상단 여백

// 행당 15개(5+gap+5+gap+5) 기준 행 너비
const groupW    = 5 * STAR_W;                // 80px
const fullRowW  = 3 * groupW + 2 * GROUP_GAP; // 256px
const fullStartX = Math.round((PW - fullRowW) / 2); // 62px

// 마지막 행(10개) 너비
const lastRowW  = 2 * groupW + GROUP_GAP;    // 168px
const lastStartX = Math.round((PW - lastRowW) / 2); // 106px

// 100개 별 엔티티 생성 (TpStar_1 ~ TpStar_100)
for (let i = 0; i < 100; i++) {
    const num = i + 1;
    const row = Math.floor(i / 15);
    const col = i % 15;
    const rowY = -(STARS_TOP + row * (STAR_W + ROW_GAP));

    let x;
    if (row < 6) {
        // 행 1~6: 15개, 5+gap+5+gap+5
        const groupIdx = Math.floor(col / 5);
        const inGroup  = col % 5;
        x = fullStartX + groupIdx * (groupW + GROUP_GAP) + inGroup * STAR_W;
    } else {
        // 행 7: 10개(5+gap+5), 중앙 정렬
        const col7     = i - 90;
        const groupIdx = Math.floor(col7 / 5);
        const inGroup  = col7 % 5;
        x = lastStartX + groupIdx * (groupW + GROUP_GAP) + inGroup * STAR_W;
    }

    b.text(`TooltipPanel/TpStar_${num}`, "★", {
        anchor: "top-left",
        pos: [x, rowY],
        rect_size: [STAR_W, STAR_W + 2],
        size: 14,
        color: "#777777",
        alignment: 4
    });
}

// === 기존 TpStarFull / StarText 화면 밖으로 이동 (더 이상 미사용) ===
b.patch("TooltipPanel/TpStarFull", {
    anchor: "top-left", pos: [0, 2000], rect_size: [1, 1]
});
b.patch("TooltipPanel/StarText", {
    anchor: "top-left", pos: [0, 2000], rect_size: [1, 1]
});

// === 별 섹션 아래 레이아웃 위치 재계산 ===
// 7행 × (16 + 4)px = 140px, + 상단 여백 8px → 끝 y절댓값 = 148
const starsEndAbs = STARS_TOP + 7 * (STAR_W + ROW_GAP); // 148

const nameY   = starsEndAbs + 8;           // 156
const div1Y   = nameY + 28 + 6;            // 190
const iconY   = div1Y + 10;               // 200
const div2Y   = iconY + 75 + 8;           // 283
const jobY    = div2Y + 12;               // 295
const div3Y   = jobY + 23 + 8;            // 326
const statsY  = div3Y + 8;               // 334

// 이름 텍스트
b.patch("TooltipPanel/TooltipTitle", {
    anchor: "top-center", pos: [0, -nameY], rect_size: [360, 28]
});

// Divider1
b.patch("TooltipPanel/Divider1", {
    anchor: "top-center", pos: [0, -div1Y], rect_size: [360, 2]
});

// 아이콘
b.patch("TooltipPanel/TooltipIcon", {
    anchor: "top-left", pos: [12, -iconY], rect_size: [75, 75]
});

// REQ 텍스트
b.patch("TooltipPanel/ReqText", {
    anchor: "top-left", pos: [100, -(iconY + 2)], rect_size: [165, 75]
});

// AtkPanel
b.patch("TooltipPanel/AtkPanel", {
    anchor: "top-right", pos: [-12, -iconY], rect_size: [88, 75]
});

// Divider2
b.patch("TooltipPanel/Divider2", {
    anchor: "top-center", pos: [0, -div2Y], rect_size: [360, 2]
});

// 직업 4개
const jobW = 84;
const jobGap = 4;
const jobTotalW = 4 * jobW + 3 * jobGap;
const jobStartX = Math.round((PW - jobTotalW) / 2);
for (let i = 0; i < 4; i++) {
    b.patch(`TooltipPanel/Job${i + 1}`, {
        anchor: "top-left",
        pos: [jobStartX + i * (jobW + jobGap), -jobY],
        rect_size: [jobW, 23]
    });
}

// Divider3
b.patch("TooltipPanel/Divider3", {
    anchor: "top-center", pos: [0, -div3Y], rect_size: [360, 2]
});

// StatsText (초기 높이 150, 런타임에서 동적 변경)
b.patch("TooltipPanel/TooltipInfo", {
    anchor: "top-left", pos: [12, -statsY], rect_size: [356, 150]
});

// TooltipPanel 초기 높이 (기본 3줄 stats + 패딩)
const initPanelH = statsY + 3 * 20 + 20; // 334+60+20 = 414
b.patch("TooltipPanel", { rect_size: [PW, initPanelH] });

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log(`✓ 툴팁 별 100개 배치 완료 (fullStartX=${fullStartX}, lastStartX=${lastStartX}, statsY=${statsY})`);
