const { UIBuilder } = require('/Users/florence/Desktop/.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = UIBuilder.read('ui/DefaultGroup.ui');
const roots = process.argv.slice(2);
const names = roots.length ? roots : ['CharInfoWindow', 'EquipWindow', 'InventoryWindow', 'EnhanceWindow', 'TooltipPanel', 'DecoWindow'];

function compactColor(v) {
  if (!v || typeof v !== 'object') return v;
  return [v.r, v.g, v.b, v.a];
}

for (const root of names) {
  console.log(`\n### ${root}`);
  for (const row of b.listEntities()) {
    if (!(row.path.includes(`/${root}`))) continue;
    const wrapper = b.find(row.path);
    const e = wrapper && wrapper.jsonString;
    const out = { path: row.path, kind: row.kind, pos: row.pos, size: row.size, enable: row.enable };
    for (const c of (e && e['@components']) || []) {
      const t = c['@type'] || '';
      if (t.endsWith('TextGUIRendererComponent') || t.endsWith('TextComponent')) {
        out.text = { Text: c.Text, FontSize: c.FontSize, FontColor: compactColor(c.FontColor), Font: c.Font, FontStyle: c.FontStyle, H: c.HorizontalAlignment, V: c.VerticalAlignment };
      } else if (t.endsWith('SpriteGUIRendererComponent')) {
        out.sprite = { ImageRUID: c.ImageRUID && c.ImageRUID.DataId, Color: compactColor(c.Color), Type: c.Type, RaycastTarget: c.RaycastTarget };
      } else if (t.endsWith('ScrollLayoutGroupComponent')) {
        out.scroll = c;
      } else if (t.endsWith('ButtonComponent')) {
        out.button = c;
      }
    }
    console.log(JSON.stringify(out));
  }
}
