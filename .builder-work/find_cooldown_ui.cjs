const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.load("ui/DefaultGroup.ui");
const WANT = ["a7a279bc-70d9-42e1-94db-1f843e8fe9dc", "c3e84cc1-692a-47c6-8399-ed17cd4c1493"];
for (const e of b.listEntities()) {
  const raw = b.find(e.path);
  if (raw && WANT.includes(raw.id)) {
    console.log("MATCH", raw.id, e.path, "comps=" + raw.componentNames, "enable=" + raw.jsonString.enable,
      "pos=" + JSON.stringify(e.pos), "size=" + JSON.stringify(e.size));
  }
}
// 쿨타임 오버레이가 모여 있는 부모를 확인한다.
for (const e of b.listEntities()) {
  if (/Cooldown/i.test(e.name || "")) console.log("COOLDOWN-ISH", e.path, e.kind, JSON.stringify(e.pos), JSON.stringify(e.size), e.enable);
}
