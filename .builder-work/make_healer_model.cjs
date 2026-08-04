// 힐러 소환수 모델: 용사 소환수(HeroSummon.model)와 완전히 같은 컴포넌트 구성을 쓰되
// 모델 식별자와 네임태그 기본값만 바꾼다.
const { ModelBuilder } = require("/Users/florence/Desktop/.claude/skills/msw-general/scripts/model/msw_model_builder.cjs");

const SRC = "RootDesk/MyDesk/Models/NPCs/HeroSummon.model";
const DST = "RootDesk/MyDesk/Models/NPCs/HealerSummon.model";

const b = ModelBuilder.read(SRC);
b.renameModel("HealerSummon", "healersummon")
  .value("MOD.Core.NameTagComponent", "Name", "힐러", "string")
  .write(DST);

console.log(JSON.stringify(b.snapshot(), null, 1));
