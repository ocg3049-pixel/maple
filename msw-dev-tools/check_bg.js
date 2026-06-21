const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const bgComp = b.getComponent('InvenWindow/BG', 'MOD.Core.SpriteGUIRendererComponent');
console.log('BG SpriteGUIRenderer:', JSON.stringify(bgComp, null, 2));
const invenWin = b.getComponent('InvenWindow', 'MOD.Core.UITransformComponent');
console.log('\nInvenWindow transform:', JSON.stringify({pos: invenWin?.anchoredPosition, size: invenWin?.RectSize}, null, 2));
