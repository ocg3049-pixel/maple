// 홀리 매직쉘 퀵슬롯 쿨타임 오버레이/텍스트를 추가한다(SixDragonsSlotCD_* 와 동일 규격).
const fs = require("fs");
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI = "ui/DefaultGroup.ui";
fs.copyFileSync(UI, ".builder-work/DefaultGroup.ui.bak");

const CD_GRAY = "SkillBar/HolyShellSlotCD_Gray";
const CD_TEXT = "SkillBar/HolyShellSlotCD_Text";
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";

function spriteComp(ruid, color, type, fillMethod, fillAmount) {
  return {
    "@type": "MOD.Core.SpriteGUIRendererComponent",
    AnimClipPlayType: 0, EndFrameIndex: 2147483647, IgnoreMapLayerCheck: false,
    ImageRUID: { DataId: ruid },
    LocalPosition: { x: 0, y: 0 }, LocalScale: { x: 1, y: 1 },
    MaterialId: "", OrderInLayer: 0, OverrideSorting: false, PlayRate: 1,
    PreserveSprite: 0, SortingLayer: "UI", StartFrameIndex: 0,
    Color: color,
    DropShadow: false, DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
    FillAmount: fillAmount, FillCenter: true, FillClockWise: true, FillMethod: fillMethod, FillOrigin: 0,
    FlipX: false, FlipY: false, FrameColumn: 1, FrameRate: 0, FrameRow: 1,
    Outline: false, OutlineColor: { r: 0, g: 0, b: 0, a: 1 }, OutlineWidth: 3,
    RaycastTarget: false, Type: type, Enable: true,
  };
}

const b = UIBuilder.load(UI);

// ⚠ 오버레이는 Simple(Type 0)로 저장하고 런타임에 Filled/Vertical로 바꾼다(프로젝트 공통 회피책).
b.empty(CD_GRAY, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], enable: false });
b.upsertComponent(CD_GRAY, "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.65 }, 0, 1, 1));

b.empty(CD_TEXT, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], enable: false });
b.upsertComponent(CD_TEXT, "MOD.Core.SpriteGUIRendererComponent",
  spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(CD_TEXT, "MOD.Core.TextComponent", {
  "@type": "MOD.Core.TextComponent",
  Alignment: 4, AllowAutomaticTranslation: true, BestFit: false, Bold: false,
  ConstraintX: 100, ConstraintY: 100,
  DropShadow: false, DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
  Font: 0, FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 22,
  IgnoreMapLayerCheck: false, IsLocalizationKey: false, MaxSize: 40, MinSize: 10, OrderInLayer: 0,
  OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
  OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1,
  Overflow: 0, OverrideSorting: false,
  Padding: { left: 0, right: 0, top: 0, bottom: 0 },
  SizeFit: false, SortingLayer: "UI", Text: "",
  UseConstraintX: false, UseConstraintY: false, UseOutLine: true, Enable: true,
});

// ⚠ strict:false 필수 - 기존 파일에 이미 lint 에러가 있어 strict면 예외+파일 손상 위험.
b.write(UI, { strict: false });
b.injectBindings("RootDesk/MyDesk/UI/HolyMagicShellCooldownUI.mlua", {
  grayOverlay: CD_GRAY,
  countdownText: CD_TEXT,
});
console.log("CD_Gray =", b.getId(CD_GRAY));
console.log("CD_Text =", b.getId(CD_TEXT));
