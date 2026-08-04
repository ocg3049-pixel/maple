const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("ui/DefaultGroup.ui");

// RestorationSlotCD_Gray/_Text 클론 (샤이닝 레이 전용 - 다른 쿨타임 UI와 엔티티 공유 금지).
// 저장은 Simple(Type 0)로, 런타임에 Filled/Vertical로 전환한다(.ui에 Filled 저장 시 미렌더 문제).
b.sprite("SkillBar/ShiningRaySlotCD_Gray", {
  anchor: "middle-center",
  pos: [-224, 40],
  rect_size: [50, 50],
  pivot: [0.5, 0.5],
  enable: false,
  sprite_type: 0,
  raycast: false,
  image_ruid: "4fea64a3307cda641809ad8be0d4890b",
  color: { r: 0, g: 0, b: 0, a: 0.4 },
});

b.sprite("SkillBar/ShiningRaySlotCD_Text", {
  anchor: "middle-center",
  pos: [-224, 40],
  rect_size: [50, 20],
  pivot: [0.5, 0.5],
  enable: false,
  sprite_type: 0,
  raycast: false,
  image_ruid: "2860136c06ab075439721c027de365af",
  color: { r: 1, g: 1, b: 1, a: 0 },
});
b.addComponent("SkillBar/ShiningRaySlotCD_Text", "MOD.Core.TextComponent", {
  "@type": "MOD.Core.TextComponent",
  Alignment: 4,
  FontSize: 20,
  FontColor: { r: 1, g: 1, b: 1, a: 1 },
  Text: "",
  Enable: true,
});

b.write("ui/DefaultGroup.ui", {
  strict: false,
  bind: {
    mlua: "RootDesk/MyDesk/UI/ShiningRayCooldownUI.mlua",
    props: {
      grayOverlay: "SkillBar/ShiningRaySlotCD_Gray",
      countdownText: "SkillBar/ShiningRaySlotCD_Text",
    },
  },
});
console.log("Gray id:", b.getId("SkillBar/ShiningRaySlotCD_Gray"));
console.log("Text id:", b.getId("SkillBar/ShiningRaySlotCD_Text"));
