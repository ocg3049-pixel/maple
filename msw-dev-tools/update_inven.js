const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const UI_PATH = '/Users/florence/Desktop/ui/DefaultGroup.ui';
const SLOT_BG_RUID = '4fea64a3307cda641809ad8be0d4890b';

const b = UIBuilder.read(UI_PATH);

// 1. Resize InvenWindow to 850x1750, initial pos so top is just visible on canvas
b.patch('InvenWindow', { pos: [230, -340], rect_size: [850, 1750] });
b.patch('InvenWindow/BG', { rect_size: [850, 1750] });

// 2. Reposition MesoBar for the taller window (center-anchored)
b.patch('InvenWindow/MesoBar', { pos: [-15, -845] });

// 3. Helper: compute 8-column grid position for slot i (1-indexed)
function slotPos(i) {
  const col = (i - 1) % 8;
  const row = Math.floor((i - 1) / 8);
  return [-343 + col * 98, 750 - row * 98];
}

// 4. Resize and reposition existing slots 1-20 to 8-column 66x66 grid
for (let i = 1; i <= 20; i++) {
  const [sx, sy] = slotPos(i);
  b.patch(`InvenWindow/InvenSlot${i}`,           { pos: [sx, sy], rect_size: [66, 66] });
  b.patch(`InvenWindow/InvenSlot${i}/SlotBG`,    { rect_size: [66, 66] });
  b.patch(`InvenWindow/InvenSlot${i}/Icon`,      { pos: [0, -9],  rect_size: [51, 51] });
  b.patch(`InvenWindow/InvenSlot${i}/ItemName`,  { pos: [0, -6],  rect_size: [66, 15] });
  b.patch(`InvenWindow/InvenSlot${i}/StarLabel`, { pos: [0,  49], rect_size: [66, 15] });
  b.patch(`InvenWindow/InvenSlot${i}/Touch`,     { rect_size: [66, 66] });
}

// 5. Add new slots 21-128 with full child structure
for (let i = 21; i <= 128; i++) {
  const [sx, sy] = slotPos(i);

  // Slot container: UITouchReceiveComponent (events wired by script)
  b.touchReceive(`InvenWindow/InvenSlot${i}`, {
    anchor: 'middle-center', pos: [sx, sy], rect_size: [66, 66]
  });

  // SlotBG: background sprite
  b.sprite(`InvenWindow/InvenSlot${i}/SlotBG`, {
    anchor: 'middle-center', pos: [0, 0], rect_size: [66, 66],
    image_ruid: SLOT_BG_RUID
  });

  // Icon: item icon (slot BG as placeholder, overridden by item RUID at runtime)
  b.sprite(`InvenWindow/InvenSlot${i}/Icon`, {
    anchor: 'middle-center', pos: [0, -9], rect_size: [51, 51],
    image_ruid: SLOT_BG_RUID
  });

  // ItemName: invisible sprite + TextComponent for item name text
  b.sprite(`InvenWindow/InvenSlot${i}/ItemName`, {
    anchor: 'middle-center', pos: [0, -6], rect_size: [66, 15], image_ruid: ''
  });
  b.upsertComponent(`InvenWindow/InvenSlot${i}/ItemName`, 'MOD.Core.TextComponent', {
    Alignment: 4, AllowAutomaticTranslation: true,
    BestFit: false, Bold: false, ConstraintX: 100
  });

  // StarLabel: invisible sprite + TextComponent for enhancement star text
  b.sprite(`InvenWindow/InvenSlot${i}/StarLabel`, {
    anchor: 'middle-center', pos: [0, 49], rect_size: [66, 15], image_ruid: ''
  });
  b.upsertComponent(`InvenWindow/InvenSlot${i}/StarLabel`, 'MOD.Core.TextComponent', {
    Alignment: 4, AllowAutomaticTranslation: true,
    BestFit: false, Bold: false, ConstraintX: 100
  });

  // Touch: UITouchReceiveComponent for hover detection
  b.touchReceive(`InvenWindow/InvenSlot${i}/Touch`, {
    anchor: 'middle-center', pos: [0, 0], rect_size: [66, 66]
  });
}

b.write(UI_PATH, { lint: false });
console.log('[update_inven] Done! 128 slots (66x66) in 8-column grid written to DefaultGroup.ui');
