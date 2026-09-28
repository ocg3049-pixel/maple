# MSW 프로젝트 복원

이 저장소는 개발 중인 월드의 소스, 맵, UI, 모델, Maker 메타데이터와 프로젝트 내 이미지·음원 원본을 보관합니다.

## 가져오기

```sh
git clone https://github.com/ocg3049-pixel/maple.git
cd maple
```

기존 체크아웃은 로컬 변경을 먼저 보관한 뒤 `git pull --ff-only origin main`으로 갱신합니다.

## Maker에서 이어서 작업

1. 같은 MSW 계정으로 원래 월드를 엽니다. 현재 월드 ID는 `414832d93c3d484db95c1449aed9f27d`입니다.
2. Play를 중지하고, LocalWorkspace를 이 체크아웃에 연결하거나 기존 LocalWorkspace에 프로젝트 파일을 복원합니다.
3. `RootDesk/`, `map/`, `ui/`, `Global/`의 폴더 구조를 유지합니다. `Global`은 기존 월드 설정과 모델의 복원용입니다.
4. Maker에서 Workspace Refresh를 실행합니다. `.mlua`와 Maker가 생성한 `.codeblock`이 함께 포함되어 있습니다.
5. Build Console을 확인한 다음 Play로 실행합니다. 등록 리소스 접근 권한과 외부 월드 상품 설정도 확인합니다.

`Environment/`는 MSW가 제공하는 API 정의이므로 저장소에서 제외됩니다. 현재 프로젝트가 사용하는 CoreVersion은 `26.7.0.0`입니다. 엔진이 제공한 환경을 사용하세요.

## Git과 별도로 관리되는 항목

- UserDataStorage / GlobalDataStorage / SortableDataStorage의 실제 캐릭터·아이템·순위 데이터는 이 저장소에 포함되지 않습니다. Maker 테스트 저장소와 출시 월드 저장소도 별도입니다.
- 스크립트/UI가 참조하는 RUID는 MSW 리소스 저장소의 리소스입니다. Git 복제만으로 다른 계정에 리소스 소유권이 이전되지는 않습니다. 제작 이미지 원본은 `RootDesk/MyDesk/Assets/`에 함께 보관합니다.
- 월드 출시 상태, 접근 범위, 테스트 서버 키, 월드샵 상품 설정은 플랫폼에서 별도로 관리합니다.
- 인증 토큰, MCP 개인 설정, 화면 녹화와 임시 백업은 포함하지 않습니다.

## 이번 저장 시점의 상태

- 캐시샵 메소 구매는 테스트용으로 개당 10,000메소입니다. 정식 서비스에서는 `CashShopManager.temporaryMesoPurchaseEnabled`를 false로 바꿔 메소 구매를 차단해야 합니다.
- 캐릭터 전체 삭제와 월드 임시 게시는 실행하지 않았습니다.
- 사용자 지정 `LevelUp.mp3`는 MSW 음원 등록 API 오류로 아직 연결되지 않았습니다. 현재 레벨업 재생 코드는 기존 효과음을 사용합니다.
