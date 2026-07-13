const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

const list = b.listEntities().filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/TooltipPanel'));
for (const e of list) {
  const t = b.getComponent(e.path, 'MOD.Core.UITransformComponent');
  const ent = b.find(e.path);
  const types = (ent.jsonString['@components'] || []).map(c => c['@type'].replace('MOD.Core.', '').replace('Component', '')).join(',');
  console.log(e.path.replace('/ui/DefaultGroup/', ''),
    `do=${ent.jsonString.displayOrder}`,
    `pos=(${t.anchoredPosition.x},${t.anchoredPosition.y})`, `size=(${t.RectSize.x},${t.RectSize.y})`,
    `[${types}]`);
}
