// 암행2(섀도어 3차) 버프바 아이콘 추가 - 암행1(BuffBar/AmhaengIcon)을 그대로 복제한다.
// 두 버프는 서로 독립이라 동시에 켜질 수 있으므로 아이콘도 별개 엔티티여야 한다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const UI_PATH = "ui/DefaultGroup.ui";
const b = UIBuilder.load(UI_PATH);

const clone = (v) => JSON.parse(JSON.stringify(v));
const comps = (path) => clone(b.find(path).jsonString["@components"]);
const pick = (list, type) => list.find((c) => c["@type"] === type);

const srcRoot = comps("BuffBar/AmhaengIcon");
const srcGray = comps("BuffBar/AmhaengIcon/GrayOverlay");
const srcIcon = comps("BuffBar/AmhaengIcon/Icon");
const srcText = comps("BuffBar/AmhaengIcon/Text");

b.empty("BuffBar/Amhaeng2Icon", {
  anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], pivot: [0.5, 0.5], enable: false,
});
b.upsertComponent("BuffBar/Amhaeng2Icon", "MOD.Core.CanvasGroupComponent",
  pick(srcRoot, "MOD.Core.CanvasGroupComponent"));

b.sprite("BuffBar/Amhaeng2Icon/GrayOverlay", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/Amhaeng2Icon/GrayOverlay", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcGray, "MOD.Core.SpriteGUIRendererComponent"));

// 아이콘 RUID는 암행1과 같은 것을 쓴다(카탈로그도 동일 - 전용 아이콘이 생기면 여기만 바꾸면 된다).
b.sprite("BuffBar/Amhaeng2Icon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/Amhaeng2Icon/Icon", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcIcon, "MOD.Core.SpriteGUIRendererComponent"));

b.sprite("BuffBar/Amhaeng2Icon/Text", {
  anchor: "middle-center", pos: [0, 3], rect_size: [48, 20], pivot: [0.5, 0.5], enable: true,
});
b.upsertComponent("BuffBar/Amhaeng2Icon/Text", "MOD.Core.SpriteGUIRendererComponent",
  pick(srcText, "MOD.Core.SpriteGUIRendererComponent"));
b.upsertComponent("BuffBar/Amhaeng2Icon/Text", "MOD.Core.TextComponent",
  pick(srcText, "MOD.Core.TextComponent"));

// ⚠ strict:false 고정 - strict 실패 시 .ui 파일이 손상/삭제되는 사고가 두 번 있었다(프로젝트 규칙).
b.write(UI_PATH, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/Amhaeng2BuffUI.mlua", {
  buffIconGroup: "BuffBar/Amhaeng2Icon",
  grayOverlay: "BuffBar/Amhaeng2Icon/GrayOverlay",
  countdownText: "BuffBar/Amhaeng2Icon/Text",
});

console.log("done:", b.getId("BuffBar/Amhaeng2Icon"));
