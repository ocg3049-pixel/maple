// 샤프 아이즈(신궁 4차) 버프바 아이콘 추가 - 암행2 아이콘 추가 스크립트와 동일한 절차로
// 기존 버프 아이콘(BuffBar/BattojutsuIcon)의 컴포넌트를 복제한 뒤 아이콘 RUID만 바꾼다.
//   · 아이콘 = 원본 팩 skill/15003.img/skill/150038002("쓸만한 샤프 아이즈")의 icon 스프라이트
//     RUID 7a580dfd67ed4a679314449c722c2399
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI_PATH = "ui/DefaultGroup.ui";
const ICON_RUID = "7a580dfd67ed4a679314449c722c2399";
const b = UIBuilder.load(UI_PATH);

const clone = (v) => JSON.parse(JSON.stringify(v));
const comps = (path) => clone(b.find(path).jsonString["@components"]);
const pick = (list, type) => list.find((c) => c["@type"] === type);

const srcRoot = comps("BuffBar/BattojutsuIcon");
const srcGray = comps("BuffBar/BattojutsuIcon/GrayOverlay");
const srcIcon = comps("BuffBar/BattojutsuIcon/Icon");
const srcText = comps("BuffBar/BattojutsuIcon/Text");

b.empty("BuffBar/SharpEyesIcon", {
  anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("BuffBar/SharpEyesIcon", "MOD.Core.CanvasGroupComponent",
  pick(srcRoot, "MOD.Core.CanvasGroupComponent"));

b.sprite("BuffBar/SharpEyesIcon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SharpEyesIcon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcGray, "MOD.Core.SpriteGUIRendererComponent"));

b.sprite("BuffBar/SharpEyesIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SharpEyesIcon/Icon", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcIcon, "MOD.Core.SpriteGUIRendererComponent"));
// 복제 원본(발도술)의 아이콘 RUID를 샤프 아이즈 것으로 교체한다.
b.patchComponent("BuffBar/SharpEyesIcon/Icon", "MOD.Core.SpriteGUIRendererComponent",
  { ImageRUID: { DataId: ICON_RUID } });

b.sprite("BuffBar/SharpEyesIcon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/SharpEyesIcon/Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("BuffBar/SharpEyesIcon/Text", "MOD.Core.TextComponent",
  pick(srcText, "MOD.Core.TextComponent"));

// ⚠ strict:false 고정 - strict 실패 시 .ui 파일이 손상/삭제되는 사고가 두 번 있었다(프로젝트 규칙).
b.write(UI_PATH, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/SharpEyesBuffUI.mlua", {
  buffIconGroup: "BuffBar/SharpEyesIcon",
  grayOverlay: "BuffBar/SharpEyesIcon/GrayOverlay",
  countdownText: "BuffBar/SharpEyesIcon/Text",
});

console.log("done:", b.getId("BuffBar/SharpEyesIcon"));
