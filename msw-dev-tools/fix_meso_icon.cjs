const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = UIBuilder.read('./ui/DefaultGroup.ui');

// MesoIcon: RectSize 32×32 → 64×26 (40×16 비율 ×1.6)
// 앵커 x:0, y:0.5 / 피벗 x:0, y:0.5 / anchoredPosition (10, 0)
// OffsetMin = {x: anchoredPos.x, y: -height/2} = {x:10, y:-13}
// OffsetMax = {x: anchoredPos.x + width, y: height/2} = {x:74, y:13}
const iconPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon';
b.upsertComponent(iconPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 10, y: -13 },
    OffsetMax: { x: 74, y: 13 },
    anchoredPosition: { x: 10, y: 0 },
});

// MesoText: anchoredPosition x: 50 → 82 (MesoIcon 오른쪽 끝 74 + 여백 8)
// OffsetMin.x = 82, OffsetMax.x = 82 + 240 = 322
const textPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText';
b.upsertComponent(textPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 82, y: -19 },
    OffsetMax: { x: 322, y: 19 },
    anchoredPosition: { x: 82, y: 0 },
});

b.write('./ui/DefaultGroup.ui');
console.log('MesoIcon 크기 및 MesoText 위치 수정 완료');
console.log('MesoIcon: 32×32 → 64×26 (비율 유지)');
console.log('MesoText anchoredPosition.x: 50 → 82');
