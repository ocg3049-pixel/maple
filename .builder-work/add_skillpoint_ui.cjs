// 스킬창 우측 위 "SKILL POINT" 구간 + 스킬 카드별 "+" 버튼 추가.
// 기존 스킬창 UI 규약을 그대로 따른다:
//   - 배경 = SpriteGUIRenderer(패널 스킨 RUID 4fea64a3...) 단독 엔티티
//   - 라벨 = 투명 스프라이트(ImageRUID "" + alpha 0) + MOD.Core.TextComponent
//     (알파 0이 아니면 빈 RUID여도 Color로 단색 렌더돼 아래를 덮는다)
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI_PATH = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const PANEL_RUID = "4fea64a3307cda641809ad8be0d4890b"; // 탭/카드가 쓰는 9-slice 패널 스킨

function textComp(text, opts) {
  const o = opts || {};
  return {
    "@type": "MOD.Core.TextComponent",
    Alignment: o.alignment === undefined ? 4 : o.alignment, // 4 = MiddleCenter
    AllowAutomaticTranslation: true,
    BestFit: false,
    Bold: o.bold === undefined ? true : o.bold,
    ConstraintX: 100,
    ConstraintY: 100,
    DropShadow: false,
    DropShadowAngle: 120,
    DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 },
    DropShadowDistance: 3,
    Font: 0,
    FontColor: o.color,
    FontSize: o.size === undefined ? 13 : o.size,
    IgnoreMapLayerCheck: false,
    IsLocalizationKey: false,
    MaxSize: 40,
    MinSize: 10,
    OrderInLayer: 0,
    OutlineColor: { r: 0.698, g: 0.698, b: 0.698, a: 1 },
    OutlineDistance: { x: 1, y: -1 },
    OutlineWidth: 1,
    Overflow: 0,
    OverrideSorting: false,
    Padding: { left: 0, right: 0, top: 0, bottom: 0 },
    SizeFit: false,
    SortingLayer: "UI",
    Text: text,
    UseConstraintX: false,
    UseConstraintY: false,
    UseOutLine: false,
    Enable: true,
  };
}

const b = UIBuilder.read(UI_PATH);

// ── 1. 우측 위 스킬 포인트 구간 (책 제목 행 y=174의 빈 오른쪽 공간) ──────────
//    SkillBookTitle이 x -235..-15를 쓰므로 그 오른쪽은 비어 있다.
//    탭 오른쪽 끝(262)에 맞춰 값 상자를 끝낸다.
b.sprite("SkillWindow/SkillPointLabelBG", {
  pos: [155, 174], rect_size: [102, 24],
  image_ruid: PANEL_RUID, sprite_type: 1,
  color: { r: 0.141, g: 0.165, b: 0.22, a: 0.9 }, // 비활성 탭과 같은 짙은 슬레이트
});
b.sprite("SkillWindow/SkillPointLabel", {
  pos: [155, 174], rect_size: [102, 24],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 },
});
b.upsertComponent("SkillWindow/SkillPointLabel", "MOD.Core.TextComponent",
  textComp("SKILL POINT", { size: 11, color: { r: 0.85, g: 0.87, b: 0.9, a: 1 } }));

b.sprite("SkillWindow/SkillPointBoxBG", {
  pos: [237, 174], rect_size: [50, 24],
  image_ruid: PANEL_RUID, sprite_type: 1,
  color: { r: 0.957, g: 0.961, b: 0.969, a: 1 }, // 원작처럼 흰 숫자 상자
});
b.sprite("SkillWindow/SkillPointValue", {
  pos: [237, 174], rect_size: [50, 24],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 },
});
b.upsertComponent("SkillWindow/SkillPointValue", "MOD.Core.TextComponent",
  textComp("0", { size: 15, color: { r: 0.15, g: 0.18, b: 0.24, a: 1 } }));

// ── 2. 카드별 "+" 버튼 (카드 로컬 좌표, 254x64 카드의 오른쪽 아래) ───────────
//    포인트를 분배할 수 있는 스킬일 때만 스크립트가 켠다(기본 꺼짐).
for (let i = 1; i <= 10; i++) {
  const base = "SkillWindow/SkillCard" + i;
  b.sprite(base + "/PlusBG", {
    pos: [112, -14], rect_size: [22, 22],
    image_ruid: PANEL_RUID, sprite_type: 1,
    color: { r: 0.20, g: 0.62, b: 0.83, a: 1.0 }, // 활성 탭과 같은 하늘색
    enable: false,
  });
  b.sprite(base + "/PlusLabel", {
    pos: [112, -14], rect_size: [22, 22],
    image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 },
    enable: false,
  });
  b.upsertComponent(base + "/PlusLabel", "MOD.Core.TextComponent",
    textComp("+", { size: 18, color: { r: 1, g: 1, b: 1, a: 1 } }));
}

// .ui write는 반드시 strict:false (strict 실패 시 파일이 삭제된 전례가 있다)
b.write(UI_PATH, { strict: false });

const after = UIBuilder.read(UI_PATH);
for (const p of [
  "SkillWindow/SkillPointLabelBG", "SkillWindow/SkillPointLabel",
  "SkillWindow/SkillPointBoxBG", "SkillWindow/SkillPointValue",
  "SkillWindow/SkillCard1/PlusBG", "SkillWindow/SkillCard1/PlusLabel",
  "SkillWindow/SkillCard10/PlusBG", "SkillWindow/SkillCard10/PlusLabel",
]) {
  const e = after.find(p);
  console.log(p, "=>", e ? "OK " + e.componentNames : "*** MISSING ***");
}
