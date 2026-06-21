const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');

// MesoIcon: 64×26 → 80×32 (40×16 원본의 2배)
// anchoredPosition x:10 유지, 오른쪽 끝 x:10+80=90
const iconPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon';
b.upsertComponent(iconPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 10, y: -16 },
    OffsetMax: { x: 90, y: 16 },
    anchoredPosition: { x: 10, y: 0 },
});

// MesoText: x:82 → x:98 (아이콘 오른쪽 끝 90 + 여백 8)
const textPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText';
b.upsertComponent(textPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 98, y: -19 },
    OffsetMax: { x: 338, y: 19 },
    anchoredPosition: { x: 98, y: 0 },
});

b.write('./ui/DefaultGroup.ui');
console.log('완료: MesoIcon 80×32, MesoText x:98으로 수정');
