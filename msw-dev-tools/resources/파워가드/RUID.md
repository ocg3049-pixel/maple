# 파워가드(2차 버프) - 업로드 RUID 대응표

구버전 메이플 클라이언트 `Skill.wz`에서 추출한 원본. **모션 alert2 / 프레임 간격 90ms**(4종 공통).
16프레임 × 90ms = 1.44초.

| 원본 파일 | 용도 | RUID |
|---|---|---|
| skill.1101007.icon.png | 스킬 아이콘 | 130a612ff85c4eae9e9f52adb9d7d4a9 |
| 1.png | 프레임1 | 3697356e16ba486cb9069c432d976235 |
| 2.png | 프레임2 | d3c16c82974b4933b03eeba3c2ec644c |
| 3.png | 프레임3 | 88b7df45f13e43f5acdb374b9d5286a8 |
| 4.png | 프레임4 | f12bdb312e404be5a58e7fb157ee9b8f |
| 5.png | 프레임5 | b68ea6ee3e0445a0898f02da53070dab |
| 6.png | 프레임6 | 8bac5a8b9fe04382a50afac0bc65a994 |
| 7.png | 프레임7 | 04ab10c58c174b27b11be0beaf30f1b9 |
| 8.png | 프레임8 | 23a03201d15f46dc8b7d34d9af562c04 |
| 9.png | 프레임9 | 14d58140ffe94bb383d8ce4fb7fef2d5 |
| 10.png | 프레임10 | b3199ee4a4ec48fc84a6aab4a824cd74 |
| 11.png | 프레임11 | b1585d55ff8f4bb2af9e23d0fc4abe72 |
| 12_.png | 프레임12 | a52d7487325540fea53e92d14b4e023f |
| 13.png | 프레임13 | 6fcc6e7183704cff9ec8a356ff477c64 |
| 14.png | 프레임14 | a49bed1bd7f04571b78a6507bcc5f2b2 |
| 15.png | 프레임15 | 88175dd62ea3411faffee0446b5716f6 |
| 16.png | 프레임16 | 5e9e7bdbc0624cd8b9aac4698f3ade58 |

## 라이브러리에서 그대로 쓰는 것

원본 팩 `skill/800033.img/skill/80003317`(파워 가드)엔 사운드가 없다 → 기존 버프 사용음
(`a83d56a314fd449cad236fd7d9b2fa63`, 부스터가 쓰던 것)을 재사용한다.
- 전부 sprite - 프레임 교체 방식 애니메이션.
