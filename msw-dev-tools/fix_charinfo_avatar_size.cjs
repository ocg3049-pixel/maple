// 캐릭터정보창 아바타를 장비창 프리뷰와 동일 설정으로 (PreserveAvatar=AspectOnly, 130×170)
const { UIBuilder } = require(
  "/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs"
);
const P = "/Users/florence/Desktop/ui/DefaultGroup.ui";
const b = UIBuilder.read(P);
b.patch("CharInfoWindow/AvatarImage", { pos: [0, 288], rect_size: [130, 170] });
b.patchComponent("CharInfoWindow/AvatarImage", "MOD.Core.AvatarGUIRendererComponent", { PreserveAvatar: 1 });
// ⚠️ 절대 규칙: strict:false
b.write(P, { strict: false });
console.log("AVATAR SIZE OK");
