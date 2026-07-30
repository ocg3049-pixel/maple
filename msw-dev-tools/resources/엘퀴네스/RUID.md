# 엘퀴네스(4차 소환) 리소스 RUID 표

구버전 클라이언트에서 추출한 **클래식 엘퀴네스** 아트(사용자 제공, `스킬/엘퀴네스/`).
바하뮤트(`msw-dev-tools/resources/바하뮤트/RUID.md`)와 같은 원리의 4차 소환수용.

> ⚠ MSW 라이브러리에도 같은 WZ 노드 `skill/222.img/skill/2221005`("엘퀴네스 / 엘퀴네스 강화")가
> 통째로 있지만(summon/stand·move·attack1·die·summoned, hit/0, effect, icon), **그쪽 그림은
> 밝은 폴리곤 톤의 "강화판"**이라 클래식과 생김새가 다르다(썸네일 대조 실측 2026-07-30 —
> 라이브러리 stand는 밝은 하늘색 폴리곤 골렘, 사용자 원본은 어두운 결정질 몸통).
> 그래서 **몸통 프레임은 여기 원본을 업로드해서 쓴다.**
> **아이콘과 타격 이펙트도 사용자 원본으로 교체했다**(지시 2026-07-30) - 라이브러리에서 쓰는 것은 사운드뿐이다.

## 정렬 방식 (바하뮤트와 다름 - 패딩 정렬)

바하뮤트는 프레임마다 오프셋 표를 들고 있었지만, 엘퀴네스는 **몸통 5종(summoned/move/stand/
attack/die)을 하나의 공용 캔버스로 패딩**해 올렸다. 그래서 코드에는 프레임별 오프셋 표가 없고
**고정 오프셋 하나**만 있으면 된다.

- 몸통 캔버스 **222×218**, WZ origin 정렬점 **(111, 192)** → 고정 오프셋 **(0, +0.830)** 월드유닛
- 타격(hit) 캔버스 **126×114**, 정렬점 **(63, 104)** → 고정 오프셋 **(0, +0.470)**
- 원점을 **가로 정중앙**에 두었기 때문에 `FlipX` 시 x 보정이 필요 없다
  (바하뮤트는 x오프셋 부호를 뒤집어야 했던 지점 - 이 방식이면 그 함정 자체가 없다)
- 원본 66장 전부 md5가 서로 달라 중복 재사용은 없다(바하뮤트의 attack0=stand0 같은 절약 불가).

프레임 딜레이(`ori.txt` 실측): summoned 120ms · move/stand 180ms · attack 120ms(마지막 18번만 90ms) ·
die 120ms · hit 150ms. 원본/패딩본 모두 `padded/`와 이 폴더에 보존돼 있다.

## 라이브러리에서 그대로 쓰는 것 (업로드 안 함)

| 용도 | rel_path | RUID |
|---|---|---|
| 사용(소환)음 | `_audio/Use` | `9cd912e261bd4b72bd3113d7c8cbc6ed` |
| 타격음 | `_audio/Hit` | `08150c9ada3e405ab7c44d024b3cc710` |

> **이미지는 라이브러리를 쓰지 않는다**(사용자 지시 2026-07-30). 아이콘·타격 이펙트 모두
> 위 사용자 원본으로 교체 완료. 라이브러리에서 남은 것은 **사운드뿐**이다.

## 업로드 완료 (계정 리소스, `padded/` 기준) — 62장

### stand (제자리, 6프레임 · 180ms)
| 파일 | RUID |
|---|---|
| stand0.png | 9ed7b46a209c4cf2bd5061cf93f1ce68 |
| stand1.png | c3239e8ee6b745c88989c98eb2fe85c0 |
| stand2.png | b5b43c2807f04d3eb9ce9b2292b0d7e5 |
| stand3.png | eecac79579904f3abd63a1e03cead3f0 |
| stand4.png | 6dedeed259d542fcbbcd4269458de922 |
| stand5.png | f2f6334cd0f4480597946f45dc597ae9 |

### move (이동, 6프레임 · 180ms)
| 파일 | RUID |
|---|---|
| move0.png | 37895734952d43baaccf54704e59e88d |
| move1.png | aad8fe974f7f4333be6dede14794aabf |
| move2.png | 9c78a69db6154a03b56ebc3ec6327c28 |
| move3.png | e94bd186443241cd9f403ac8866c9559 |
| move4.png | 3057084f656949efb4a336cfe21296fa |
| move5.png | ca515f2b192a4e739647a3bb1df4e79b |

### attack (공격/브레스, 19프레임 · 120ms, 마지막만 90ms)
| 파일 | RUID |
|---|---|
| attack0.png | 87ac91b28484403e85ca0acf41ef60b5 |
| attack1.png | 1c3a76ac0a9747699d439e1db7e9393e |
| attack2.png | ddd3e0ad59984b30bb74d1b6a14b6676 |
| attack3.png | 360b483804164c11a1496d1d14f0f176 |
| attack4.png | f4612e1ad67e4cff8980413d2c213c10 |
| attack5.png | 68a7e969852143fa82678e2f81799966 |
| attack6.png | de13037c5f094cc796895fc84971484d |
| attack7.png | 322d9f5fe4a84f80bb2a1c7869b57fea |
| attack8.png | 827f521b601040b88bb334f8f88a478a |
| attack9.png | d0a26cba3f8941f1bb898fcad91cd378 |
| attack10.png | f8a135eed9bd41a1af4ce8d222911d3b |
| attack11.png | dd7a6b9bf3934d23be05cff7c2e97bcb |
| attack12.png | 74a08c33d89d4ed3bde020e2d6ebf0d4 |
| attack13.png | caf4d1d853d149d5bee1c9776bca22d6 |
| attack14.png | 352f14f3b0c64ff285fdfb8a7e4c8668 |
| attack15.png | 7c0fa697f7324ebfad5176daa381e61d |
| attack16.png | 55d16b261c94497bb89166a05fbce911 |
| attack17.png | 52549dd9c3a94d4db2666f9a641e42e4 |
| attack18.png | 8fe0cf5b4ff34737bfdd2509dec083ea |

### summoned (등장, 15프레임 · 120ms)
| 파일 | RUID |
|---|---|
| summoned0.png | 1af6aff1d0d7463d930e9162d9318abc |
| summoned1.png | 7a9ee1a1160746b19e2b474510c7d6b5 |
| summoned2.png | 5526763e5667482681f2a7aef8ec479b |
| summoned3.png | f80467ce53be41f8aa74fe993b156233 |
| summoned4.png | aa55ff9b38d242859bea6ed3973b4c25 |
| summoned5.png | 242c17ea5e5245bbae1f1b9db5208b36 |
| summoned6.png | 8cd40482c3e140d7a2985f4947a0ced3 |
| summoned7.png | 11d78f170a2e40da9d2cb3a828aaef9d |
| summoned8.png | 3dae41c447e245fd89dccee2f10aeefc |
| summoned9.png | 12c8320583d146dc93eb7bf29a6df97e |
| summoned10.png | e44df75a4a1b44a98b31c604aa754727 |
| summoned11.png | 806d7a9f3b284caf9717bc73dfa13b34 |
| summoned12.png | c370a1994485443980fa0f64397633ab |
| summoned13.png | fb67805b308a405cbb78b7c71728d2a0 |
| summoned14.png | 3f5f2e215f5840b9bdcfcae7dfea80db |

### hit (타격 이펙트, 8프레임 · 150ms) — 사용자 원본
| 파일 | RUID |
|---|---|
| hit0.png | 2227d242fbfc44d280061c687147aed3 |
| hit1.png | 675ceaf331eb4326b090c0bcca774ba2 |
| hit2.png | 36e038b56cac4726bc53031577063b35 |
| hit3.png | 9eb1e3a24b8a4d2497a5010eb145ed03 |
| hit4.png | 09ebd2a5cc684994a4962d7898bacea4 |
| hit5.png | 8011b6b59c3c4b25b0d481c1bfea678b |
| hit6.png | 777cb156b3534f43a0dbae29b12203c0 |
| hit7.png | 07f9d411d399406a85d44c38245871a8 |

### 아이콘 — 사용자 원본
| 파일 | RUID |
|---|---|
| icon.png | 13d9054e49b640f08abc2820f5ca8215 |

## 완료 상태 (2026-07-30)

**총 62장 업로드 완료** — stand 6 / move 6 / attack 19 / summoned 15 / hit 8 / icon 1.
코드(`Skills/ElquinesSummon.mlua`, PlayerAttack, SkillManager)까지 연결돼 실제 동작 확인.
**이미지는 전부 이 폴더 원본이며 라이브러리 이미지는 하나도 쓰지 않는다**(사운드만 라이브러리).

남은 것은 **die 12장**뿐이다(현재 소멸은 1초 페이드아웃으로 대체 — 라이브러리 이미지가 아니므로
지시 위반은 아니다). 올리려면 `padded/die0~11.png`를 업로드하고 GetDieFrames를 추가하면 된다.
