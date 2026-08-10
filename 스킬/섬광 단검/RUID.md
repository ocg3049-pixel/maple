# 섬광 투척 단검 스프라이트

- **RUID**: `ea55ff6b7e1748a6aeda07c6e78c665c`
- **이름**: ThrownDagger_Flash
- **분류**: sprite / skill
- **크기**: 128x64 px (논리 그리드 64x32, 2px/dot)
- **스타일**: maple cartoon (selout · 계단식 음영 · 테이퍼 실루엣 AA)
- **속성**: filter_mode=Point, wrap_mode=Clamp, pivot=(0.5, 0.5)

## 왜 만들었나

장착 무기를 `thumbnail://`로 그리던 기존 방식은 **인벤토리 아이콘**이라 드롭 섀도가
비트맵에 박혀 있어 날아갈 때 그림자까지 같이 날아갔다. `avataritem`은 `thumbnail://`
없이는 렌더 자체가 안 되므로(엔진 사양) 그림자를 뗄 방법이 없어 전용 sprite를 만들었다.

## 방향 규약 (중요)

**칼끝이 오른쪽(+x)** 을 향하도록 그렸다. 그래서 `PlayerAttack.AttackFlash`는
`ZRotation = math.deg(math.atan(dirY, dirX))` 로 **보정각 없이** 쓴다.
(예전 아이템 썸네일은 45도 대각 기준이라 -45/+135 보정이 필요했고, 그 값이 어긋나
"칼자루가 앞서 날아가는" 신고로 이어졌다.)

인게임 실측: 0°/45°/90° 배치 시 칼끝이 정확히 그 방향을 향함.

## 재생성

`dagger_source.js`를 msw-painter의 렌더러로 다시 그릴 수 있다:

    node scripts/render.cjs --type canvas --in dagger_source.js --out out.png --width 128 --height 64
