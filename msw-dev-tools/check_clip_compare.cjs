const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

function getEnt(path) {
  return raw.find(e => e.jsonString.path === path);
}

function showComps(path) {
  const ent = getEnt(path);
  if (!ent) { console.log(path + ': NOT FOUND'); return; }
  const js = ent.jsonString;
  console.log('\n=== ' + path.split('/').pop() + ' ===');
  const comps = js['@components'] || [];
  comps.forEach(c => {
    const type = c['@type'] ? c['@type'].split('.').pop() : '?';
    console.log('  ' + type);
    // TextComponent 세부 정보
    if (type === 'TextComponent' || type === 'TextGUIRendererComponent') {
      console.log('    Text:', c.Text);
      console.log('    FontColor:', JSON.stringify(c.FontColor));
      console.log('    FontSize:', c.FontSize);
      console.log('    SortingLayer:', c.SortingLayer);
      console.log('    OrderInLayer:', c.OrderInLayer);
    }
  });
}

// TabLbl vs TitleText 비교
showComps('/ui/DefaultGroup/InvenWindow/InvenTab_equip/TabLbl');
showComps('/ui/DefaultGroup/InvenWindow/TitleText');

// InvenWindow 컴포넌트 확인 (마스크/클리핑 여부)
const win = getEnt('/ui/DefaultGroup/InvenWindow');
if (win) {
  const comps = win.jsonString['@components'] || [];
  console.log('\n=== InvenWindow 컴포넌트 목록 ===');
  comps.forEach(c => {
    const type = c['@type'] ? c['@type'].split('.').pop() : '?';
    console.log('  ' + type);
  });
}

// InvenTab_equip 컴포넌트 확인
const tab = getEnt('/ui/DefaultGroup/InvenWindow/InvenTab_equip');
if (tab) {
  const comps = tab.jsonString['@components'] || [];
  console.log('\n=== InvenTab_equip 컴포넌트 목록 ===');
  comps.forEach(c => {
    const type = c['@type'] ? c['@type'].split('.').pop() : '?';
    console.log('  ' + type);
  });
}
