const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const mesoEnts = ents.filter(e => e.path && e.path.includes('InvenWindow/MesoBar'));
console.log('=== MesoBar and children ===');
mesoEnts.forEach(e => {
  const tf = b.getComponent(e.path.replace('/ui/DefaultGroup/', ''), 'MOD.Core.UITransformComponent');
  const comps = b.find(e.path.replace('/ui/DefaultGroup/', ''))?.jsonString?.['@components'] || [];
  const compTypes = comps.map(c => c['@type'].split('.').pop()).join(', ');
  console.log(e.name + ': pos=' + JSON.stringify(tf?.anchoredPosition) + ' size=' + JSON.stringify(tf?.RectSize) + ' comps=[' + compTypes + ']');
});
