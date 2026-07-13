// EnhanceWindow 전체 트리 구조/좌표 덤프
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const list = b.listEntities();
for (const e of list) {
  if (e.path.startsWith('/ui/DefaultGroup/EnhanceWindow')) {
    const indent = '  '.repeat(e.depth - 1);
    console.log(`${indent}${e.kind}\t${e.name}\tpos=${JSON.stringify(e.pos)}\tsize=${JSON.stringify(e.size)}\ten=${e.enable}`);
  }
}
