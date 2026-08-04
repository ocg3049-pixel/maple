# 메이플 자동사냥 RPG — Phase 1 상세 계획 "레벨이 장비로만 오르내린다"

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue the build, load the `msw-planning` skill FIRST and resume through it (read `Archive/As-built.md` + the GDD → reconstruct state) — don't treat this as plain implementation and start editing straight from this doc. **Before implementing tasks or updating any `⬜/🟡/✅` state, Read the skill's `references/build-management.md` IN FULL** (state rules · completion cleanups · revision flow).
> Parent doc: `MapleIdle-M1-GDD.md` · This Phase's goal: 레벨이 「장비 유래 전투력(EquipCP)」만으로 CP(L) 테이블을 따라 오르내리고, 망토·장갑이 스탯에 실반영되며, 강화 대상이 6부위로 제한된다.
> **Skills to reference (this Phase)**: `msw-scripting`(+`references/verify-checklist.md` — 모든 .mlua 수정 턴 필수) · `msw-general`(`references/workspace.md` refresh/play 루프). `.ui`/`.model`/`.map` 변경 없음 — 빌더 불필요. 플레이 검증 절차는 메모리 `reference_msw_playtest_flow`(play 후 엔터2회+1초+엔터1회 입장, Y키 자동 캐릭터 생성) 참고.

## Status checklist
> States: ⬜ not started · 🟡 implemented (untested) · ✅ tested.
> All items start ⬜. Mark 🟡 when built, ✅ only after verification passes.

- ✅ T1. `CalcEquipCombatPower()` 신설 — 장비 유래 스탯만·슬롯 1~25 전체 스캔 (기저 스탯 10 고정 추가 — 스탯 장비 0개일 때 공격력 옵션이 0으로 붕괴하는 문제 방지). 검증: 물약 사용 시 EquipCP 53→53 불변·표시 전투력만 74→9524·레벨 불변(2) 로그 확인
- ✅ T2. 망토·장갑 스탯 실반영 — 합산 루프 4곳 1~25 + `equip10~25` 저장 선확장 + 잔재 정리. 검증: 15성 망토 장착 시 EquipCP 53→374·레벨 2→5, 해제 시뮬(swapOff 19,730 < swapKeep 60,551), 복원 후 53, 슬롯 10~25 빈 값·에러 0
- ✅ T3. CP(L) 레벨 테이블 도입 — 환산 지점 전수 교체 (CharInfoManager 2곳 + UIMyInfoManager HUD + SkillManager 4곳). 검증: 경계값 19,200→Lv40 / 19,199→Lv39 / 0→Lv1, 1.3M→Lv120, 8.2M→Lv160, 0~12M 단조성 true
- ✅ T4. 강화 대상 6부위 제한 — 인벤 경로+장착 중 경로 양쪽 가드. 검증: 판정 로그 1=F 2=F 3=T 4=F 5=T 6=T 7=T 8=T 9=T 10=F
- 🟡 T5. 레벨 오르내림 통합 검증 — 장착↑/해제↓ 로그 확인(2→5→2), HUD 갱신은 사용자 확인 완료(잘됨). ⚠️ needs user test(잔여): 강화창에서 실제 파괴 시 레벨이 즉시 떨어지는지 육안 확인
- 🟡 T6. (사용자 피드백 추가) 강화창 클릭-클릭 배정 — 장비창/인벤 아이템 단일 클릭 → 강화창 대상 슬롯 클릭으로 등록. 장착 중 장비도 강화 대상 지원(`SetEnhanceTargetFromEquip`, 강화/주문서/큐브/파괴 결과가 장비창에 직접 반영·저장). 거부 안내 문구 "강화 불가 아이템입니다."로 변경. 검증: 프로덕션 경로(OnSlotClick→pick→등록→3성 기록→EquipCP 55→108→복원, 하의 거부 다이얼로그 표시) 로그 확인. ⚠️ needs user test: 실제 마우스 클릭-클릭 동선 (터치 이벤트는 시뮬 불가)

## Task detail

### T1. `CalcEquipCombatPower()` 신설
- **Goal**: 레벨 산정 전용 전투력 함수가 생긴다 — **장비(슬롯 1~25 전체) 유래 스탯만** 합산하고, `baseVal(4+5L)`·`potionAttackBonus`·`buffAttackBonus`·`skillAttackBonus`를 **제외**한다. 기존 `CalcCombatPower()`(표시/스킬용)는 그대로 둔다. 슬롯 번호 체계는 GDD §4.6 25종 표가 기준(10~25는 잠금 칸 — 지금은 항상 빈 문자열이라 루프가 그냥 지나감, 향후 개방 시 코드 수정 없이 반영).
- **Required systems·components**: `CharInfo/CharInfoManager.mlua`(@Logic, ClientOnly). 구현 골격은 `CalcCombatPowerSwap` 본문 복제 후 ① 루프 `1, 25` ② 물약/버프/스킬 3줄 제거 ③ `baseVal = 0` (주스탯·부스탯이 순수 장비 합만 반영) ④ 크리대미지 상수 1.35 유지.
- **Data**: 없음 (하드코딩 v1 — CSV 이관은 Phase 5).
- **UI**: 없음.
- **Done (verification) criteria** (AI 검증 가능): play 진입 후 `log()`로 ① 무장착 상태 EquipCP=0 ② 물약(`UseAttackPotion`) 사용 전후 EquipCP 불변·기존 CalcCombatPower만 상승 ③ 장비 1개 장착 시 EquipCP 상승 — 3케이스 로그 확인.
- **Dependencies**: 없음 (T2와 같은 파일이라 한 편집 흐름으로 처리 권장).
- **Skills to reference (predicted)**: `msw-scripting` + `verify-checklist.md`.

### T2. 망토·장갑 스탯 실반영 + 슬롯 25종 선확장
- **Goal**: 망토(슬롯8)·장갑(슬롯9)에 붙은 스타포스·잠재·에디셔널이 스탯창·전투력·크리 수치에 실제 반영된다 (장착·UI·저장은 이미 구현 — 2026-07-23 확장). 동시에 내부 슬롯 체계를 GDD §4.6 기준 25종으로 선확장한다.
- **Required systems·components**:
  - `CharInfoManager.mlua`의 기존 `for slot = 1, 7` **4곳 전부** 1~25로 확장: `UpdateStats`(L189) · `CalcCritRate`(L660) · `CalcCritDamage`(L684) · `CalcCombatPowerSwap`(L719). 무기 분기(`slot == 6`)는 그대로.
  - `UIEquipInventoryManager.mlua`: `equip10~25` property 추가 + `GetEquip`/`SetEquipStr` 분기 확장 + 저장/복원(`ExportSaveTable`/`ImportSaveTable`) 루프 1~25 + `CharacterPersistence` 대응 (잠금 칸은 항상 빈 값이라 동작 변화 없음 — 개방 대비 선작업).
  - 구버전 잔재 정리: "장비창에 슬롯이 없는 부위(망토/장갑)는 0" 주석·경로(L1704 부근)를 현행 8/9 매핑에 맞게 정리(`GetAvatarSlotIdx`가 이미 8/9를 반환하는지 확인만).
  - 잠금 슬롯(10~25)의 UI 활성화·아이템·개방 게이트는 **이번 범위 아님** (160+ 로드맵) — 회색 칸 그대로.
- **Data / UI**: 없음 (UI 변경 없음).
- **Done criteria** (AI 검증 가능): 망토 또는 장갑에 스타포스가 붙은 아이템을 장착 → ① 스탯창 STR 등 상승 ② `CalcCombatPowerSwap(8, "")`(해제 시뮬)이 현재보다 낮은 값 반환 ③ 장착/해제 반복 시 전투력 증감 로그 대칭 ④ `GetEquip(10)~GetEquip(25)`가 빈 문자열 반환·에러 없음 ⑤ 저장→재로그인 후 장비 상태 보존. 강화창에서 망토 대상 스타포스 성공 → 전투력 즉시 상승.
- **Dependencies**: T1과 동시 진행 (신설 함수도 처음부터 1~25로 작성).
- **Skills to reference (predicted)**: `msw-scripting` + `verify-checklist.md`.

### T3. CP(L) 레벨 테이블 도입
- **Goal**: 표시 레벨이 `floor(전투력/10)` 선형식 대신 **GDD §4.1 CP(L) 구간 테이블**의 역함수(`GetLevelForEquipCP(cp)`)로 계산되고, 입력이 T1의 EquipCP로 바뀐다.
- **Required systems·components**:
  - `CharInfoManager.mlua`에 `GetLevelForEquipCP(number cp)` 신설 — 구간별: Lv1~40 `L = floor(sqrt(cp/12))`, 41~70 `19,200×1.066^(L-40)`, 71~120 `×1.047`, 121~160 `×1.047`, 161+ `×1.12` (역산은 로그 또는 상한 200까지 테이블 사전 생성 후 이분/선형 탐색 — **레벨 상한 200 가드**).
  - 교체 지점(전수): `UIMyInfoManager.UpdateBars`(HUD 레벨·전직명) · `CharInfoManager.UpdateLevelClass`(스탯창 레벨 배지) · 그 외 `math.floor(combatPower / 10)`·`/ 10` 레벨 환산을 **grep으로 전수 색출** 후 신설 함수 호출로 통일 (`Grep "combatPower / 10"` + `"CalcCombatPower"` 호출처 검토).
  - `UpdateStats`의 `baseVal = 4 + level*5`는 **표시 스탯용으로 유지**하되 level 입력을 새 레벨로 교체 (레벨 산정 자체는 T1이 baseVal 제외라 순환 없음).
- **Data**: CP(L) 앵커 하드코딩 (Lv40=19,200 / Lv70≈130,000 / Lv120≈1,300,000 / Lv160≈8,200,000) — Phase 5에서 `LevelCurve.csv` 이관.
- **UI**: 없음 (기존 텍스트 엔티티 재사용).
- **Done criteria** (AI 검증 가능): 로그로 ① EquipCP 0 → Lv1(하한) ② 경계값 검증: EquipCP 19,200→Lv40, 19,199→Lv39 ③ 단조성: CP 증가 시 레벨 비감소(테스트 루프로 0~10M 구간 샘플 확인) ④ HUD·스탯창·전직명이 동일 레벨을 표시.
- **Dependencies**: T1 (EquipCP), T2 (루프 확장 — 수치 일관성).
- **Skills to reference (predicted)**: `msw-scripting` + `verify-checklist.md`.

### T4. 강화 대상 6부위 제한
- **Goal**: 강화창(스타포스·주문서·잠재·에디셔널 전 탭)이 **모자(7)·상의(3)·망토(8)·장갑(9)·신발(5)·무기(6)** 만 대상으로 받고, 얼굴(1)·머리(2)·하의(4)는 기존 "사용 불가 아이템" 다이얼로그로 거부한다.
- **Required systems·components**: `Enhancement/EnhancementManager.mlua` — ① 허용 슬롯 판정 헬퍼 `IsEnhanceableSlot(slotIdx)` 신설({3,5,6,7,8,9}) ② `SetEnhanceTarget`에서 아이템 문자열 3번째 필드(slotIdx)로 거부 분기(기존 `ShowItemUnusableDialog` 재사용) ③ `UseScrollOnTarget`의 `slotIdx < 1 or > 7` 검사를 헬퍼 호출로 교체 ④ `UpdateInvenItemStars`/`DestroyTarget`의 장비 슬롯 순회 `1, 7`도 1~9로 확장 (망토·장갑 장착 상태 강화·파괴 대응).
- **Data / UI**: 없음 (기존 다이얼로그 재사용).
- **Done criteria** (AI 검증 가능): ① 하의 아이템을 강화창에 올리면 거부 다이얼로그 로그 ② 망토/장갑은 정상 등록·스타포스 시도 가능 ③ 장착 중인 망토 파괴 시 `SetEquipStr(8, "")` 경로 동작 로그.
- **Dependencies**: T2 (슬롯 8·9 유효화).
- **Skills to reference (predicted)**: `msw-scripting` + `verify-checklist.md`.

### T5. 레벨 오르내림 통합 검증
- **Goal**: "장비가 좋아지면 레벨이 오르고, 잃으면 즉시 내려간다"가 실플레이에서 성립.
- **Required systems·components**: 신규 코드 없음 — T1~T4 통합 시나리오 테스트. 절차: play → 로그인 → Y키 캐릭터 생성 → 입장(메모리 `reference_msw_playtest_flow`) → ① 스타포스 붙은 장비 장착 → 레벨 상승 로그 ② 해제 → 하락 ③ 강화창에서 의도적 파괴(고구간 반복 시도) → 레벨 하락 + HUD·전직명 갱신(0.5초 주기) 확인.
- **Done criteria**: 위 3 시나리오 로그 + 빌드/런타임 에러 0. **⚠️ needs user test**: 실제 화면에서 HUD 레벨·전직명이 자연스럽게 갱신되는지 육안 확인 (AI는 로그로만 검증 — `execute_script`로 InitEquip 직접 호출 금지, 반드시 실제 로그인 흐름 사용: 메모리 `feedback_msw_dev_testing`).
- **Dependencies**: T1~T4 전부.
- **Skills to reference (predicted)**: `msw-scripting` `references/verify-checklist.md` (Verify 단계 전체).

## Risks / cautions
- **인벤·장비는 클라이언트 전용 상태** — EquipCP·레벨 계산 전부 ClientOnly에서. 서버가 레벨을 알아야 하는 순간(사냥터 게이트는 Phase 3)이 오면 기존 패턴대로 RPC 인자 전달로 해결(이번 Phase에서는 불필요).
- **레벨 순환 참조 주의**: 레벨 산정(EquipCP)에는 baseVal·물약·버프 절대 포함 금지. 표시 스탯(UpdateStats)의 baseVal은 유지 — 두 경로를 헷갈리면 레벨이 자기 자신을 먹고 자란다.
- **`_UIMyInfoManager.CharLevel`은 죽은 값**(서버 InitStats 후 미갱신) — 새 코드에서 참조 금지, 레벨은 항상 `GetLevelForEquipCP(EquipCP)`.
- **검증 시 더미 데이터 flush 위험** (메모리 `feedback_msw_execute_script_test_data_flush_risk`): 활성 탭에 대량 테스트 장비를 넣지 말고 빈 탭/기존 로그 백업 활용.
- `.mlua` 수정 후 반드시 `refresh` → `logs(kind="build")` — 수정 턴마다 `msw-scripting` verify-checklist 준수.
