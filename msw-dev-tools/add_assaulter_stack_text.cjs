// 어썰터 스택 수 표시용 텍스트 엔티티를 SkillBar 밑에 추가하고
// AssaulterCooldownUI.mlua의 stackText 프로퍼티에 UUID를 바인딩한다.
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

// 기존 어썰터 오버레이(AssaulterSlotCD_Gray, [-224,40] 50x50)와 같은 영역에 두고
// LowerRight(8) 정렬로 아이콘 우측 아래 모서리에 숫자가 붙게 한다. 시작은 숨김(enable:false).
b.text('SkillBar/AssaulterStack_Text', '', {
  size: 16,
  bold: true,
  alignment: 8, // LowerRight
  color: '#FFFFFF',
  anchor: 'middle-center',
  pos: [-224, 40],
  rect_size: [50, 50],
  enable: false,
});
// 아이콘 위에서도 잘 읽히도록 검은 외곽선 + 우/하단 여백 2px.
b.patchComponent('SkillBar/AssaulterStack_Text', 'MOD.Core.TextComponent', {
  UseOutLine: true,
  OutlineColor: { r: 0, g: 0, b: 0, a: 1 },
  OutlineWidth: 1,
  Padding: { left: 0, right: 3, top: 0, bottom: 2 },
});

b.write('ui/DefaultGroup.ui', {
  strict: false,
  bind: {
    mlua: 'RootDesk/MyDesk/UI/AssaulterCooldownUI.mlua',
    props: {
      stackText: 'SkillBar/AssaulterStack_Text',
    },
  },
});
console.log('AssaulterStack_Text id=' + b.getId('SkillBar/AssaulterStack_Text'));
