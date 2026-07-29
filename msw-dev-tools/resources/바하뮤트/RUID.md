# 바하뮤트(4차 소환) 리소스 RUID 표

구버전 클라이언트에서 추출한 **클래식 바하뮤트** 아트(사용자 제공, `메이플 스킬/바하뮤트/`).

> ⚠ MSW 라이브러리에도 같은 WZ 노드 `skill/232.img/skill/2321003`("바하뮤트 / 바하뮤트 강화")가
> 통째로 들어 있지만(summon/stand·fly·attack1·die·summoned 클립), **그쪽 그림은 금갑옷을 두른
> "강화판"**이라 클래식 바하뮤트와 생김새가 다르다(썸네일 대조 실측 2026-07-29).
> 그래서 **몸통 프레임 42장은 여기 원본을 업로드해서 쓴다.**
> 반대로 **타격 이펙트와 사운드는 두 버전이 같아서** 라이브러리 것을 그대로 쓴다(업로드 불필요).

`ori.txt` = 프레임별 WZ origin(이미지 좌상단 기준 픽셀, y는 아래로 증가).
업로드된 스프라이트의 피벗은 중앙이므로 배치 오프셋은
**`((w/2 - ox)/100, (oy - h/2)/100)` 월드유닛**으로 환산해 프레임마다 따로 준다
(안 주면 프레임 크기가 제각각이라 지진난 것처럼 떨린다).
환산된 값은 `RootDesk/MyDesk/Skills/BahamutSummon.mlua`의 프레임 테이블에 그대로 들어가 있다.

프레임 딜레이(ori.txt 실측): summoned 120ms · fly/stand 150ms · attack1 **90ms** · hit 120ms ·
die는 프레임마다 100/100/120/130/140/300ms.

## 라이브러리에서 그대로 쓰는 것 (업로드 안 함)

| 용도 | rel_path | RUID |
|---|---|---|
| 타격 이펙트 | `hit/0` (animationclip, 7프레임) | `598a38c6f7d747b9aedf97c18dad6dc7` |
| 사용(소환)음 | `_audio/Use` | `5044fe5629044efd8da504d153fae348` |
| 타격음 | `_audio/Hit` | `154f797432104a0b9de86cdb7c9e7a6a` |

라이브러리 `hit/0`의 첫 프레임(156x156)과 사용자 `hit0.png`(153x153)를 겹쳐 본 결과 같은 금색
마법진 폭발이라 교체 이득이 없어 클립을 그대로 재생한다(수동 프레임 스텝 불필요).

## 업로드한 프레임 (계정 리소스)

### summoned (등장, 6프레임)
| 파일 | RUID |
|---|---|
| summoned0.png | 73ad3604b79c42ce9409fbaf30de4453 |
| summoned1.png | f522d0a7e19448319894d0f5d9902417 |
| summoned2.png | 74be5f4344bf45979ae87dcd8cc6d6a2 |
| summoned3.png | 61a7319b0288406f80303fb0e6ae4e0b |
| summoned4.png | e71643acb2be4ab58a6b0e53af7be3d3 |
| summoned5.png | 0996e99f07f44d5fa346dcd4a0b3d933 |

### fly (이동, 6프레임)
| 파일 | RUID |
|---|---|
| fly0.png | d6fe03bd5cf64ed39fe5342c08492e32 |
| fly1.png | 18f214270f2a4eaea398a07f897a929d |
| fly2.png | 4cba4639956a4ee4b5ca960da3fb49d0 |
| fly3.png | 661a54c863124a58ae7397a04eb1ff2e |
| fly4.png | a2b242bd9d0f4941b3eece0e4b61c6c2 |
| fly5.png | a2d3896a75c94b6f8c7bf71c10982178 |

### stand (제자리, 6프레임)
원본은 12프레임이지만 stand6~11은 stand0~5와 **바이트 단위로 같거나 사실상 동일**해서 6장만 올리고 반복 재생한다.

| 파일 | RUID |
|---|---|
| stand0.png | 56b30c245ba74e95b6cff98bf0589bf4 |
| stand1.png | 41aa9e797db14f9ab4a073fed466b691 |
| stand2.png | 87af8e06638d4602988e83c091642da2 |
| stand3.png | 517932a2dcac4e7489c8477bddd1c544 |
| stand4.png | 7cfc11cc5fda435bb54685a4074dcb51 |
| stand5.png | 0f60840e17be428a9fab9f40c174bfab |

### attack1 (공격, 18프레임)
attack0.png는 stand0.png와 md5가 같아 stand0의 RUID를 재사용한다.

| 파일 | RUID |
|---|---|
| attack0.png | 56b30c245ba74e95b6cff98bf0589bf4 (=stand0) |
| attack1.png | afacf4bb28d345c6819738f045744e0f |
| attack2.png | a2968603f51747c4adbb075fd5d5753e |
| attack3.png | e75dbda1d9b647c79b2f667557bff5a4 |
| attack4.png | 299e84a1637b4974a14901b9e215888f |
| attack5.png | 1d6de88b112046bb9f94c086b58b2e67 |
| attack6.png | 0be0d6e181bb4043bfabac7a14dc5f2f |
| attack7.png | 2acd876157e847329cb5c5d2a00ab628 |
| attack8.png | 7a52e8e08b5745c8bb25203691cb2f39 |
| attack9.png | cf817d0c1786476bb2ee0d3492abf09c |
| attack10.png | afb0276b6ab74a4ebbcebaa3bce2ba4b |
| attack11.png | 7dc0f0a054af4d60a3cb633b9f2ef1d2 |
| attack12.png | 3dd5253453f8487d8099d72a94d189e2 |
| attack13.png | efe2df8f2bb84ef5a46697cb933bed5f |
| attack14.png | 1dba81a7faf2406ca6ba5b0011c0074a |
| attack15.png | ddb4d23bac92475cb866f83245fff47c |
| attack16.png | 49b5687d7cca4d5bb615e3288e412f21 |
| attack17.png | dd4ed7fb74be44c688801d9f7d4ab3bd |

### die (소멸, 6프레임)
| 파일 | RUID |
|---|---|
| die0.png | f1689a5814974874836eb3824f3ed576 |
| die1.png | 1afa60a09a3d48d9bf02cdb64e622990 |
| die2.png | f93a056cb91c44198b77253c86e2cd5f |
| die3.png | 878a9bbf70014003ab8c8d20e551b101 |
| die4.png | f07120bbac0444cf822dd9dcda1a95ae |
| die5.png | 94aac94c92074c7e9b77021369162b5c |

### 아이콘
| 파일 | RUID |
|---|---|
| icon.png | 4c9e769fed8f40a790ae6086785a822e |
