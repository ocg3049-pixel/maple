const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

const items = ['InvenWindow/TitleText', 'InvenWindow/Divider', 'InvenWindow/HintText', 'InvenWindow/CloseInven', 'InvenWindow/MesoBar', 'InvenWindow/InvenEnhanceBtn', 'InvenWindow/InvenMinBtn'];
items.forEach(item => {
  const tf = b.getComponent(item, 'MOD.Core.UITransformComponent');
  if (tf) {
    console.log(item + ': anchors=min' + JSON.stringify(tf.AnchorsMin) + ' max' + JSON.stringify(tf.AnchorsMax) + ' anchoredPos=' + JSON.stringify(tf.anchoredPosition));
  } else {
    console.log(item + ': transform NOT FOUND');
  }
});
