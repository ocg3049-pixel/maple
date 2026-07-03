const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const inspect = (path) => {
  const e = b.find(path);
  if (!e) { console.log(path + ': NOT FOUND'); return; }
  // Print all keys
  const keys = Object.keys(e);
  console.log(path + ' keys: ' + keys.join(', '));
  // Print the full object (limited)
  const str = JSON.stringify(e, null, 2);
  console.log(str.substring(0, 800));
  console.log('---');
};

inspect('EnhanceWindow/RightPanel/SlotArea');
