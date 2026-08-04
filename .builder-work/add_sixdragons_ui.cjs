// 용 소환(6마리) UI 2종을 DefaultGroup.ui에 추가한다.
//  1) BuffBar/SixDragonsIcon          - 지속시간(5분) 버프 아이콘 (HealerSummonIcon과 같은 구성)
//  2) SkillBar/SixDragonsSlotCD_Gray  - 퀵슬롯 쿨타임(10분) 오버레이 (DragonRidingSlotCD_* 복제)
//     SkillBar/SixDragonsSlotCD_Text
const fs = require("fs");
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI = "ui/DefaultGroup.ui";
fs.copyFileSync(UI, ".builder-work/DefaultGroup.ui.bak");

const b = UIBuilder.load(UI);

// ── 1) 버프바 아이콘 ────────────────────────────────────────────
const ICON_ROOT = "BuffBar/SixDragonsIcon";
const ICON_RUID = "84190342335e44ad98519eb58753eea0"; // 드래곤 라이딩 아이콘(임시 재사용)
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

function textComp(fontSize) {
  return {
    "@type": "MOD.Core.TextComponent",
    Alignment: 4, AllowAutomaticTranslation: true, BestFit: false, Bold: false,
    ConstraintX: 100, ConstraintY: 100,
    DropShadow: false, DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
    Font: 0, FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: fontSize,
    IgnoreMapLayerCheck: false, IsLocalizationKey: false, MaxSize: 40, MinSize: 10, OrderInLayer: 0,
    OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
    OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1,
    Overflow: 0, OverrideSorting: false,
    Padding: { left: 0, right: 0, top: 0, bottom: 0 },
    SizeFit: false, SortingLayer: "UI", Text: "",
    UseConstraintX: false, UseConstraintY: false, UseOutLine: true, Enable: true,
  };
}

b.empty(ICON_ROOT, { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent(ICON_ROOT, "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent",
  BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.empty(ICON_ROOT + "/GrayOverlay", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ICON_ROOT + "/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.4 }, 3, 1, 0));
b.empty(ICON_ROOT + "/Icon", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ICON_ROOT + "/Icon", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(ICON_RUID, { r: 1, g: 1, b: 1, a: 1 }, 0, 0, 1));
b.empty(ICON_ROOT + "/Text", { anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], enable: true });
b.upsertComponent(ICON_ROOT + "/Text", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(ICON_ROOT + "/Text", "MOD.Core.TextComponent", textComp(20));
b.patch(ICON_ROOT + "/GrayOverlay", { display_order: 0 });
b.patch(ICON_ROOT + "/Icon", { display_order: 1 });
b.patch(ICON_ROOT + "/Text", { display_order: 2 });

// ── 2) 퀵슬롯 쿨타임 오버레이 ───────────────────────────────────
// DragonRidingSlotCD_* 와 같은 규격(50x50 / 50x20, 시작 위치 [-224,40], enable=false).
// 오버레이는 .ui에 Filled로 저장하면 렌더링되지 않아 Simple(Type 0)로 저장하고
// 런타임에 SixDragonsCooldownUI가 Filled/Vertical로 바꾼다(프로젝트 공통 회피책).
const CD_GRAY = "SkillBar/SixDragonsSlotCD_Gray";
const CD_TEXT = "SkillBar/SixDragonsSlotCD_Text";

b.empty(CD_GRAY, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], enable: false });
b.upsertComponent(CD_GRAY, "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.65 }, 0, 1, 1));
b.empty(CD_TEXT, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], enable: false });
b.upsertComponent(CD_TEXT, "MOD.Core.SpriteGUIRendererComponent",
  spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(CD_TEXT, "MOD.Core.TextComponent", textComp(22));

// ⚠ strict:false 필수 - 기존 DefaultGroup.ui에 이미 lint 에러가 있어 strict면 예외+파일 손상 위험.
b.write(UI, {
  strict: false,
  bind: {
    mlua: "RootDesk/MyDesk/UI/SixDragonsBuffUI.mlua",
    props: {
      buffIconGroup: ICON_ROOT,
      grayOverlay: ICON_ROOT + "/GrayOverlay",
      countdownText: ICON_ROOT + "/Text",
    },
  },
});
b.injectBindings("RootDesk/MyDesk/UI/SixDragonsCooldownUI.mlua", {
  grayOverlay: CD_GRAY,
  countdownText: CD_TEXT,
});

console.log("BuffIcon  =", b.getId(ICON_ROOT));
console.log("CD_Gray   =", b.getId(CD_GRAY));
console.log("CD_Text   =", b.getId(CD_TEXT));
