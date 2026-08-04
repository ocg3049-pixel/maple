// 기존 쿨다운 UI 엔티티(패링 등) 구조 조회 - 섬광/체인샷 쿨다운 UI 복제용
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
const ents = b.listEntities();
for (const e of ents) {
	if (/SlotCD/i.test(e.path)) {
		console.log("PATH:", e.path, "| kind:", e.kind, "| size:", JSON.stringify(e.size), "| pos:", JSON.stringify(e.pos), "| enable:", e.enable);
	}
}
// 패링 쿨다운 그레이/텍스트의 컴포넌트 상세
for (const p of ["SkillBar/ParrySlotCD_Gray", "SkillBar/ParrySlotCD_Text"]) {
	const ent = b.find(p);
	if (ent) {
		console.log("== ", p, " id:", ent.id);
		for (const c of ent.jsonString["@components"]) {
			console.log(JSON.stringify(c).slice(0, 400));
		}
	} else {
		console.log("NOT FOUND:", p);
	}
}
