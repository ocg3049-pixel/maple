const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');

for (const entity of b.entities) {
    const js = entity.jsonString || {};
    const path = js.path || '';
    if (path === '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText') {
        const comps = js['@components'] || [];
        for (const c of comps) {
            console.log('type:', c['@type']);
            console.log('data:', JSON.stringify(c, null, 2));
        }
    }
}
