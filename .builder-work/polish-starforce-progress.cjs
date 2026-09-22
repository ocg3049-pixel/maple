const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const { UIBuilder } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const { lintUiFile } = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const file = path.join(root, 'ui/DefaultGroup.ui');
const S = 'MOD.Core.SpriteGUIRendererComponent';
const U = 'MOD.Core.UITransformComponent';
const T = 'MOD.Core.TextGUIRendererComponent';
const L = 'MOD.Core.TextComponent';
const b = UIBuilder.read(file);
// Only discard the temporary geometry created during this polish pass.
for (const e of b.listEntities().filter(e => /\/EnhanceWindow\/RightPanel\/ContentArea\/StarforceContent\/Star_\d+\/UnfilledStar$/.test(e.path))) b.remove(e.path);
const ids = b.listEntities().map(e => [e.path, b.getId(e.path)]);
const existingErrors = new Set(lintUiFile(file).filter(e => e.severity === 'error').map(e => e.rule + '|' + e.path));
const stars = b.listEntities().filter(e => /\/EnhanceWindow\/RightPanel\/ContentArea\/StarforceContent\/Star_\d+$/.test(e.path));
assert.equal(stars.length, 100);
// The original achieved-star clip is baked yellow. A tint cannot turn it white.
// Keep that clip for achieved stars and reuse each slot's existing star text.
for (const star of stars) {
  b.patchComponent(star.path, S, {Enable: false, Color: {r: 1, g: 0.84, b: 0.24, a: 1}});
  b.patchComponent(star.path, L, {
    Enable: true, Text: '★', FontColor: {r: 1, g: 1, b: 1, a: 1},
    UseOutLine: false, DropShadow: false,
  });
}

// Keep the summary attached to the item name so clearing/moving its parent also
// clears/moves the summary. Do not revive the old duplicate comparison panels.
const label = 'EnhanceWindow/RightPanel/SlotArea/TargetNameLabel/StarforceProgressText';
b.text(label, '', {
  anchor: 'middle-center', pivot: [0.5, 0.5], pos: [0, -38], rect_size: [478, 32],
  size: 20, color: '#FFFFFF', alignment: 4, bold: false, enable: false,
});
b.patchComponent(label, T, {Font: 'Default', IsRichText: false});
b.patchComponent(label, S, {RaycastTarget: false});
b.patch(label, {enable: false, display_order: 20});

let failure;
try { b.write(file); } catch (error) { failure = error; }
const errors = lintUiFile(file).filter(e => e.severity === 'error');
assert.deepEqual(errors.filter(e => !existingErrors.has(e.rule + '|' + e.path)), [], 'New UI lint errors');
if (failure && !errors.length) throw failure;
const check = UIBuilder.read(file);
for (const [p, id] of ids) assert.equal(check.getId(p), id, 'Changed existing binding: ' + p);
assert.deepEqual(check.getComponent(label, U).RectSize, {x: 478, y: 32});
for (const star of stars) {
  assert.equal(check.getComponent(star.path, S).Enable, false);
  const text = check.getComponent(star.path, L);
  assert.equal(text.Text, '★');
  assert.deepEqual(text.FontColor, {r: 1, g: 1, b: 1, a: 1});
}
assert.equal(check.getComponent(label, S).RaycastTarget, false);
assert.equal(check.find('EnhanceWindow/RightPanel/ContentArea/StarforceContent/ArrowPillBG').jsonString.enable, false);
console.log('[StarforceProgress] 100 white unfilled stars; item-name child summary; existing UUIDs preserved; no new lint errors');
