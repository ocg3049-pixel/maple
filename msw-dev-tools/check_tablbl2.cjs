const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

const lblEnt = raw.find(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenTab_equip/TabLbl');
console.log('TabLbl full JSON:');
console.log(JSON.stringify(lblEnt && lblEnt.jsonString, null, 2));
