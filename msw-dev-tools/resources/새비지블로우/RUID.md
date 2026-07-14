# 새비지블로우 리소스 RUID 대응표

업로드 방식: `asset_create_account_resource_storage_item` (category=sprite, subcategory=skill)
사용처: `RootDesk/MyDesk/Combat/SavageBlowVisual.mlua` (프레임 8장), `RootDesk/MyDesk/Combat/PlayerAttack.mlua` (히트 이펙트), `RootDesk/MyDesk/Skills/SkillManager.mlua` (2차 탭 아이콘)

## 시전 모션 프레임 — **정렬본(aligned/)이 실제 사용본**

원본 8장은 캔버스 폭이 제각각(81~106px)이고, 그 안에서 **공통 요소(파란 문양 다이아몬드)의 x 위치가 최대 15px씩 어긋나** 있었다.
→ 프레임이 바뀔 때마다 그림 전체가 좌우로 튀는 "지진" 현상이 생겨서, 파란 문양을 기준으로 8장을 모두 **같은 캔버스(108×116)** 에 재배치해(`aligned/`) 다시 업로드했다.
(파란 문양이 8장 모두 x=16~94에 정확히 일치한다.)

| 파일 | 원본 크기 | 리소스명 | RUID (**사용 중**) |
|---|---|---|---|
| aligned/1.png | 81x116 → 108x116 | SavageBlow_A1 | `0c10c7f12e7445c2a840c593fbfc9513` |
| aligned/2.png | 96x116 → 108x116 | SavageBlow_A2 | `c517f7f05a844af580b80bf420743ce8` |
| aligned/3.png | 106x116 → 108x116 | SavageBlow_A3 | `3e556b633f4f4b358ae54cf4add11fd7` |
| aligned/4.png | 93x116 → 108x116 | SavageBlow_A4 | `ed2c5cd4ceea4090813802f4143b3cfc` |
| aligned/5.png | 105x116 → 108x116 | SavageBlow_A5 | `d99ee75c6cb041b48067b61fbb8734a0` |
| aligned/6.png | 93x116 → 108x116 | SavageBlow_A6 | `4fa59e6d33d94917a8a4c9ea03745acf` |
| aligned/7.png | 81x116 → 108x116 | SavageBlow_A7 | `f565ca85888249faad6eddf86992a486` |
| aligned/8.png | 81x116 → 108x116 | SavageBlow_A8 | `61d7141ba8d047f4a2b8d514e64d3dfc` |

> 데미지 판정(6타)은 프레임 **2, 3, 4, 5, 6, 8** 이 보이는 순간에 들어간다. 프레임이 바뀔 때마다 히트 사운드가 재생된다.
> 프레임 간격은 `0.12초 × 공격속도배율` (SavageBlowVisual.FrameInterval ↔ PlayerAttack.frameInterval 동일해야 함).

<details>
<summary>원본(정렬 전) RUID — 더 이상 사용하지 않음</summary>

| 파일 | 리소스명 | RUID |
|---|---|---|
| 1.png | SavageBlow_1 | `47a30781e6004b7dbc840d211e56ea85` |
| 2.png | SavageBlow_2 | `273c385a1f804c1aab557c3790e8618b` |
| 3.png | SavageBlow_3 | `9eb8c2245fdc4f95951872a9485f6d96` |
| 4.png | SavageBlow_4 | `945027356f7e48b49d02d89e0e780fd5` |
| 5.png | SavageBlow_5 | `e59bb64df7444b5c9d640562c9b623b6` |
| 6.png | SavageBlow_6 | `5074805b7071422cb7482bbd7e12652b` |
| 7.png | SavageBlow_7 | `ffd50076351745429b4887c7e4376bc8` |
| 8.png | SavageBlow_8 | `1daed69d61794fe2bb5fcede834e9c57` |

</details>

## 히트 이펙트 (3종 중 시전마다 1개를 랜덤 선택 → 그 하나만 6번 재생)

| 파일 | 크기 | 리소스명 | RUID |
|---|---|---|---|
| hit1.png | 35x34 | SavageBlow_Hit1 | `5154d64ae24843a3bc29a878f13768ad` |
| hit2.png | 28x47 | SavageBlow_Hit2 | `45087e25ef5949f68af9fe40c5b3c0a9` |
| hit3.png | 39x53 | SavageBlow_Hit3 | `53a8a9f33fdb42819715399936e1a7fa` |

## 아이콘 (스킬창 2차 탭)

| 파일 | 크기 | 리소스명 | RUID |
|---|---|---|---|
| icon.png | 32x32 | SavageBlow_Icon | `e4e5bf026b7c4976a1842de4418326ab` |

## 기타

- 히트 사운드는 외부 리소스가 아니라 MSW 기본 사운드를 쓴다: `23250468023a4767b32611f2fd8ec49b`
- 정렬본 생성 방법: 각 프레임에서 "파란색 픽셀(b > r+25, alpha>60)"의 bbox를 구해 그 왼쪽 끝을 공통 x=16에 맞추고 108×116 캔버스에 붙여넣기.
