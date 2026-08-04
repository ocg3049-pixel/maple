# 메이플 자동사냥 RPG — As-built log

> Running record of the world's implementation. Survives across milestones. ⚠️confirm = survey guess to verify with the user.

## Current state (by system)
| System | Built | Where (key files) | Notes / gotchas |
|---|---|---|---|
| 로그인→캐릭터 선택/생성(12슬롯 페이징)→입장 | @Component + .ui | `CharacterSelectComponent` · `CreateCharacterok` · `loginbutton` · `ui/DefaultGroup.ui` | 직업 10종 선택 저장(slotData 8번째 필드). DefaultGroup.ui는 2300+ 엔티티 — UIBuilder write는 반드시 `strict:false` |
| 인벤/장비창 (활성 9슬롯: 1얼굴~7모자+8망토+9장갑 / 회색 예비 16칸 GS_1~18 중 잠금 16종) + 메소 | @Logic | `UIEquipInventoryManager.mlua` | 인벤 상태는 **클라이언트 전용** — 서버엔 장비 데이터 없음(전투력은 RPC 인자로 전달). 망토(8)·장갑(9)은 **장착까지 구현**됐으나 CharInfoManager 합산 루프가 1~7이라 스탯 미반영. 회색 칸 실측: 반지×4·귀고리·펜던트·벨트·포켓·어깨장식·훈장·안드로이드·하트·칭호·뱃지·보조무기·엠블렘 (GS_9망토/GS_10장갑은 승격돼 disabled) — 내부 번호 10~25는 M1 GDD §4.6에 확정 |
| 강화창 (스타포스/주문서/잠재/에디셔널) | @Logic | `Enhancement/EnhancementManager.mlua` | (M1 개편) 구간별 확률 11밴드(성공/유지/하락/파괴, `Balance/StarforceTable.csv`), 파괴→기본템 재구매 다이얼로그, 클릭-클릭 배정+장착 중 장비 강화(`enhanceTargetEquipSlot`), 잠재 메소 부여 2만/재설정 10만·15만, Space=즉시 강화. ConfirmDialog 3모드(`confirmInfoOnly`/`pendingRebuySlot`/`pendingGrantTab`). 전부 클라 판정 |
| 밸런스 데이터 (CSV 5종) | dataset | `Balance/{LevelCurve,StarforceTable,RegionTier,HeroSkillTable,ShopPrice}.{userdataset,csv}` | CSV가 진실의 원천, 각 로더는 pcall+하드코딩 폴백. 레벨 커브 계수 26 (1,000처치/h 시뮬 보정). CSV 수정 후 재접속 필요(_T 캐싱) |
| 지역 티어/게이트 | @Logic | `Balance/RegionTierLogic.mlua` + `MapPortalSystem`/`PortalManager` 게이트 + `Monster.Dead()` 메소 | 3지역 87맵 체인 인덱스→T1~T10, 몬스터 메소=티어 기본값±20%, 서버 레벨=MaxHp(50+10L) 역산, 차단 시 UIToast |
| 스킬포인트/위력 배율 | @Logic | `Skills/SkillManager.mlua` | SP 총량=3×레벨, 히어로 14스킬 spendable(레벨 제한 10~150), 위력=유효pt 비율×(0.6+0.4×pt/마스터)×제한 미달 페널티(하한 0.3) — `UseSkillInSlot`→`GetEffectiveCombatPower` 1회성 훅. 투자는 세이브 "SP" 라인 |
| 전투력/스탯/레벨 표시 | @Logic | `CharInfo/CharInfoManager.mlua` · `UI/UIMyInfoManager.mlua` | (M1 개편) 레벨 = `CalcEquipCombatPower()`(장비만·기저 스탯 10·슬롯 1~25)의 CP(L) 테이블 환산 — 물약/버프/스킬 보너스는 표시 전투력에만. 기본 크확 10%. 잠재 파서: 크뎀→데미지 오합산 버그 수정, 보스뎀 보유 전용, 쿨감 "-N초" 인식 |
| 몬스터/전투 파이프라인 | @Component | `Combat/Monster.mlua`(HP 3000·Lv15 고정, 메소 드랍 lv×3+rand) · `Combat/PlayerAttack.mlua`(21k줄) · `MonsterZoneRespawn` | 사망 유예·예약 데미지 등 다중타격 보정 다수. 밀집 지역 다중히트 회귀 주의 |
| 스킬 시스템 (100+ 스킬, 10직업 탭) | @Logic + @Component | `Skills/SkillManager.mlua`(6.8k줄) + `Skills/*` 60여 파일 | 퀵슬롯 Q~8, 직업별 탭 필터(GetJobSkillNames), 스킬포인트 일부 구현(표창+ 공+2/pt). 쿨타임/버프 UI 40여 종 |
| 영속 저장 | @Logic | `Persistence/CharacterPersistence.mlua` | 자체 텍스트 포맷(줄+탭) — TableToString 중첩 불가 때문 |
| 상점/포탈/드랍 | @Logic·@Component | `Shop/PotionShopManager` · `Portal/*` · `Item/*` | ⚠️ PotionShopManager에 레거시 별도 메소 저장소 있음 — 인벤창 열 때 실제 메소를 1000으로 덮은 전적(수정됐는지 ⚠️confirm) |
| 맵 | .map | `map/` — map01 · monsterzone 등 | MapleTile(0). 사냥터 티어 구조는 미구현 (M1 Phase 3 대상) |
| 자동사냥 (M2 P1) | @Logic | `AutoHunt/AutoHuntManager.mlua` | F7 토글. ClientOnly OnUpdate: 0.3s 대상 캐시(같은 높이 우선·5s 타임아웃 제외) → 접근(**PlayerController 비활성 필수** — 입력 0이 이동을 덮음, 정지 시 복구) + **걷기 모션 ChangeState("MOVE")**(플레이어 이동 상태명 MOVE — "WALK"는 LEA-3005) + 위/아래 발판 점프/다운점프 → 방향 보정 → **스킬바 전체 용도별 로테이션**(GetSkillRole 분류표: buff 270s 유지/summon 290s/aoe 주변 3마리↑/single, 미분류="manual" 미사용). 배회/자동 물약은 P2 미착수 |

## Standing issues & handoff rules   (update in place — never re-append)
| Issue / rule | Workaround / rule | Count | First → last seen |
|---|---|---|---|
| `ui/DefaultGroup.ui` UIBuilder write 시 파일 삭제 위험 | 무조건 `write(path, { strict: false })` (pre-existing lint 에러 20여 개) | 2 | 06-22 → 07-01 |
| 서버에 장비/인벤 데이터 없음 | 전투력·공속 등은 시전 시 클라 계산값을 RPC 인자로 서버 전달 | - | 상시 규칙 |
| 밀집 몬스터 구역에서 박스 판정 다중히트 | 단일 대상 스킬은 CurrentTarget 포인터 패턴(목록 필터 금지) | 3+ | 07-02 → 07-04 |

## Log
### 2026-08-03 M1 Phase 1~5 구현 완료 — ⏳ user-test pending
- Phase1 레벨=장비CP(슬롯 25종 선확장·망토/장갑 반영·강화 6부위 제한·클릭-클릭 배정) / Phase2 스타포스 11구간+파괴 재구매+Space 연타 / Phase3 잠재 옵션 풀 교체·메소 부여/재설정·이중 메소 폐기·지역 티어+게이트 / Phase4 SP=3×레벨·위력 배율·크확 10%·쿨감 실적용·투자 저장 / Phase5 CSV 5종 이관+커브 시뮬 보정(계수 26).
- 사용자 테스트 대기: 각 Phase 문서 🟡 항목 — 육안(고스트/토스트/HUD)·체감(연타/템포)·실플레이(파괴→레벨 하락, 재로그인 투자 유지, 포션 실메소 구매).
- 미구현 잔여: 자동사냥(로드맵 M2 — 밸런스 실측 재보정의 전제), 잠재 옵션 크리티컬 2종은 포함 확정.

### 2026-08-03 Seed — surveyed on toolkit adoption (brownfield)
- 세션 메모리(project_msw_status 등)와 파일 목록·핵심 4파일(CharInfoManager/Monster/EnhancementManager 전체, 스킬 목록) 실측으로 시드 작성.
- 게임은 로그인~강화창~스킬 100여 종까지 깊게 구현된 상태에서 **밸런스 프레임워크(M1)** 를 처음 계획함. GDD 이전의 구현이므로 체크리스트 이력 없음.
- ⚠️confirm: 자동사냥 미구현 추정 · PotionShopManager 이중 메소 버그 잔존 여부.
