const { UIBuilder } = require('/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.load('/Users/florence/Desktop/ui/DefaultGroup.ui');

const TAB_NAMES = ['EnhanceTab_Starforce','EnhanceTab_Scroll','EnhanceTab_AddOption','EnhanceTab_Potential','EnhanceTab_Additional'];

TAB_NAMES.forEach(name => {
    const tabBGPath = 'EnhanceWindow/LeftPanel/' + name + '/TabBG';
    // TabBG 스프라이트에 RaycastTarget=true 설정 (클릭 감지 위해 필수)
    b.patchComponent(tabBGPath, 'MOD.Core.SpriteGUIRendererComponent', {
        RaycastTarget: true,
    });
    console.log('✓ RaycastTarget=true: ' + tabBGPath);
});

b.write('/Users/florence/Desktop/ui/DefaultGroup.ui', { strict: false });
console.log('\n✓ DefaultGroup.ui 저장 완료');
