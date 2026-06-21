const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

// TitleText와 그 자식들 확인
const titleEnts = raw.filter(e => e.jsonString.path && e.jsonString.path.startsWith('/ui/DefaultGroup/InvenWindow/TitleText'));
console.log('TitleText 관련 엔티티:', titleEnts.length);
titleEnts.forEach(e => {
  const js = e.jsonString;
  const comps = js['@components'] || [];
  const typeNames = comps.map(c => c['@type'] ? c['@type'].split('.').pop() : '?');
  console.log('\n  path:', js.path.split('/').slice(-2).join('/'));
  console.log('  comps:', typeNames.join(', '));
  const tc = comps.find(c => c['@type'] && c['@type'].includes('Text'));
  if (tc) {
    console.log('  Text:', tc.Text);
    console.log('  FontColor:', JSON.stringify(tc.FontColor));
    console.log('  FontSize:', tc.FontSize);
  }
  const spr = comps.find(c => c['@type'] && c['@type'].includes('SpriteGUI'));
  if (spr) {
    console.log('  SpriteColor:', JSON.stringify(spr.Color));
    console.log('  SpriteEnable:', spr.Enable);
  }
});

// SlotBG는 SpriteGUI만 있는데, ItemName/StarLabel 같은 순수 텍스트가 어떻게 됐는지 확인
const itemName = raw.find(e => e.jsonString.path === '/ui/DefaultGroup/InvenWindow/InvenSlot21/ItemName');
if (itemName) {
  console.log('\n=== ItemName(Slot21) 구조 ===');
  const comps = itemName.jsonString['@components'] || [];
  comps.forEach(c => {
    const type = c['@type'] ? c['@type'].split('.').pop() : '?';
    console.log('  ' + type);
    if (type.includes('Text')) {
      console.log('  FontColor:', JSON.stringify(c.FontColor));
    }
    if (type.includes('SpriteGUI')) {
      console.log('  Color:', JSON.stringify(c.Color));
    }
  });
}
