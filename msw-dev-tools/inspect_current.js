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

const all = b.listEntities();
console.log('Total entities:', Array.isArray(all) ? all.length : 'N/A');

// Key elements
const paths = [
  'EnhanceWindow',
  'EnhanceWindow/BG',
  'EnhanceWindow/TitleText',
  'EnhanceWindow/CloseEnhance',
  'EnhanceWindow/LeftPanel',
  'EnhanceWindow/RightPanel',
  'EnhanceWindow/RightPanel/SlotArea',
  'EnhanceWindow/RightPanel/ContentArea',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_100',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/LevelArrow',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceLevelText',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatHeader',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/StatsText',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateHeader',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/RateText',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/CostText',
];
paths.forEach(p => inspect(p));
