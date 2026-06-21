const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

// Test: can patch() accept pos and rect_size for UIBuilder?
// We'll try on a copy and check the result
try {
  b.patch('InvenWindow/InvenSlot1', { pos: [-343, 750], rect_size: [66, 66] });
  const tf = b.getComponent('InvenWindow/InvenSlot1', 'MOD.Core.UITransformComponent');
  console.log('patch() success! New transform:');
  console.log('  anchoredPosition:', JSON.stringify(tf.anchoredPosition));
  console.log('  RectSize:', JSON.stringify(tf.RectSize));
  console.log('  OffsetMin:', JSON.stringify(tf.OffsetMin));
  console.log('  OffsetMax:', JSON.stringify(tf.OffsetMax));

  // Also check that components are unchanged
  const comps = b.find('InvenWindow/InvenSlot1').jsonString['@components'];
  console.log('  Component count:', comps.length);
  comps.forEach(c => console.log('  - ' + c['@type']));
} catch(e) {
  console.log('patch() ERROR:', e.message);
}
