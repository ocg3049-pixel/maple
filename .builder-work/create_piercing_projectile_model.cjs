// 피어싱(신궁 3차) 관통 화살 모델 - 스나이핑 화살 모델(SnipingProjectile.model)을 복제해
// 스크립트 컴포넌트만 피어싱 것으로 갈아끼운다.
//   · SpriteRUID = 원본 팩 skill/322.img/skill/3221017의 ball 클립(1923e540…)
//     ⚠ 스나이핑은 단계별로 서버가 SpriteRUID를 갈아끼우지만 피어싱은 단계가 없어 모델 값 고정이다.
const path = require("path");
const { ModelBuilder, vector3 } = require("../.claude/skills/msw-general/scripts/model/msw_model_builder.cjs");

const SRC = "RootDesk/MyDesk/Models/Skills/SnipingProjectile.model";
const OUT = "RootDesk/MyDesk/Models/Skills/PiercingProjectile.model";
const BALL_RUID = "1923e5406af44149a7575b25593e9336";

const b = ModelBuilder.read(SRC);
b.renameModel("PiercingProjectile", "piercingprojectile");

// 스나이핑 전용 스크립트 → 피어싱 스크립트로 교체.
b.removeComponent("script.SnipingProjectile");
b.removeComponent("script.SnipingProjectileAttack");
b.component("script.PiercingProjectile");
b.component("script.PiercingProjectileAttack");

// 화살 아트 교체(피어싱 ball 클립).
b.value("MOD.Core.SpriteRendererComponent", "SpriteRUID", BALL_RUID, "string");
// 스나이핑보다 살짝 크게 - 위아래 판정이 넓은 스킬이라 화살도 그만큼 두껍게 보이도록.
b.value("MOD.Core.TransformComponent", "Scale", vector3(0.6, 0.6, 1), "vector3");

b.write(OUT);
console.log(JSON.stringify(b.snapshot(), null, 1));
