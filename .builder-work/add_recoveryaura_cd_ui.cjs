const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const UI = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(UI);

// 퀵슬롯 쿨다운 클론 절차: <Name>SlotCD_Gray(50x50, ruid 4fea64a3, 검정 0.4, Simple 저장) + _Text(20pt)
// 전용 엔티티(다른 쿨다운 UI와 공유 금지 - 동시 쿨타임이 서로를 덮어씀).
b.sprite("SkillBar/RecoveryAuraSlotCD_Gray", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], pivot: [0.5, 0.5],
  image_ruid: "4fea64a3307cda641809ad8be0d4890b",
  color: { r: 0, g: 0, b: 0, a: 0.4 },
  sprite_type: 0,
  enable: false,
});
b.sprite("SkillBar/RecoveryAuraSlotCD_Text", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], pivot: [0.5, 0.5],
  image_ruid: "2860136c06ab075439721c027de365af",
  color: { r: 1, g: 1, b: 1, a: 0 },
  sprite_type: 0,
  enable: false,
});
b.addComponent("SkillBar/RecoveryAuraSlotCD_Text", "MOD.Core.TextComponent", {
  "@type": "MOD.Core.TextComponent",
  Alignment: 4, FontSize: 20,
  FontColor: { r: 1, g: 1, b: 1, a: 1 },
  Text: "",
  Enable: true,
});

b.write(UI, {
  strict: false,
  bind: {
    mlua: "/Users/florence/Desktop/RootDesk/MyDesk/UI/RecoveryAuraCooldownUI.mlua",
    props: {
      grayOverlay: "SkillBar/RecoveryAuraSlotCD_Gray",
      countdownText: "SkillBar/RecoveryAuraSlotCD_Text",
    },
  },
});
console.log("done gray=", b.getId("SkillBar/RecoveryAuraSlotCD_Gray"), "text=", b.getId("SkillBar/RecoveryAuraSlotCD_Text"));
