// 어썰터 쿨타임 UI 엔티티(회색 오버레이/카운트다운 텍스트) 구조 조회
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const list = b.listEntities();
for (const e of list) {
  if (/assault/i.test(e.name) || /cooldown/i.test(e.name)) {
    console.log(JSON.stringify(e));
    const id = b.getId(e.path.replace(/^\/ui\/DefaultGroup\/?/, '') || '/');
    console.log('  id=' + id);
    const tr = b.getComponent(e.path, 'MOD.Core.UITransformComponent');
    console.log('  transform=' + JSON.stringify(tr));
    const txt = b.getComponent(e.path, 'MOD.Core.TextComponent');
    if (txt) console.log('  text=' + JSON.stringify(txt));
    const spr = b.getComponent(e.path, 'MOD.Core.SpriteGUIRendererComponent');
    if (spr) console.log('  sprite=' + JSON.stringify(spr));
  }
}
