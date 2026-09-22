const assert = require('node:assert/strict');
const { UIBuilder } = require('../.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const { lintUiFile } = require('../.agents/skills/msw-ui-system/scripts/ui_lint.cjs');

const file = 'ui/DefaultGroup.ui';
const sprite = 'MOD.Core.SpriteGUIRendererComponent';
const backgroundPaths = [
  'MapleHUD/VitalsFrame',
  'MapleHUD/HpBar/Bg',
  'MapleHUD/MpBar/Bg',
];
const b = UIBuilder.read(file);
// 기존 중첩 BuffBar/화면 밖 숨김 요소는 이번 배경 색상 변경 범위에 포함하지 않는다.
const knownErrors = new Set(lintUiFile(file).filter(x => x.severity === 'error').map(x => x.rule + '|' + x.path));
const originalIds = backgroundPaths.map(path => b.getId(path));
for (const path of backgroundPaths) {
  b.patchComponent(path, sprite, { Color: { r: 0, g: 0, b: 0, a: 0.55 } });
}
b.patchComponent('MapleHUD/VitalsFrame', sprite, {
  OutlineColor: { r: 0.55, g: 0.55, b: 0.55, a: 0.45 },
});
try {
  b.write(file);
} catch (error) {
  if (!String(error.message).startsWith('ui_lint:')) throw error;
}
const newErrors = lintUiFile(file).filter(x => x.severity === 'error' && !knownErrors.has(x.rule + '|' + x.path));
assert.deepEqual(newErrors, [], 'No new UI layout errors');
const verified = UIBuilder.read(file);
for (const [index, path] of backgroundPaths.entries()) {
  assert.equal(verified.getId(path), originalIds[index]);
  assert.deepEqual(verified.getComponent(path, sprite).Color, { r: 0, g: 0, b: 0, a: 0.55 });
}
console.log('PASS: HP/MP backgrounds are black at 55% opacity; bindings preserved.');
