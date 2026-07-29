# 엔젤레이 (4차) 리소스 RUID 대응표

원본 출처: 사용자 제공 클래식 아트 (`스킬/엔젤레이/`). WZ origin 값은 `ori.txt` 참고.
- 원본 폴더의 `effect012.png`는 크기/ori.txt 대조 결과 12번 프레임이라 `effect12.png`로 이름을 바로잡아 보관했다.
- 히트 사운드는 MSW 라이브러리 원본 팩(`skill/232.img/skill/2321007` 엔젤레이 강화)의 `_audio/Hit`을 재사용한다(팩에 Use 오디오 없음).

| 파일 | 용도 | RUID |
|---|---|---|
| icon.png | 스킬 아이콘 (32x32) | `3f99493e69b64086b41945a3e5be08c2` |
| ball0.png | 투사체 (90x19, 단일 프레임) | `4d01ad5c78c14a8fb954fb76713048c4` |
| (라이브러리) _audio/Hit | 적중음 | `c2ca06323f67485e9355ff4d097ae77b` |

## 패딩 정렬본 (실사용 - 코드가 참조하는 것은 이쪽)

원본은 프레임마다 크기/origin이 달라 그대로 쓰면 프레임별 위치가 흔들린다(블레스/분노와 동일).
`padded/` 폴더에 각 시퀀스를 동일 캔버스로 패딩하고 WZ origin을 캔버스 한 점에 정렬해 업로드했다.
- effect: 캔버스 185×194, origin 정렬점 (112,135) → 중심 대비 dx=+19.5px, dy=+38px.
  origin을 캐릭터 발끝(0,0)에 두려면 스프라이트 중심을 (−0.195×방향, +0.38)에 배치.
- hit: 캔버스 105×114, origin 정렬점 (52,60) → 중심 대비 dx=−0.5px, dy=+3px.
  origin을 대상 부착점에 두려면 중심을 (+0.005, +0.03)에 배치(사실상 0).
- 프레임 딜레이(ori.txt): effect/hit 모두 프레임당 60ms.

| 파일(padded/) | RUID |
|---|---|
| effect0.png | `f589e80ef37e4e2fbbe99b97915b329e` |
| effect1.png | `9c4e6931f24c4aaa92363594c6c181e1` |
| effect2.png | `6b3b8eab7b5e4cc28c73684fe9794b91` |
| effect3.png | `f0b14236ed864b63bc2a04c62722fe48` |
| effect4.png | `fdfd7c732ac64deaa1513b497c33fc9c` |
| effect5.png | `8cebe7a19ebd4a58a48989e4e1f2d1a3` |
| effect6.png | `ce02b0dd95744002b6f3d9671268257f` |
| effect7.png | `da302311a55b4795b3e54ab7d2dbe17f` |
| effect8.png | `02c11b4b3caf47c693a5eb960eec1138` |
| effect9.png | `92e6e9e493ac4b89956df9f209d04b21` |
| effect10.png | `3061ea19cdb34f40a503645097b2a891` |
| effect11.png | `5abf2cb1687340c8bed551d2ea178dc2` |
| effect12.png | `921860f9bee942ccb572a21439b6f6e0` |
| effect13.png | `13eb62c1a0094965adbb19e3dbb5d4f0` |
| effect14.png | `848cc0f7534642c9b5716c2c4f8bd30a` |
| hit0.png | `0abe20dbc819415ab9ec999e72de7470` |
| hit1.png | `d574fb40143644ba8606c747bfeed6c8` |
| hit2.png | `9eda02efae944e99887841859f16e3ad` |
| hit3.png | `ae3a2ccb65ce476ab207ce29193ce266` |
| hit4.png | `310c513bde8a4288874116caf4201cb8` |
| hit5.png | `5e1ce983abae4e39b95b5222184ce74d` |
| hit6.png | `3f89846e2bbd4c2aa69a46c6158df162` |
