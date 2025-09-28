# Scripts

프로젝트의 빌드, 배포, 유틸리티 작업을 자동화하는 스크립트 모음입니다.

## 목적

- **자동화**: 반복적인 작업의 자동화
- **일관성**: 환경별 일관된 배포 프로세스
- **효율성**: 개발 및 배포 시간 단축
- **표준화**: 팀 내 표준화된 작업 프로세스

## 주요 스크립트

### 빌드 스크립트
- **build:frontend**: 프론트엔드 프로덕션 빌드
- **build:backend**: 백엔드 TypeScript 컴파일
- **build:shared**: 공통 모듈 빌드
- **build:all**: 전체 프로젝트 빌드

### 테스트 스크립트
- **test:frontend**: 프론트엔드 테스트 실행
- **test:backend**: 백엔드 테스트 실행
- **test:shared**: 공통 모듈 테스트 실행
- **test:all**: 전체 테스트 실행

### 배포 스크립트
- **deploy:frontend**: 프론트엔드 배포 (GitHub Pages)
- **deploy:backend**: 백엔드 배포 (AWS Lambda)
- **deploy:infrastructure**: 인프라 배포 (AWS CDK)
- **deploy:all**: 전체 배포

### 개발 스크립트
- **dev:frontend**: 프론트엔드 개발 서버 시작
- **dev:backend**: 백엔드 개발 서버 시작
- **dev:all**: 전체 개발 환경 시작

### 유틸리티 스크립트
- **setup**: 프로젝트 초기 설정
- **clean**: 빌드 아티팩트 정리
- **lint**: 코드 린팅
- **format**: 코드 포맷팅

## 디렉토리 구조

```
scripts/
├── build/          # 빌드 관련 스크립트
├── deploy/         # 배포 관련 스크립트
├── dev/            # 개발 환경 스크립트
├── test/           # 테스트 관련 스크립트
├── utils/          # 유틸리티 스크립트
└── setup/          # 초기 설정 스크립트
```

## 사용 방법

### 루트에서 실행
```bash
# 전체 빌드
npm run build:all

# 전체 테스트
npm run test:all

# 전체 배포
npm run deploy:all
```

### 개별 패키지에서 실행
```bash
# 프론트엔드 개발 서버
cd frontend && npm run dev

# 백엔드 테스트
cd backend && npm run test
```

## 환경 변수

- **NODE_ENV**: 환경 설정 (development, staging, production)
- **AWS_REGION**: AWS 리전 설정
- **API_URL**: API 엔드포인트 URL
- **COGNITO_USER_POOL_ID**: Cognito 사용자 풀 ID

## 배포 스크립트

### deploy.sh - 배포 자동화 스크립트
프론트엔드 애플리케이션을 GitHub Pages에 배포하는 자동화 스크립트입니다.
GitHub Actions를 통한 자동 배포를 우선으로 하며, 로컬 개발/테스트용으로도 사용 가능합니다.

#### 사용법
```bash
# 프로덕션 환경 배포 (기본값)
./scripts/deploy.sh

# 개발 환경 배포
./scripts/deploy.sh dev

# 스테이징 환경 배포
./scripts/deploy.sh staging

# 프로덕션 환경 배포
./scripts/deploy.sh prod
```

#### 주요 기능
- **배포 전 체크리스트**: Git 상태, 브랜치, 동기화 확인
- **자동 검증**: Lint, 타입 체크, 테스트, 빌드 검증
- **환경별 설정**: dev, staging, prod 환경별 다른 브랜치 사용
- **GitHub Actions 통합**: CI 환경에서 자동 배포 처리
- **배포 후 확인**: 배포된 사이트 접근성 및 내용 확인
- **Slack 알림**: 배포 완료 시 Slack 웹훅을 통한 알림 (선택사항)

#### 환경 변수
- **SLACK_WEBHOOK_URL**: Slack 알림을 위한 웹훅 URL (선택사항)
- **GITHUB_REPOSITORY_OWNER**: GitHub 저장소 소유자
- **GITHUB_REPOSITORY_NAME**: GitHub 저장소 이름

### rollback.sh - 롤백 스크립트
배포된 애플리케이션을 이전 버전으로 롤백하는 스크립트입니다.

#### 사용법
```bash
# 이전 커밋으로 롤백 (기본값)
./scripts/rollback.sh

# 특정 커밋으로 롤백
./scripts/rollback.sh <commit-hash>

# 예시
./scripts/rollback.sh abc1234
./scripts/rollback.sh HEAD~2
```

#### 주요 기능
- **안전한 롤백**: 백업 브랜치 자동 생성
- **롤백 확인**: 사용자 확인 후 롤백 실행
- **빌드 테스트**: 롤백된 코드의 빌드 및 테스트 검증
- **강제 푸시**: 원격 저장소에 안전한 강제 푸시
- **복구 옵션**: 백업 브랜치를 통한 이전 상태 복구

#### 안전 기능
- **백업 브랜치**: 롤백 전 자동 백업 브랜치 생성
- **사용자 확인**: 롤백 및 강제 푸시 전 사용자 확인
- **에러 처리**: 각 단계별 에러 처리 및 복구 가이드 제공

## 개발 가이드

- 모든 스크립트는 에러 처리를 포함
- 환경별 설정 분리
- 로깅 및 진행 상황 표시
- 실패 시 적절한 에러 메시지 제공
- 색상 코딩된 로그 메시지로 가독성 향상
