const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function dump(path) {
  const e = b.find(path);
  if (!e) { console.log(path, '=> NOT FOUND'); return; }
  const t = b.getComponent(path, 'MOD.Core.UITransformComponent');
  const touch = b.hasComponent(path, 'MOD.Core.UITouchReceiveComponent');
  console.log(path, JSON.stringify({
    pos: t && t.AnchoredPosition, size: t && t.SizeDelta, anchorMin: t && t.AnchorMin, anchorMax: t && t.AnchorMax,
    displayOrder: e.jsonString.displayOrder, enable: e.jsonString.enable,
    hasTouch: touch
  }));
}

['EnhanceWindow', 'EnhanceWindow/TitleText', 'EnhanceWindow/TitleText/TitleBG', 'EnhanceWindow/TitleText/Label',
 'EnhanceWindow/CloseEnhance', 'EnhanceWindow/LeftPanel', 'EnhanceWindow/LeftPanel/SideBG', 'EnhanceWindow/RightPanel', 'EnhanceWindow/RightPanel/MainBG',
 'DecoWindow', 'DecoWindow/TitleText'
].forEach(dump);
