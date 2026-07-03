const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) { console.log(path + ': NOT FOUND'); return; }
  const json = e.jsonString;
  const tf = json['@components'].find(c => c['@type'] === 'MOD.Core.UITransformComponent');
  if (!tf) { console.log(path + ': no UITransformComponent'); return; }
  console.log(path + ':');
  console.log('  AnchoredPosition=' + JSON.stringify(tf.AnchoredPosition));
  console.log('  SizeDelta=' + JSON.stringify(tf.SizeDelta));
  console.log('  AnchorsMin=' + JSON.stringify(tf.AnchorsMin));
  console.log('  AnchorsMax=' + JSON.stringify(tf.AnchorsMax));
  console.log('  Pivot=' + JSON.stringify(tf.Pivot));
  console.log('  AlignmentOption=' + tf.AlignmentOption);
};

inspect('EnhanceWindow');
inspect('EnhanceWindow/RightPanel');
inspect('EnhanceWindow/LeftPanel');
inspect('EnhanceWindow/RightPanel/SlotArea');
inspect('EnhanceWindow/RightPanel/ContentArea');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_11');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG');
