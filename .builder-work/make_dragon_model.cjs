// 용 소환(6마리) 소환수 모델.
// 날아다니는 스프라이트 소환수라 Body는 없다(직접 Transform 이동 - Body 없는 엔티티만 허용).
// 몬스터에게 맞을 수 있어야 하므로 HitComponent를 단다(용사/힐러와 같은 규격).
const path = require("path");
const { ModelBuilder, vector2 } = require("/Users/florence/Desktop/.claude/skills/msw-general/scripts/model/msw_model_builder.cjs");

const SKILL_ROOT = "/Users/florence/Desktop/.claude/skills/msw-general";
const DST = "RootDesk/MyDesk/Models/Skills/SummonDragon.model";

const b = ModelBuilder.fromTemplate(
  path.join(SKILL_ROOT, "models", "TransformOnly.model"),
  "SummonDragon"
);

b.component("SpriteRendererComponent")
  .component("HitComponent")
  // 기본 클립: 1번 용(마뇽) 제자리 - 비어 있으면 화면에 안 보인다(platform.md §7).
  .value("MOD.Core.SpriteRendererComponent", "SpriteRUID", "b3c129ed24244b43bcc25dcc6e31513c", "string")
  .value("MOD.Core.SpriteRendererComponent", "SortingLayer", "MapLayer0", "string")
  .value("MOD.Core.SpriteRendererComponent", "OrderInLayer", 3, "int")
  // 피격 판정: 용사/힐러(0.5×0.8 / offset 0,0.4)보다 조금 넓게 - 날개 달린 큰 몸통.
  .value("MOD.Core.HitComponent", "IsLegacy", false, "bool")
  .value("MOD.Core.HitComponent", "BoxSize", vector2(0.8, 0.7), "vector2")
  .value("MOD.Core.HitComponent", "ColliderOffset", vector2(0, 0.35), "vector2")
  .write(DST);

console.log(JSON.stringify(b.snapshot(), null, 1));
