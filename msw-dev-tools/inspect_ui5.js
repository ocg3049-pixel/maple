const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) { console.log(path + ': NOT FOUND'); return; }
  const json = e.jsonString;
  const tf = json['@components'].find(c => c['@type'] === 'MOD.Core.UITransformComponent');
  if (!tf) { console.log(path + ': no tf'); return; }
  const ap = tf.anchoredPosition;
  const size = tf.RectSize;
  const omin = tf.OffsetMin;
  const omax = tf.OffsetMax;
  console.log(path + ':  ap=(' + (ap?ap.x:'-') + ',' + (ap?ap.y:'-') + ')  size=(' + (size?size.x:'-') + 'x' + (size?size.y:'-') + ')  omin.y=' + (omin?omin.y:'-') + '  omax.y=' + (omax?omax.y:'-'));
};

inspect('EnhanceWindow');
inspect('EnhanceWindow/BG');
inspect('EnhanceWindow/TitleText');
inspect('EnhanceWindow/RightPanel');
inspect('EnhanceWindow/LeftPanel');
inspect('EnhanceWindow/RightPanel/SlotArea');
inspect('EnhanceWindow/RightPanel/ContentArea');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_11');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG');
