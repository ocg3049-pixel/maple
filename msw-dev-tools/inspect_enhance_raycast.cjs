const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function dumpSprite(path) {
  const s = b.getComponent(path, 'MOD.Core.SpriteGUIRendererComponent');
  console.log(path, s ? JSON.stringify({ RaycastTarget: s.RaycastTarget, Color: s.Color }) : 'NO SPRITE COMP');
}
['EnhanceWindow/RightPanel/MainBG', 'EnhanceWindow/LeftPanel/SideBG', 'EnhanceWindow/TitleText/TitleBG', 'DecoWindow/BG'].forEach(dumpSprite);

function dumpTouch(path) {
  const t = b.getComponent(path, 'MOD.Core.UITouchReceiveComponent');
  console.log(path, 'touch=', t ? JSON.stringify(t) : null);
}
['EnhanceWindow/TitleText', 'DecoWindow/TitleText'].forEach(dumpTouch);
