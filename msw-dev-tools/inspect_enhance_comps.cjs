// EnhanceWindow 주요 엔티티 컴포넌트 값 덤프
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const targets = [
  ['EnhanceWindow', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/BG', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/LeftPanel', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/RightPanel', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/LeftPanel/EnhanceTab_Starforce/TabBG', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/LeftPanel/EnhanceTab_Starforce/TabLbl', 'MOD.Core.TextComponent'],
  ['EnhanceWindow/RightPanel/SlotArea/SlotPromptText', 'MOD.Core.TextComponent'],
  ['EnhanceWindow/RightPanel/SlotArea/TargetNameLabel', 'MOD.Core.TextComponent'],
  ['EnhanceWindow/RightPanel/SlotArea/TargetSlotBG/SlotBG', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/RightPanel/SlotArea/TargetSlotBG/PlaceholderIcon', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn', 'MOD.Core.TextComponent'],
  ['EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/TitleText/Label', 'MOD.Core.TextComponent'],
  ['EnhanceWindow/TitleText/TitleBG', 'MOD.Core.SpriteGUIRendererComponent'],
  ['EnhanceWindow/RightPanel/ContentArea/DefaultContent/Hint', 'MOD.Core.TextComponent'],
];
for (const [p, c] of targets) {
  const comp = b.getComponent(p, c);
  if (!comp) { console.log(p + ' :: ' + c + ' -> NONE'); continue; }
  const brief = {};
  for (const k of ['Color','ImageRUID','Text','FontColor','FontSize','Alignment','Bold','Enable']) {
    if (comp[k] !== undefined) brief[k] = comp[k];
  }
  console.log(p + ' :: ' + c.replace('MOD.Core.','') + ' -> ' + JSON.stringify(brief));
}
// displayOrder 확인
for (const p of ['EnhanceWindow/LeftPanel/EnhanceTab_Starforce', 'EnhanceWindow/RightPanel/SlotArea', 'EnhanceWindow/RightPanel/ContentArea', 'EnhanceWindow/RightPanel/SlotArea/TargetSlotBG']) {
  const e = b.find(p);
  console.log(p + ' displayOrder=' + e.jsonString.displayOrder);
}
