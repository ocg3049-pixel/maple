// 강화창 타이틀 드래그 영역이 X 닫기 버튼(362,428)과 겹치지 않도록 폭 축소
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
// 우측 끝 = 52+250 = 302 < 닫기 버튼 좌측 끝 346
b.patch('EnhanceWindow/TitleText', { pos: [52, 428], rect_size: [500, 44] });
b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done');
