// InvenSlot1-20을 새로 추가 (remove 없이 — 기존 없는 상태에서 추가)
const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

const IW = '/ui/DefaultGroup/InvenWindow';
const COLS = 16;
const colX = [-525,-455,-385,-315,-245,-175,-105,-35,35,105,175,245,315,385,455,525];
const rowY = [176, 106, 36, -34, -104, -174, -244, -314];

// InvenSlot1-20만 추가 (1-16: row0, 17-20: row1의 첫 4개)
for (let i = 1; i <= 20; i++) {
  const col = (i - 1) % COLS;
  const row = Math.floor((i - 1) / COLS);
  const sx = colX[col], sy = rowY[row];
  const sp = IW + '/InvenSlot' + i;

  b.panel(sp, { anchor: 'middle-center', pos: [sx, sy], rect_size: [66, 66] });
  b.upsertComponent(sp, 'MOD.Core.UITouchReceiveComponent', {});

  b.sprite(sp + '/SlotBG', { anchor: 'middle-center', pos: [0, 0], rect_size: [66, 66], color: {r:1,g:1,b:1,a:1} });
  b.upsertComponent(sp + '/SlotBG', 'MOD.Core.UITouchReceiveComponent', {});
  b.patchComponent(sp + '/SlotBG', 'MOD.Core.SpriteGUIRendererComponent', { RaycastTarget: true });

  b.sprite(sp + '/Icon', { anchor: 'middle-center', pos: [0, -9], rect_size: [51, 51] });
  b.upsertComponent(sp + '/Icon', 'MOD.Core.UITouchReceiveComponent', {});
  b.patchComponent(sp + '/Icon', 'MOD.Core.SpriteGUIRendererComponent', { RaycastTarget: true });

  b.text(sp + '/ItemName', '', { anchor: 'middle-center', pos: [0, -6], rect_size: [66, 15], size: 8 });
  b.text(sp + '/StarLabel', '', { anchor: 'middle-center', pos: [0, 49], rect_size: [66, 15], size: 8 });
}

b.write('ui/DefaultGroup.ui', { lint: false });
console.log('Done: InvenSlot1-20 추가 완료');

// 확인
const b2 = UIBuilder.read('ui/DefaultGroup.ui');
const slot1ents = b2.listEntities().filter(e => e.path && e.path.startsWith('/ui/DefaultGroup/InvenWindow/InvenSlot1/'));
console.log('InvenSlot1 자식들:', slot1ents.length, '개 (4여야 함)');
slot1ents.forEach((e, i) => console.log('  ['+i+']', e.path));
