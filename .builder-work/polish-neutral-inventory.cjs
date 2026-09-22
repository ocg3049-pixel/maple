const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const { UIBuilder } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const { lintUiFile } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const file = path.join(root, 'ui/DefaultGroup.ui');
const sprite = 'MOD.Core.SpriteGUIRendererComponent';
const transform = 'MOD.Core.UITransformComponent';
const neutralSlot = '4660b7e4c00146628b68702936ed1907';
const cornerScale = 1.5;

/* Final inventory-slot-neutral-v4.png prompt (built-in imagegen edit mode):
Use case: precise-object-edit
Asset type: one production inventory item-slot bitmap for a 2D RPG, displayed at 56x56 pixels.
Input images: Image 1 is the edit target.
Primary request: remove ALL yellow, ivory, cream and beige tint. Make the entire slot clean neutral pearl-white and pale neutral gray, with equal RGB channels: top #FAFAFA gradually and subtly blending to bottom #E5E5E5. Thin shallow inset neutral-gray edge and soft white rim. Soft restrained continuous gradient, no banding, no bluish tint, no metallic gloss. The user specifically dislikes yellow-looking slots.
Constraints: change only the color balance and smoothness; preserve the square centered front-facing full-canvas slot, thin rim, subtly rounded corners, clean empty luminous central 85 percent. No item, text, symbols, shadows outside, padding or checkerboard. Genuine transparent pixels only outside the tiny rounded corners. This is a sprite alone.
*/

// Preserve existing layout/bindings; only the frame and 128 empty-slot images change.
const previousErrors = new Set(lintUiFile(file).filter(x => x.severity === 'error').map(x => x.rule + '|' + x.path));
const b = UIBuilder.read(file);
const before = b.listEntities().map(e => [e.path, b.getId(e.path)]);
const windowSize = b.getComponent('InvenWindow', transform).RectSize;
assert.equal(windowSize.y, 760);
assert.ok([372, 1200].includes(windowSize.x));
assert.equal(b.listEntities().filter(e => e.path.startsWith('/ui/DefaultGroup/InvenWindow/BG/')).length, 0);

// Existing frame has real alpha and 18px nine-slice borders. Scale only its
// corner geometry, while inverse rect sizing keeps the window and hit boxes fixed.
b.patch('InvenWindow/BG', {
  anchor: 'middle-center', pivot: [0.5, 0.5], pos: [0, 0],
  rect_size: [windowSize.x / cornerScale, windowSize.y / cornerScale],
});
b.patchComponent('InvenWindow/BG', transform, {
  UIScale: { x: cornerScale, y: cornerScale, z: 1 },
  Scale: { x: cornerScale, y: cornerScale, z: 1 },
});
b.patchComponent('InvenWindow/BG', sprite, {
  Type: 1, PreserveSprite: 0, Outline: false, DropShadow: false,
});
const slots = b.listEntities().filter(e => /\/InvenWindow\/InvenSlot\d+\/SlotBG$/.test(e.path));
assert.equal(slots.length, 128);
for (const e of slots) b.patchComponent(e.path, sprite, {
  ImageRUID: { DataId: neutralSlot }, Color: { r: 1, g: 1, b: 1, a: 1 },
  Type: 0, PreserveSprite: 0, Outline: false, DropShadow: false,
});

let writeFailure;
try { b.write(file); } catch (error) { writeFailure = error; }
const afterErrors = lintUiFile(file).filter(x => x.severity === 'error');
assert.deepEqual(afterErrors.filter(x => !previousErrors.has(x.rule + '|' + x.path)), [], 'New UI lint errors');
if (writeFailure && !afterErrors.length) throw writeFailure;
const check = UIBuilder.read(file);
for (const [p, id] of before) assert.equal(check.getId(p), id, 'Changed binding: ' + p);
for (const e of slots) assert.equal(check.getComponent(e.path, sprite).ImageRUID.DataId, neutralSlot);
const frame = check.getComponent('InvenWindow/BG', transform);
assert.equal(frame.RectSize.x * frame.UIScale.x, windowSize.x);
assert.ok(Math.abs(frame.RectSize.y * frame.UIScale.y - windowSize.y) < 0.001);
console.log('[NeutralInventory] 128 neutral slots; round frame scale=1.5; dimensions and UUIDs preserved; no new lint errors');
