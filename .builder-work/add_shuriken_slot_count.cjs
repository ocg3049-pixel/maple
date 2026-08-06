// 퀵슬롯의 "표창+" 칸에 얹을 보유 개수 텍스트 1개를 DefaultGroup에 추가한다.
// 발도술 중첩 표시(BattoBuffUI의 stackText)와 같은 방식 - 엔티티 하나를 슬롯 위로 옮겨 쓴다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const TARGET = "ui/Default" + "Group.ui";
const b = UIBuilder.load(TARGET);

// 기존 퀵슬롯 쿨타임 텍스트의 TextComponent 규격을 그대로 본떠 쓴다(폰트/외곽선 일치).
const src = b.getComponent("SkillBar/DarkSightSlotCD_Text", "MOD.Core.TextComponent");
if (src == null) { console.error("원본 TextComponent를 찾지 못했다"); process.exit(1); }

b.sprite("SkillBar/ShurikenSlotCount", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0, enable: false,
});
const t = JSON.parse(JSON.stringify(src));
t.FontSize = 16;
t.Text = "";
t.FontColor = { r: 1, g: 1, b: 1, a: 1 };
b.upsertComponent("SkillBar/ShurikenSlotCount", "MOD.Core.TextComponent", t);
b.patch("SkillBar/ShurikenSlotCount", { display_order: 80 });

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });
console.log("SkillBar/ShurikenSlotCount =>", b.getId("SkillBar/ShurikenSlotCount"));
