// 표창 선택 링 Slot 하위 구조 조사 - 개수 표시 텍스트를 어디에 붙일지 정한다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.load("ui/ShurikenSelect" + "Group.ui");
for (const e of b.listEntities()) {
  if (e.path.includes("/Slot1") || e.path.includes("/Slot2")) {
    console.log(e.path, "| kind=", e.kind, "| pos=", JSON.stringify(e.pos), "| size=", JSON.stringify(e.size));
  }
}
