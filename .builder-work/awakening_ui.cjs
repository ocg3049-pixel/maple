// 각성(나이트로드 4차): 버프바 아이콘 1개 + 퀵슬롯 쿨타임 오버레이 2개를 DefaultGroup에 추가한다.
// 구조/컴포넌트 필드는 기존 DarkSightIcon(버프바) / DarkDragonSlotCD_*(쿨타임)을 그대로 복제했다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const TARGET = "ui/Default" + "Group.ui";
const GRAY_RUID = "4fea64a3307cda641809ad8be0d4890b"; // 버프/쿨타임 오버레이 공용 스프라이트
const ICON_RUID = "c4d0b2dadd064a1c885896527b2e0f5f"; // skill/421.img/skill/4210015/icon (어드밴스드 다크 사이트)

// DarkSightIcon/Text 의 TextComponent 필드를 그대로 복제한다(FontSize만 인자).
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

// ── ① 버프바 아이콘 (지속 10~39초 표시 + 우클릭 취소 판정 대상) ──────────────
b.empty("BuffBar/AwakeningIcon", { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent("BuffBar/AwakeningIcon", "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent", BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.patch("BuffBar/AwakeningIcon", { display_order: 20 });

b.sprite("BuffBar/AwakeningIcon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48],
  image_ruid: GRAY_RUID, color: { r: 0, g: 0, b: 0, a: 0.4 }, sprite_type: 3, fill_method: 1,
});
b.patchComponent("BuffBar/AwakeningIcon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent", { FillAmount: 0, FillOrigin: 0 });
b.patch("BuffBar/AwakeningIcon/GrayOverlay", { display_order: 0 });

b.sprite("BuffBar/AwakeningIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48],
  image_ruid: ICON_RUID, color: { r: 1, g: 1, b: 1, a: 1 }, sprite_type: 0,
});
b.patch("BuffBar/AwakeningIcon/Icon", { display_order: 1 });

b.sprite("BuffBar/AwakeningIcon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0,
});
b.upsertComponent("BuffBar/AwakeningIcon/Text", "MOD.Core.TextComponent", textComp(20));
b.patch("BuffBar/AwakeningIcon/Text", { display_order: 2 });

// ── ② 퀵슬롯 쿨타임 오버레이 (5분) ────────────────────────────────────────
// 저장은 Simple(Type 0)로 두고 런타임에 Filled/Vertical로 바꾼다(프로젝트 공통 규칙).
b.sprite("SkillBar/AwakeningSlotCD_Gray", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50],
  image_ruid: GRAY_RUID, color: { r: 0, g: 0, b: 0, a: 0.65 }, sprite_type: 0, fill_method: 1, enable: false,
});
b.patchComponent("SkillBar/AwakeningSlotCD_Gray", "MOD.Core.SpriteGUIRendererComponent", { FillAmount: 1, FillOrigin: 0 });
b.patch("SkillBar/AwakeningSlotCD_Gray", { display_order: 78 });

b.sprite("SkillBar/AwakeningSlotCD_Text", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20],
  image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 }, sprite_type: 0, enable: false,
});
b.upsertComponent("SkillBar/AwakeningSlotCD_Text", "MOD.Core.TextComponent", textComp(22));
b.patch("SkillBar/AwakeningSlotCD_Text", { display_order: 79 });

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });

// UUID 바인딩 주입 - 새로 만든 두 Logic 스크립트의 property 기본값을 채운다.
b.injectBindings("RootDesk/MyDesk/UI/AwakeningBuffUI.mlua", {
  buffIconGroup: "BuffBar/AwakeningIcon",
  grayOverlay: "BuffBar/AwakeningIcon/GrayOverlay",
  countdownText: "BuffBar/AwakeningIcon/Text",
});
b.injectBindings("RootDesk/MyDesk/UI/AwakeningCooldownUI.mlua", {
  grayOverlay: "SkillBar/AwakeningSlotCD_Gray",
  countdownText: "SkillBar/AwakeningSlotCD_Text",
});

for (const p of [
  "BuffBar/AwakeningIcon", "BuffBar/AwakeningIcon/GrayOverlay",
  "BuffBar/AwakeningIcon/Icon", "BuffBar/AwakeningIcon/Text",
  "SkillBar/AwakeningSlotCD_Gray", "SkillBar/AwakeningSlotCD_Text",
]) {
  console.log(p, "=>", b.getId(p));
}
