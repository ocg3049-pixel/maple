// 리스토네이션 퀵슬롯 쿨다운 UI 엔티티 추가 (ArcherSupportSlotCD_* 와 동일 캐논)
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const UI = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(UI);

const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";
b.sprite("SkillBar/RestorationSlotCD_Gray", {
	anchor: "middle-center",
	pos: [-224, 40],
	rect_size: [50, 50],
	image_ruid: GRAY_RUID,
	sprite_type: 0,
	color: { r: 0, g: 0, b: 0, a: 0.4 },
	enable: false,
});
b.sprite("SkillBar/RestorationSlotCD_Text", {
	anchor: "middle-center",
	pos: [-224, 40],
	rect_size: [50, 20],
	color: { r: 1, g: 1, b: 1, a: 0 },
	sprite_type: 0,
	enable: false,
});
b.addComponent("SkillBar/RestorationSlotCD_Text", "MOD.Core.TextComponent", {
	"@type": "MOD.Core.TextComponent",
	Alignment: 4,
	FontSize: 20,
	FontColor: { r: 1, g: 1, b: 1, a: 1 },
	Text: "",
	Enable: true,
});

b.write(UI, { lint: true, strict: false });
b.injectBindings("/Users/florence/Desktop/RootDesk/MyDesk/UI/RestorationCooldownUI.mlua", {
	grayOverlay: "SkillBar/RestorationSlotCD_Gray",
	countdownText: "SkillBar/RestorationSlotCD_Text",
});
console.log("DONE", b.getId("SkillBar/RestorationSlotCD_Gray"), b.getId("SkillBar/RestorationSlotCD_Text"));
