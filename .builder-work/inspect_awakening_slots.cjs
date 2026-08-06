// 각성 UI 추가 전 조사: 버프바 아이콘 / 퀵슬롯 쿨타임 오버레이의 display_order·좌표 목록을 뽑는다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const TARGET = "ui/Default" + "Group.ui";
const b = UIBuilder.load(TARGET);
const ents = b.listEntities();
const rows = ents.filter((e) => e.path.includes("/BuffBar/") || e.path.includes("SlotCD"));
for (const e of rows) {
  const raw = b.find(e.path);
  console.log(e.path, "| order=", raw.jsonString.displayOrder, "| pos=", JSON.stringify(e.pos), "| size=", JSON.stringify(e.size));
}
