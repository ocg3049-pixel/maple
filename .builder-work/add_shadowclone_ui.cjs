// 분신 소환 전용 UI 추가 - 우측 상단 버프바 아이콘 1세트 + 퀵슬롯 "위치 교환" 쿨타임 오버레이 2개.
// 기존 암행 버프 아이콘 / 다크사이트 쿨타임 오버레이를 그대로 복제하고 아이콘 RUID만 분신 소환 것으로 바꾼다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI_PATH = "ui/DefaultGroup.ui";
const CLONE_ICON_RUID = "c6ce60523c954791af5632da796cca7c"; // 분신 소환 아이콘(카탈로그와 동일)

const b = UIBuilder.load(UI_PATH);
const clone = (v) => JSON.parse(JSON.stringify(v));
const comps = (path) => clone(b.find(path).jsonString["@components"]);
const pick = (list, type) => list.find((c) => c["@type"] === type);

// ── 1) 버프바 아이콘 (BuffBar/ShadowCloneIcon + GrayOverlay / Icon / Text) ──
const srcRoot = comps("BuffBar/AmhaengIcon");
const srcGray = comps("BuffBar/AmhaengIcon/GrayOverlay");
const srcIcon = comps("BuffBar/AmhaengIcon/Icon");
const srcText = comps("BuffBar/AmhaengIcon/Text");

b.empty("BuffBar/ShadowCloneIcon", {
  anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("BuffBar/ShadowCloneIcon", "MOD.Core.CanvasGroupComponent",
  pick(srcRoot, "MOD.Core.CanvasGroupComponent"));

b.sprite("BuffBar/ShadowCloneIcon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/ShadowCloneIcon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcGray, "MOD.Core.SpriteGUIRendererComponent"));

const buffIconSpr = pick(srcIcon, "MOD.Core.SpriteGUIRendererComponent");
buffIconSpr.ImageRUID = { DataId: CLONE_ICON_RUID };
b.sprite("BuffBar/ShadowCloneIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/ShadowCloneIcon/Icon", "MOD.Core.SpriteGUIRendererComponent", buffIconSpr);

b.sprite("BuffBar/ShadowCloneIcon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/ShadowCloneIcon/Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("BuffBar/ShadowCloneIcon/Text", "MOD.Core.TextComponent",
  pick(srcText, "MOD.Core.TextComponent"));

// ── 2) 퀵슬롯 "위치 교환" 쿨타임 오버레이 ──
const srcCdGray = comps("SkillBar/DarkSightSlotCD_Gray");
const srcCdText = comps("SkillBar/DarkSightSlotCD_Text");

b.sprite("SkillBar/ShadowCloneSwapCD_Gray", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("SkillBar/ShadowCloneSwapCD_Gray", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcCdGray, "MOD.Core.SpriteGUIRendererComponent"));

b.sprite("SkillBar/ShadowCloneSwapCD_Text", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("SkillBar/ShadowCloneSwapCD_Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcCdText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("SkillBar/ShadowCloneSwapCD_Text", "MOD.Core.TextComponent",
  pick(srcCdText, "MOD.Core.TextComponent"));

// ⚠ strict:false 고정 - strict 실패 시 .ui 파일이 손상/삭제되는 사고가 두 번 있었다(프로젝트 규칙).
b.write(UI_PATH, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/ShadowCloneBuffUI.mlua", {
  buffIconGroup: "BuffBar/ShadowCloneIcon",
  grayOverlay: "BuffBar/ShadowCloneIcon/GrayOverlay",
  countdownText: "BuffBar/ShadowCloneIcon/Text",
});
b.injectBindings("RootDesk/MyDesk/UI/ShadowCloneSwapCooldownUI.mlua", {
  grayOverlay: "SkillBar/ShadowCloneSwapCD_Gray",
  countdownText: "SkillBar/ShadowCloneSwapCD_Text",
});

console.log("done:", b.getId("BuffBar/ShadowCloneIcon"), b.getId("SkillBar/ShadowCloneSwapCD_Gray"));
