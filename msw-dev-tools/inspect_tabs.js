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
  console.log('\n=== ' + path + ' components ===');
  json['@components'].forEach(c => {
    const type = c['@type'];
    const fields = Object.keys(c).filter(k => k !== '@type' && k !== '@fileId');
    const vals = fields.map(f => f + '=' + JSON.stringify(c[f]));
    console.log('  [' + type + '] ' + vals.join(', '));
  });
};

// LeftPanel and all children
console.log('=== LeftPanel hierarchy ===');
const all = b.listEntities();
const lpPaths = all.filter(p => p === 'EnhanceWindow/LeftPanel' || p.startsWith('EnhanceWindow/LeftPanel/'));
lpPaths.forEach(p => inspect(p));

// Star_1 component detail
inspectAllComponents('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1');
inspectAllComponents('EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_100');

// Current StarforceContent
inspect('EnhanceWindow/RightPanel/ContentArea/StarforceContent');
