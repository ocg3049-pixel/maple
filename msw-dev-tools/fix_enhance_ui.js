const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// 1. Window & BG height: 780 -> 850
b.patch('EnhanceWindow', { rect_size: [800, 850] });
b.patch('EnhanceWindow/BG', { rect_size: [800, 850] });

// 2. CloseEnhance & TitleText - move up to match new top
b.patch('EnhanceWindow/CloseEnhance', { pos: [360, 385] });
b.patch('EnhanceWindow/TitleText', { pos: [-100, 385] });

// 3. RightPanel height
b.patch('EnhanceWindow/RightPanel', { rect_size: [580, 850] });

// 4. SlotArea - move up, reduce height slightly
b.patch('EnhanceWindow/RightPanel/SlotArea', { pos: [0, 340], rect_size: [560, 140] });

// 5. ContentArea - move up, expand height 540->680
b.patch('EnhanceWindow/RightPanel/ContentArea', { pos: [0, 10], rect_size: [560, 680] });

// 6. Update each content panel size
const panels = ['StarforceContent','ScrollContent','AddOptionContent','PotentialContent','AdditionalContent','DefaultContent'];
panels.forEach(p => {
  b.patch('EnhanceWindow/RightPanel/ContentArea/' + p, { rect_size: [560, 680] });
});

// 7. Move stars UP: row spacing 36px -> 24px, starting y=270
// Current: row R has y = 200 - R*36 (R from 0)
// New:     row R has y = 270 - R*24
const starXPositions = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];
for (let row = 0; row < 10; row++) {
  const newY = 270 - row * 24;
  for (let col = 0; col < 10; col++) {
    const starNum = row * 10 + col + 1;
    b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_' + starNum, {
      pos: [starXPositions[col], newY]
    });
  }
}

// 8. Move LevelArrow below stars (stars bottom: row10 y=270-9*24=54, bottom edge=54-14=40)
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow', { pos: [0, 10], rect_size: [420, 36] });

// 9. Move EnhanceLevelText below LevelArrow
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceLevelText', { pos: [0, -35], rect_size: [300, 30] });

// 10. Add "강화 스텟" header (new entity)
b.text('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader', '강화 스텟', {
  anchor: 'middle-center', pos: [0, -75], rect_size: [300, 26],
  size: 18, color: '#AAAACC', alignment: 4, bold: true
});

// 11. Reposition StatsText - centered, below header
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText', {
  pos: [0, -150], rect_size: [380, 110]
});

// 12. Add "강화 확률" header
b.text('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader', '강화 확률', {
  anchor: 'middle-center', pos: [0, -218], rect_size: [300, 26],
  size: 18, color: '#AAAACC', alignment: 4, bold: true
});

// 13. Reposition RateText - centered, below rate header
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText', {
  pos: [0, -252], rect_size: [420, 36]
});

// 14. Hide CostText (move off-screen)
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/CostText', { pos: [0, 9999] });

// 15. Move EnhanceBtn below RateText
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn', { pos: [0, -310] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnBG', { rect_size: [360, 60] });
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn/BtnLabel', { rect_size: [360, 60] });

// 16. Move LogBG to bottom
b.patch('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG', { pos: [0, -383] });

// 17. Move orphaned window-level elements off-screen
b.patch('EnhanceWindow/EnhanceLevelText', { pos: [0, 9999] });
b.patch('EnhanceWindow/LogBG', { pos: [0, 9999] });

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { lint: false, strict: false });
console.log('Enhancement window layout updated successfully');
