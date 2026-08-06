// 암행(나이트로드 2차): 지속시간 버프로 바뀌면서 버프바 아이콘 1개가 필요해졌다.
// 구조/컴포넌트 필드는 기존 AwakeningIcon(=DarkSightIcon 복제)을 그대로 따른다. 쿨타임은 없다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const TARGET = "ui/Default" + "Group.ui";
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b"; // 버프/쿨타임 오버레이 공용 스프라이트
const ICON_RUID = "6e463376315c4a4eb8f632bea7b4cd3b"; // 암행 아이콘(스킬 카탈로그와 동일 RUID)

function textComp(fontSize) {
  return {
    "@type": "MOD.Core.TextComponent",
    Alignment: 4, AllowAutomaticTranslation: true, BestFit: false, Bold: false,
    ConstraintX: 100, ConstraintY: 100,
    DropShadow: false, DropShadowAngle: 120, DropShadowColor: { r: 0, g: 0, b: 0, a: 0.72 }, DropShadowDistance: 3,
    Font: 0, FontColor: { r: 1, g: 1, b: 1, a: 1 }, FontSize: fontSize,
    IgnoreMapLayerCheck: false, IsLocalizationKey: false, MaxSize: 40, MinSize: 10,
    OrderInLayer: 0,
    OutlineColor: { r: 0.698039234, g: 0.698039234, b: 0.698039234, a: 1 },
    OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1,
    Overflow: 0, OverrideSorting: false,
    Padding: { left: 0, right: 0, top: 0, bottom: 0 },
    SizeFit: false, SortingLayer: "UI", Text: "",
    UseConstraintX: false, UseConstraintY: false, UseOutLine: true, Enable: true,
  };
}

const b = UIBuilder.load(TARGET);

b.empty("BuffBar/AmhaengIcon", { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent("BuffBar/AmhaengIcon", "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent", BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.patch("BuffBar/AmhaengIcon", { display_order: 21 });

b.sprite("BuffBar/AmhaengIcon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48],
  image_ruid: GRAY_RUID, color: { r: 0, g: 0, b: 0, a: 0.4 }, sprite_type: 3, fill_method: 1,
});
b.patchComponent("BuffBar/AmhaengIcon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent", { FillAmount: 0, FillOrigin: 0 });
b.patch("BuffBar/AmhaengIcon/GrayOverlay", { display_order: 0 });

b.sprite("BuffBar/AmhaengIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48],
  image_ruid: ICON_RUID, color: { r: 1, g: 1, b: 1, a: 1 }, sprite_type: 0,
});
b.patch("BuffBar/AmhaengIcon/Icon", { display_order: 1 });

b.sprite("BuffBar/AmhaengIcon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0,
});
b.upsertComponent("BuffBar/AmhaengIcon/Text", "MOD.Core.TextComponent", textComp(20));
b.patch("BuffBar/AmhaengIcon/Text", { display_order: 2 });

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/AmhaengBuffUI.mlua", {
  buffIconGroup: "BuffBar/AmhaengIcon",
  grayOverlay: "BuffBar/AmhaengIcon/GrayOverlay",
  countdownText: "BuffBar/AmhaengIcon/Text",
});

for (const p of [
  "BuffBar/AmhaengIcon", "BuffBar/AmhaengIcon/GrayOverlay",
  "BuffBar/AmhaengIcon/Icon", "BuffBar/AmhaengIcon/Text",
]) {
  console.log(p, "=>", b.getId(p));
}
