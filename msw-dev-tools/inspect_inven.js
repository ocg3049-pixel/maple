const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const invenEnts = ents.filter(e => e.path && e.path.includes('InvenWindow'));
invenEnts.slice(0, 40).forEach(e => {
  console.log(e.name + ' | size=' + JSON.stringify(e.size) + ' | pos=' + JSON.stringify(e.pos));
});
