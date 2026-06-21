const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = UIBuilder.read('./ui/DefaultGroup.ui');

// MesoIcon: 64×26 → 32×32 (금색동전 28×24 비율 유지, AspectOnly 사용)
// anchoredPosition x:10, pivot/anchor x:0 y:0.5 → OffsetMin {x:10,y:-16} OffsetMax {x:42,y:16}
const iconPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon';
b.upsertComponent(iconPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 10, y: -16 },
    OffsetMax: { x: 42, y: 16 },
    anchoredPosition: { x: 10, y: 0 },
});

// MesoText: 아이콘 오른쪽 끝 42 + 여백 8 = 50 시작
// OffsetMin.x = 50, OffsetMax.x = 50 + 240 = 290
const textPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText';
b.upsertComponent(textPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 50, y: -19 },
    OffsetMax: { x: 290, y: 19 },
    anchoredPosition: { x: 50, y: 0 },
});

b.write('./ui/DefaultGroup.ui');
console.log('MesoIcon: 64×26 → 32×32, MesoText x: 82 → 50 완료');
