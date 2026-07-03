const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const all = b.listEntities();
// all is array of {name, path, depth, kind, pos, size}
const enhance = all.filter(e => e.path && e.path.includes('EnhanceWindow'));
console.log('EnhanceWindow entities (' + enhance.length + '):');
enhance.forEach(e => {
  console.log('  ' + e.path + '  [' + e.kind + ']  pos=' + JSON.stringify(e.pos) + '  size=' + JSON.stringify(e.size));
});
