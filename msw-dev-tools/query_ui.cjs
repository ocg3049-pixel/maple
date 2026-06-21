const {UIBuilder} = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');

// Check InvenWindow full dimensions
for (const entity of b.entities) {
    const js = entity.jsonString || {};
    const path = js.path || '';
    if (path === '/ui/DefaultGroup/InvenWindow') {
        const comps = js['@components'] || [];
        console.log('InvenWindow components:');
        for (const c of comps) {
            console.log('  type:', c['@type']);
            console.log('  data:', JSON.stringify(c));
        }
    }
    if (path === '/ui/DefaultGroup/InvenWindow/BG') {
        const comps = js['@components'] || [];
        console.log('\nInvenWindow/BG components:');
        for (const c of comps) {
            const type = c['@type'] || '';
            if (type.includes('Transform') || type.includes('Sprite')) {
                console.log(' ', type, JSON.stringify(c));
            }
        }
    }
}
