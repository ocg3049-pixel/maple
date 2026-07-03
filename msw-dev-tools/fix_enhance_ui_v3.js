const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// ContentArea를 SlotArea 바로 아래에 배치
// SlotArea: pos=[0,340], height=140 → bottom=270
// ContentArea top = SlotArea bottom → ContentArea center = bottom - half
// ContentArea height=700, half=350 → center = 270-350 = -80
b.patch('EnhanceWindow/RightPanel/ContentArea', { pos: [0, -80], rect_size: [560, 700] });

const panels = ['StarforceContent','ScrollContent','AddOptionContent','PotentialContent','AdditionalContent','DefaultContent'];
panels.forEach(p => {
  b.patch('EnhanceWindow/RightPanel/ContentArea/' + p, { rect_size: [560, 700] });
});

// 별들을 ContentArea 상단 가까이 배치
// ContentArea half=350, stars top = half-14-5 = 331 (5px margin)
// Row R: y = 331 - R*30
// Row 1: y=331, top=345 (within ContentArea top 350 ✓)
// Row 10: y=61, bottom=47
// Window: stars top = -80+(331+14)=265 < 270(slot bottom) ✓ (5px gap below slot)
const starXPositions = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];
for (let row = 0; row < 10; row++) {
  const newY = 331 - row * 30;
  for (let col = 0; col < 10; col++) {
    const starNum = row * 10 + col + 1;
    b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_' + starNum, {
      pos: [starXPositions[col], newY]
    });
  }
}

// 콘텐츠 요소 - 별 row10 bottom=47 기준으로 쌓기 (로컬 좌표)
// LevelArrow (h=36): top=45, center=27, bottom=9
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow', { pos: [0, 27], rect_size: [420, 36] });

// EnhanceLevelText (h=30): top=9, center=-6, bottom=-21
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceLevelText', { pos: [0, -6], rect_size: [300, 30] });

// StatHeader (h=26): top=-21, center=-34, bottom=-47
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader', { pos: [0, -34], rect_size: [300, 26] });

// StatsText (h=110): top=-47, center=-102, bottom=-157
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText', { pos: [0, -102], rect_size: [380, 110] });

// RateHeader (h=26): top=-157, center=-170, bottom=-183
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader', { pos: [0, -170], rect_size: [300, 26] });

// RateText (h=36): top=-183, center=-201, bottom=-219
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText', { pos: [0, -201], rect_size: [420, 36] });

// EnhanceBtn (h=60): 5px gap, top=-224, center=-254, bottom=-284
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn', { pos: [0, -254] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnBG', { rect_size: [360, 60] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnLabel', { rect_size: [360, 60] });

// LogBG (h=72): top=-284, center=-320, bottom=-356
// window = -80+(-356) = -436 > window bottom(-450) ✓
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG', { pos: [0, -320] });

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { lint: false, strict: false });
console.log('Enhancement window v3 - ContentArea starts at slot bottom, stars near top of ContentArea');
