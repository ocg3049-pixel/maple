// 엔젤레이 투사체 모델 생성 - IronArrowProjectile.model과 동일 구성(Transform + SpriteRenderer
// MapLayer0/5 + DamageSkinSetting(Alpha 0 - 수동 데미지 표시라 자동 스킨 숨김) + 스크립트 2종),
// 스프라이트만 업로드한 엔젤레이 ball(4d01ad5c...)로 교체.
const path = require("path");
const SKILL_ROOT = "/Users/florence/Desktop/.claude/skills/msw-general";
const { ModelBuilder } = require(path.join(SKILL_ROOT, "scripts/model/msw_model_builder.cjs"));

const b = ModelBuilder.fromTemplate(
  path.join(SKILL_ROOT, "models", "TransformOnly.model"),
  "AngelRayProjectile"
);
b.component("MOD.Core.SpriteRendererComponent")
  .value("MOD.Core.SpriteRendererComponent", "SpriteRUID", "4d01ad5c78c14a8fb954fb76713048c4", "string")
  .value("MOD.Core.SpriteRendererComponent", "SortingLayer", "MapLayer0", "string")
  .value("MOD.Core.SpriteRendererComponent", "OrderInLayer", 5, "int")
  .component("MOD.Core.DamageSkinSettingComponent")
  .value("MOD.Core.DamageSkinSettingComponent", "Enable", true, "bool")
  .value("MOD.Core.DamageSkinSettingComponent", "Alpha", 0, "float")
  .component("script.AngelRayProjectile")
  .component("script.AngelRayProjectileAttack")
  .write("/Users/florence/Desktop/RootDesk/MyDesk/Models/Skills/AngelRayProjectile.model");
console.log(JSON.stringify(b.snapshot(), null, 1));
