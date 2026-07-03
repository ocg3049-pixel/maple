const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) { return; }
  const json = e.jsonString;
  const tf = json['@components'].find(c => c['@type'] === 'MOD.Core.UITransformComponent');
  if (!tf) { console.log(path + ': no tf'); return; }
  const ap = tf.anchoredPosition;
  const size = tf.RectSize;
  const omin = tf.OffsetMin;
  const omax = tf.OffsetMax;
  console.log(path + ':  ap=(' + (ap?ap.x:'-') + ',' + (ap?ap.y:'-') + ')  size=(' + (size?size.x:'-') + 'x' + (size?size.y:'-') + ')');
};

// List all entities and filter for EnhanceWindow
const all = b.listEntities();
const paths = Array.isArray(all) ? all : [];
console.log('Total entities:', paths.length);

// Find all EnhanceWindow paths
const ewPaths = paths.filter(p => typeof p === 'string' && p.startsWith('EnhanceWindow'));
console.log('\n=== ALL EnhanceWindow entities (' + ewPaths.length + ') ===');
ewPaths.forEach(p => inspect(p));
