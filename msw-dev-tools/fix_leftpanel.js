const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

// LeftPanel 높이 수정: 탭 5개(y=±184, 크기 80)가 ±224까지 차지하므로 최소 448 필요 → 480으로 설정
// 현재 LeftPanel ap=(-285, 176), rect_size=[170, 420] → 420/2=210, 부족
b.patch('EnhanceWindow/LeftPanel', { rect_size: [170, 480] });

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('✓ LeftPanel 높이 420→480 수정 완료 (탭 클릭 영역 확보)');
