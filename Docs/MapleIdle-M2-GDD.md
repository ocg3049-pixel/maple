# 메이플 자동사냥 RPG — 자동사냥 시스템 설계서 (M2 GDD)

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue/resume this game, load the `msw-planning` skill FIRST and follow its resume flow (read `MapleIdle-Roadmap.md` + `Archive/As-built.md` → reconstruct state). **Before touching any `⬜/🟡/✅` state or running a completion, Read the skill's `references/build-management.md` IN FULL.**
> Last updated: 2026-08-03 / Stage: Phase 1·2 구현 완료 — 사용자 테스트 대기 (각 Phase의 🟡 항목)
> ※ M1(밸런스)은 ⏳ user-test pending 상태로 병행 — M1 테스트 결과는 M1 Phase 문서들에 반영한다.

## 1. 한 줄 컨셉
> "토글 한 번이면 캐릭터가 스스로 몬스터를 찾아 이동하고 스킬로 사냥한다 — 방치 성장 루프(자동사냥 → 메소 → 강화 → 레벨 → 상위 사냥터)의 마지막 조각."

## 2. 핵심 결정 (불변 기준선)
| 항목 | 결정 | 비고 |
|---|---|---|
| 맵 모드 | MapleTile(0) — 기존 유지 | 이동은 `MovementComponent:MoveToDirection` (클라 권한 — 플레이어 이동은 클라이언트) |
| 조작 | **F7 키 토글** (ON/OFF 토스트 안내) | UI 버튼은 로드맵 |
| 공격 | **Q 슬롯 스킬 자동 시전** (미배정이면 기본공격 `ActionAttack`) | 쿨다운·위력 배율·전투력 전달은 기존 SkillManager 파이프라인 그대로 재사용 |
| 대상 선정 | 같은 높이(|dy|<1.5) 우선 최근접, 5초 추적 실패 시 대상 제외 후 재선정 | 발판 점프 내비게이션은 Phase 2 |
| 줍기 | 기존 드랍 자동 흡수 시스템 재사용 (신규 작업 없음) | |

## 3. 코어 루프
```
F7 ON → 최근접 몬스터 탐색 → 좌우 이동 접근 → 사거리 도달 → Q 스킬 반복 시전
  → 처치 → 메소 흡수 → 다음 몬스터 → (몬스터 없음: 정지 대기 / 리젠 대기)
```

## 4. 핵심 시스템
- **AutoHuntManager (@Logic, ClientOnly 중심)**: 토글 상태, 0.3초 주기 대상 탐색 캐시, OnUpdate 이동/공격 판단. 사망(DEAD) 중 일시정지, 맵 이동 시 자동 재탐색.
- 공격 사거리 1.3유닛(파워스트라이크 박스 기준), 공격 시도 스로틀 0.25초(실쿨은 SkillManager가 관리).
- 추적 타임아웃: 같은 대상을 5초 넘게 못 때리면 3초간 제외(다른 발판 몬스터에 갇힘 방지).

## 5. 시스템 ↔ MSW 매핑
| 시스템 | 구현 |
|---|---|
| 자동사냥 본체 | 신규 `RootDesk/MyDesk/AutoHunt/AutoHuntManager.mlua` (@Logic) |
| 이동 | `MovementComponent:MoveToDirection`/`Stop` (클라 OnUpdate — 플레이어 이동 클라 권한 규칙) |
| 공격 | `_SkillManager:UseSkillInSlot("Q")` + `HasSkillInSlot` 헬퍼 신설 / 기본공격 `PlayerControllerComponent:ActionAttack()` |
| 대상 탐색 | `CurrentMap:GetChildComponentsByTypeName("script.Monster", true)` + `IsDead`/`Hp` 필터 |
| 토글 입력 | `_InputService` KeyDownEvent (F7) + `_UIToast` 안내 |

## 6. 로드맵 (Phases)
### Phase 1 — "F7 켜면 알아서 사냥한다" (지능형 확장 포함)
- ✅ AutoHuntManager 신설 — F7 토글·토스트·사망 일시정지·맵 이동 시 자동 재탐색 (`AutoHunt/AutoHuntManager.mlua`)
- ✅ 추적·이동 — 같은 높이 우선 최근접, 5초 타임아웃 제외, 자동 이동 중 PlayerController 비활성(정지/OFF 복구), **걷기 모션 = ChangeState("MOVE")** (WALK는 미등록·LEA-3005), 위/아래 발판은 점프/다운점프 추적, **공격 방향 = `LookDirectionX` 직접 대입**(스킬 판정·모션·이펙트가 전부 이 값을 읽음 — "짧은 이동" 방식은 무효였음. 검증: dx=-0.62→look=-1.0 / dx=2.96→look=1.0 정합)
- ✅ 스킬 용도별 로테이션 (사용자 피드백 확장) — 스킬바 전체 스캔 → 버프(스킬별 주기: 콤보 어택 25분·기타 4.5분, ON 직후 즉시 1회)/소환수(290초)/공격 **가중 랜덤**: 다수(사거리권 2마리↑) 시 광역 가중 3.0·단일 0.4, **브랜디쉬 보유 시 파워스트라이크·슬래시블러스트 1% 강등**, **전방 3유닛 직선상 2마리↑면 돌진 ×5**. 검증: 돌진 27/브랜디쉬 17/코마 7/패닉 6/파스·슬블 0회(1% 정상), 에러 0
- 🟡 통합 검증 — 로그 검증 완료. ⚠️ needs user test: ① 장시간 방치 체감(처치/시간 실측 — 커브 재보정 데이터) ② 모션이 버튼 조작과 동일하게 보이는지 육안 ③ F7 OFF 후 수동 조작 복귀 ④ 발판 점프 추적 체감
### Phase 2 — "발판을 넘어다닌다"
- 🟡 위/아래 발판 내비게이션 개선 — 수평 정렬(위 |dx|≤1.2 / 아래 |dx|≤1.5) 후에만 점프/다운점프. ⚠️ needs user test: 발판 많은 사냥터(hunting 지역)에서 체감
- ✅ 몬스터 전멸 시 배회 — 검증: 빈 로비(hunting01)에서 걷기/대기 교대·좌우 방향 전환 로그, 리젠 감지는 0.3초 스캔으로 자동 복귀
- ✅ 자동 HP 포션 — 검증: HP 18/70(26%) 감지 → 자동 사용 → 힐 5틱 진행 (28→38→48…), 힐 중 재사용 방지

## 7. 데이터 주도
- 사거리·스로틀·타임아웃 상수는 Phase 2에서 `Balance/AutoHunt.csv`로 이관 검토 (v1 하드코딩 — 항목 적음).

## 8. 결정 사항
| 항목 | 상태 |
|---|---|
| F7 토글·Q 슬롯 고정 | 결정 (v1 — 슬롯 선택 UI는 로드맵) |
| 발판 점프 내비 | Phase 2 |

## 9. 계획 변경 이력
| 시점 | 유형 | 변경 | 사유 | 영향 |
|---|---|---|---|---|
| 2026-08-03 | 최초 작성 | 로드맵 M2 슬롯 승격 | — | — |
| 2026-08-03 | Modify | Phase 1을 "Q 슬롯 단일 시전"에서 "스킬바 전체 용도별 로테이션(버프/소환/광역/단일) + 발판 점프 추적 + 걷기 모션"으로 확장 | 사용자 피드백 — 용사 소환처럼 보유 스킬을 용도에 맞게 전부 활용해야 함 | Phase 2의 발판 내비 일부(점프/다운점프)를 P1로 앞당김 |
| 2026-08-03 | Add | ① 자동사냥 시전 모션 홀드(0.8×공속) — 모션 끝나기 전 이동 방지 ② 파워스트라이크/슬래시블러스트(+파이널)에 브랜디쉬식 모션 가드 이식(`Begin/EndSwingMotionGuard` — 착지/피격에 모션 끊김 수정, 재적용 로그 다발→1회) ③ 섬광 벽 선택: 1.5유닛 이상 벽 우선, 없으면 근거리 폴백 (방향 자동 선택도 동일 규칙) | 사용자 피드백 3건 | PlayerAttack 8지점 + AutoHunt 홀드 + 섬광 레이캐스트 선호 |
| 2026-08-03 | Add | ④ 자동사냥 토글을 키설정 기능 "autohunt"(기본 F7)로 등록 — 키설정창에서 재배정·저장·프리셋 지원, 토스트 문구도 배정 키 표시 ⑤ 자동사냥 중 섬광은 방향키 없이도 "적 쪽 방향키를 누른 것처럼" 조준(`_AutoHuntManager:GetAimDirX()` — dir=(±1,0) 검증) | 사용자 피드백 2건 | KeySettingManager funcDefs + SkillManager 섬광 분기 + AutoHunt IsActive/GetAimDirX |
| 2026-08-03 | Modify | ⑥ 섬광을 공격 로테이션에서 제외하고 **상하 이동기(mobility)** 로 재분류 — 위아래 |dy|≥1.2 대상 추격에만 시전(수직 조준 fdy 포함, GetAimDirY), 가까운 적에게는 사용 금지 (평지 45초 실측 0회) ⑦ 돌진은 전방 직선상에 적이 없으면 사용 금지(가중 0), 2마리↑면 ×5 유지 | 사용자 피드백 — 섬광은 수직 이동용, 돌진 헛발 방지 | AutoHunt 역할 분류/접근 분기 + SkillManager 섬광 fdy |
| 2026-08-03 | Modify | ⑧ 대상 선정 2-패스 — 같은 층(|dy|<1.5) 최근접이 4유닛 초과·부재 시 수직 페널티 `dy×10+100`→`dy×2` 완화(수직 적 적극 선택 → 섬광 기회↑, 실측 섬광 이동 시전 2회) ⑨ 파이널어택 모션 가드(IsBrandishMotionGuardOn) 중 자동사냥 이동/시전 전면 대기 ⑩ 공격 가중 재조정 — 광역: 다수 3.0 / **단일 0.15**, 단일기: 다수 **0.15** / 단일 1.0 (실측: 산개 구간 파스 45 vs 슬블 27 — 단독 대상 슬블 희소 확인), 돌진 전방 2마리↑ 부스트 ×5→**×4**(80%) ⑪ 접근 이동에 **대시(러시) 활용** — |dx|≥3·같은 층·3.5초 스로틀로 질주 진입(실측 53회, dir 좌28/우25, 제자리 헛시전 2회뿐) | 사용자 피드백 5건 — 수직 적 섬광 기회, 파이널 모션 무시, 단독/다수 확률 반전, 돌진 80%, 이동 대시 | AutoHunt FindTarget 2-패스/OnUpdate 가드/TryAttackCast 가중/대시 분기 + SkillManager TryEnterSprintFromSkill 자동사냥 분기 |
| 2026-08-03 | Fix | ⑫ 공격 사거리 판정에 수직 거리 추가 — `|dx|`만 보던 판정이 아래/위층 몬스터를 "사거리 내"로 오인해 허공에 파스/슬블 발동 → 같은 층(`|dy|<1.2`)일 때만 공격, 수평 정렬이 끝난 수직 대상에겐 제자리에서 점프/섬광 대기(좌우 떨림 방지) | 사용자 목격 — 범위 밖인데 발동 | AutoHunt 사거리 분기 (검증: 평지 시전 정상·에러 0) |
