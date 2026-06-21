const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('/Users/florence/Desktop/ui/DefaultGroup.ui');
for (const i of [1, 20, 21, 22]) {
    const utr = b.getComponent('InvenWindow/InvenSlot'+i, 'MOD.Core.UITouchReceiveComponent');
    const touchUtr = b.getComponent('InvenWindow/InvenSlot'+i+'/Touch', 'MOD.Core.UITouchReceiveComponent');
    const touchTf = b.getComponent('InvenWindow/InvenSlot'+i+'/Touch', 'MOD.Core.UITransformComponent');
    const slotTf = b.getComponent('InvenWindow/InvenSlot'+i, 'MOD.Core.UITransformComponent');
    console.log('=== Slot'+i+' ===');
    console.log('  Slot UTR:', JSON.stringify(utr));
    console.log('  Slot TF pos:', JSON.stringify(slotTf?.anchoredPosition), 'anchors:', JSON.stringify(slotTf?.AnchorsMin), JSON.stringify(slotTf?.AnchorsMax));
    console.log('  Touch UTR:', JSON.stringify(touchUtr));
    console.log('  Touch TF anchorsMin:', JSON.stringify(touchTf?.AnchorsMin), 'Max:', JSON.stringify(touchTf?.AnchorsMax));
    console.log('  Touch TF pivot:', JSON.stringify(touchTf?.Pivot));
    console.log('  Touch TF pos/size:', JSON.stringify(touchTf?.anchoredPosition), JSON.stringify(touchTf?.RectSize));
    console.log('  Touch TF OffsetMin:', JSON.stringify(touchTf?.OffsetMin), 'OffsetMax:', JSON.stringify(touchTf?.OffsetMax));
}
