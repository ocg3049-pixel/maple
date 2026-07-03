const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) return null;
  const json = e.jsonString;
  const tf = json['@components'].find(c => c['@type'] === 'MOD.Core.UITransformComponent');
  if (!tf) { console.log(path + ': found but no tf'); return; }
  const ap = tf.anchoredPosition;
  const size = tf.RectSize;
  console.log(path + ':  ap=(' + (ap?ap.x:'-') + ',' + (ap?ap.y:'-') + ')  size=(' + (size?size.x:'-') + 'x' + (size?size.y:'-') + ')');
  return true;
};

// Try various paths for Star_1
const starPaths = [
  'EnhanceWindow/Star_1',
  'EnhanceWindow/RightPanel/Star_1',
  'EnhanceWindow/RightPanel/ContentArea/Star_1',
  'EnhanceWindow/RightPanel/ContentArea/StarforceContent/Star_1',
  'EnhanceWindow/ContentArea/StarforceContent/Star_1',
  'EnhanceWindow/ContentArea/Star_1',
];
console.log('=== Star_1 search ===');
starPaths.forEach(p => { if (inspect(p)) console.log('  ^^^ FOUND'); });

// Try various paths for RightPanel
console.log('\n=== RightPanel search ===');
['EnhanceWindow/RightPanel', 'EnhanceWindow/ContentPane', 'EnhanceWindow/Panel'].forEach(p => inspect(p));

// Inspect all entities: iterate by checking EnhanceWindow/* paths
console.log('\n=== EnhanceWindow/* (trying common names) ===');
const ew = b.find('EnhanceWindow');
if (ew) {
  // Try reading the raw JSON to find children
  const json = ew.jsonString;
  const keys = Object.keys(json);
  console.log('EnhanceWindow JSON keys:', keys.join(', '));
  if (json.children || json.Children) {
    const ch = json.children || json.Children;
    console.log('Children:', JSON.stringify(ch).substring(0, 500));
  }
}

// Try to get all entities by iterating listEntities differently
const all = b.listEntities();
console.log('\nlistEntities type:', typeof all, Array.isArray(all) ? 'array' : 'not-array');
if (all) {
  const keys = Object.keys(all);
  console.log('listEntities keys:', keys.slice(0,20).join(', '));
  if (keys.length > 0) {
    const first = all[keys[0]];
    console.log('First entity:', JSON.stringify(first).substring(0, 200));
  }
}
