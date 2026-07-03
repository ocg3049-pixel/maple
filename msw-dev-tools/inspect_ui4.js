const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const e = b.find('EnhanceWindow/RightPanel/SlotArea');
const json = e.jsonString;
const tf = json['@components'].find(c => c['@type'] === 'MOD.Core.UITransformComponent');
console.log('All UITransformComponent fields:');
console.log(JSON.stringify(tf, null, 2));
