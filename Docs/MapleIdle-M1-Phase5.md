# 메이플 자동사냥 RPG — Phase 5 상세 계획 "실측으로 보정한다 (캘리브레이션)"

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue the build, load the `msw-planning` skill FIRST and resume through it (read `Archive/As-built.md` + the GDD → reconstruct state). **Before implementing tasks or updating any `⬜/🟡/✅` state, Read the skill's `references/build-management.md` IN FULL.**
> Parent doc: `MapleIdle-M1-GDD.md` · This Phase's goal: 밸런스 수치 전부가 CSV로 이관되어 코드 수정 없이 튜닝 가능하고, 템포 목표(1일 Lv40)가 시뮬레이션으로 1차 보정된다.
> **Skills to reference (this Phase)**: `msw-scripting`(+`verify-checklist.md`) · `msw-general/references/dataset.md`(UserDataSet 구조·`_DataService` API).

## Status checklist
> States: ⬜ not started · 🟡 implemented (untested) · ✅ tested.

- ✅ T1. 밸런스 CSV 5종 생성 — `RootDesk/MyDesk/Balance/` 페어 10파일 (LevelCurve 200행 / StarforceTable 11구간 / RegionTier 11티어 / HeroSkillTable 14스킬 / ShopPrice 6키). (08-03 사용자 피드백으로 LevelCurve v3·StarforceTable v2 재생성 — CSV 로드 재검증 완료: 200행/11구간)
- ✅ T2. 로더 연결 — 4개 시스템 CSV 우선 + pcall 폴백. 검증: 5종 전부 "CSV 로드 완료" 로그 (폴백 미사용)
- 🟡 T3. 템포 캘리브레이션 — (v3 재보정) 몬테카를로 앵커가 스타포스 실물 CP와 최대 24배 어긋나 폐기, **스타포스 실물 CP 앵커링**으로 교체: Lv40=13k(12성×6)/70=72k(17성)/120=250k(20~21성)/160=722k(23성 — "22~24성=160" 사용자 앵커). ⚠️ needs user test: 실플레이 템포(일차별 도달 성 수) 체감 — 어긋나면 스타포스 비용·박스 공급으로 조정
- 🟡 T4. 통합 검증 — (v3 기준 재검증 부분 완료) CSV 200행/11구간 로드, band5 파괴5%·1,000메소, 모자16성+무기3성 캐릭 DisplayLevel=12 정상. ⚠️ needs user test: HUD 레벨 표시(Lv756 버그 수정 후), 5성대 파괴 발생, 박스 드랍 빈도 체감

## CSV 스키마 (v1)
| 파일 | 컬럼 | 소비처 |
|---|---|---|
| LevelCurve | level, requiredCP (1~200) | `CharInfoManager.GetLevelForEquipCP` |
| StarforceTable | minStar, success, keep, drop, destroy, cost | `EnhancementManager.GetStarforceBand` (minStar ≤ 현재성 중 최대 행) |
| RegionTier | tier, openLevel, meso | `RegionTierLogic.GetTierInfo` (서버) |
| HeroSkillTable | name, reqLevel, master | `SkillManager.GetSkillRequiredLevel`/`GetSkillPowerMultiplier` |
| ShopPrice | key, price (grant_potential/reset_potential/reset_additional/rebuy_armor/rebuy_weapon/potion) | `EnhancementManager` 가격 4곳 (+포션은 문서화만 — PotionShopManager property 유지) |

## Risks / cautions
- CSV 셀은 전부 문자열 — `tonumber` 필수, 빈 셀은 "" 체크.
- 자동사냥 미구현(로드맵 M2)이라 **실측 캘리브레이션은 시뮬레이션으로 대체**하고, 자동사냥 구현 후 실측 재보정을 로드맵에 기록.
- 데이터셋 로드는 캐싱(_T) — CSV 수정 후에는 재접속(또는 refresh+재플레이)해야 반영.
