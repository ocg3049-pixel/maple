// 퀵슬롯 한 칸의 하위 구조/표시순서 조사 - 표창 아이콘 뒤에 흰 배경을 어디에 넣을지 정한다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.load("ui/Default" + "Group.ui");
for (const e of b.listEntities()) {
  if (/\/SkillBar\/Slot_[^/]*(\/|$)/.test(e.path) && e.path.indexOf("Slot_F") >= 0) {
    const raw = b.find(e.path);
    console.log(e.path, "| kind=", e.kind, "| order=", raw.jsonString.displayOrder,
      "| pos=", JSON.stringify(e.pos), "| size=", JSON.stringify(e.size),
      "| comps=", raw.componentNames);
  }
}
