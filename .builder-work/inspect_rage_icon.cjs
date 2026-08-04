const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
for (const n of ['BuffBar', 'BuffBar/RageIcon', 'BuffBar/RageIcon/GrayOverlay', 'BuffBar/RageIcon/Icon', 'BuffBar/RageIcon/Text']) {
  const e = b.find(n);
  if (!e) { console.log(n, '=> NOT FOUND'); continue; }
  console.log('===', n, 'id=', e.id, 'enable=', e.jsonString.enable, 'displayOrder=', e.jsonString.displayOrder);
  for (const c of e.jsonString['@components']) {
    console.log(JSON.stringify(c).slice(0, 700));
  }
}
