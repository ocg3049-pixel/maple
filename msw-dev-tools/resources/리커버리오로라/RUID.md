# 리커버리 오로라 리소스 RUID 대응표

원본 출처: 사용자 제공 클래식 아트 (`스킬/리커버리 오로라/`). WZ origin 값은 `ori.txt` 참고.
프레임 딜레이: 전 프레임 120ms (ori.txt).

원본 프레임(0~19.png)은 크기가 제각각(391~412 × 135~150)이라 그대로 순환 재생하면
흔들림(지진)이 발생한다(블레스/분노와 동일). `padded/` 폴더에 20프레임 전부를
**동일 캔버스 412×150**으로 패딩하고 WZ origin을 캔버스 한 점 **(216,140)**에 정렬해
업로드했다 — 코드가 참조하는 것은 padded 쪽 RUID다.

- 배치 공식(중심 피벗): 오로라 기준점(=시전자 발밑)을 P라 하면 엔티티 위치 = (P.x - 0.10, P.y + 0.65)

| 파일 | 용도 | RUID |
|---|---|---|
| icon.png | 스킬 아이콘 (32x32) | `16d7498e26154b9393af469d1d82c7ca` |
| padded/0.png | 오로라 프레임 0 | `37e2991ed2844a00b1b5060cda90f9c8` |
| padded/1.png | 오로라 프레임 1 | `dff2c72fbf0647b3b0b6c02c9c3c05af` |
| padded/2.png | 오로라 프레임 2 | `41bf5a1e707c488791c2e26f55a671f1` |
| padded/3.png | 오로라 프레임 3 | `63fff23d556c40a3a6d37ebb6802c1ea` |
| padded/4.png | 오로라 프레임 4 | `f5c4e5350eb04a1fbcff799b5dd5fbab` |
| padded/5.png | 오로라 프레임 5 | `4e16295d271d4fdeba2a04f7e07120de` |
| padded/6.png | 오로라 프레임 6 | `d4861b4c548a4275a63756bf53026b57` |
| padded/7.png | 오로라 프레임 7 | `2362c1684ea3458db2aaee6d0e621f97` |
| padded/8.png | 오로라 프레임 8 | `139fbbbd6dfb4e28a266c5acc7861083` |
| padded/9.png | 오로라 프레임 9 | `51cf28032ba44dc1a3019b4747d66e9d` |
| padded/10.png | 오로라 프레임 10 | `b69844a9d8d44a4491bbc766b463d415` |
| padded/11.png | 오로라 프레임 11 | `0c67dc83e10447309402d0d11d1f9f0a` |
| padded/12.png | 오로라 프레임 12 | `04bd1c39120842728bb9a4c629d9aae2` |
| padded/13.png | 오로라 프레임 13 | `e74dddbbfd92484a8a31a6110e72ccff` |
| padded/14.png | 오로라 프레임 14 | `2c4cc1cb7ce9433c8d9864bbf5fe3ae6` |
| padded/15.png | 오로라 프레임 15 | `9c032d93a40c4ffa859229983803c508` |
| padded/16.png | 오로라 프레임 16 | `f01b1676d8244ae0b9151a5c42dc9c21` |
| padded/17.png | 오로라 프레임 17 | `7436266d3b58401cac27a7d136b83c1f` |
| padded/18.png | 오로라 프레임 18 | `2dbb388d69934e5c8f516cfb019381e4` |
| padded/19.png | 오로라 프레임 19 | `bcc8e978c0e44256a8e9cddcb39d73bb` |

사용처: `Skills/RecoveryAuraVisual.mlua`(프레임 순환 재생, 투명도 60%),
`SkillManager.mlua` 스킬 목록 탭 IV 아이콘.
