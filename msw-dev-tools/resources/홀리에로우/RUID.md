# 홀리 에로우 (2차) 리소스 RUID 대응표

원본 출처: 사용자 제공 클래식 아트 (`스킬/홀리 에로우/`). WZ origin 값은 `ori.txt` 참고.
사용음/적중음은 MSW 라이브러리 원본 팩(`skill/230.img/skill/2301005` 홀리 애로우)의 `_audio/Use`/`_audio/Hit`을 재사용한다.

| 파일 | 용도 | RUID |
|---|---|---|
| icon.png | 스킬 아이콘 (32x32) | `ded9f8d0b8ba42d6af429e1653dfd039` |
| (라이브러리) _audio/Use | 사용음 | `9af8818422a04d12877fb9e1c30573a8` |
| (라이브러리) _audio/Hit | 적중음 | `d21f05522bef4ffeae3045d7cdbafafe` |

## 패딩 정렬본 (실사용 - 코드가 참조하는 것은 이쪽)

`padded/` 폴더에 각 시퀀스를 동일 캔버스로 패딩하고 WZ origin을 캔버스 한 점에 정렬해 업로드했다.
- effect(7장, 프레임당 100ms): 캔버스 143×89, origin 정렬점 (103,76) → 중심 대비 dx=+31.5px, dy=+31.5px.
  origin을 캐릭터 발끝(0,0)에 두려면 스프라이트 중심을 (−0.315×방향, +0.315)에 배치(왼쪽 보기 기준, FlipX 시 x부호 반전).
- ball(3장, 애니메이션 화살): 캔버스 83×11, origin 정렬점 (41,5) ≈ 중앙. 발사체에서 SpriteRUID를 순환 교체해 재생.
- hit(3장, 프레임당 80ms): 캔버스 136×136, origin 정렬점 (68,68) = 정확히 중앙 → 부착점 보정 불필요.

| 파일(padded/) | RUID |
|---|---|
| ball0.png | `d8275b5454a84af580d7dc865ae7ada0` |
| ball1.png | `f07b1a483b564ef590bd026dc36c4422` |
| ball2.png | `863eab6bbf1d486794ed8335f4f8c86d` |
| effect0.png | `d9e3726f83b648cbb235ff2ec77f2904` |
| effect1.png | `ffd0471aa2654f0f83d52f9437a69451` |
| effect2.png | `cdd3bb9a395644a7bf44b52751cf695a` |
| effect3.png | `b3b8ccb8e5a247c28402d470aadc379c` |
| effect4.png | `c96717e1d97042f589ea2da562525ad4` |
| effect5.png | `ffdc4a624af340e093d6ebee921349f1` |
| effect6.png | `801d3ae9a54e4b6d965ac2ba5565cfde` |
| hit0.png | `8edf33f4b3b34ddcb14cb87a8c6cff12` |
| hit1.png | `93570ada189943b2a9ddb534fb487f81` |
| hit2.png | `064dd5feb22b4d1fb5bc139a479128c2` |
