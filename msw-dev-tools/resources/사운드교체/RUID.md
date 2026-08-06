# 사운드 교체 (요청 2026-08-07)

원본: `Desktop/스킬/PickUpItem.mp3`, `Desktop/스킬/Use.mp3` (각 3,354 bytes)

| 파일 | RUID | 쓰이는 곳 |
|---|---|---|
| `PickUpItem.ogg` | `c6da79f93bc34e7cb213080a00f09fef` | 아이템이 캐릭터에게 흡수(습득)되는 순간 — `DroppedItemComponent.PlayPickupSound` |
| `Use.ogg` | `f6b84a0152ef492e9233f621c81a4920` | 슬래시블러스트 사용음 — `PlayerAttack.PlaySlashBlastUseSound` (구 `afbb81b51fed47eaaee26cc403d59ccf` 교체) |

## ⚠ 업로드는 반드시 `.ogg`로 — `.mp3`는 실패한다 (실측)

`asset_create_account_resource_storage_item`에 **mp3를 올리면 2단계(생성 완료)가 조용히 실패**한다.

- 1단계 presigned URL 발급 ✅ / S3 `PUT` **HTTP 200** ✅ / 2단계에서 `An unexpected error occurred` ❌
- 에러 메시지에 포맷 얘기가 전혀 없어서 권한·파라미터 문제로 오해하기 쉽다.
  4회 시도(`audioclip`의 `item`/`skill`/`etc`, `fileUrl` 쿼리스트링형·경로형)를 전부 태워도 동일했다.
- `asset_list_account_resources`가 빈 목록 → 리소스가 아예 안 만들어진다.
- **같은 파일을 ogg(Vorbis)로 변환하니 첫 시도에 성공.**

### 변환 명령 (mp3 → ogg)

```bash
# ⚠ ffmpeg의 native vorbis 인코더는 스테레오만 지원한다 - 모노 원본은 -ac 2 로 올려야 한다.
#   (libvorbis가 깔려 있으면 -c:a libvorbis 로 그냥 하면 된다)
ffmpeg -y -i PickUpItem.mp3 -ac 2 -ar 44100 -c:a vorbis -strict -2 -q:a 5 PickUpItem.ogg
ffmpeg -y -i Use.mp3        -ac 2 -ar 44100 -c:a vorbis -strict -2 -q:a 5 Use.ogg
```

### PUT 시 주의

`curl --data-binary @<파일>` 의 경로에 한글이 섞이면 `error encountered when reading a file`이 난다 -
**해당 폴더로 `cd` 한 뒤 파일명만** 넘긴다.

## 습득음은 "교체"가 아니라 신규 추가였다

`DroppedItemComponent.PickupBy` 경로에는 원래 사운드가 **하나도 없었다**.
`PickupBy`는 `@ExecSpace("ServerOnly")`라 `_SoundService`를 직접 못 부르므로
`@ExecSpace("Client") PlayPickupSound()`를 새로 만들고 `targetUserId`를 **호출부 마지막 인자로** 붙였다
(습득한 본인에게만 들린다. 슬래시블러스트 사용음이 Multicast인 것과 대비).
⚠ `targetUserId`는 예약 파라미터라 **메서드 선언에는 넣지 않는다**.
