// 연막(4차) 전용 UI 엔티티 추가 - 퀵슬롯 쿨타임 오버레이 2개 + 우측 상단 버프바 아이콘 1세트(3자식).
// 기존 다크사이트 UI(DarkSightSlotCD_* / BuffBar/DarkSightIcon)를 그대로 복제해 RUID만 연막 아이콘으로 바꾼다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI_PATH = "ui/DefaultGroup.ui";
const SMOKE_ICON_RUID = "b944ae2274a04a1b96df2875368a8105"; // 연막 스킬 아이콘(카탈로그와 동일)

const b = UIBuilder.load(UI_PATH);

const clone = (v) => JSON.parse(JSON.stringify(v));
const comps = (path) => clone(b.find(path).jsonString["@components"]);
const pick = (list, type) => list.find((c) => c["@type"] === type);

// ── 1) 퀵슬롯 쿨타임 오버레이 (SkillBar/SmokeScreenSlotCD_Gray, _Text) ──
const srcGray = comps("SkillBar/DarkSightSlotCD_Gray");
const srcText = comps("SkillBar/DarkSightSlotCD_Text");

b.sprite("SkillBar/SmokeScreenSlotCD_Gray", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 50], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("SkillBar/SmokeScreenSlotCD_Gray", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcGray, "MOD.Core.SpriteGUIRendererComponent"));

b.sprite("SkillBar/SmokeScreenSlotCD_Text", {
  anchor: "middle-center", pos: [-224, 40], rect_size: [50, 20], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("SkillBar/SmokeScreenSlotCD_Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("SkillBar/SmokeScreenSlotCD_Text", "MOD.Core.TextComponent",
  pick(srcText, "MOD.Core.TextComponent"));

// ── 2) 버프바 아이콘 (BuffBar/SmokeScreenIcon + GrayOverlay / Icon / Text) ──
const srcIconRoot = comps("BuffBar/DarkSightIcon");
const srcBuffGray = comps("BuffBar/DarkSightIcon/GrayOverlay");
const srcBuffIcon = comps("BuffBar/DarkSightIcon/Icon");
const srcBuffText = comps("BuffBar/DarkSightIcon/Text");

b.empty("BuffBar/SmokeScreenIcon", {
  anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("BuffBar/SmokeScreenIcon", "MOD.Core.CanvasGroupComponent",
  pick(srcIconRoot, "MOD.Core.CanvasGroupComponent"));

b.sprite("BuffBar/SmokeScreenIcon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SmokeScreenIcon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcBuffGray, "MOD.Core.SpriteGUIRendererComponent"));

const buffIconSpr = pick(srcBuffIcon, "MOD.Core.SpriteGUIRendererComponent");
buffIconSpr.ImageRUID = { DataId: SMOKE_ICON_RUID };
b.sprite("BuffBar/SmokeScreenIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SmokeScreenIcon/Icon", "MOD.Core.SpriteGUIRendererComponent", buffIconSpr);

b.sprite("BuffBar/SmokeScreenIcon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SmokeScreenIcon/Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcBuffText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("BuffBar/SmokeScreenIcon/Text", "MOD.Core.TextComponent",
  pick(srcBuffText, "MOD.Core.TextComponent"));

// ── 3) 저장 + .mlua 프로퍼티 UUID 주입 ──
// ⚠ strict:false 고정 - strict 실패 시 .ui 파일이 손상/삭제되는 사고가 두 번 있었다(프로젝트 규칙).
b.write(UI_PATH, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/SmokeScreenCooldownUI.mlua", {
  grayOverlay: "SkillBar/SmokeScreenSlotCD_Gray",
  countdownText: "SkillBar/SmokeScreenSlotCD_Text",
});
b.injectBindings("RootDesk/MyDesk/UI/SmokeScreenBuffUI.mlua", {
  buffIconGroup: "BuffBar/SmokeScreenIcon",
  grayOverlay: "BuffBar/SmokeScreenIcon/GrayOverlay",
  countdownText: "BuffBar/SmokeScreenIcon/Text",
});

console.log("done:",
  b.getId("SkillBar/SmokeScreenSlotCD_Gray"),
  b.getId("SkillBar/SmokeScreenSlotCD_Text"),
  b.getId("BuffBar/SmokeScreenIcon"));
