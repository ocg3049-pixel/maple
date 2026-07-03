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

const inspectAllComponents = (path) => {
  const e = b.find(path);
  if (!e) { console.log(path + ': NOT FOUND'); return; }
  const json = e.jsonString;
  console.log('\n=== ' + path + ' all components ===');
  json['@components'].forEach(c => {
    const type = c['@type'];
    const fields = Object.keys(c).filter(k => k !== '@type' && k !== '@fileId');
    const vals = fields.map(f => f + '=' + JSON.stringify(c[f]));
    console.log('  [' + type + '] ' + vals.join(', '));
  });
};

// Manually inspect known tab paths
console.log('=== LeftPanel tabs ===');
const tabNames = [
  'EnhanceTab_Starforce',
  'EnhanceTab_Scroll',
  'EnhanceTab_AddOption',
  'EnhanceTab_Potential',
  'EnhanceTab_Additional',
];
tabNames.forEach(name => {
  inspect('EnhanceWindow/LeftPanel/' + name);
  inspect('EnhanceWindow/LeftPanel/' + name + '/ClickZone');
});

// Star_1 components
console.log('\n=== Star_1 ===');
inspectAllComponents('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1');

// Current StarforceContent and ContentArea
console.log('\n=== ContentArea / StarforceContent ===');
inspect('EnhanceWindow/RightPanel/ContentArea');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/EnhanceBtn');
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent/LogBG');
