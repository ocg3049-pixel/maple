const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const PW = 380;
const PH = 590;

// TooltipPanel 크기 확장
b.patch("TooltipPanel", { rect_size: [PW, PH] });

// 배경 (stretch)
b.patch("TooltipPanel/TooltipBG", {
    anchor: "stretch", color: "#0D0D1A", alpha: 0.96
});

// TpStarFull: 황금색 채워진 별 (새로 추가)
b.text("TooltipPanel/TpStarFull", "", {
    anchor: "top-left", pos: [10, -12], rect_size: [280, 20],
    size: 14, color: "#FFD700", bold: true, alignment: 0
});

// StarText → 회색 빈 별 (재활용, 위치 재조정은 런타임에서)
b.patch("TooltipPanel/StarText", {
    anchor: "top-left", pos: [10, -12], rect_size: [280, 20],
    size: 14, color: "#777777", alignment: 0
});

// TooltipTitle → 이름 (재활용)
b.patch("TooltipPanel/TooltipTitle", {
    anchor: "top-center", pos: [0, -40], rect_size: [360, 28],
    size: 20, color: "#FF9900", bold: true, alignment: 4
});

// Divider1
b.sprite("TooltipPanel/Divider1", {
    anchor: "top-center", pos: [0, -76], rect_size: [360, 2], color: "#555566"
});

// ItemIcon (재활용)
b.patch("TooltipPanel/TooltipIcon", {
    anchor: "top-left", pos: [12, -85], rect_size: [75, 75]
});

// ReqText (REQ 조건 표시용)
b.text("TooltipPanel/ReqText", "REQ LEV : 5", {
    anchor: "top-left", pos: [100, -87], rect_size: [165, 75],
    size: 13, color: "#CCCCCC", alignment: 0
});

// AtkPanel (공격력 증가량 박스)
b.sprite("TooltipPanel/AtkPanel", {
    anchor: "top-right", pos: [-12, -85], rect_size: [88, 75], color: "#111133"
});
b.text("TooltipPanel/AtkPanel/AtkLabel", "공격력\n증가량", {
    anchor: "top-center", pos: [0, -6], rect_size: [86, 34],
    size: 11, color: "#AAAAAA", alignment: 4
});
b.text("TooltipPanel/AtkPanel/AtkValue", "0", {
    anchor: "bottom-center", pos: [0, 8], rect_size: [70, 32],
    size: 22, color: "#FFFFFF", bold: true, alignment: 4
});

// Divider2
b.sprite("TooltipPanel/Divider2", {
    anchor: "top-center", pos: [0, -170], rect_size: [360, 2], color: "#555566"
});

// 직업 4개 (top-left 앵커 기준, 패널 너비 380 내 균등 배치)
// 총 4개, 각 너비 84px, 간격 4px → 총 344px, 여백: (380-344)/2 = 18px
const jobNames = ["초보자", "전사", "마법사", "궁수"];
const jobW = 84;
const jobGap = 4;
const jobTotalW = jobNames.length * jobW + (jobNames.length - 1) * jobGap;
const jobStartX = Math.round((PW - jobTotalW) / 2);
for (let i = 0; i < jobNames.length; i++) {
    b.text(`TooltipPanel/Job${i + 1}`, jobNames[i], {
        anchor: "top-left",
        pos: [jobStartX + i * (jobW + jobGap), -183],
        rect_size: [jobW, 23],
        size: 15, color: "#FFFFFF", bold: true, alignment: 4
    });
}

// Divider3
b.sprite("TooltipPanel/Divider3", {
    anchor: "top-center", pos: [0, -215], rect_size: [360, 2], color: "#555566"
});

// TooltipInfo → StatsText (재활용)
b.patch("TooltipPanel/TooltipInfo", {
    anchor: "top-left", pos: [12, -222], rect_size: [356, 360],
    size: 14, color: "#FFFFFF", alignment: 0
});

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('✓ TooltipPanel 재설계 완료 (380x590)');
