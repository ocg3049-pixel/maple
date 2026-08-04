const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const b = UIBuilder.read("/Users/florence/Desktop/ui/DefaultGroup.ui");
const findings = b.validate();
const mine = findings.filter((f) => /SkillPoint|Plus(BG|Label)/.test(JSON.stringify(f)));
console.log("validate findings total:", findings.length, "| mine:", mine.length);
for (const f of mine) console.log(JSON.stringify(f));
