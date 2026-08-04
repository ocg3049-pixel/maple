# 메이플 자동사냥 RPG — Phase 2 상세 계획 "자주 때리고 자주 터진다 (스타포스 재설계)"

> 🔖 **AI note — resuming?** If you're reading this in a new session to continue the build, load the `msw-planning` skill FIRST and resume through it (read `Archive/As-built.md` + the GDD → reconstruct state) — don't treat this as plain implementation and start editing straight from this doc. **Before implementing tasks or updating any `⬜/🟡/✅` state, Read the skill's `references/build-management.md` IN FULL** (state rules · completion cleanups · revision flow).
> Parent doc: `MapleIdle-M1-GDD.md` · This Phase's goal: 스타포스가 GDD §4.2 구간표(성공/유지/하락/파괴·비용)대로 동작하고, 파괴 즉시 기본 장비 재구매 루프가 돌아간다.
> **Skills to reference (this Phase)**: `msw-scripting`(+`verify-checklist.md`) — `.mlua`만 수정, `.ui` 신규 작업 없음(기존 텍스트 엔티티 재사용).

## Status checklist
> States: ⬜ not started · 🟡 implemented (untested) · ✅ tested.

- ✅ T1. 구간별 확률·비용표 도입 — 검증: band0=95/5/0/0/500, band16=45/30/15/10/20k, band40=2/28/40/30/10M (표와 일치)
- ✅ T2. `DoEnhance` 4분기 재설계 — 검증: 저구간 10회(성공8/유지2 → +8강), 중구간 15회(성공3/유지11/**하락1**/파괴0) — 하락 분기 실발동 확인
- ✅ T3. 파괴 → 재구매 루프 — 검증: 재구매 다이얼로그("모자 파괴! 기본 장비 재구매: 10000 메소") → 확인 → 메소 -10,000·기본 모자 지급. 테스트 후 메소·인벤 완전 원복
- ✅ T4. 강화창 UI 갱신 — 검증: RateText "성공 35% | 유지 30% | 하락 20% | 파괴 15%" (17~20 구간표 정확 표시)
- 🟡 T5. 연타 UX — 스타포스 탭 Space = 즉시 강화  ⚠️ needs user test: 실제 연타감
- 🟡 T6. 통합 검증 — 분기·재구매·UI 로그 검증 완료. ⚠️ needs user test: 실플레이에서 랜덤 파괴 자연 발동 → 재구매 다이얼로그 → 레벨 하락까지 한 흐름 확인

## Task detail (요약)
- **T1**: `EnhancementManager`에 밴드 테이블(0~5/5~10/10~12/12~15/15~17/17~20/20~22/22~25/25~30/30~40/40~100). 반환 {success, keep, drop, destroy, cost}. Phase 5에서 `StarforceTable.csv`로 이관 예정(하드코딩 v1).
- **T2**: 단일 롤 누적 판정. 하락은 `enhanceLevel-1`(하한 0) 후 기존 `UpdateInvenItemStars` 재사용(장착 대상이면 장비창 직접 반영 — Phase 1 T6 경로). 파괴 전에 부위 slotIdx를 캡처해 T3에 넘긴다.
- **T3**: `ShowRebuyDialog(slotIdx)` — 기존 ConfirmDialog 재사용, 확인 로직은 `AcceptConfirmDialog()`로 공통화(강화/재구매/안내 3모드). `UIEquipInventoryManager:GrantBasicEquipBySlot(slotIdx)` 신설 — 박스 지급 문자열(모자 연두색머리띠/망토 엔틱벨벳/상의 흰반팔티/장갑 노가다목장갑/신발 가죽샌들/무기 직업별) 재사용, 장비 탭 빈칸 지급 + 저장.
- **T4**: `UpdateStarforceUI`의 RateText를 "성공 N% | 유지 N% | 하락 N% | 파괴 N%"로. CostText는 GetStarforceCost 위임으로 자동 연동.
- **T5**: OnKeyDown Space: 다이얼로그 열림 → AcceptConfirmDialog(재구매 모드 포함), 스타포스 탭 → **즉시 DoEnhance**(연타). 버튼·P키는 확인 다이얼로그 유지.
- **T6 검증 기준**: ① 각 밴드 대표 성수(0/10/15/20/25/40)에서 1000회 샘플 롤 분포가 표 ±3%p ② 하락 시 성 -1·전투력 하락 로그 ③ 파괴→재구매 확인→메소 차감+기본템 지급 로그 ④ 잔액 부족 시 구매 거부.

## Risks / cautions
- ConfirmDialog가 3용도(강화 확인/사용 불가 안내/재구매)로 공유됨 — 모드 플래그(`confirmInfoOnly`, `pendingRebuySlot`) 정리 순서에 주의. 취소 시 모드 리셋 필수.
- 하락·파괴가 잦아 저장 타이밍 중요 — 기존 MarkDirty 경로 재사용.
- 강화는 전부 클라이언트 판정(기존 구조 유지) — 보안 강화는 이번 범위 아님.
