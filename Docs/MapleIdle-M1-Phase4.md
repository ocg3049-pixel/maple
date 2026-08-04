# 메이플 자동사냥 RPG — Phase 4 상세 계획 "히어로 스킬이 표대로 움직인다"

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue the build, load the `msw-planning` skill FIRST and resume through it (read `Archive/As-built.md` + the GDD → reconstruct state). **Before implementing tasks or updating any `⬜/🟡/✅` state, Read the skill's `references/build-management.md` IN FULL.**
> Parent doc: `MapleIdle-M1-GDD.md` · This Phase's goal: 히어로 13스킬에 레벨 제한·스킬포인트(3×레벨)·위력 배율이 적용되고, 레벨이 떨어지면 스킬이 약해지며, 투자 상태가 저장된다.
> **Skills to reference (this Phase)**: `msw-scripting`(+`verify-checklist.md`).

## Status checklist
> States: ⬜ not started · 🟡 implemented (untested) · ✅ tested.

- ✅ T1. 히어로 스킬 목록·레벨 제한 확정 — 실구현 14스킬 기준 GDD §4.5 표 갱신 + `GetSkillRequiredLevel` 테이블
- ✅ T2. 스킬포인트 총량 = 3×레벨 — 검증: Lv3 → 남은 SP 9, 10pt 투자 시 0 (예산 초과 인식)
- ✅ T3. 히어로 14스킬 spendable 전환 — maxLevel 부여 + 기본 level 0 초기화 (14종 패치 확인)
- ✅ T4. 위력 배율 적용 — 검증: 미투자 파워스트라이크 0.39(=0.6×레벨페널티0.65), 10pt 투자 0.507(예산초과 축소 반영), 브랜디쉬 0.18(하한), 비spendable 1.0(타 직업 무영향)
- ✅ T5. 기본 크리티컬 확률 50% → 10% — 검증: critRate = 10 + 장비 크확 8 = 18
- ✅ T6. 쿨감 옵션 실적용 — 검증: 쿨감 -2초 인식 → 30s→28 / 5s→3 / 3s 미적용(<5s) / 해제 시 0
- ✅ T7. 스킬 투자 저장 — Export "파워스트라이크=10" 확인, "SP" 라인 접두사 충돌 처리 (재로그인 왕복은 T8 사용자 확인에 포함)
- 🟡 T8. 통합 검증 — 수식·저장 로그 검증 완료. ⚠️ needs user test: ① 스킬창에서 히어로 스킬에 "+" 분배 → SP 감소·데미지 상승 체감 ② 재로그인 후 투자 유지 ③ **주의: 미투자 스킬 데미지가 0.6배(레벨 제한 미달이면 그 이하)로 낮아진 것이 정상 동작**

## 히어로 스킬 레벨 제한·마스터 (v1)
| 차수 | 스킬 | 레벨 제한 | 마스터 pt |
|---|---|---|---|
| 1차 | 파워스트라이크 10 · 러시 15 · 슬래시블러스트 20 | 10~29 | 20 / 15 / 20 |
| 2차 | 부스터 30 · 파이널어택 35 · 분노 40 · 파워가드 50 · 섬광 60 | 30~69 | 10 / 20 / 10 / 10 / 20 |
| 3차 | 콤보 어택 70 · 패닉 85 · 코마 100 | 70~119 | 10 / 20 / 20 |
| 4차 | 브랜디쉬 120 · 어드밴스드 콤보 135 · 돌진 150 | 120+ | 20 / 10 / 15 |

## Risks / cautions
- **미투자 스킬 = 배율 0.6 (사용 가능)** — GDD의 "1pt 투자해야 사용 가능"은 기존 플레이 흐름이 깨져 완화 (§9 로그). 잠금 전환은 이 배율 함수 한 곳만 고치면 됨.
- 위력 훅은 `GetEffectiveCombatPower` 경유 스킬에만 적용 — `CalcCombatPower` 직접 사용 스킬(지속 소환수·힐 등 비공격)은 의도적으로 제외.
- SP는 레벨과 함께 오르내림 — 파괴로 레벨이 떨어지면 총투자 > 3×레벨이 되어 전 스킬 위력이 비율로 약화 (요청 사양).
