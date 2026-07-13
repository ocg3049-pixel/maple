// DecoWindow/TitleText에 raycast 타깃 스프라이트 추가 (알파 0, RaycastTarget=true)
// - UITouchReceiveComponent만 있고 raycast 그래픽이 없어 터치가 도달하지 않던 문제 수정
// - EquipWindow/EnhanceWindow TitleText와 동일한 구성으로 맞춤
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');

// EquipWindow/TitleText의 스프라이트 구성을 복제해 동일하게 부여
const ref = b.getComponent('EquipWindow/TitleText', 'MOD.Core.SpriteGUIRendererComponent');
const clone = JSON.parse(JSON.stringify(ref));
clone.RaycastTarget = true;
clone.Color = { r: 0, g: 0, b: 0, a: 0 };
b.upsertComponent('DecoWindow/TitleText', 'MOD.Core.SpriteGUIRendererComponent', clone);

b.write('ui/DefaultGroup.ui', { strict: false });
console.log('done');
