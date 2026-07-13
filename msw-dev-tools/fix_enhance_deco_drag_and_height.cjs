// 1) EnhanceWindow: LeftPanel(880)/RightPanel(900) 높이 불일치 수정 -> 880으로 통일
// 2) EnhanceWindow: 타이틀 드래그 스트립(TitleText)이 RightPanel 위쪽만 덮고 LeftPanel(ENCHANT 사이드바) 위쪽은
//    덮지 못했던 문제 수정 -> 창 전체 상단(닫기 버튼 제외)을 덮도록 확장
// 3) DecoWindow: TitleText가 stretch(0,0)-(1,1) 앵커로 깨져 있어(OffsetMin==OffsetMax) 실제 히트 영역이
//    RectSize(440x40)와 전혀 다른 위치로 계산되던 버그 수정 -> middle-center 고정 앵커로 재작성
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

// ── EnhanceWindow 높이 정렬 ──
b.patch('EnhanceWindow/RightPanel', { pos: [92, 0], rect_size: [580, 880] });
b.patch('EnhanceWindow/RightPanel/MainBG', { pos: [0, 0], rect_size: [580, 880] });

// ── EnhanceWindow 타이틀 드래그 스트립: 창 전체 상단으로 확장 (닫기버튼 좌측 346 이전까지) ──
b.patch('EnhanceWindow/TitleText', { pos: [-27, 428], rect_size: [738, 44] });

// ── DecoWindow 타이틀 드래그 스트립: 깨진 stretch 앵커 -> middle-center로 재작성 ──
b.patch('DecoWindow/TitleText', { anchor: 'middle-center', pos: [-21, 323], rect_size: [490, 30] });

b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done');
