const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const titleEnts = ents.filter(e => e.path && e.path.includes('InvenWindow/TitleText'));
console.log('=== InvenWindow TitleText and children ===');
titleEnts.forEach(e => {
  const tf = b.getComponent(e.path.replace('/ui/DefaultGroup/', ''), 'MOD.Core.UITransformComponent');
  console.log(e.name + ': pos=' + JSON.stringify(tf?.anchoredPosition) + ' size=' + JSON.stringify(tf?.RectSize));
});
// Also check if TitleBG and Label exist
const titleBG = b.find('InvenWindow/TitleText/TitleBG');
const label = b.find('InvenWindow/TitleText/Label');
console.log('\nTitleBG exists:', !!titleBG);
console.log('Label exists:', !!label);
