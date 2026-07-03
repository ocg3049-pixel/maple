const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) { console.log(path + ': NOT FOUND'); return; }
  const tf = e.RectTransformComponent || {};
  console.log(path + ':');
  console.log('  pos=' + JSON.stringify(tf.AnchoredPosition));
  console.log('  size=' + JSON.stringify(tf.SizeDelta));
  console.log('  anchor=' + JSON.stringify(tf.AnchorMin) + ' ~ ' + JSON.stringify(tf.AnchorMax));
  console.log('  pivot=' + JSON.stringify(tf.Pivot));
};

inspect('EnhanceWindow');
inspect('EnhanceWindow/RightPanel');
inspect('EnhanceWindow/RightPanel/SlotArea');
inspect('EnhanceWindow/RightPanel/ContentArea');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_11');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG');
