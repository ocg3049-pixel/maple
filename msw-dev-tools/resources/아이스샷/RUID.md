# 아이스 샷 리소스 RUID 대응표

원본: 구버전 클라이언트 WZ 추출본(사용자 제공, `/Users/florence/Desktop/Desktop/아이스샷`).
2026-07-23 계정 리소스로 업로드(전부 sprite / skill). ori.txt는 WZ origin 좌표와 프레임 delay.

| 파일 | 용도 | RUID |
|---|---|---|
| icon.png | 스킬 아이콘 | 3aeb13b82977470d85c9aac1a0732515 |
| arrow1.png | 화살 프레임1 (머리 좌하단 -135도, 회전보정 +135도) | 2d244b18d5da41fd946220e319e73dce |
| arrow2.png | 화살 프레임2 | c76a4948cd2b479797c816948d4eb632 |
| arrow3.png | 화살 프레임3 | 55c85742031c4a3eacafc0e64b83e8aa |
| arrow4.png | 화살 프레임4 | 3a1249350d2f4e49a7a6f580c9fc04fe |
| arrow5.png | 화살 프레임5 | 64ab16e3ec4b4c2bb49ad42bfb79e4e5 |
| arrow6.png | 화살 프레임6 | 3b2bdef2d73848eb9d50466559fbbd81 |
| arrow7.png | 화살 프레임7 | 5dd40edc6d764efaac5562db877e878b |
| arrow8.png | 화살 프레임8 | b506c14e7d6740279d4a2a7101fef728 |
| arrow9.png | 화살 프레임9 | 98ffd0585ec04ec990ab6e76ecd27095 |
| effect1.png | 시전 이펙트 프레임1 (delay 110ms) | b403326e82304598873d37bbf57c6b93 |
| effect2.png | 시전 이펙트 프레임2 | 450dda0f413945faa44fb2135082ef05 |
| effect3.png | 시전 이펙트 프레임3 | 73aa5e24acfd4b66b91829f779099365 |
| effect4.png | 시전 이펙트 프레임4 | e67191d8816d478a880550c3a58d9f8f |
| effect5.png | 시전 이펙트 프레임5 (백청 방사광) | 3f29477d4edb4ae5a2def02d69bcd587 |
| effect6.png | 시전 이펙트 프레임6 | bd1609c01d4b40a5b13bf8455c9a22f7 |
| effect7.png | 시전 이펙트 프레임7 | f9e8423d4d514dcfa88f42fe5867d8a3 |
| effect8.png | 시전 이펙트 프레임8 | 4ece98754816484dace1322e13042151 |
| effect9.png | 시전 이펙트 프레임9 | 249df88b783c492a8d82e862780719fd |
| effectspecial.png | 시전 스페셜(잔광) | cb01592c6d3746a2a3ca161044896c15 |
| hit1.png | 히트(빙결 결정) 프레임1 (delay 120ms) | fc4f1fba7c57461380a634feda24aa5c |
| hit2.png | 히트 프레임2 | 9963f5ab73474e2786259878ef66f3f6 |
| hit3.png | 히트 프레임3 | 26cbc52d8d444032b20fea7af775fd3b |
| hit4.png | 히트 프레임4 (결정 파열) | 34097d531f564cce9ed75b6a531e8f60 |
| hit5.png | 히트 프레임5 | 76ee3683807148dda4bc742ad5279633 |
| hit6.png | 히트 프레임6 | 0b76f710f9df4baebf5c92d0281ce92b |

참고: 파이어 샷(예시로 받은 원본 팩)은 라이브러리에 그대로 존재 - skill/800033.img/skill/80003324.

2026-07-23 변경: arrow1~9는 더 이상 날아가는 탄환이 아니라 **도착지점 화살비**(`ArrowRainArrow.mlua`)에 쓴다.
날아가는 탄환은 파이어 샷과 공용으로 라이브러리 ball 클립 `7d360ab4c5ef4690bbebd54ff766cc5b`
(skill/3310.img/skill/33101003)을 쓰며, 이 클립은 머리가 +x라 회전 보정이 0이다.
