const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function dump(path) {
  const t = b.getComponent(path, 'MOD.Core.UITransformComponent');
  console.log(path, JSON.stringify(t));
}
['EnhanceWindow', 'EnhanceWindow/TitleText', 'EnhanceWindow/LeftPanel', 'EnhanceWindow/LeftPanel/SideBG', 'EnhanceWindow/RightPanel', 'EnhanceWindow/RightPanel/MainBG', 'EnhanceWindow/CloseEnhance',
 'DecoWindow', 'DecoWindow/TitleText'
].forEach(dump);
