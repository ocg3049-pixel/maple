// 마크 오브 어쌔신(나이트로드 1차 토글): 활성화 표시용 버프바 아이콘 1개.
// 구조는 AmhaengIcon을 따르되 무기한 토글이라 오버레이/카운트다운 없이 아이콘만 둔다.
const { UIBuilder } = require("../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const TARGET = "ui/Default" + "Group.ui";
const ICON_RUID = "5e8e76cb9d2e49fda8ce7c22a39146a4"; // 마크 오브 어쌔신 1차 아이콘(스킬 카탈로그와 동일)

const b = UIBuilder.load(TARGET);

b.empty("BuffBar/MarkIcon", { anchor: "middle-center", pos: [32, 0], rect_size: [56, 56], enable: false });
b.upsertComponent("BuffBar/MarkIcon", "MOD.Core.CanvasGroupComponent", {
  "@type": "MOD.Core.CanvasGroupComponent", BlocksRaycasts: false, GroupAlpha: 1, Interactable: false, Enable: true,
});
b.patch("BuffBar/MarkIcon", { display_order: 22 });

b.sprite("BuffBar/MarkIcon/Icon", {
  anchor: "middle-center", pos: [0, 0], rect_size: [48, 48],
  image_ruid: ICON_RUID, color: { r: 1, g: 1, b: 1, a: 1 }, sprite_type: 0,
});
b.patch("BuffBar/MarkIcon/Icon", { display_order: 1 });

// ⚠ .ui write는 무조건 strict:false (strict 실패 시 파일이 삭제되는 사고가 두 번 있었다).
b.write(TARGET, { strict: false });

b.injectBindings("RootDesk/MyDesk/UI/MarkBuffUI.mlua", {
  buffIconGroup: "BuffBar/MarkIcon",
});

for (const p of ["BuffBar/MarkIcon", "BuffBar/MarkIcon/Icon"]) {
  console.log(p, "=>", b.getId(p));
}
