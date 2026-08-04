// 표창+ 선택 링 UI. 캐릭터 주변에 표창 아이콘 9개가 원형으로 뜨고, 옆에 눌러야 할 번호가 붙는다.
// DefaultGroup(2400+ 엔티티)에 덧붙이면 조용히 누락되는 사례가 있어 전용 그룹 파일로 분리한다.
const { UIBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs");

const OUT = "/Users/florence/Desktop/ui/ShurikenSelectGroup.ui";
const PANEL_RUID = "4fea64a3307cda641809ad8be0d4890b"; // 프로젝트 공용 9-slice 패널 스킨

// 기존 창들과 같은 규약: 라벨 = 투명 스프라이트(ImageRUID "" + alpha 0) + MOD.Core.TextComponent
function textComp(text, opts) {
  const o = opts || {};
  return {
    "@type": "MOD.Core.TextComponent",
    Alignment: 4, AllowAutomaticTranslation: true, BestFit: false,
    Bold: o.bold === undefined ? true : o.bold,
    ConstraintX: 100, ConstraintY: 100,
    DropShadow: true, DropShadowAngle: 120,
    DropShadowColor: { r: 0, g: 0, b: 0, a: 0.85 }, DropShadowDistance: 2,
    Font: 0, FontColor: o.color, FontSize: o.size === undefined ? 13 : o.size,
    IgnoreMapLayerCheck: false, IsLocalizationKey: false,
    MaxSize: 40, MinSize: 10, OrderInLayer: 0,
    OutlineColor: { r: 0, g: 0, b: 0, a: 1 },
    OutlineDistance: { x: 1, y: -1 }, OutlineWidth: 1,
    Overflow: 0, OverrideSorting: false,
    Padding: { left: 0, right: 0, top: 0, bottom: 0 },
    SizeFit: false, SortingLayer: "UI", Text: text,
    UseConstraintX: false, UseConstraintY: false, UseOutLine: false, Enable: true,
  };
}

const b = new UIBuilder("ShurikenSelectGroup", 60, true);

// Ring: 실제로 켜고 끄는 컨테이너. 런타임에 캐릭터의 화면 위치로 옮겨 다닌다.
// 파일에는 꺼진 상태로 저장한다(하위에 @Component가 없어 disabled-group 함정에 걸리지 않는다).
b.empty("Ring", { anchor: "middle-center", pos: [0, 0], rect_size: [400, 400], enable: false });

// 남은 시간(3초 카운트다운) - 링 위쪽
b.sprite("Ring/Countdown", { pos: [0, 168], rect_size: [120, 26], image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 } });
b.upsertComponent("Ring/Countdown", "MOD.Core.TextComponent",
  textComp("3.0", { size: 18, color: { r: 1, g: 0.85, b: 0.35, a: 1 } }));

// 표창 9종을 반지름 128px 원 위에 배치(12시부터 시계방향).
const R = 128;
for (let i = 1; i <= 9; i++) {
  const ang = (Math.PI / 2) - (i - 1) * (2 * Math.PI / 9);
  const x = Math.round(R * Math.cos(ang));
  const y = Math.round(R * Math.sin(ang));
  const s = "Ring/Slot" + i;

  b.empty(s, { pos: [x, y], rect_size: [52, 52] });
  // 아이콘 뒤 판때기. (요청) 회색 네모 대신 지정 리소스(cb4b8f34..., 72x108 animationclip)를
  // 비율 유지해 52x78로 넣는다. Frame을 Icon보다 먼저 만들어 표창 뒤에 그려지게 한다.
  b.sprite(s + "/Frame", { pos: [0, 0], rect_size: [52, 78],
    image_ruid: "cb4b8f3451bb4f0dab53327cce29c873", sprite_type: 0,
    color: { r: 1, g: 1, b: 1, a: 1 } });
  // (요청) 창이 열려 있는 동안 계속 반복 재생되어야 한다 - 기본값 Onetime(0)이면 한 번만 돌고 멈춘다.
  b.patchComponent(s + "/Frame", "MOD.Core.SpriteGUIRendererComponent", { AnimClipPlayType: 1 }); // Loop
  b.sprite(s + "/Icon", { pos: [0, 0], rect_size: [34, 34], image_ruid: "", color: { r: 1, g: 1, b: 1, a: 1 } });
  // 눌러야 할 번호 뱃지 (아이콘 오른쪽 아래)
  b.sprite(s + "/KeyBadge", { pos: [20, -19], rect_size: [22, 20], image_ruid: PANEL_RUID, sprite_type: 1,
    color: { r: 0.20, g: 0.62, b: 0.83, a: 1.0 } });
  b.sprite(s + "/KeyLabel", { pos: [20, -19], rect_size: [22, 20], image_ruid: "", color: { r: 1, g: 1, b: 1, a: 0 } });
  b.upsertComponent(s + "/KeyLabel", "MOD.Core.TextComponent",
    textComp(String(i), { size: 13, color: { r: 1, g: 1, b: 1, a: 1 } }));
}

// (요청) 표창을 고른 순간 고른 자리에서 1회 재생하는 이펙트(68x44 animationclip, 8프레임).
// 링과 함께 움직여야 하므로 Ring 아래에 두고, 고를 때 그 슬롯 좌표로 옮겨 켠다.
// "잘 보이게" 요청이라 원본(68x44)의 약 2배인 136x88로 키운다(비율 유지).
b.sprite("Ring/PickFx", { pos: [0, 0], rect_size: [136, 88],
  image_ruid: "0e35906499314071a510a886c92a1dde", sprite_type: 0,
  color: { r: 1, g: 1, b: 1, a: 1 }, enable: false });
b.patchComponent("Ring/PickFx", "MOD.Core.SpriteGUIRendererComponent", { AnimClipPlayType: 0 }); // Onetime

// .ui write는 반드시 strict:false (strict 실패 시 파일이 삭제된 전례가 있다)
b.write(OUT, { strict: false });

const after = UIBuilder.read(OUT);
console.log("엔티티 수:", after.listEntities().length);
for (const p of ["Ring", "Ring/Countdown", "Ring/Slot1/Icon", "Ring/Slot9/KeyLabel"]) {
  const e = after.find(p);
  console.log(p, "=>", e ? "OK" : "*** MISSING ***");
}
