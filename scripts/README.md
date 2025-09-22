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

## 개발 가이드

- 모든 스크립트는 에러 처리를 포함
- 환경별 설정 분리
- 로깅 및 진행 상황 표시
- 실패 시 적절한 에러 메시지 제공
