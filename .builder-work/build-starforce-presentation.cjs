const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const {UIBuilder} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs'));
const {lintUiFile} = require(path.join(root, '.agents/skills/msw-ui-system/scripts/ui_lint.cjs'));
const file = path.join(root, 'ui/DefaultGroup.ui');
const b = UIBuilder.read(file);
const S = 'MOD.Core.SpriteGUIRendererComponent';
const L = 'MOD.Core.TextComponent';
const sf = 'EnhanceWindow/RightPanel/ContentArea/StarforceContent';
const item = 'EnhanceWindow/RightPanel/SlotArea/TargetSlotBG';
const beforeErrors = new Set(lintUiFile(file).filter(x => x.severity === 'error').map(x => x.rule + '|' + x.path));
const ids = b.listEntities().map(e => [e.path, b.getId(e.path)]);
for (let i = 1; i <= 100; i++) {
  b.patchComponent(sf + '/Star_' + i, S, {Enable: false});
  b.patchComponent(sf + '/Star_' + i, L, {Enable: true, Text: '☆', FontSize: 19, FontColor: {r: 1, g: 1, b: 1, a: 1}, UseOutLine: false, DropShadow: false});
}
function fx(builder, name, ruid, size, order) {
  builder.sprite(name, {image_ruid: ruid, sprite_type: 0, color: '#FFFFFF', rect_size: size, anchor: 'middle-center', pivot: [0.5,0.5], pos: [0,0], raycast: false, enable: false});
  builder.patchComponent(name, S, {AnimClipPlayType: 0, PreserveSprite: 1});
  builder.patch(name, {display_order: order});
}
// Fixed per-frame sprites avoid resizing the previous texture while the next loads.
const source = fs.readFileSync(path.join(root, 'RootDesk/MyDesk/Enhancement/StarforcePresentation.mlua'), 'utf8');
function frameGroup(builder, parent, tableName, scale, size, order) {
  builder.empty(parent, {rect_size: size, anchor: 'middle-center', pivot: [0.5,0.5], pos: [0,0], enable: false});
  builder.patch(parent, {display_order: order});
  const block = source.match(new RegExp('self\\._T\\.' + tableName + ' = \\{([\\s\\S]*?)\\n\\t\\t\\}'));
  assert.ok(block, tableName);
  const frames = [...block[1].matchAll(/ruid="([a-f0-9]+)", w=(\d+), h=(\d+), ox=(\d+), oy=(\d+), index=(\d+)/g)];
  assert.equal(frames.length, tableName === 'destroyTextFrames' ? 11 : 16);
  for (const [,ruid,w,h,ox,oy,index] of frames) {
    const name = parent + '/Frame_' + index;
    builder.sprite(name, {image_ruid: ruid, sprite_type: 0, color: '#FFFFFF', rect_size: [w*scale,h*scale],
      anchor: 'middle-center', pivot: [ox/w,1-oy/h], pos: [0,0], raycast: false, enable: false});
    builder.patchComponent(name, S, {PreserveSprite: 0});
  }
}
fx(b, item + '/TryFx1', '3d98d0b0453c444383849217bb7f031b', [312,306], 30);
// Keep the old second entity disabled to preserve existing references, but never play it.
fx(b, item + '/TryFx2', '3d98d0b0453c444383849217bb7f031b', [312,306], 31);
for (const name of ['TryFx1','TryFx2']) {
  b.patch(item + '/' + name, {pos: [-12*0.6,-139*0.6]});
  b.patchComponent(item + '/' + name, 'MOD.Core.UITransformComponent', {UIScale: {x:0.6,y:0.6,z:1}});
  b.patchComponent(item + '/' + name, S, {PlayRate: 3, PreserveSprite: 2});
}
fx(b, item + '/ResultFx', '2ed0563b97a741ad9f64728ab9763897', [170,170], 32);
// Reuse the project's existing achromatic material; do not modify its shared state.
b.patchComponent(item + '/ResultFx', S, {MaterialId: 'material://37ba494c-5f39-4f1b-be11-dc6b1aea17d3'});
frameGroup(b, item + '/DestroyFx', 'destroyItemFrames', 1.2, [460,460], 34);
fx(b, item + '/DestroyLeadIn', 'bb981266810a4d65b59687af9b6bafe5', [322.8,374.4], 33);
b.patch(item + '/DestroyLeadIn', {pivot: [129/269,1-142/312]});
b.patchComponent(item + '/DestroyLeadIn', S, {PreserveSprite: 0});
fx(b, sf + '/StarFillFx', '58a7d48901d64cc8a4a5d7c2a6c1174c', [62.4,66], 200);
b.patchComponent(sf + '/StarFillFx', S, {PlayRate: 2});
b.text(sf + '/PresentationStatus', '', {pos: [0,-230], rect_size: [460,22], size: 16, color: '#D3F0FF', enable: false});
b.patch(sf + '/PresentationStatus', {display_order: 201});
let failure;
try {b.write(file);} catch (error) {failure = error;}
const errors = lintUiFile(file).filter(x => x.severity === 'error');
assert.deepEqual(errors.filter(x => !beforeErrors.has(x.rule + '|' + x.path)), []);
if (failure && !errors.length) throw failure;
const check = UIBuilder.read(file);
for (const [p,id] of ids) assert.equal(check.getId(p), id);
const screenFile = path.join(root, 'ui/StarforceEffects.ui');
const c = fs.existsSync(screenFile) ? UIBuilder.read(screenFile) : new UIBuilder('StarforceEffects', 60, true);
c.patchComponent('StarforceEffects', 'MOD.Core.UIGroupComponent', {GroupType: 2, GroupOrder: 60, DefaultShow: true});
c.patchComponent('StarforceEffects', 'MOD.Core.CanvasGroupComponent', {Interactable: false, BlocksRaycasts: false});
c.empty('Center', {rect_size: [1200,700], anchor: 'middle-center', pos: [0,0]});
fx(c, 'Center/SuccessFx', '54ddb99704ad49019d5a6b0d45226e8a', [411,178], 1);
c.patch('Center/SuccessFx', {pos: [-206.5*3,80*3]});
c.patchComponent('Center/SuccessFx', 'MOD.Core.UITransformComponent', {UIScale: {x:3,y:3,z:1}});
c.patchComponent('Center/SuccessFx', S, {PreserveSprite: 2});
frameGroup(c, 'Center/DestroyFx', 'destroyTextFrames', 2, [1200,700], 2);
c.write(screenFile);
console.log('[StarforceFX] 100 matched stars; item/star effects; nonblocking centered result overlay; existing UUIDs preserved');
