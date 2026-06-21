const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const raw = b.entities;

const tabKeys = ['equip','consume','etc','install','cash','decorate'];
for (const tk of tabKeys) {
  const base = '/ui/DefaultGroup/InvenWindow/InvenTab_' + tk;
  const bgPath  = base + '/TabBG';
  const lblPath = base + '/TabLbl';

  const bgEnt  = raw.find(e => e.jsonString.path === bgPath);
  const lblEnt = raw.find(e => e.jsonString.path === lblPath);

  if (!lblEnt) {
    console.log('[' + tk + '] TabLbl: NOT FOUND in .ui');
  } else {
    const js = lblEnt.jsonString;
    // TextComponent 찾기
    const comps = js['@components'] || [];
    const textComp = comps.find(c => c['@type'] && c['@type'].includes('TextGUI'));
    console.log('[' + tk + '] TabLbl displayOrder=' + js.displayOrder +
      ' enable=' + js.enable +
      ' origin=' + JSON.stringify(js.origin) +
      ' text=' + (textComp ? textComp.Text : 'N/A') +
      ' color=' + (textComp ? JSON.stringify(textComp.FontColor) : 'N/A') +
      ' size=' + (textComp ? textComp.FontSize : 'N/A'));
  }
  if (!bgEnt) {
    console.log('[' + tk + '] TabBG: NOT FOUND');
  } else {
    console.log('[' + tk + '] TabBG  displayOrder=' + bgEnt.jsonString.displayOrder);
  }
}
