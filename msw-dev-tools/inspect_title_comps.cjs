const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('ui/DefaultGroup.ui');

function comps(path) {
  const e = b.find(path);
  if (!e) { console.log(path, 'NOT FOUND'); return; }
  const js = e.jsonString;
  const list = (js['@components'] || []).map(c => {
    let extra = '';
    if (c['@type'] === 'MOD.Core.SpriteGUIRendererComponent') extra = ` raycast=${c.RaycastTarget} a=${c.Color && c.Color.a}`;
    if (c['@type'] === 'MOD.Core.TextComponent') extra = ` raycast=${c.RaycastTarget} text="${(c.Text||'').slice(0,12)}"`;
    return c['@type'].replace('MOD.Core.', '') + extra;
  });
  console.log(path, '=>', list.join(' | '));
}

['InvenWindow/TitleText', 'EquipWindow/TitleText', 'DecoWindow/TitleText', 'DecoWindow/TitleLabel', 'DecoWindow/BG',
 'EnhanceWindow/TitleText', 'CharInfoWindow/TitleText/DragHandle'].forEach(comps);
