// BuffBar/BlessIcon 생성 - RageIcon 구조 미러링 (group56 + GrayOverlay + Icon + Text)
// DefaultGroup.ui는 pre-existing lint 에러가 있으므로 반드시 strict:false로 write한다.
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

// 아이콘 그룹(56x56) - 시작은 enable:false, 위치 x는 BuffBarManager.Reorder가 재배치
b.empty('BuffBar/BlessIcon', { anchor: 'middle-center', pos: [32, 0], rect_size: [56, 56], enable: false, pivot: [0.5, 0.5] });
b.upsertComponent('BuffBar/BlessIcon', 'MOD.Core.UIGroupComponent',
  { '@type': 'MOD.Core.UIGroupComponent', DefaultShow: true, GroupOrder: 0, GroupType: 1, Enable: true });
b.upsertComponent('BuffBar/BlessIcon', 'MOD.Core.CanvasGroupComponent',
  { '@type': 'MOD.Core.CanvasGroupComponent', BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true });

// 회색 오버레이(경과시간 표시): Filled(3)/Vertical(1), FillAmount 0에서 차오름, 검정 40%
b.sprite('BuffBar/BlessIcon/GrayOverlay', {
  anchor: 'middle-center', pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5],
  image_ruid: '4fea64a3307cda641809ad8be0d4890b', sprite_type: 3,
});
b.patchComponent('BuffBar/BlessIcon/GrayOverlay', 'MOD.Core.SpriteGUIRendererComponent',
  { FillMethod: 1, FillAmount: 0, Color: { r: 0, g: 0, b: 0, a: 0.4 } });

// 스킬 아이콘
b.sprite('BuffBar/BlessIcon/Icon', {
  anchor: 'middle-center', pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5],
  image_ruid: '476232fa1b5e4ce68268fb26a793eb7d', sprite_type: 0,
  color: { r: 1, g: 1, b: 1, a: 1 },
});

// 카운트다운 텍스트(TextComponent - Rage/Meditation 아이콘과 동일 구성)
b.empty('BuffBar/BlessIcon/Text', { anchor: 'bottom-center', pos: [0, 3], rect_size: [48, 20], pivot: [0.5, 0] });
b.upsertComponent('BuffBar/BlessIcon/Text', 'MOD.Core.TextComponent', {
  '@type': 'MOD.Core.TextComponent',
  Alignment: 4, AllowAutomaticTranslation: true, BestFit: false, Bold: false,
  FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 20, Text: '',
  Overflow: 0, SortingLayer: 'UI', Enable: true,
});

// displayOrder를 Rage 아이콘과 동일하게 정리
b.patch('BuffBar/BlessIcon/GrayOverlay', { display_order: 0 });
b.patch('BuffBar/BlessIcon/Icon', { display_order: 1 });
b.patch('BuffBar/BlessIcon/Text', { display_order: 2 });

b.write('ui/DefaultGroup.ui', {
  strict: false,
  bind: {
    mlua: 'RootDesk/MyDesk/UI/BlessBuffUI.mlua',
    props: {
      buffIconGroup: 'BuffBar/BlessIcon',
      grayOverlay: 'BuffBar/BlessIcon/GrayOverlay',
      countdownText: 'BuffBar/BlessIcon/Text',
    },
  },
});
console.log('BlessIcon id =', b.getId('BuffBar/BlessIcon'));
