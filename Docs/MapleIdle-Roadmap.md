# 메이플 자동사냥 RPG — Milestone roadmap

> 🔖 Cross-milestone direction: vision · release criteria · one slot per milestone · Backlog.
> This is NOT a GDD — the active milestone's contract is its `-M<n>-GDD.md`. Updated only at controlled moments.
> Last updated: 2026-08-03

## Vision & release criteria
- Vision: 장비 강화(스타포스·잠재)를 무척 자주 시도하고 무척 자주 터뜨리는 재미로 굴러가는 자동사냥 메이플 액션 — 레벨은 순수 장비 전투력의 환산값.
- Release criteria: ① 자동사냥으로 방치 성장 루프가 실제로 돌아간다 ② 히어로 기준 밸런스 템포(1/7/20/30일 = Lv40/70/120/160)가 실측으로 맞는다 ③ 10개 직업 모두 각자의 스킬 테이블로 동일 템포를 탄다 ④ 진행 상태(장비·스킬 투자)가 저장된다.

## Milestones
| M | Theme (one line) | Status |
|---|---|---|
| M1 | 히어로 기준 밸런스 프레임워크 (레벨 커브·스타포스·메소 경제·스킬 테이블) → `MapleIdle-M1-GDD.md` | ⏳ user-test pending |
| M2 | 자동사냥 시스템 구현 (자동 이동·자동 스킬·방치 루프 — M1 밸런스의 전제) → `MapleIdle-M2-GDD.md` | 🔨 active |
| M3+ | 직업별 밸런스 확장 — 팔라딘부터 한 직업씩 히어로 틀 복제·수정 (직업당 1슬롯) | candidate |
| M(후순위) | 160+ 엔드콘텐츠 (벽 완화·신규 티어·상위 성 구간 개방·**잠금 장비칸 10~25 순차 개방** — 반지×4/귀고리/펜던트/벨트/포켓/어깨/훈장/안드로이드/하트/칭호/뱃지/보조무기/엠블렘, 번호는 M1 GDD §4.6에 확정) | candidate |

## Backlog (wanted, not yet slotted)
- 밸런스 실측 재보정 — 자동사냥(M2) 구현 후 시간당 처치 수·메소 수입을 실측해 `Balance/LevelCurve.csv`·`RegionTier.csv` 재캘리브레이션 (M1은 1,000처치/h 가정 시뮬 기준)
- 스탯·HP 보강형 스킬 추가 (사용자 예고 — 스킬포인트 소비처 확장) — 히어로 틀 확정 후
- 보스 몬스터 시스템 (보스 데미지% 옵션의 실효화 전제) — 엔드콘텐츠와 함께 검토
- 몬스터 플레이스홀더(몬스터1~70)에 실제 몬스터 종류 대입 (밸런스와 독립 — 언제든 가능)
