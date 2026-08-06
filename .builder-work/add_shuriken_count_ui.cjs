// 표창 선택 링의 각 슬롯에 "보유 개수" 라벨을 추가한다(KeyLabel 컴포넌트 필드를 그대로 복제).
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const TARGET = "ui/ShurikenSelect" + "Group.ui";
const b = UIBuilder.load(TARGET);

// 기존 KeyLabel의 텍스트 컴포넌트를 그대로 본떠 쓴다(폰트/외곽선 규격 일치).
const src = b.getComponent("Ring/Slot1/KeyLabel", "MOD.Core.TextComponent");
if (src == null) {
  console.log("KeyLabel TextComponent 없음 - 컴포넌트 목록:", JSON.stringify(b.find("Ring/Slot1/KeyLabel").componentNames));
  process.exit(1);
}

for (let i = 1; i <= 9; i++) {
  const slot = "Ring/Slot" + i;
  if (b.find(slot) == null) continue;
  const name = slot + "/CountLabel";
  // 슬롯 왼쪽 아래(키 뱃지 반대편) - 아이콘/뱃지와 겹치지 않는 자리.
  b.sprite(name, {
    anchor: "middle-center", pos: [-15, -19], rect_size: [34, 20],
    image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0,
  });
  const t = JSON.parse(JSON.stringify(src));
  t.FontSize = 14;
  t.Text = "";
  t.FontColor = { r: 1, g: 1, b: 1, a: 1 };
  b.upsertComponent(name, "MOD.Core.TextComponent", t);
  b.patch(name, { display_order: 5 });
}

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });
for (let i = 1; i <= 9; i++) {
  console.log("Slot" + i + "/CountLabel =>", b.getId("Ring/Slot" + i + "/CountLabel"));
}
