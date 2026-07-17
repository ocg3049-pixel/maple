#!/usr/bin/env node
// MSW 리소스 라이브러리의 스킬 팩 전체 인덱스를 로컬 파일로 덤프한다.
//
// 왜 필요한가:
//   MSW 라이브러리는 메이플 원본 WZ 경로를 팩 ID로 그대로 쓴다 (skill/<직업img>.img/skill/<스킬ID>).
//   그런데 한글 이름 검색(searchResources)은 현대 리메이크판을 먼저 물어오고, 클래식 팩은 이름이
//   엉뚱하게 섞여 붙어 있어(예: 1001005 = ['용독술','슬래시 블러스트']) 검색으로는 잘 안 잡힌다.
//   전체를 로컬에 덤프해두면 grep 한 번으로 확실히 찾는다.
//
// 사용법:
//   node msw-dev-tools/dump_skill_pack_index.cjs
//
// 출력: msw-dev-tools/msw-library-index/
//   스킬팩_목록.tsv    - 팩 1개 = 1행 (팩ID, 한글명, 영문명, 요소수, rel_path 요약)
//   스킬요소_목록.tsv  - 요소 1개 = 1행 (팩ID, 한글명, rel_path, 타입, RUID)  ← RUID를 직접 찾을 때 이 파일을 grep
//
// 재실행하면 전체를 다시 받아 덮어쓴다(증분 없음). 서버 부하를 감안해 페이지마다 잠깐 쉰다.

const fs = require('fs');
const path = require('path');

// msw-search 스킬의 검증된 래퍼를 그대로 쓴다 (직접 curl/fetch 조립 금지 규칙).
// 스킬 플러그인 경로는 워크스페이스 밖(.claude/)이라 저장소에는 포함되지 않는다.
const WRAPPER = path.join(__dirname, '..', '.claude', 'skills', 'msw-search', 'scripts', 'msw_resource_api.cjs');
if (!fs.existsSync(WRAPPER)) {
  console.error('msw-search 스킬 래퍼를 찾을 수 없습니다:\n  ' + WRAPPER + '\n스킬이 설치된 환경에서 실행하세요.');
  process.exit(1);
}
const { listResources } = require(WRAPPER);

const OUT_DIR = path.join(__dirname, 'msw-library-index');
const PAGE_SIZE = 100;
const PAGE_DELAY_MS = 120;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// TSV 셀 안의 탭/개행은 필드 구분을 깨뜨리므로 공백으로 눕힌다.
const cell = (v) => String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' ').trim();

const joinNames = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join(' / ') : '');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const packs = [];
  const elements = [];
  let offset = null;
  let page = 0;

  for (;;) {
    const opt = {
      resourceTypeFilter: ['resource_pack'],
      categoryFilter: ['skill'],
      limit: PAGE_SIZE,
    };
    // 첫 페이지에는 offset을 아예 보내지 않는다. 정수 0을 보내면 커서로 해석돼 빈 결과가 온다.
    if (offset) opt.offset = offset;

    let res;
    try {
      res = await listResources(opt);
    } catch (e) {
      console.error(`\n${page + 1}페이지에서 실패: ${e.message}`);
      console.error('여기까지 받은 내용으로 파일을 씁니다.');
      break;
    }

    const items = res.items || [];
    for (const it of items) {
      const id = it.id || '';
      const ko = joinNames((it.names || {}).ko);
      const en = joinNames((it.names || {}).en);
      const els = ((it.payload || {}).elements) || [];

      const relPaths = [];
      for (const el of els) {
        const rel = el.rel_path || '';
        relPaths.push(rel);
        elements.push([id, ko, rel, el.resource_type || '', el.ruid || '']);
      }
      packs.push([id, ko, en, String(els.length), relPaths.join(',')]);
    }

    page++;
    process.stdout.write(`\r${page}페이지 | 팩 ${packs.length}개 | 요소 ${elements.length}개`);

    offset = res.nextOffset;
    // list 계열의 nextOffset은 정수가 아니라 불투명 커서 문자열이고, 끝나면 null이 온다.
    if (!offset || items.length === 0) break;
    await sleep(PAGE_DELAY_MS);
  }

  packs.sort((a, b) => a[0].localeCompare(b[0]));
  elements.sort((a, b) => a[0].localeCompare(b[0]) || a[2].localeCompare(b[2]));

  const packFile = path.join(OUT_DIR, '스킬팩_목록.tsv');
  const elemFile = path.join(OUT_DIR, '스킬요소_목록.tsv');

  fs.writeFileSync(
    packFile,
    ['팩ID\t한글명\t영문명\t요소수\trel_path목록', ...packs.map((r) => r.map(cell).join('\t'))].join('\n') + '\n',
    'utf8'
  );
  fs.writeFileSync(
    elemFile,
    ['팩ID\t한글명\trel_path\t타입\tRUID', ...elements.map((r) => r.map(cell).join('\t'))].join('\n') + '\n',
    'utf8'
  );

  const classic = packs.filter((p) => /^skill\/(1|2|3|4|5)\d{0,2}\.img\//.test(p[0]));
  console.log(`\n\n완료`);
  console.log(`  팩   ${packs.length}개 -> ${packFile}`);
  console.log(`  요소 ${elements.length}개 -> ${elemFile}`);
  console.log(`  그중 구버전 직업img(1~5xx.img) 패턴: ${classic.length}개`);
}

main();
