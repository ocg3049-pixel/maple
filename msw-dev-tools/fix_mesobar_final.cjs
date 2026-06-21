const { UIBuilder } = require('./.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');

const b = UIBuilder.read('./ui/DefaultGroup.ui');

// MesoIcon: 64×26 (40×16 비율 ×1.6) — 3aa44934989f48c596076258d86b9c61용
// anchoredPosition x:10, OffsetMin {x:10,y:-13} OffsetMax {x:74,y:13}
const iconPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoIcon';
b.upsertComponent(iconPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 10, y: -13 },
    OffsetMax: { x: 74, y: 13 },
    anchoredPosition: { x: 10, y: 0 },
});

// MesoText: x:82 시작, 기본 Text = "" (깜빡임 방지)
const textPath = '/ui/DefaultGroup/InvenWindow/MesoBar/MesoText';
b.upsertComponent(textPath, 'MOD.Core.UITransformComponent', {
    OffsetMin: { x: 82, y: -19 },
    OffsetMax: { x: 322, y: 19 },
    anchoredPosition: { x: 82, y: 0 },
});
b.upsertComponent(textPath, 'MOD.Core.TextComponent', {
    Text: '',
});

b.write('./ui/DefaultGroup.ui');
console.log('MesoBar .ui 수정 완료:');
console.log('  MesoIcon: 64×26 (OffsetMin x:10,y:-13 → OffsetMax x:74,y:13)');
console.log('  MesoText: anchoredPosition x:82, 기본 Text=""');
