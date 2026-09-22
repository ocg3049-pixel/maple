const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const { UIBuilder } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const { lintUiFile } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const S = 'MOD.Core.SpriteGUIRendererComponent';
const U = 'MOD.Core.UITransformComponent';
const ivory = '5635957ae3b34a6e8dfd3a4f7aea0b48';

/* Final inventory-slot-ivory-v3.png prompt (built-in imagegen edit mode):
Use case: precise-object-edit
Asset type: production bitmap sprite for one empty inventory item slot in a MapleStory Worlds 2D RPG, displayed at 56x56 pixels.
Input images: Image 1 is the edit target.
Primary request: make the slot substantially brighter, near white and pale warm beige, with a smooth natural gradient. Replace the cool silver-blue gray interior with warm ivory #FFFEF8 at top gradually blending to very pale beige #EAE2D2 at bottom. Replace the metallic dark groove with a delicate shallow inset edge in warm light gray. The central 85 percent must remain clean, luminous and quiet behind an item icon. Make the rim thinner and softer with only very subtle shading.
Constraints: preserve a single perfectly square front-facing slot filling the canvas edge to edge, same centered composition and slightly rounded corners. Interior opaque; genuinely transparent outside tiny rounded corners. No broad outer margin. No objects, text, icons, patterns, ornamental accents, sparkle, dark blue, black shadows, strong gloss, checkerboard, watermark. This is the slot asset alone, not an inventory window.
*/

function edit(group, mutate) {
  const file = path.join(root, 'ui', group + '.ui');
  const existing = new Set(lintUiFile(file).filter(x => x.severity === 'error').map(x => x.rule + '|' + x.path));
  const b = UIBuilder.read(file);
  const ids = b.listEntities().map(e => [e.path, b.getId(e.path)]);
  mutate(b);
  let failure;
  try { b.write(file); } catch (e) { failure = e; }
  const errors = lintUiFile(file).filter(x => x.severity === 'error');
  assert.deepEqual(errors.filter(x => !existing.has(x.rule + '|' + x.path)), [], group + ': new lint errors');
  if (failure && !errors.length) throw failure;
  const check = UIBuilder.read(file);
  for (const [p, id] of ids) assert.equal(check.getId(p), id, 'UUID changed: ' + p);
  console.log('[IvoryPolish] ' + group + ': existing bindings preserved; no new lint errors');
  return check;
}

const inventory = edit('DefaultGroup', b => {
  // The resource has 18px nine-slice borders; both window widths retain circular corners.
  b.patchComponent('InvenWindow/BG', S, {Type: 1, PreserveSprite: 0, Outline: false, DropShadow: false});
  const slots = b.listEntities().filter(e => /\/InvenWindow\/InvenSlot\d+\/SlotBG$/.test(e.path));
  assert.equal(slots.length, 128);
  for (const e of slots) b.patchComponent(e.path, S, {
    ImageRUID: {DataId: ivory}, Color: {r: 1, g: 1, b: 1, a: 1},
    Type: 0, PreserveSprite: 0, Outline: false, DropShadow: false,
  });
});
assert.equal(inventory.getComponent('InvenWindow/BG', S).Type, 1);
assert.equal(inventory.listEntities().filter(e => inventory.getComponent(e.path, S)?.ImageRUID?.DataId === ivory).length, 128);

const world = edit('WorldMapGroup', b => {
  // Keep 800x590 authoring coordinates: one parent scale enlarges artwork, points,
  // hit targets and animations without introducing independent coordinate drift.
  for (const p of ['FullMapPanel', 'VictoriaPanel']) {
    b.patch(p, {anchor: 'middle-center', pivot: [0.5, 0.5], pos: [0, 0], rect_size: [800, 590]});
    // Maker reloads the serialized Scale after UIScale; keep both representations aligned.
    b.patchComponent(p, U, {UIScale: {x: 1.6, y: 1.6, z: 1}, Scale: {x: 1.6, y: 1.6, z: 1}});
  }
  const before = b.listEntities().filter(e => /^\/ui\/WorldMapGroup\/VictoriaPanel\/(?:BL|BS|P|Y)_\d+$/.test(e.path));
  b.sprite('VictoriaPanel/SelectionIndicator', {
    image_ruid: '96392b1df6724d43abab0ec1988aa7c4', sprite_type: 0,
    anchor: 'middle-center', pivot: [0.5, 0.5], pos: [0, 0], rect_size: [20, 36],
    color: {r: 1, g: 1, b: 1, a: 0}, raycast: false,
  });
  b.patch('VictoriaPanel/SelectionIndicator', {display_order: 1000});
  b.patchComponent('VictoriaPanel/SelectionIndicator', S, {PreserveSprite: 2, PlayRate: 0});
  for (const e of before) {
    const after = b.listEntities().find(x => x.path === e.path);
    assert.deepEqual(after.pos, e.pos, 'map-relative point moved');
    assert.deepEqual(after.size, e.size, 'point scaled twice');
  }
  console.log('[IvoryPolish] ' + before.length + ' map points share 1.6x scale; map 1280x944');
});
assert.equal(world.getComponent('FullMapPanel', U).UIScale.x, 1.6);
assert.equal(world.getComponent('VictoriaPanel', U).UIScale.x, 1.6);
assert.equal(world.getComponent('FullMapPanel', U).Scale.x, 1.6);
assert.equal(world.getComponent('VictoriaPanel', U).Scale.x, 1.6);
