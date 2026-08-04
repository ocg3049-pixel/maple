// 새로 만든 두 Logic 스크립트의 property 기본값 UUID를 빌더로 재주입해 .ui와 일치함을 보장한다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.load("ui/Default" + "Group.ui");

b.injectBindings("RootDesk/MyDesk/UI/DarkSightBuffUI.mlua", {
  buffIconGroup: "BuffBar/DarkSightIcon",
  grayOverlay: "BuffBar/DarkSightIcon/GrayOverlay",
  countdownText: "BuffBar/DarkSightIcon/Text",
});
b.injectBindings("RootDesk/MyDesk/UI/DarkSightCooldownUI.mlua", {
  grayOverlay: "SkillBar/DarkSightSlotCD_Gray",
  countdownText: "SkillBar/DarkSightSlotCD_Text",
});
console.log("bind ok");
