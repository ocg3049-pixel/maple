// 캐릭터정보창 비율 조정: 아바타 영역 축소(과하게 큰 캐릭터 이미지), 스탯 영역 확대 (원작 9.png 비율)
const { UIBuilder } = require(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
);
const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
const W = "CharInfoWindow/";
const D = W + "DetailPanel/";

// ── 상단 영역 축소 ──
b.patch(W + "TopPanel", { pos: [0, 272], rect_size: [610, 265] });
b.patch(W + "LevelClassText", { pos: [0, 391] });
b.patch(W + "ClassBadgeText", { pos: [-218, 391] });
b.patch(W + "AvatarImage", { pos: [0, 285], rect_size: [140, 200] });
b.patch(W + "CharNameText", { pos: [0, 162] });
b.patch(W + "DetailToggleBtn", { pos: [0, 107] });

// ── DetailPanel 확대: (0,-180) 630×540, 행 간격 40으로 여유있게 ──
b.patch(D.slice(0, -1), { pos: [0, -180], rect_size: [630, 540] });
b.patch(D + "StatHeaderBG", { pos: [0, 252] });
b.patch(D + "StatHeaderText", { pos: [0, 252] });
b.patch(D + "CombatRowBG", { pos: [0, 210], rect_size: [620, 46] });
b.patch(D + "Label_Combat", { pos: [-235, 210], rect_size: [150, 46] });
b.patch(D + "StatVal_Combat", { pos: [60, 210], rect_size: [400, 46] });
b.patch(D + "Box1BG", { pos: [0, 122], rect_size: [620, 130] });
b.patch(D + "Box2BG", { pos: [0, -30], rect_size: [620, 160] });
b.patch(D + "Box3BG", { pos: [0, -172], rect_size: [620, 110] });

// [엔티티, x, y, w] — 정렬/폰트는 이전 패스에서 이미 적용됨(위치만 이동)
const L = [
  // Box1: rows +162,+122,+82
  ["Label_HP",  -230, 162, 120], ["StatVal_HP",  -115, 162, 170],
  ["Label_MP",    85, 162, 120], ["StatVal_MP",   215, 162, 170],
  ["Label_STR", -230, 122, 120], ["StatVal_STR", -115, 122, 170],
  ["Label_DEX",   85, 122, 120], ["StatVal_DEX",  215, 122, 170],
  ["Label_INT", -230,  82, 120], ["StatVal_INT", -115,  82, 170],
  ["Label_LUK",   85,  82, 120], ["StatVal_LUK",  215,  82, 170],
  // Box2: rows +30,-10,-50,-90
  ["Label_StatATK",   -212,  30, 175], ["StatVal_StatATK",   -90,  30, 120],
  ["Label_DefIgnore", -212, -10, 175], ["StatVal_DefIgnore", -90, -10, 120],
  ["Label_CDReduce",  -212, -50, 175], ["StatVal_CDReduce",  -90, -50, 120],
  ["Label_CDImmune",  -212, -90, 175], ["StatVal_CDImmune",  -90, -90, 120],
  ["Label_TotalDmg",    98,  30, 155], ["StatVal_TotalDmg",  235,  30, 130],
  ["Label_CritRate",    98, -10, 155], ["StatVal_CritRate",  235, -10, 130],
  ["Label_CritDmg",     98, -50, 155], ["StatVal_CritDmg",   235, -50, 130],
  ["Label_AtkSpeed",    98, -90, 155], ["StatVal_AtkSpeed",  235, -90, 130],
  // Box3: rows -136,-172,-208
  ["Label_Meso",     -212, -136, 175], ["StatVal_Meso",     -90, -136, 120],
  ["Label_Drop",     -212, -172, 175], ["StatVal_Drop",     -90, -172, 120],
  ["Label_ExpBonus", -212, -208, 175], ["StatVal_ExpBonus", -90, -208, 120],
];
for (const [name, x, y, w] of L) {
  b.patch(D + name, { pos: [x, y], rect_size: [w, 26] });
}

// ⚠️ 절대 규칙: strict:false
b.write(P, { strict: false });
console.log("PROPORTION FIX OK");
