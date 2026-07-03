const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// 창 높이 850→900 (슬롯과 콘텐츠 겹침 방지)
b.patch('EnhanceWindow', { rect_size: [800, 900] });
b.patch('EnhanceWindow/BG', { rect_size: [800, 900] });
b.patch('EnhanceWindow/RightPanel', { rect_size: [580, 900] });

// 타이틀/닫기 위치 조정 (900px 창 기준)
b.patch('EnhanceWindow/CloseEnhance', { pos: [360, 430] });
b.patch('EnhanceWindow/TitleText', { pos: [-100, 430] });

// ContentArea를 아래로 이동 (center y=10 → -16)
// SlotArea bottom = 340-70 = 270
// 별 로컬 top = 284 → window top = -16+284 = 268 < 270 (2px 갭) ✓
// LogBG bottom local = -417 → window = -16-417 = -433 > -450 ✓
b.patch('EnhanceWindow/RightPanel/ContentArea', { pos: [0, -16], rect_size: [560, 700] });

// 서브패널 크기 업데이트
const panels = ['StarforceContent','ScrollContent','AddOptionContent','PotentialContent','AdditionalContent','DefaultContent'];
panels.forEach(p => {
  b.patch('EnhanceWindow/RightPanel/ContentArea/' + p, { rect_size: [560, 700] });
});

// 별 행 간격 24px→30px (28px 별 + 2px 갭, 겹침 없음)
// Row R (0-indexed): y = 270 - R * 30
// Row 10 center = 0, bottom edge = -14
const starXPositions = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];
for (let row = 0; row < 10; row++) {
  const newY = 270 - row * 30;
  for (let col = 0; col < 10; col++) {
    const starNum = row * 10 + col + 1;
    b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_' + starNum, {
      pos: [starXPositions[col], newY]
    });
  }
}

// 콘텐츠 요소 위치 (모두 StarforceContent 로컬 좌표)
// 별 row10 bottom = -14
// LevelArrow top = -16 (2px gap from stars) → center = -16-18 = -34
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow', { pos: [0, -34], rect_size: [420, 36] });

// EnhanceLevelText: top = -52 (LevelArrow bottom), center = -52-15 = -67
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceLevelText', { pos: [0, -67], rect_size: [300, 30] });

// StatHeader: top = -82 (EnhanceLevelText bottom), center = -82-13 = -95
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader', { pos: [0, -95], rect_size: [300, 26] });

// StatsText: top = -108 (StatHeader bottom), center = -108-55 = -163
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText', { pos: [0, -163], rect_size: [380, 110] });

// RateHeader: top = -218 (StatsText bottom), center = -218-13 = -231
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader', { pos: [0, -231], rect_size: [300, 26] });

// RateText: top = -244 (RateHeader bottom), center = -244-18 = -262
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText', { pos: [0, -262], rect_size: [420, 36] });

// EnhanceBtn: 5px gap from RateText bottom (-280), top = -285, center = -285-30 = -315
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn', { pos: [0, -315] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnBG', { rect_size: [360, 60] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnLabel', { rect_size: [360, 60] });

// LogBG: top = -345 (EnhanceBtn bottom), center = -345-36 = -381
// window bottom = -16+(-381-36) = -16-417 = -433 > -450 ✓
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG', { pos: [0, -381] });

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { lint: false, strict: false });
console.log('Enhancement window v2 - stars below slot, tight spacing applied');
