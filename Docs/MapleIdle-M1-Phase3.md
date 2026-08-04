# 메이플 자동사냥 RPG — Phase 3 상세 계획 "메소 하나로 다 굴러간다 (경제 통일)"

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue the build, load the `msw-planning` skill FIRST and resume through it (read `Archive/As-built.md` + the GDD → reconstruct state). **Before implementing tasks or updating any `⬜/🟡/✅` state, Read the skill's `references/build-management.md` IN FULL.**
> Parent doc: `MapleIdle-M1-GDD.md` · This Phase's goal: 잠재/에디셔널이 메소로 부여·재설정되고, 잡옵 없는 새 옵션 풀이 돌아가며, 사냥터 3지역 87맵이 티어별 메소·레벨 게이트로 묶인다.
> **Skills to reference (this Phase)**: `msw-scripting`(+`verify-checklist.md`). `.ui` 신규 없음(기존 다이얼로그·탭 UI 재사용). 신규 상호참조 `.mlua`는 LEA-1118 시 touch+재refresh (메모리 `reference_msw_angelray_skill`).

## Status checklist
> States: ⬜ not started · 🟡 implemented (untested) · ✅ tested.

- ✅ T1. 잠재·에디셔널 옵션 풀 교체 — 검증: 20롤 잡옵 0건, 새 풀 샘플·무기 레전드리 정상
- ✅ T2. 스탯 파서 정비 — 크뎀→데미지 오합산 수정(3곳), 쿨감 "-N초" 파스, CalcCritRate 크뎀 제외 (빌드·롤 검증)
- ✅ T3. 잠재 메소 단일화 — 검증: 부여 -20,000(부여 플래그·레어·옵션3), 메소 재설정 -100,000(옵션 리롤)
- ✅ T4. 포션 상점 실메소 전환 — PotionShopMeso 스토리지·초기화 전부 제거 (빌드 검증, 실구매는 T7 사용자 확인)
- ✅ T5. 지역 메소 티어 — 검증: hunting01=T1/001000003=T2/104020000=T7/105100301=T10/monsterzone=T1, 메소 롤 59/1,356/9,200 (기본값 ±20% 범위)
- ✅ T6. 티어 개방 레벨 게이트 — 검증: 서버 레벨 3 인식, hunting01 통과·T10맵 차단(토스트 발송)
- 🟡 T7. 통합 검증 — 로직 전부 로그 검증 완료. ⚠️ needs user test: ① 실사냥에서 몬스터 메소 드랍량 체감 ② 포탈로 상위 지역 진입 시 차단 토스트가 화면에 뜨는지 ③ 포션 상점 실메소 구매

## 맵→티어 배정 (v1)
| 지역 | 체인 | 티어 |
|---|---|---|
| region1 (hunting01, 15맵) | idx 1~5 / 6~10 / 11~15 | T1 / T2 / T3 |
| region2 (hunting02, 48맵) | idx 1~12 / 13~24 / 25~36 / 37~48 | T4 / T5 / T6 / T7 |
| region3 (hunting03, 24맵) | idx 1~8 / 9~16 / 17~24 | T8 / T9 / T10 |
| 로비 | hunting01=T1 · hunting02=T4 · hunting03=T8 | 로비 자체가 지역 게이트 |
| map01(마을)·monsterzone·기타 | T1 | 게이트 없음 |

## Risks / cautions
- 신규 `@Logic` 상호참조(LEA-1118) — refresh 2회.
- 서버 레벨은 `MaxHp=50+레벨×10` 역산 — 클라 UpdateBars가 0.5초마다 보고하므로 로그인 직후 수 초간 부정확할 수 있음(게이트는 여유 있게 허용 방향으로 실패).
- 큐브 드랍은 보너스로 유지 — 큐브 탭(기존)과 메소 탭이 공존.
- GDD §4.3의 "큐브 상점 판매"는 "강화창 메소 부여·재설정 직접 통합"으로 구현 방식 변경 (§9 로그) — 신규 상점 UI 없이 동일한 경제 효과.
