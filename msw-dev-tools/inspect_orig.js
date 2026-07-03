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
  // Also check children
  const children = json['@children'] || [];
  const childNames = children.map(c => c['@name'] || c.name || '?');
  console.log(path + ':  ap=(' + (ap?ap.x:'-') + ',' + (ap?ap.y:'-') + ')  size=(' + (size?size.x:'-') + 'x' + (size?size.y:'-') + ')  children=[' + childNames.join(',') + ']');
};

// EnhanceWindow and its children
inspect('EnhanceWindow');

// Try known child names
const candidates = [
  'BG', 'TitleText', 'CloseEnhance', 'LeftPanel', 'RightPanel',
  'Content', 'ContentArea', 'TabContent', 'TabArea', 'StarArea',
  'StarforceContent', 'SlotArea', 'LogBG', 'EnhanceBtn',
  'Star_1', 'LevelArrow', 'StatsText', 'RateText',
  'EnhanceTab_Starforce', 'EnhanceTab_Scroll',
];

candidates.forEach(name => {
  inspect('EnhanceWindow/' + name);
});

// Also check EnhanceWindow children directly
const ew = b.find('EnhanceWindow');
if (ew) {
  const json = ew.jsonString;
  const children = json['@children'] || [];
  console.log('\nEnhanceWindow direct children:');
  children.forEach(c => {
    const name = c['@name'] || c.name || JSON.stringify(Object.keys(c));
    console.log('  - ' + name);
  });
}
