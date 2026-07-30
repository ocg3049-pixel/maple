# 이프리트(4차 소환) 리소스 RUID 표

**업로드한 리소스가 없다.** 사용자 지정대로 MSW 라이브러리 몹 팩 `mob/8610015.img`("이프리트")의
클립·이펙트·사운드를 그대로 쓴다. 엘퀴네스가 사용자 제공 낱장 아트라 66장을 올려야 했던 것과
정반대의 경우다(그래서 이 폴더에는 원본 이미지도 없다).

| 용도 | rel_path | 프레임 | RUID |
|---|---|:--:|---|
| 제자리 | `stand` (animationclip 145x158) | 6 | `23b5af3095bd4be6af97422e7bf98df4` |
| 이동 | `move` (animationclip 147x157) | 6 | `c60a03ce4cfd46c2a0a964b8258f2864` |
| 공격 | `attack1` (animationclip 150x160) | 19 | `12eb937249b94fa1a4a2b28039b42f9e` |
| 소멸 | `die1` (animationclip 149x164) | 12 | `6d33d5e5eed64028beab08a5118acbe3` |
| 타격 이펙트 | `attack1/info/hit` (animationclip 98x86) | 8 | `05959535067a4e65a7c8db8ff235670d` |
| 공격음 | `_audio/Attack1` | - | `d769daa17e6c4e9eb78a57e5a02f80a9` |
| 피격음(미사용) | `_audio/Damage` | - | `cf13ce9727aa448c97334e204036d3fa` |
| 사망음(미사용) | `_audio/Die` | - | `cef248e1dd694966aa222963781287b0` |

스킬 아이콘은 스킬 목록에 원래 들어 있던 `80add5d3f2364d01b7c5c973c884324e`를 그대로 쓴다.

## animationclip이라 코드가 단순하다

`SpriteRendererComponent.SpriteRUID`에 **animationclip RUID를 넣으면 엔진이 알아서 재생**한다
(용 소환/SummonDragon과 같은 방식). 그래서 엘퀴네스처럼 프레임 테이블·오프셋 표·수동 프레임
교체가 전혀 필요 없고, 상태에 따라 클립 RUID만 바꿔 끼우면 된다.

- 타격 이펙트도 클립이라 `PlayEffectAttached` 한 줄로 끝난다
  (엘퀴네스는 낱장 8장이라 엔티티를 스폰해 SpriteRUID를 갈아끼워야 했다).
- 배치: 클립 피벗이 중앙이라 홈(주인 뒤 1.1 / 위 0.75)에 **오프셋 0**으로 놓는다.
  처음 +0.5를 줬더니 실측 dy가 1.18까지 올라가 주인 머리 위로 한참 떠버렸다(스크린샷 확인 후 수정).
- 배율 0.85(약 1.36유닛). 시트 원본이 왼쪽을 보므로 오른쪽을 볼 때만 `FlipX`.

## 등장 = die1 클립의 역재생 (사용자 요청)

팩에 등장 전용 클립이 없어서 **소멸(die1) 모션을 거꾸로 돌려** "흩어진 조각이 다시 모여
형태를 갖추는" 등장 연출로 쓴다. 소환 직후 1.44초 동안 재생된다.

⚠ **MSW는 animationclip 역방향 재생을 지원하지 않는다**(`PlayRate` 음수도 보장되지 않음).
대신 `SpriteRendererComponent`의 `StartFrameIndex == EndFrameIndex`로 **클립을 특정 프레임에
고정**할 수 있으므로, 마지막 프레임(11)부터 0까지 120ms 간격으로 내려가며 고정해 역재생을 만든다.

```lua
local idx = 11 - math.floor(sinceSpawn / 0.12)   -- 12프레임 × 120ms = 1.44초
sr.StartFrameIndex = idx
sr.EndFrameIndex   = idx
```

**등장이 끝나면 반드시 `StartFrameIndex=0` / `EndFrameIndex=2147483647`로 되돌려야 한다.**
안 그러면 이후 stand/move/attack 클립이 전부 한 프레임에 멈춘다.
등장 모션과 공격 모션이 겹치지 않도록 첫 공격도 소환 후 1.5초로 미뤘다(엘퀴네스와 같은 문제).

실측 검증(프레임 인덱스 샘플링): `0.1s→11 / 0.4s→9 / 0.8s→5 / 1.2s→2 / 1.5s→stand 전체재생(0~max)`.

## 사양 (엘퀴네스와 동일 규격)

지속 10분 / 쿨타임 30초 / 재시전 시 교체 / 주인 곁 체류 / 반경 6.5 안 최대 6마리 동시 타격 /
대상당 전투력 200%~300% / 공격 주기 4.8초(모션 19프레임 ≈ 2.25초, 타격은 1.44초 지점).
구현: `Skills/IfritSummon.mlua` + PlayerAttack `SummonIfrit`/`DealIfritHit`/`skill.ifrit` +
SkillManager 4차 탭 "이프리트" 분기 + `RequestFireIfrit`.
