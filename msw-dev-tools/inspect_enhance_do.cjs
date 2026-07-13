// EnhanceWindow 형제 displayOrder 실제 값 확인
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const paths = [
  'EnhanceWindow/RightPanel/MainBG',
  'EnhanceWindow/RightPanel/SlotArea',
  'EnhanceWindow/RightPanel/ContentArea',
  'EnhanceWindow/RightPanel/RightTitleText',
  'EnhanceWindow/RightPanel/ConfirmDialog',
  'EnhanceWindow/RightPanel/SlotArea/SlotSectionBG',
  'EnhanceWindow/RightPanel/SlotArea/TargetSlotBG',
  'EnhanceWindow/RightPanel/SlotArea/NamePillBG',
  'EnhanceWindow/RightPanel/SlotArea/SlotPromptText',
  'EnhanceWindow/RightPanel/SlotArea/TargetSlotBG/SlotBG',
  'EnhanceWindow/RightPanel/SlotArea/TargetSlotBG/FrameT',
  'EnhanceWindow/LeftPanel/SideBG',
  'EnhanceWindow/LeftPanel/EnhanceTab_Starforce',
  'EnhanceWindow/LeftPanel/EnhanceTab_Scroll',
  'EnhanceWindow/LeftPanel/EnhanceTab_Starforce/TabBG',
  'EnhanceWindow/LeftPanel/EnhanceTab_Starforce/TabLbl',
  'EnhanceWindow/LeftPanel/EnhanceTab_Starforce/EventBadge',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/StarBoxBG',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1',
];
for (const p of paths) {
  const e = b.find(p);
  if (!e) { console.log(p + ' -> NOT FOUND'); continue; }
  console.log(p + ' displayOrder=' + e.jsonString.displayOrder + ' enable=' + e.jsonString.enable);
}
