// 드레인 샷 쿨타임(5초) 퀵슬롯 오버레이 2개를 DefaultGroup에 추가한다(DarkSightSlotCD_* 복제).
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const TARGET = "ui/Default" + "Group.ui";
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";
const b = UIBuilder.load(TARGET);

const srcText = b.getComponent("SkillBar/DarkSightSlotCD_Text", "MOD.Core.TextComponent");
if (srcText == null) { console.error("원본 TextComponent 없음"); process.exit(1); }

b.sprite("SkillBar/DrainShotSlotCD_Gray", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50],
  image_ruid: GRAY_RUID, color: { r: 0, g: 0, b: 0, a: 0.65 }, sprite_type: 0, fill_method: 1, enable: false,
});
b.patchComponent("SkillBar/DrainShotSlotCD_Gray", "MOD.Core.SpriteGUIRendererComponent", { FillAmount: 1, FillOrigin: 0 });
b.patch("SkillBar/DrainShotSlotCD_Gray", { display_order: 81 });

b.sprite("SkillBar/DrainShotSlotCD_Text", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0, enable: false,
});
const t = JSON.parse(JSON.stringify(srcText));
b.upsertComponent("SkillBar/DrainShotSlotCD_Text", "MOD.Core.TextComponent", t);
b.patch("SkillBar/DrainShotSlotCD_Text", { display_order: 82 });

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });
b.injectBindings("RootDesk/MyDesk/UI/DrainShotCooldownUI.mlua", {
  grayOverlay: "SkillBar/DrainShotSlotCD_Gray",
  countdownText: "SkillBar/DrainShotSlotCD_Text",
});
console.log("gray =>", b.getId("SkillBar/DrainShotSlotCD_Gray"));
console.log("text =>", b.getId("SkillBar/DrainShotSlotCD_Text"));
