const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('./ui/DefaultGroup.ui');

// MesoIcon: 앵커/피벗을 middle-left (0, 0.5)로 명시 + RectSize 추가
// anchoredPosition.x = left edge 위치 (MesoBar 왼쪽 기준)
// 80x32 = 원본 40x16의 2배
const iconPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon';
b.upsertComponent(iconPath, 'MOD.Core.UITransformComponent', {
    AnchorsMin: { x: 0, y: 0.5 },
    AnchorsMax: { x: 0, y: 0.5 },
    Pivot: { x: 0, y: 0.5 },
    anchoredPosition: { x: 10, y: 0 },
    OffsetMin: { x: 10, y: -16 },
    OffsetMax: { x: 90, y: 16 },
    RectSize: { x: 80, y: 32 },
});

b.write('./ui/DefaultGroup.ui');
console.log('완료: MesoIcon 앵커(middle-left) + RectSize(80×32) 설정');
