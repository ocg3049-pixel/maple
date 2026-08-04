// 드래곤 블러드 버프바 아이콘: /ui/DefaultGroup/BuffBar/DragonBloodIcon
// 구성은 기존 SixDragonsIcon / HealerSummonIcon 과 동일(빈 루트 + CanvasGroup + 오버레이/아이콘/텍스트).
const fs = require("fs");
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI = "ui/DefaultGroup.ui";
fs.copyFileSync(UI, ".builder-work/DefaultGroup.ui.bak");

const ROOT = "BuffBar/DragonBloodIcon";
// 아이콘: 시전 마지막 프레임(17번)을 임시 아이콘으로 재사용(요청).
const ICON_RUID = "4bd903c41887458f9ccf1aa20aa46181";
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

b.empty(ROOT, { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent(ROOT, "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent",
  BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.empty(ROOT + "/GrayOverlay", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.4 }, 3, 1, 0));
b.empty(ROOT + "/Icon", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/Icon", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(ICON_RUID, { r: 1, g: 1, b: 1, a: 1 }, 0, 0, 1));
b.empty(ROOT + "/Text", { anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], enable: true });
b.upsertComponent(ROOT + "/Text", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(ROOT + "/Text", "MOD.Core.TextComponent", {
  "@type": "MOD.Core.TextComponent",
  Alignment: 4, AllowAutomaticTranslation: true, BestFit: false, Bold: false,
  ConstraintX: 100, ConstraintY: 100,
  DropShadow: false, DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
  Font: 0, FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: 20,
  IgnoreMapLayerCheck: false, IsLocalizationKey: false, MaxSize: 40, MinSize: 10, OrderInLayer: 0,
  OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
  OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1,
  Overflow: 0, OverrideSorting: false,
  Padding: { left: 0, right: 0, top: 0, bottom: 0 },
  SizeFit: false, SortingLayer: "UI", Text: "",
  UseConstraintX: false, UseConstraintY: false, UseOutLine: true, Enable: true,
});
b.patch(ROOT + "/GrayOverlay", { display_order: 0 });
b.patch(ROOT + "/Icon", { display_order: 1 });
b.patch(ROOT + "/Text", { display_order: 2 });

// ⚠ strict:false 필수 - 기존 DefaultGroup.ui에 이미 lint 에러가 있어 strict면 예외+파일 손상 위험.
b.write(UI, {
  strict: false,
  bind: {
    mlua: "RootDesk/MyDesk/UI/DragonBloodBuffUI.mlua",
    props: {
      buffIconGroup: ROOT,
      grayOverlay: ROOT + "/GrayOverlay",
      countdownText: ROOT + "/Text",
    },
  },
});
console.log("DragonBloodIcon =", b.getId(ROOT));
