const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const b = UIBuilder.load("ui/DefaultGroup.ui");
for (const p of [
  "BuffBar/HeroSummonIcon",
  "BuffBar/HeroSummonIcon/GrayOverlay",
  "BuffBar/HeroSummonIcon/Icon",
  "BuffBar/HeroSummonIcon/Text",
]) {
  const e = b.find(p);
  if (!e) { console.log(p, "=> NOT FOUND"); continue; }
  console.log("=== " + p + " id=" + e.id);
  console.log(JSON.stringify(e.jsonString, null, 1));
}
