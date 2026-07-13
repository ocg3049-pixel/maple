const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function dump(path) {
  const t = b.getComponent(path, 'MOD.Core.UITransformComponent');
  console.log(path, JSON.stringify({ anchorsMin: t.AnchorsMin, anchorsMax: t.AnchorsMax, offsetMin: t.OffsetMin, offsetMax: t.OffsetMax, rectSize: t.RectSize, anchoredPosition: t.anchoredPosition }));
}
['InvenWindow/TitleText', 'EquipWindow/TitleText', 'CharInfoWindow/TitleText', 'CharInfoWindow/TitleText/DragHandle', 'EnhanceWindow/TitleText', 'DecoWindow/TitleText'].forEach(dump);
