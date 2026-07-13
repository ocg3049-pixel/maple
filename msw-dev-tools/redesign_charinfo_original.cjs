// 캐릭터정보창(C) 원작 스타일 리디자인 (9.png 참조)
// - 유니온/무릉도장/인기도/길드/연합/하이퍼스탯/어빌리티/스탯 화살표 없음 (요청사항)
// - 기존 Label_*/StatVal_* 엔티티 경로 유지 (CharInfoManager.sv()가 그대로 동작)
const { UIBuilder } = require(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
);

const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
const W = "CharInfoWindow/";
const D = W + "DetailPanel/";

const RUID = { DataId: "4fea64a3307cda641809ad8be0d4890b" }; // 공용 흰색 placeholder
const NAVY_WINDOW = { r: 0.090, g: 0.106, b: 0.157, a: 0.97 };  // 창 본체
const NAVY_TITLE  = { r: 0.067, g: 0.078, b: 0.118, a: 1 };     // 타이틀바
const BOX_LIGHT   = { r: 0.227, g: 0.255, b: 0.314, a: 0.92 };  // 밝은 스탯 박스
const BOX_DARK    = { r: 0.106, g: 0.125, b: 0.176, a: 0.9 };   // 어두운 스탯 박스
const HEADER_BG   = { r: 0.137, g: 0.161, b: 0.216, a: 1 };     // STAT 헤더/DETAIL 바
const TOP_LIGHT   = { r: 0.804, g: 0.827, b: 0.863, a: 0.95 };  // 상단 아바타 영역
const YELLOW      = "#FFE44D";   // 타이틀
const GOLD        = "#F5B93C";   // 전투력 숫자
const LABEL_W     = "#FFFFFF";
const VALUE_C     = "#E8EAEE";
const SUB_BLUE    = "#9FB4CC";

// ── 창/타이틀 ──────────────────────────────────────────────
b.patchComponent(W + "BG", "MOD.Core.SpriteGUIRendererComponent", { Color: NAVY_WINDOW, ImageRUID: RUID });
b.sprite(W + "TitleBarBG", { anchor: "middle-center", pos: [0, 440], rect_size: [650, 56], color: "#111420", image_ruid: RUID.DataId });
b.patchComponent(W + "TitleBarBG", "MOD.Core.SpriteGUIRendererComponent", { Color: NAVY_TITLE });
b.patch(W + "TitleText", { pos: [-190, 440], rect_size: [260, 56] });
b.patchComponent(W + "TitleText", "MOD.Core.TextComponent", {
  Text: "CHARACTER INFO", FontColor: { r: 1, g: 0.894, b: 0.302, a: 1 }, FontSize: 17, Bold: true, Alignment: 3,
});
b.patch(W + "TitleText/DragHandle", { rect_size: [540, 56] });
b.patch(W + "CloseCharInfo", { pos: [300, 440], rect_size: [40, 40] });
b.patchComponent(W + "CloseCharInfo", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 1, g: 1, b: 1, a: 0 } });
b.patchComponent(W + "CloseCharInfo", "MOD.Core.TextComponent", { Text: "×", FontColor: { r: 0.78, g: 0.8, b: 0.84, a: 1 }, FontSize: 24, Bold: true, Alignment: 4 });
b.patchComponent(W + "TitleDivider", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 1, g: 1, b: 1, a: 0 } });

// ── 상단 아바타 영역 (라이트 패널 + 배지들) ─────────────────
b.sprite(W + "TopPanel", { anchor: "middle-center", pos: [0, 215], rect_size: [610, 385], color: "#CDD3DC", image_ruid: RUID.DataId });
b.patchComponent(W + "TopPanel", "MOD.Core.SpriteGUIRendererComponent", { Color: TOP_LIGHT });

// Lv 배지 (LevelClassText 재활용 — mlua UpdateLevelClass가 "Lv.N" 기록)
b.patch(W + "LevelClassText", { pos: [0, 385], rect_size: [110, 27] });
b.patchComponent(W + "LevelClassText", "MOD.Core.TextComponent", { FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 14, Bold: true, Alignment: 4 });
b.patchComponent(W + "LevelClassText", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 0.125, g: 0.161, b: 0.231, a: 0.95 }, ImageRUID: RUID });

// 직업 배지 (신규 — mlua UpdateLevelClass가 "초보자" 기록)
b.text(W + "ClassBadgeText", "초보자", { anchor: "middle-center", pos: [-218, 385], rect_size: [150, 28], size: 14, alignment: 4, color: "#2A3140" });
b.patchComponent(W + "ClassBadgeText", "MOD.Core.TextComponent", { Bold: true });
b.patchComponent(W + "ClassBadgeText", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 0.62, g: 0.667, b: 0.725, a: 0.9 }, ImageRUID: RUID });

// 이름 배지 (파란 캡슐 — mlua UpdateCharName이 텍스트 기록)
b.patch(W + "CharNameText", { pos: [0, 52], rect_size: [180, 30] });
b.patchComponent(W + "CharNameText", "MOD.Core.TextComponent", { FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 15, Bold: true, Alignment: 4 });
b.patchComponent(W + "CharNameText", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 0.247, g: 0.733, b: 0.878, a: 1 }, ImageRUID: RUID });

// DETAIL 토글 바 (텍스트는 mlua가 "▲/▼ 세부 정보" 기록)
b.patch(W + "DetailToggleBtn", { pos: [0, -22], rect_size: [610, 34] });
b.patchComponent(W + "DetailToggleBtn", "MOD.Core.SpriteGUIRendererComponent", { Color: HEADER_BG, ImageRUID: RUID });
b.patchComponent(W + "DetailToggleBtn", "MOD.Core.TextComponent", { FontColor: { r: 0.624, g: 0.706, b: 0.8, a: 1 }, FontSize: 13, Bold: true, Alignment: 4 });
b.patchComponent(W + "ToggleDivider", "MOD.Core.SpriteGUIRendererComponent", { Color: { r: 1, g: 1, b: 1, a: 0 } });

// ── DetailPanel: STAT 헤더 + 전투력 + 박스 3단 ───────────────
// 박스 배경 (신규)
b.sprite(D + "StatHeaderBG", { anchor: "middle-center", pos: [0, 200], rect_size: [620, 24], color: "#232936", image_ruid: RUID.DataId });
b.patchComponent(D + "StatHeaderBG", "MOD.Core.SpriteGUIRendererComponent", { Color: HEADER_BG });
b.text(D + "StatHeaderText", "STAT", { anchor: "middle-center", pos: [0, 200], rect_size: [620, 24], size: 12, alignment: 4, color: SUB_BLUE });
b.patchComponent(D + "StatHeaderText", "MOD.Core.TextComponent", { Bold: true });

b.sprite(D + "CombatRowBG", { anchor: "middle-center", pos: [0, 163], rect_size: [620, 42], color: "#1B2029", image_ruid: RUID.DataId });
b.patchComponent(D + "CombatRowBG", "MOD.Core.SpriteGUIRendererComponent", { Color: BOX_DARK });
b.sprite(D + "Box1BG", { anchor: "middle-center", pos: [0, 92], rect_size: [620, 96], color: "#3A4150", image_ruid: RUID.DataId });
b.patchComponent(D + "Box1BG", "MOD.Core.SpriteGUIRendererComponent", { Color: BOX_LIGHT });
b.sprite(D + "Box2BG", { anchor: "middle-center", pos: [0, -13], rect_size: [620, 120], color: "#1E242F", image_ruid: RUID.DataId });
b.patchComponent(D + "Box2BG", "MOD.Core.SpriteGUIRendererComponent", { Color: BOX_DARK });
b.sprite(D + "Box3BG", { anchor: "middle-center", pos: [0, -135], rect_size: [620, 92], color: "#3A4150", image_ruid: RUID.DataId });
b.patchComponent(D + "Box3BG", "MOD.Core.SpriteGUIRendererComponent", { Color: BOX_LIGHT });

// 전투력 행
b.patch(D + "Label_Combat", { pos: [-235, 163], rect_size: [150, 42] });
b.patch(D + "StatVal_Combat", { pos: [60, 163], rect_size: [400, 42] });

// 공용 스타일 함수는 못 쓰니 (CJS 직렬 실행) 라벨/값 스타일·위치를 표로 일괄 적용
// [엔티티, x, y, w, 정렬(3=좌/5=우/4=중앙)]
const L = [
  // Box1: HP|MP / STR|DEX / INT|LUK
  ["Label_HP",  -230, 122, 120, 3], ["StatVal_HP",  -115, 122, 170, 5],
  ["Label_MP",    85, 122, 120, 3], ["StatVal_MP",   215, 122, 170, 5],
  ["Label_STR", -230,  92, 120, 3], ["StatVal_STR", -115,  92, 170, 5],
  ["Label_DEX",   85,  92, 120, 3], ["StatVal_DEX",  215,  92, 170, 5],
  ["Label_INT", -230,  62, 120, 3], ["StatVal_INT", -115,  62, 170, 5],
  ["Label_LUK",   85,  62, 120, 3], ["StatVal_LUK",  215,  62, 170, 5],
  // Box2: 좌(공격력/방어율무시/재사용감소/재사용미적용) 우(데미지/크확/크뎀/공속)
  ["Label_StatATK",   -212,  32, 175, 3], ["StatVal_StatATK",   -90,  32, 120, 5],
  ["Label_DefIgnore", -212,   2, 175, 3], ["StatVal_DefIgnore", -90,   2, 120, 5],
  ["Label_CDReduce",  -212, -28, 175, 3], ["StatVal_CDReduce",  -90, -28, 120, 5],
  ["Label_CDImmune",  -212, -58, 175, 3], ["StatVal_CDImmune",  -90, -58, 120, 5],
  ["Label_TotalDmg",    98,  32, 155, 3], ["StatVal_TotalDmg",  235,  32, 130, 5],
  ["Label_CritRate",    98,   2, 155, 3], ["StatVal_CritRate",  235,   2, 130, 5],
  ["Label_CritDmg",     98, -28, 155, 3], ["StatVal_CritDmg",   235, -28, 130, 5],
  ["Label_AtkSpeed",    98, -58, 155, 3], ["StatVal_AtkSpeed",  235, -58, 130, 5],
  // Box3: 메소/드롭/경험치 (좌측 컬럼)
  ["Label_Meso",     -212, -107, 175, 3], ["StatVal_Meso",     -90, -107, 120, 5],
  ["Label_Drop",     -212, -135, 175, 3], ["StatVal_Drop",     -90, -135, 120, 5],
  ["Label_ExpBonus", -212, -163, 175, 3], ["StatVal_ExpBonus", -90, -163, 120, 5],
];
for (const [name, x, y, w, al] of L) {
  b.patch(D + name, { pos: [x, y], rect_size: [w, 26] });
  const isLabel = name.startsWith("Label_");
  b.patchComponent(D + name, "MOD.Core.TextComponent", {
    Alignment: al, FontSize: 13, Bold: isLabel,
    FontColor: isLabel ? { r: 1, g: 1, b: 1, a: 1 } : { r: 0.91, g: 0.918, b: 0.933, a: 1 },
  });
}
// 전투력 스타일 (표 이후 덮어쓰기)
b.patchComponent(D + "Label_Combat", "MOD.Core.TextComponent", { Alignment: 3, FontSize: 15, Bold: true, FontColor: { r: 1, g: 1, b: 1, a: 1 } });
b.patchComponent(D + "StatVal_Combat", "MOD.Core.TextComponent", { Alignment: 4, FontSize: 24, Bold: true, FontColor: { r: 0.961, g: 0.725, b: 0.235, a: 1 } });

// 라벨 문구를 원작 표기로
b.patchComponent(D + "Label_CritRate", "MOD.Core.TextComponent", { Text: "크리티컬 확률" });
b.patchComponent(D + "Label_CritDmg",  "MOD.Core.TextComponent", { Text: "크리티컬 데미지" });
b.patchComponent(D + "Label_CDReduce", "MOD.Core.TextComponent", { Text: "재사용 대기시간 감소" });
b.patchComponent(D + "Label_CDImmune", "MOD.Core.TextComponent", { Text: "재사용 대기시간 미적용" });
b.patchComponent(D + "Label_Meso",     "MOD.Core.TextComponent", { Text: "메소 획득량" });
b.patchComponent(D + "Label_Drop",     "MOD.Core.TextComponent", { Text: "아이템 드롭률" });
b.patchComponent(D + "Label_ExpBonus", "MOD.Core.TextComponent", { Text: "추가 경험치 획득" });

// ── displayOrder 정리 (배경 → 콘텐츠) ────────────────────────
b.patch(W + "BG", { display_order: 0 });
b.patch(W + "TopPanel", { display_order: 1 });
b.patch(W + "TitleBarBG", { display_order: 2 });
b.patch(W + "TitleText", { display_order: 5 });
b.patch(W + "CloseCharInfo", { display_order: 6 });
b.patch(W + "AvatarImage", { display_order: 6 });
b.patch(W + "LevelClassText", { display_order: 7 });
b.patch(W + "ClassBadgeText", { display_order: 7 });
b.patch(W + "CharNameText", { display_order: 7 });
b.patch(W + "DetailToggleBtn", { display_order: 5 });
b.patch(W + "DetailPanel", { display_order: 8 });
const boxOrder = { StatHeaderBG: 0, CombatRowBG: 0, Box1BG: 0, Box2BG: 0, Box3BG: 0, StatHeaderText: 5 };
for (const [n, o] of Object.entries(boxOrder)) b.patch(D + n, { display_order: o });
for (const [name] of L) b.patch(D + name, { display_order: 10 });
b.patch(D + "Label_Combat", { display_order: 10 });
b.patch(D + "StatVal_Combat", { display_order: 10 });

// ⚠️ 절대 규칙: strict:false (기존 22개 무관 lint 에러로 인한 파일 삭제 방지)
b.write(P, { strict: false });
console.log("CHARINFO REDESIGN OK");
