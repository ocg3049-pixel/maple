// 섬광/체인샷 퀵슬롯 쿨다운 UI 엔티티 추가 (ParrySlotCD_* 캐논 복제)
// Gray: 50x50 스프라이트 ruid 4fea64a3(원형 게이지), 검정 0.4, Simple 저장(Filled 저장 시 미렌더 - 실측), enable:false
// Text: 알파0 스프라이트 + TextComponent(20pt, 가운데 정렬), 50x20, enable:false
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const UI = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(UI);

const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";
const TEXT_COMP = {
	Alignment: 4,
	FontSize: 20,
	FontColor: { r: 1, g: 1, b: 1, a: 1 },
	Text: "",
	Enable: true,
};

for (const name of ["FlashSlotCD", "ChainShotSlotCD"]) {
	b.sprite("SkillBar/" + name + "_Gray", {
		anchor: "middle-center",
		pos: [-224, 40],
		rect_size: [50, 50],
		image_ruid: GRAY_RUID,
		sprite_type: 0,                       // Simple 저장 (런타임에 Filled로 전환)
		color: { r: 0, g: 0, b: 0, a: 0.4 },
		enable: false,
	});
	b.sprite("SkillBar/" + name + "_Text", {
		anchor: "middle-center",
		pos: [-224, 40],
		rect_size: [50, 20],
		color: { r: 1, g: 1, b: 1, a: 0 },    // 알파 0 배경(텍스트만 보이게)
		sprite_type: 0,
		enable: false,
	});
	b.addComponent("SkillBar/" + name + "_Text", "MOD.Core.TextComponent", Object.assign({ "@type": "MOD.Core.TextComponent" }, TEXT_COMP));
}

b.write(UI, { lint: true, strict: false });

b.injectBindings("/Users/florence/Desktop/RootDesk/MyDesk/UI/FlashCooldownUI.mlua", {
	grayOverlay: "SkillBar/FlashSlotCD_Gray",
	countdownText: "SkillBar/FlashSlotCD_Text",
});
b.injectBindings("/Users/florence/Desktop/RootDesk/MyDesk/UI/ChainShotCooldownUI.mlua", {
	grayOverlay: "SkillBar/ChainShotSlotCD_Gray",
	countdownText: "SkillBar/ChainShotSlotCD_Text",
});
console.log("DONE",
	b.getId("SkillBar/FlashSlotCD_Gray"), b.getId("SkillBar/FlashSlotCD_Text"),
	b.getId("SkillBar/ChainShotSlotCD_Gray"), b.getId("SkillBar/ChainShotSlotCD_Text"));
