# 블레스 (2차 버프) 리소스 RUID 대응표

원본 출처: 사용자 제공 클래식 아트 (`스킬/블레스/`). WZ origin 값은 `ori.txt` 참고.
사용음은 MSW 라이브러리 원본 팩(`skill/230.img/skill/2301004`)의 `_audio/Use`를 재사용한다.

| 파일 | 용도 | RUID |
|---|---|---|
| icon.png | 스킬 아이콘 (32x32) | `476232fa1b5e4ce68268fb26a793eb7d` |
| effect0.png | 시전자 이펙트 0 (48x21, origin 29,14) | `8f50674765314885b7b589f36d9c2010` |
| effect1.png | 시전자 이펙트 1 (60x25, origin 35,18) | `4eac3d9db9734151838d03fc6266143f` |
| effect2.png | 시전자 이펙트 2 (66x32, origin 38,25) | `312b5862f858495ebe2fa7d45e942a1d` |
| effect3.png | 시전자 이펙트 3 (60x36, origin 35,29) | `96c18e429ca046e698e8b5f5a7973feb` |
| effect4.png | 시전자 이펙트 4 (77x336, origin 42,326) | `bec5d376deb743d2a0f763055bbcbf10` |
| effect5.png | 시전자 이펙트 5 (84x340, origin 43,326) | `e835ceb37df74b10a13ccbc4c03a6229` |
| effect6.png | 시전자 이펙트 6 (80x336, origin 46,328) | `aceca8e8bd46468fbdc7680cb9e3c36d` |
| effect7.png | 시전자 이펙트 7 (89x378, origin 42,366) | `2235fb72f6da458299399e68f2ae6f34` |
| effect8.png | 시전자 이펙트 8 (71x364, origin 38,354) | `66a61dd88de940a7af566abf4ab52e2a` |
| effect9.png | 시전자 이펙트 9 (66x361, origin 38,349) | `e6ab6b0674794dad8589fb01d25ef261` |
| effect10.png | 시전자 이펙트 10 (64x336, origin 37,326) | `48643e0ae8844899b71e728788672262` |
| affected0.png | 피버프자 이펙트 0 (86x46, origin 45,130) | `a788cba771084a98bc1c49ab1f3055b8` |
| affected1.png | 피버프자 이펙트 1 (90x41, origin 46,125) | `692d2928be8c40ee8577ee9d2380080a` |
| affected2.png | 피버프자 이펙트 2 (86x46, origin 45,130) | `0d68f2effe7f47b7b2f3085a1cb71055` |
| affected3.png | 피버프자 이펙트 3 (90x41, origin 47,125) | `93a1445379864153a972773e15a7832e` |
| affected4.png | 피버프자 이펙트 4 (86x44, origin 45,129) | `746ba796cbf24274b6fd6a508e32f820` |
| affected5.png | 피버프자 이펙트 5 (90x79, origin 47,123) | `5f89f5f677244a7abd1e9c47c299e602` |
| affected6.png | 피버프자 이펙트 6 (90x83, origin 47,123) | `508a515cdf7548879191a071dba8c1e6` |
| affected7.png | 피버프자 이펙트 7 (86x98, origin 45,127) | `3679c7ecc60c4bfca23cdf318844ed8c` |
| affected8.png | 피버프자 이펙트 8 (86x98, origin 45,127) | `a9153a8c13a24f2b8964afeeef572f7c` |
| affected9.png | 피버프자 이펙트 9 (90x90, origin 47,121) | `4a130dc1bafd4fcf8ff14075b13ac189` |
| affected10.png | 피버프자 이펙트 10 (90x78, origin 47,121) | `6501bfe87d1b4986a6def4e7064694c0` |
| (라이브러리) _audio/Use | 사용음 (3.0s ogg) | `693e8550871b4a0db0e6970f08e26add` |

프레임 딜레이(ori.txt): affected 0~9는 80ms, affected 10은 300ms. effect는 기본 100ms.

## 패딩 정렬본 (실사용 - 코드가 참조하는 것은 이쪽)

원본은 프레임마다 크기/origin이 달라 프레임별 오프셋 재생 시 흔들림(지진)이 발생했다(분노 때와 동일).
`padded/` 폴더에 각 시퀀스를 동일 캔버스로 패딩하고 WZ origin을 캔버스 한 점에 정렬해 재업로드했다.
- effect: 캔버스 93×380, origin 정렬점 (46,366) → 코드 단일 위치 y=1.76 (origin=발끝)
- affected: 캔버스 91×130, origin 정렬점 (47,130) → 코드 단일 위치 y=0.65

| 파일(padded/) | RUID |
|---|---|
| effect0.png | `3f2ba57ceb724b3aba1c9205292fe6c1` |
| effect1.png | `8c47758b2cc143469be1bf9148fbb345` |
| effect2.png | `981b537715ca420e85bad99c0b09886a` |
| effect3.png | `c873a59b360746d5afb7b6a6f801b940` |
| effect4.png | `434275d7979f4339bddb232d3e90f9ad` |
| effect5.png | `933e9d7f0dca40a19c2cc58f2298a9b1` |
| effect6.png | `745690c5baf34bd48bd8fa2e1e8543f8` |
| effect7.png | `99bc646420bd4d8e86f7ea89e3bbf02a` |
| effect8.png | `d1915346d12b47feab9fef9427312172` |
| effect9.png | `e3fdc90505e44322a9cf1609eb1640bf` |
| effect10.png | `1af5a3dc8713417480b08537cf882079` |
| affected0.png | `1c5ceb5b21af4e9c9a73bb371d8609e8` |
| affected1.png | `5b52635496af427882cfdfd1962b8143` |
| affected2.png | `033d6254dc1340ff8757482266bc7770` |
| affected3.png | `5a0c60a200644c7ca5af8aa120d1adf8` |
| affected4.png | `d2f9e539b9d04662be1bb3933673f2cf` |
| affected5.png | `10c49d0b8ac34f2382ef97c48c7ba522` |
| affected6.png | `867e8f5003e34eb781dc8a7d762850a8` |
| affected7.png | `97c816f3cf0c47efb45f2ecbd1c2f2a6` |
| affected8.png | `ae32c0d6ffe04774ba24ef9c251f37d3` |
| affected9.png | `eb7aefeee82b4e48b281bcd584344e38` |
| affected10.png | `0544be7da91a4aa38b2d5fd59f7aad7e` |
