// EnhanceWindow 하위 엔티티의 "실제 저장 배열 순서" 확인 (렌더 순서 규칙 파악용)
const { UIBuilder } = require('../.claude/skills/msw-ui-system/scripts/msw_ui_builder.cjs');
const b = UIBuilder.read('ui/DefaultGroup.ui');
const json = b.build();
const ents = json.ContentProto.Entities;
let i = 0;
for (const e of ents) {
  const p = (typeof e.jsonString === 'string' ? JSON.parse(e.jsonString) : e.jsonString).path || e.path;
  if (p && p.startsWith('/ui/DefaultGroup/EnhanceWindow/RightPanel') && p.split('/').length <= 6) {
    console.log(i, p, 'do=' + (typeof e.jsonString === 'string' ? JSON.parse(e.jsonString) : e.jsonString).displayOrder);
  }
  if (p && p.startsWith('/ui/DefaultGroup/EnhanceWindow/LeftPanel') && p.split('/').length <= 6) {
    console.log(i, p, 'do=' + (typeof e.jsonString === 'string' ? JSON.parse(e.jsonString) : e.jsonString).displayOrder);
  }
  i++;
}
