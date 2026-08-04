const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
console.log("restoration gray", b.getId("SkillBar/RestorationSlotCD_Gray"));
console.log("restoration text", b.getId("SkillBar/RestorationSlotCD_Text"));
console.log("archer gray (기존 유지)", b.getId("SkillBar/ArcherSupportSlotCD_Gray"));
console.log("flash gray (기존 유지)", b.getId("SkillBar/FlashSlotCD_Gray"));
