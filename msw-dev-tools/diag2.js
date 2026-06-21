const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('/Users/florence/Desktop/ui/DefaultGroup.ui');

for (const id of ['InvenWindow/InvenSlot1', 'InvenWindow/InvenSlot21', 'InvenWindow/InvenTab_equip', 'InvenWindow/InvenMinBtn']) {
    const tf = b.getComponent(id, 'MOD.Core.UITransformComponent');
    const touchTf = b.getComponent(id+'/Touch', 'MOD.Core.UITransformComponent');
    const utr = b.getComponent(id, 'MOD.Core.UITouchReceiveComponent');
    console.log('=== ' + id + ' ===');
    console.log('  Parent UTR:', utr ? 'YES' : 'none');
    console.log('  Parent anchoredPos:', JSON.stringify(tf?.anchoredPosition), 'size:', JSON.stringify(tf?.RectSize));
    console.log('  Parent AnchorsMin:', JSON.stringify(tf?.AnchorsMin), 'Max:', JSON.stringify(tf?.AnchorsMax));
    console.log('  Touch AnchorsMin:', JSON.stringify(touchTf?.AnchorsMin), 'Max:', JSON.stringify(touchTf?.AnchorsMax));
    console.log('  Touch OffsetMin:', JSON.stringify(touchTf?.OffsetMin), 'OffsetMax:', JSON.stringify(touchTf?.OffsetMax));
    console.log('  Touch anchoredPos:', JSON.stringify(touchTf?.anchoredPosition), 'size:', JSON.stringify(touchTf?.RectSize));
}
