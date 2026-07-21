# 서먼 다크드래곤(2차) - 업로드 RUID 대응표

사용자 제공 드래곤 시트(idle/buf/stand, /Users/florence/Downloads)를 연결요소로 슬라이스 →
공통 캔버스 280×278(밑동-중앙 정렬) 패딩 → 45% 축소(126×125, 게임에서 ~1.26유닛) 후 업로드.
소스: final/*.png (idle 5 / buf 6 / stand 5)

스킬 스펙: 2차 버프스킬, 10분. 캐릭터 주변 배회(idle 애니), 소환 시 알파 0→1 페이드인.
20~30초마다 버프 1회(드래곤 머리 위 이펙트): [쿨타임 전체 초기화(이펙트 280d255d…+사운드 c454d997…) /
서먼블랙드래곤(드래곤이 한마리 더 소환, 유저는 재시전 불가) / 콤보어택 / 쉐도우파트너] 중 랜덤.
2~4초마다 공격 1회: stand 자세 전환, 궤적 이펙트(f9b7dfc6/3ea00516/9fad8944/f7d1f362/3d12372b 중 랜덤)를
드래곤→몬스터 각도로 재생, 데미지 전투력 200~300%.

| 프레임 | RUID |
|---|---|
| idle_1 | 7ac2730a18ac47e083a46dc5e879deac |
| idle_2 | fa619b956fad497ca2f3a686985a2319 |
| idle_3 | 4f30d3c01e424ed6a0752a8236a9bb1f |
| idle_4 | cfb1fcf539844ada8ac200500ee0fb39 |
| idle_5 | 43f7075f03254c3c94a5b98c635d1a98 |
| buf_1 | 953bb7366eef4ad79524a050a9f2aa8c |
| buf_2 | 54ff71063a2f4e09a287668b80a1c493 |
| buf_3 | 036e6b099704491daf4f3fd24c4c059e |
| buf_4 | 7b3d8b3a1c984894bbf509177de98f47 |
| buf_5 | b80ee5241abd46ac930cacfc6f77b74c |
| buf_6 | 2d38445668b54dfd946da682d5db517e |
| stand_1 | 87672a20076545599a3db8f49cab3004 |
| stand_2 | 72f34a0b01494325bd89343292d83619 |
| stand_3 | bf23099d75e94310bed5429863c830c5 |
| stand_4 | c16ddf9d7cf04223bc9d44111de8e8ee |
| stand_5 | 6e919b4a2a854e0f9bbedc4e6851a53e |
