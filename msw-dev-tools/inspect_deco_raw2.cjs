const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function dump(path) {
  const t = b.getComponent(path, 'MOD.Core.UITransformComponent');
  const e = b.find(path);
  console.log(path, 'displayOrder=' + (e && e.jsonString && e.jsonString.displayOrder), JSON.stringify(t));
}
['DecoWindow', 'DecoWindow/BG', 'DecoWindow/TitleText', 'DecoWindow/TitleLabel', 'DecoWindow/HeaderLabel', 'DecoWindow/CloseDeco'].forEach(dump);
