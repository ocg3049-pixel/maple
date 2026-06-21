// 맵에서 기존 드랍 설정 제거 + MonsterLevel=15 추가
const path = require('path');
const { MapBuilder } = require('./.claude/skills/msw-general/scripts/map/msw_map_builder.cjs');

const MAP_PATH = path.join(__dirname, 'map/monsterzone.map');

const builder = MapBuilder.read(MAP_PATH);

let updated = 0;
for (const entity of builder.entities) {
    const js = entity.jsonString || {};
    const components = js['@components'] || [];
    const monsterComp = components.find(c => c['@type'] === 'script.Monster');
    if (!monsterComp) continue;

    const entityId = js.path || entity.path;

    // script.Monster 컴포넌트 전체 교체 (드랍 필드 제거, MonsterLevel 추가)
    builder.upsertComponent(entityId, 'script.Monster', {
        Enable: true,
        RespawnOn: true,
        GroupRespawn: true,
        RespawnDelay: 7.0,
        MonsterLevel: 15
    });

    updated++;
    console.log(`Updated: ${js.name || entityId}`);
}

builder.write(MAP_PATH);
console.log(`\n완료: ${updated}마리 몬스터 드랍 설정 초기화 + MonsterLevel=15 적용`);
