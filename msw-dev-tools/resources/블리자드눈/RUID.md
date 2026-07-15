# 블리자드 눈 리소스 RUID 대응표

업로드 방식: `asset_create_account_resource_storage_item` (category=sprite, subcategory=skill)
사용처: `RootDesk/MyDesk/UI/BlizzardSnowfall.mlua` + `ui/BlizzardSnowGroup.ui` (화면 폭설)

> **바닥에 쌓이는 눈은 요청에 따라 제거됐다.** 아래 "바닥 눈 조각 6종"은 업로드만 되어 있고
> 현재 코드에서 쓰지 않는다(나중에 다시 필요하면 그대로 쓰면 된다).

## 원본 (MSW 기본 리소스, 스프라이트 시트)

| 원본 RUID | 크기 | 내용 |
|---|---|---|
| `3561b2391d5b4ce180172e4bb9f27c6a` | 528x444 | 바닥에 쌓인 눈 덩어리 여러 개가 흩어진 한 장 |
| `91009accfdf5433d8498d1b0a7c80257` | 328x476 | 〃 (풀 가장자리 보이는 눈) |
| `b3f740a137c04aa19c716911362b5918` | 400x280 | 〃 (얇고 긴 눈) |
| `2d507f2d249f4654b461600a02599b8c` | 116x128 | 눈송이/눈발/작은 알갱이가 흩어진 한 장 |

원본 한 장에는 눈 덩어리가 여러 개 흩어져 있어서 그대로 붙이면 "바닥에 쌓인 눈"이 되지 않는다.
→ 알파 채널 연결 성분(8-이웃 BFS)으로 **덩어리 하나씩 잘라내어** 개별 스프라이트로 업로드했다.
(슬라이스 스크립트: `slice.py` — bbox 6px 이내 조각은 그림자/부스러기로 보고 한 덩어리로 병합)

## 바닥에 쌓이는 눈 조각 (6종) — **현재 미사용**

| 파일 | 원본 시트 | 크기(px) | 리소스명 | RUID |
|---|---|---|---|---|
| snow_A1.png | 3561b239 | 129x92 | Blizzard_Snow_A1 | `f7df0f0237ec4c0a8d9d8d047bab210e` |
| snow_A2.png | 3561b239 | 165x59 | Blizzard_Snow_A2 | `53cf0f4b09c84d35b75b0d153f7bac41` |
| snow_A4.png | 3561b239 | 118x42 | Blizzard_Snow_A4 | `d4c93debfb074a28bd047106f9d6d8cf` |
| snow_B2.png | 91009acc | 152x69 | Blizzard_Snow_B2 | `2c069a1f30cf4fd88635a0b15b85adb3` |
| snow_C1.png | b3f740a1 | 133x56 | Blizzard_Snow_C1 | `5d78a9090e0f4f57936f3277ba0a95d3` |
| snow_C2.png | b3f740a1 | 90x25 | Blizzard_Snow_C2 | `9e294ab9a5ec4c63bd35ba9391c6d6e0` |

> 다시 쓸 경우: 6종을 랜덤 선택 + 좌우 반전 + 크기 0.45~0.85배로 섞어야 같은 그림 반복이 티가 안 난다.
> 스프라이트 피벗이 가운데라 발판에 얹으려면 `y = 발판y + (높이px/100 * scale)/2 - 0.02` 로 올려야 한다.

## 폭설 눈송이 (3종, 화면 UI 오버레이에서 우상 → 좌하로 낙하) — **사용 중**

`ui/BlizzardSnowGroup.ui`: 그룹 → Batch1~5 → 눈송이 70개씩 = 350개(알갱이 190 / 눈발 105 / 결정 55).

⚠ 두 가지 함정(둘 다 실측으로 확인, 에러 로그 없이 조용히 실패):
1. **`DefaultGroup.ui`에 넣으면 안 된다** — 이미 엔티티가 2318개라, 뒤에 붙인 350개가 런타임에
   통째로 누락된다(70개는 올라왔다). 그래서 전용 `.ui` 그룹 파일로 분리했다.
2. **그룹 displayOrder/GroupOrder에 음수를 주면 안 된다** — `-1`로 두면 엔티티/알파/좌표가 전부
   정상인데도 화면에 아무것도 안 그려진다. 현재 `6`.

| 파일 | 크기(px) | 리소스명 | RUID |
|---|---|---|---|
| flake_2.png | 20x22 | Blizzard_Flake_1 | `8b2d0a2984404efdaa6c6677e7bce664` |
| flake_3.png | 23x13 | Blizzard_Flake_2 | `78a18913fcd445b5aafd394db26073a4` |
| flake_5.png | 5x5 | Blizzard_Flake_3 | `bd783daac63246d3b352cf66d324688d` |

> 잘라낸 나머지 조각(flake_1/4/6~15)은 업로드하지 않았다(중복이거나 너무 흐릿함). 원본 png는 이 폴더에 남아 있다.
