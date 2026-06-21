const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('/Users/florence/Desktop/ui/DefaultGroup.ui');

// 슬롯 20(정상)의 Touch SpriteGUIRendererComponent 확인
const sgr20 = b.getComponent('InvenWindow/InvenSlot20/Touch', 'MOD.Core.SpriteGUIRendererComponent');
const sgr21 = b.getComponent('InvenWindow/InvenSlot21/Touch', 'MOD.Core.SpriteGUIRendererComponent');
const sgrTab = b.getComponent('InvenWindow/InvenTab_equip/Touch', 'MOD.Core.SpriteGUIRendererComponent');

console.log('Slot20 Touch SpriteGUIRenderer:', JSON.stringify(sgr20, null, 2));
console.log('Slot21 Touch SpriteGUIRenderer:', JSON.stringify(sgr21));
console.log('Tab_equip Touch SpriteGUIRenderer:', JSON.stringify(sgrTab));
