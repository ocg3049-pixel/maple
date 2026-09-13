// 기사 소환: 퀵슬롯 쿨타임 2개 엔티티와 우측 상단 버프 아이콘 3개 엔티티를 UIBuilder로 추가한다.
const fs = require("fs");
const { UIBuilder } = require("/Users/florence/Desktop/.agents/skills/msw-ui-system/scripts/msw_ui_builder.cjs");
const UI = "ui/DefaultGroup.ui";
fs.copyFileSync(UI, ".builder-work/DefaultGroup.ui.knight-summon.bak");
const b = UIBuilder.load(UI);
const ICON_RUID = "ec65789e35b34c90bdf883a51c76a720";
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";

function spriteComp(ruid, color, type, fillMethod, fillAmount) {
  return {
    "@type": "MOD.Core.SpriteGUIRendererComponent",
    AnimClipPlayType: 0, EndFrameIndex: 2147483647, IgnoreMapLayerCheck: false,
    ImageRUID: { DataId: ruid }, LocalPosition: { x: 0, y: 0 }, LocalScale: { x: 1, y: 1 },
    MaterialId: "", OrderInLayer: 0, OverrideSorting: false, PlayRate: 1, PreserveSprite: 0,
    SortingLayer: "UI", StartFrameIndex: 0, Color: color, DropShadow: false,
    DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
    FillAmount: fillAmount, FillCenter: true, FillClockWise: true, FillMethod: fillMethod, FillOrigin: 0,
    FlipX: false, FlipY: false, FrameColumn: 1, FrameRate: 0, FrameRow: 1,
    Outline: false, OutlineColor: { r: 0, g: 0, b: 0, a: 1 }, OutlineWidth: 3,
    RaycastTarget: false, Type: type, Enable: true,
  };
}

function textComp(fontSize) {
  return {
    "@type": "MOD.Core.TextComponent", Alignment: 4, AllowAutomaticTranslation: true,
    BestFit: false, Bold: false, ConstraintX: 100, ConstraintY: 100, DropShadow: false,
    DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
    Font: 0, FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: fontSize,
    IgnoreMapLayerCheck: false, IsLocalizationKey: false, MaxSize: 40, MinSize: 10,
    OrderInLayer: 0, OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
    OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1, Overflow: 0, OverrideSorting: false,
    Padding: { left: 0, right: 0, top: 0, bottom: 0 }, SizeFit: false, SortingLayer: "UI",
    Text: "", UseConstraintX: false, UseConstraintY: false, UseOutLine: true, Enable: true,
  };
}

const CD_GRAY = "SkillBar/KnightSummonSlotCD_Gray";
const CD_TEXT = "SkillBar/KnightSummonSlotCD_Text";
b.empty(CD_GRAY, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], enable: false });
b.upsertComponent(CD_GRAY, "MOD.Core.SpriteGUIRendererComponent", spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.65 }, 0, 1, 1));
b.empty(CD_TEXT, { anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], enable: false });
b.upsertComponent(CD_TEXT, "MOD.Core.SpriteGUIRendererComponent", spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(CD_TEXT, "MOD.Core.TextComponent", textComp(22));

const ROOT = "BuffBar/KnightSummonIcon";
b.empty(ROOT, { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent(ROOT, "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent", BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.empty(ROOT + "/GrayOverlay", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent", spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.4 }, 3, 1, 0));
b.empty(ROOT + "/Icon", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/Icon", "MOD.Core.SpriteGUIRendererComponent", spriteComp(ICON_RUID, { r: 1, g: 1, b: 1, a: 1 }, 0, 0, 1));
b.empty(ROOT + "/Text", { anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], enable: true });
b.upsertComponent(ROOT + "/Text", "MOD.Core.SpriteGUIRendererComponent", spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(ROOT + "/Text", "MOD.Core.TextComponent", textComp(20));
b.patch(ROOT + "/GrayOverlay", { display_order: 0 });
b.patch(ROOT + "/Icon", { display_order: 1 });
b.patch(ROOT + "/Text", { display_order: 2 });

b.write(UI, { strict: false });
b.injectBindings("RootDesk/MyDesk/UI/KnightSummonCooldownUI.mlua", {
  grayOverlay: CD_GRAY, countdownText: CD_TEXT,
});
b.injectBindings("RootDesk/MyDesk/UI/KnightSummonBuffUI.mlua", {
  buffIconGroup: ROOT, grayOverlay: ROOT + "/GrayOverlay", countdownText: ROOT + "/Text",
});
console.log(JSON.stringify({
  cooldownGray: b.getId(CD_GRAY), cooldownText: b.getId(CD_TEXT),
  buffRoot: b.getId(ROOT), buffGray: b.getId(ROOT + "/GrayOverlay"), buffText: b.getId(ROOT + "/Text"),
}, null, 2));
