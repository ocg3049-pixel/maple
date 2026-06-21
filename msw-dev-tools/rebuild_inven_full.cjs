// Rebuilds the full current InvenWindow structure into DefaultGroup.ui
// CONFIRMED: higher displayOrder = rendered ON TOP in MSW
// Fix: TabLbl displayOrder=10(front), TabBG displayOrder=1(back)
//      Icon displayOrder=10(front), SlotBG displayOrder=1(back)
//      All interactive children get UITouchReceiveComponent
const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

const IW = '/ui/DefaultGroup/InvenWindow';
const COLS = 16;
const colX = [-525,-455,-385,-315,-245,-175,-105,-35,35,105,175,245,315,385,455,525];
const rowY = [176, 106, 36, -34, -104, -174, -244, -314];

// ─── 0. Clean up leftovers ────────────────────────────────────────────────────
const tabKeys0 = ['equip','consume','etc','install','cash','decorate'];
for (const tk of tabKeys0) {
  try { b.removeComponent(IW + '/InvenTab_' + tk, 'MOD.Core.SpriteGUIRendererComponent'); } catch(e) {}
  try { b.remove(IW + '/InvenTab_' + tk + '/Touch'); } catch(e) {}
}
for (let i = 1; i <= 128; i++) {
  try { b.removeComponent(IW + '/InvenSlot' + i, 'MOD.Core.SpriteGUIRendererComponent'); } catch(e) {}
}
try { b.remove(IW + '/InvenMinBtn/Touch'); } catch(e) {}

// ─── 1. Remove old InvenSlot1-20 ────────────────────────────────────────────
for (let i = 1; i <= 20; i++) {
  try { b.remove(IW + '/InvenSlot' + i); } catch(e) {}
}

// ─── 2. Core InvenWindow children ─────────────────────────────────────────────
b.panel(IW + '/TitleText', { anchor: 'middle-center', pos: [0, 355], rect_size: [1200, 50] });
b.sprite(IW + '/TitleText/TitleBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [1200, 50], color: {r:0.1,g:0.1,b:0.15,a:0.9} });
b.text(IW + '/TitleText/Label', 'INVENTORY', { anchor: 'middle-center', pos: [-60, 0], rect_size: [400, 50], size: 20, bold: true, color: {r:0.2,g:0.9,b:0.4} });

b.panel(IW + '/CloseInven', { anchor: 'middle-center', pos: [580, 355], rect_size: [36, 36] });
b.upsertComponent(IW + '/CloseInven', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(IW + '/CloseInven', 'MOD.Core.SpriteGUIRendererComponent', { Color: {r:0.85,g:0.2,b:0.2,a:1} });

b.panel(IW + '/InvenMinBtn', { anchor: 'middle-center', pos: [538, 355], rect_size: [36, 36] });
b.upsertComponent(IW + '/InvenMinBtn', 'MOD.Core.UITouchReceiveComponent', {});
b.upsertComponent(IW + '/InvenMinBtn', 'MOD.Core.SpriteGUIRendererComponent', { Color: {r:0.3,g:0.5,b:0.8,a:1} });
b.text(IW + '/InvenMinBtn/Label', '_', { anchor: 'middle-center', pos: [0, 4], rect_size: [36, 22], size: 14, bold: true, color: {r:1,g:1,b:1} });

b.panel(IW + '/MesoBar', { anchor: 'middle-center', pos: [-20, -350], rect_size: [1180, 50] });
b.sprite(IW + '/MesoBar/MesoIcon', { anchor: 'middle-center', pos: [-550, 0], rect_size: [36, 36] });
b.text(IW + '/MesoBar/MesoText', '0', { anchor: 'middle-center', pos: [-450, 0], rect_size: [200, 36], size: 16, color: {r:1,g:1,b:1} });
b.panel(IW + '/MesoBar/EnhanceOpenBtn', { anchor: 'middle-center', pos: [400, 0], rect_size: [100, 32] });
b.upsertComponent(IW + '/MesoBar/EnhanceOpenBtn', 'MOD.Core.UITouchReceiveComponent', {});

b.text(IW + '/InvenSlotCount', '0/128', { anchor: 'middle-center', pos: [555, 303], rect_size: [100, 30], size: 13, color: {r:0.9,g:0.9,b:0.9} });

// ─── 3. Tabs: higher displayOrder = front, all children get UITouchReceive ────
// TabBG: displayOrder=1 (back = background)
// TabLbl: displayOrder=10 (front = text visible)
const tabKeys = ['equip','consume','etc','install','cash','decorate'];
const tabLabels = ['장비','소비','기타','설치','캐시','치장'];
const tabXexp = [-350,-210,-70,70,210,350];

for (let i = 0; i < tabKeys.length; i++) {
  const tk = tabKeys[i];
  const tBase = IW + '/InvenTab_' + tk;

  b.panel(tBase, { anchor: 'middle-center', pos: [tabXexp[i], 250], rect_size: [132, 36] });
  b.upsertComponent(tBase, 'MOD.Core.UITouchReceiveComponent', {});

  // TabBG: background + RaycastTarget=true (클릭 수신) + UITouchReceive
  b.sprite(tBase + '/TabBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [132, 36], color: {r:0.22,g:0.22,b:0.28,a:1} });
  b.upsertComponent(tBase + '/TabBG', 'MOD.Core.UITouchReceiveComponent', {});
  b.patchComponent(tBase + '/TabBG', 'MOD.Core.SpriteGUIRendererComponent', { RaycastTarget: true });

  // TabLbl: text (앞에 표시, RaycastTarget 기본=false이므로 클릭 통과→TabBG로)
  b.text(tBase + '/TabLbl', tabLabels[i], { anchor: 'middle-center', pos: [0, 0], rect_size: [132, 36], size: 14, bold: true, color: {r:1,g:1,b:1} });
}

// ─── 4. Slots: higher displayOrder = front ────────────────────────────────────
// SlotBG: displayOrder=1 (back = white background)
// Icon: displayOrder=10 (front = icon visible)
// ItemName: displayOrder=20 (front)
// StarLabel: displayOrder=15 (front)
for (let i = 1; i <= 128; i++) {
  const col = (i - 1) % COLS;
  const row = Math.floor((i - 1) / COLS);
  const sx = colX[col], sy = rowY[row];
  const sp = IW + '/InvenSlot' + i;

  b.panel(sp, { anchor: 'middle-center', pos: [sx, sy], rect_size: [66, 66] });
  b.upsertComponent(sp, 'MOD.Core.UITouchReceiveComponent', {});

  // SlotBG: white background + RaycastTarget=true (클릭 수신) + UITouchReceive
  b.sprite(sp + '/SlotBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [66, 66], color: {r:1,g:1,b:1,a:1} });
  b.upsertComponent(sp + '/SlotBG', 'MOD.Core.UITouchReceiveComponent', {});
  b.patchComponent(sp + '/SlotBG', 'MOD.Core.SpriteGUIRendererComponent', { RaycastTarget: true });

  // Icon: 아이템 아이콘 + RaycastTarget=true + UITouchReceive
  b.sprite(sp + '/Icon', { anchor: 'middle-center', pos: [0, -9], rect_size: [51, 51] });
  b.upsertComponent(sp + '/Icon', 'MOD.Core.UITouchReceiveComponent', {});
  b.patchComponent(sp + '/Icon', 'MOD.Core.SpriteGUIRendererComponent', { RaycastTarget: true });

  // ItemName, StarLabel: 텍스트 (TextComponent는 RaycastTarget=false → 클릭 통과)
  b.text(sp + '/ItemName', '', { anchor: 'middle-center', pos: [0, -6], rect_size: [66, 15], size: 8 });
  b.text(sp + '/StarLabel', '', { anchor: 'middle-center', pos: [0, 49], rect_size: [66, 15], size: 8 });
}

// ─── 5. Scroll components ─────────────────────────────────────────────────────
b.panel(IW + '/InvenScrollTrack', { anchor: 'middle-center', pos: [3000, 3000], rect_size: [16, 500] });
b.upsertComponent(IW + '/InvenScrollTrack', 'MOD.Core.SpriteGUIRendererComponent', { Color: {r:0.2,g:0.2,b:0.2,a:0.5} });

b.panel(IW + '/InvenScrollUp', { anchor: 'middle-center', pos: [3000, 3000], rect_size: [24, 24] });
b.upsertComponent(IW + '/InvenScrollUp', 'MOD.Core.UITouchReceiveComponent', {});
b.sprite(IW + '/InvenScrollUp/UpBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], color: {r:0.3,g:0.3,b:0.4,a:1} });
b.text(IW + '/InvenScrollUp/UpLbl', '▲', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], size: 12, color: {r:1,g:1,b:1} });

b.panel(IW + '/InvenScrollDown', { anchor: 'middle-center', pos: [3000, 3000], rect_size: [24, 24] });
b.upsertComponent(IW + '/InvenScrollDown', 'MOD.Core.UITouchReceiveComponent', {});
b.sprite(IW + '/InvenScrollDown/DownBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], color: {r:0.3,g:0.3,b:0.4,a:1} });
b.text(IW + '/InvenScrollDown/DownLbl', '▼', { anchor: 'middle-center', pos: [0, 0], rect_size: [24, 24], size: 12, color: {r:1,g:1,b:1} });

b.panel(IW + '/InvenScrollThumb', { anchor: 'middle-center', pos: [3000, 3000], rect_size: [16, 48] });
b.upsertComponent(IW + '/InvenScrollThumb', 'MOD.Core.UITouchReceiveComponent', {});
b.sprite(IW + '/InvenScrollThumb/ThumbBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [16, 48], color: {r:1,g:1,b:1,a:0.9} });

// ─── 6. Write ──────────────────────────────────────────────────────────────────
console.log('Entity count before write:', b.listEntities().length);
b.write('ui/DefaultGroup.ui', { lint: false });
console.log('DONE: DefaultGroup.ui rebuilt');

const b2 = UIBuilder.read('ui/DefaultGroup.ui');
const tabEnts = b2.listEntities().filter(e => e.path && e.path.includes('InvenTab_equip'));
console.log('InvenTab_equip entities:');
tabEnts.forEach((e, i) => console.log('  ['+i+']', e.path));

const slot1ents = b2.listEntities().filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/InvenWindow/InvenSlot1'));
console.log('InvenSlot1 children (' + slot1ents.length + '):');
slot1ents.forEach((e, i) => console.log('  ['+i+']', e.path));
