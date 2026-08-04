// 힐러 소환 버프바 아이콘: /ui/DefaultGroup/BuffBar/HealerSummonIcon 을 만든다.
// 기존 용사 소환 아이콘(HeroSummonIcon)의 컴포넌트 구성을 그대로 복제하되,
// UIGroupComponent(루트 아래 그룹 = lint L029)는 넣지 않고 CanvasGroup만 붙인다
// (스크립트가 쓰는 건 Enable + CanvasGroupComponent 둘뿐).
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const fs = require("fs");
const UI = "ui/DefaultGroup.ui";
// 안전장치: 쓰기 전에 현재 파일을 백업해 둔다(write 실패 시 파일이 손상될 수 있다는 프로젝트 경험).
fs.copyFileSync(UI, ".builder-work/DefaultGroup.ui.bak");
const ROOT = "BuffBar/HealerSummonIcon";
// 아이콘 이미지: 힐 스킬 아이콘(임시 - 전용 아이콘이 생기면 교체 가능)
const ICON_RUID = "44b70137422f425eb486eb7cc5a92aec";
// 회색 쿨/지속 오버레이 스프라이트(다른 버프 아이콘과 동일)
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b";

const b = UIBuilder.load(UI);

b.empty(ROOT, { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent(ROOT, "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent",
  BlocksRaycasts: false,
  GroupAlpha: 1,
  Interactable: false,
  Enable: true,
});

function spriteComp(ruid, color, type, fillMethod, fillAmount) {
  return {
    "@type": "MOD.Core.SpriteGUIRendererComponent",
    AnimClipPlayType: 0,
    EndFrameIndex: 2147483647,
    IgnoreMapLayerCheck: false,
    ImageRUID: { DataId: ruid },
    LocalPosition: { x: 0, y: 0 },
    LocalScale: { x: 1, y: 1 },
    MaterialId: "",
    OrderInLayer: 0,
    OverrideSorting: false,
    PlayRate: 1,
    PreserveSprite: 0,
    SortingLayer: "UI",
    StartFrameIndex: 0,
    Color: color,
    DropShadow: false,
    DropShadowAngle: 120,
    DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 },
    DropShadowDistance: 3,
    FillAmount: fillAmount,
    FillCenter: true,
    FillClockWise: true,
    FillMethod: fillMethod,
    FillOrigin: 0,
    FlipX: false,
    FlipY: false,
    FrameColumn: 1,
    FrameRate: 0,
    FrameRow: 1,
    Outline: false,
    OutlineColor: { r: 0, g: 0, b: 0, a: 1 },
    OutlineWidth: 3,
    RaycastTarget: false,
    Type: type,
    Enable: true,
  };
}

// 회색 오버레이(경과 시간만큼 위에서 아래로 차오르는 Filled 스프라이트)
b.empty(ROOT + "/GrayOverlay", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(GRAY_RUID, { r: 0, g: 0, b: 0, a: 0.4 }, 3, 1, 0));

// 스킬 아이콘
b.empty(ROOT + "/Icon", { anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], enable: true });
b.upsertComponent(ROOT + "/Icon", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp(ICON_RUID, { r: 1, g: 1, b: 1, a: 1 }, 0, 0, 1));

// 남은 시간 텍스트(투명 배경 스프라이트 + TextComponent - 다른 버프 아이콘과 동일 규격)
b.empty(ROOT + "/Text", { anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], enable: true });
b.upsertComponent(ROOT + "/Text", "MOD.Core.SpriteGUIRendererComponent",
  spriteComp("", { r: 1, g: 1, b: 1, a: 0 }, 0, 0, 1));
b.upsertComponent(ROOT + "/Text", "MOD.Core.TextComponent", {
  "@type": "MOD.Core.TextComponent",
  Alignment: 4,
  AllowAutomaticTranslation: true,
  BestFit: false,
  Bold: false,
  ConstraintX: 100,
  ConstraintY: 100,
  DropShadow: false,
  DropShadowAngle: 120,
  DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 },
  DropShadowDistance: 3,
  Font: 0,
  FontColor: { r: 1, g: 1, b: 1, a: 1 },
  FontSize: 20,
  IgnoreMapLayerCheck: false,
  IsLocalizationKey: false,
  MaxSize: 40,
  MinSize: 10,
  OrderInLayer: 0,
  OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
  OutlineDistance: { x: 1, y: -1 },
  OutlineWidth: 1,
  Overflow: 0,
  OverrideSorting: false,
  Padding: { left: 0, right: 0, top: 0, bottom: 0 },
  SizeFit: false,
  SortingLayer: "UI",
  Text: "",
  UseConstraintX: false,
  UseConstraintY: false,
  UseOutLine: true,
  Enable: true,
});

// 형제 아이콘들과 같은 겹침 순서(오버레이 → 아이콘 → 텍스트)
b.patch(ROOT + "/GrayOverlay", { display_order: 0 });
b.patch(ROOT + "/Icon", { display_order: 1 });
b.patch(ROOT + "/Text", { display_order: 2 });

// ⚠ strict:false 필수 - 기존 DefaultGroup.ui에는 이미 lint 에러(루트 아래 UIGroup 등)가 있어
//   strict로 쓰면 예외가 나고 파일이 손상될 수 있다(프로젝트 규칙).
b.write(UI, {
  strict: false,
  bind: {
    mlua: "RootDesk/MyDesk/UI/HealerSummonBuffUI.mlua",
    props: {
      buffIconGroup: ROOT,
      grayOverlay: ROOT + "/GrayOverlay",
      countdownText: ROOT + "/Text",
    },
  },
});

console.log("HealerSummonIcon id =", b.getId(ROOT));
console.log("GrayOverlay     id =", b.getId(ROOT + "/GrayOverlay"));
console.log("Text            id =", b.getId(ROOT + "/Text"));
