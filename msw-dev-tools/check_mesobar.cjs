const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');

const targets = [
    '/ui/DefaultGroup/InvenWindow/MesoBar',
    '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon',
    '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText',
];

for (const entity of b.entities) {
    const js = entity.jsonString || {};
    const path = js.path || '';
    if (!targets.includes(path)) continue;
    console.log('\n=== ' + path + ' ===');
    const comps = js['@components'] || [];
    for (const c of comps) {
        if (c['@type'] && c['@type'].includes('UITransform')) {
            console.log('UITransform:', JSON.stringify({
                OffsetMin: c.OffsetMin,
                OffsetMax: c.OffsetMax,
                anchoredPosition: c.anchoredPosition,
                AnchorsMin: c.AnchorsMin,
                AnchorsMax: c.AnchorsMax,
                Pivot: c.Pivot,
            }, null, 2));
        }
    }
}
