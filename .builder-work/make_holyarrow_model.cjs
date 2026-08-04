// 홀리 에로우 투사체 모델 생성 - AngelRayProjectile.model과 동일 구성, 스프라이트만 홀리 에로우
// ball0(d8275b54...)으로 교체(ball1/2는 런타임에 SpriteRUID 순환 교체).
const path = require("path");
const SKILL_ROOT = "/Users/florence/Desktop/.claude/skills/msw-general";
const { ModelBuilder } = require(path.join(SKILL_ROOT, "scripts/model/msw_model_builder.cjs"));

const b = ModelBuilder.fromTemplate(
  path.join(SKILL_ROOT, "models", "TransformOnly.model"),
  "HolyArrowProjectile"
);
b.component("MOD.Core.SpriteRendererComponent")
  .value("MOD.Core.SpriteRendererComponent", "SpriteRUID", "d8275b5454a84af580d7dc865ae7ada0", "string")
  .value("MOD.Core.SpriteRendererComponent", "SortingLayer", "MapLayer0", "string")
  .value("MOD.Core.SpriteRendererComponent", "OrderInLayer", 5, "int")
  .component("MOD.Core.DamageSkinSettingComponent")
  .value("MOD.Core.DamageSkinSettingComponent", "Enable", true, "bool")
  .value("MOD.Core.DamageSkinSettingComponent", "Alpha", 0, "float")
  .component("script.HolyArrowProjectile")
  .component("script.HolyArrowProjectileAttack")
  .write("/Users/florence/Desktop/RootDesk/MyDesk/Models/Skills/HolyArrowProjectile.model");
console.log("OK", JSON.stringify(b.listComponents()));
