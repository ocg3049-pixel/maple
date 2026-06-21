const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const path = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const b = UIBuilder.read(path);
const ents = b.listEntities();
const invenEnts = ents.filter(e => e.path && e.path.includes('InvenWindow/InvenSlot'));
console.log('Total entities:', ents.length);
console.log('InvenSlot entities:', invenEnts.length);
// Check a few slots
const slot1 = ents.find(e => e.name === 'InvenSlot1' && e.path.includes('InvenWindow'));
const slot128 = ents.find(e => e.name === 'InvenSlot128' && e.path.includes('InvenWindow'));
if (slot1) console.log('InvenSlot1:', JSON.stringify({ pos: slot1.pos, size: slot1.size }));
if (slot128) console.log('InvenSlot128:', JSON.stringify({ pos: slot128.pos, size: slot128.size }));
else console.log('InvenSlot128: NOT FOUND');
