# 샤이닝 레이 (3차) 리소스 RUID 대응표

원본 출처: 사용자 제공 클래식 아트 (`스킬/샤이닝레이/`). WZ origin 값은 `ori.txt` 참고 (프레임당 delay 60ms).
아이콘은 MSW 라이브러리 원본 팩(`skill/231.img/skill/2311004`)의 icon RUID(`49bd6b2c5d22446c9f8079a50bcc67c0`)가
이미 SkillManager 탭에 등록돼 있어 그대로 사용한다. 사용음/적중음도 같은 팩의 `_audio/Use`/`_audio/Hit`를 쓴다.

- 사용음(_audio/Use): `6f972ab4e14841398281f3fc2a8f376e`
- 적중음(_audio/Hit): `01cd44c5de6d45cfbf47938e26243452`

## 패딩 정렬본 (실사용 - 코드가 참조하는 것은 이쪽, `padded/`)

원본은 프레임마다 크기/origin이 달라 그대로 재생하면 흔들림(지진)이 생기므로(블레스 때와 동일),
각 시퀀스를 동일 캔버스로 패딩해 WZ origin을 캔버스 한 점에 정렬 후 업로드했다(`pad_shiningray.py`).
코드는 `MakeConstantFrames` 단일 위치로 재생한다.

- effect: 캔버스 240×274, origin 정렬점 (126,126) → 단일 위치 (x=-0.06, y=-0.11)
- sineffect: 캔버스 752×532, origin 정렬점 (380,375) → 단일 위치 (x=-0.04, y=+1.09)
- hit: 캔버스 222×216, origin 정렬점 (108,106) → 사실상 중앙(x=0.03, y=-0.02)
- ⚠ ori.txt의 effect 9번 origin `(120,12)`는 앞뒤 프레임(121) 대비 명백한 오탈자로 판단해 **(120,121)로 보정**해 패딩했다.

| 파일(padded/) | RUID |
|---|---|
| effect0.png | `c67a743ca1934626ad2f7744062ec14f` |
| effect1.png | `69042e2218c6446db879e9be6db7ef3b` |
| effect2.png | `9139599c677b405490757c9ae77bbd93` |
| effect3.png | `d34afae34a3c4a3abe2bacbad32edc43` |
| effect4.png | `151d9a3a646e4099882a988b4d0a5aba` |
| effect5.png | `49aeecc1218f4a40a0ffbc7e6277451c` |
| effect6.png | `c7b9c30f7bc14979af7eef57e86d0023` |
| effect7.png | `1eb118d660d440659ca819c6e19a37c8` |
| effect8.png | `4da33ae59d2746cd9d4ded4809f0d504` |
| effect9.png | `bbfb9ff38749410b8c4fb04bbe518e55` |
| effect10.png | `4248fdf44677473ebd33434b7434dc4e` |
| effect11.png | `d508da81ddb447928ea3aca807b6aa17` |
| effect12.png | `2cdc5bd1aee34c4c8d7458f4673f418a` |
| effect13.png | `fcdd9956f4784311a2655dcfb121994e` |
| effect14.png | `45d4dfdffe0b4281b95781967a03bd11` |
| effect15.png | `79b47a455b5944b5a79bf9e4259647b7` |
| sineffect0.png | `0a9e7d58c1cf4116bb2baa56c1bbff3a` |
| sineffect1.png | `b1dcbc8511314d458f57f5bad122ee3e` |
| sineffect2.png | `c6c35c45c07f45a294119279dc310c5f` |
| sineffect3.png | `00ff7680a5174ed795595a940fcade2f` |
| sineffect4.png | `ae477b7187524ecfb23ce79aea4c1574` |
| sineffect5.png | `6e63529a524e4626a1036d7851758178` |
| sineffect6.png | `b45a268669e946f0afa8f917d100c6c8` |
| sineffect7.png | `c1e0f9d495354586bbeb6e31809a22d5` |
| sineffect8.png | `f4acad30463f431d9be8a1c0540ea525` |
| sineffect9.png | `ba7adc4c48a343ec8b23b33a2110c360` |
| sineffect10.png | `3c2a7fc354a848e69a61b73bce57fd95` |
| sineffect11.png | `e6b5c3d0076c47fcb2dfd46ccd855998` |
| sineffect12.png | `e9084f7b6c7f4bb28b32fe5ee0aa3475` |
| sineffect13.png | `d21d62a474464af49955fbb05564d94a` |
| sineffect14.png | `32b7809b396e4ec1a4dc32d68ed4befc` |
| sineffect15.png | `075e01d0741c4dd1a066669adfced6bc` |
| sineffect16.png | `693d8428b7754d1c87458e7c6ae0e809` |
| sineffect17.png | `117e9e94c6984f438af8faf6d74d52ee` |
| sineffect18.png | `a96d3c814ac0425481332c9ff87e2ba0` |
| sineffect19.png | `245de9ba93a446ec85fab3ba817fc5a5` |
| hit0.png | `6648e74d13164cde9df9f5278d547002` |
| hit1.png | `cfee3131ed4546a2920de5e240f6a054` |
| hit2.png | `e5a3e22eb0b14b56afe18b28f15c7151` |
| hit3.png | `d24b9dd8082b4b23a5085d0125461846` |
| hit4.png | `c197b42c5d9f4affbd49354555f9e4e5` |
| hit5.png | `e2b6a3e05fe0430e8b8beb44aca514bc` |
| hit6.png | `961ac75e651048e5a62f209c40355199` |
| hit7.png | `ae3393a5eb7c48cea2cc4bc216334a49` |
