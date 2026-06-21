const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup' + '.ui';
const b = UIBuilder.read(path);

['InvenWindow/InvenSlot1', 'InvenWindow/InvenSlot1/SlotBG', 'InvenWindow/InvenSlot1/Icon', 'InvenWindow/InvenSlot1/ItemName', 'InvenWindow/InvenSlot1/StarLabel', 'InvenWindow/InvenSlot1/Touch'].forEach(p => {
  const e = b.find(p);
  if (e) {
    const comps = e.jsonString['@components'] || [];
    console.log('\n=== ' + p + ' ===');
    comps.forEach(c => {
      const t = c['@type'];
      if (t.includes('UITransform')) {
        console.log('  UITransform: pos=' + JSON.stringify(c.anchoredPosition) + ' size=' + JSON.stringify(c.SizeDelta));
      } else {
        console.log('  ' + t + ': ' + JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k]) => k !== '@type').slice(0, 5))));
      }
    });
  }
});
