# Infrastructure

AWS CDK(Cloud Development Kit)를 사용한 인프라스트럭처 코드입니다.

## 목적

- **Infrastructure as Code**: 코드로 인프라 관리
- **자동화**: 배포 및 환경 관리 자동화
- **일관성**: 개발/스테이징/프로덕션 환경 일관성 보장
- **확장성**: 서버리스 아키텍처의 자동 확장

## 기술 스택

- **AWS CDK**: TypeScript 기반 인프라 정의
- **AWS Lambda**: 서버리스 함수 실행
- **AWS DynamoDB**: NoSQL 데이터베이스
- **AWS API Gateway**: RESTful API 엔드포인트
- **AWS Cognito**: 사용자 인증 서비스
- **AWS CloudFront**: CDN 및 정적 파일 배포
- **AWS S3**: 정적 웹사이트 호스팅

## 아키텍처 구성 요소

### 컴퓨팅
- **Lambda Functions**: API 핸들러 및 비즈니스 로직
- **API Gateway**: HTTP API 엔드포인트

### 데이터베이스
- **DynamoDB**: TODO 데이터 저장
- **DynamoDB Streams**: 실시간 데이터 처리

### 인증
- **Cognito User Pool**: 사용자 관리
- **Cognito Identity Pool**: 임시 AWS 자격 증명

### 스토리지
- **S3 Bucket**: 정적 웹사이트 호스팅
- **CloudFront**: CDN 및 캐싱

### 모니터링
- **CloudWatch**: 로깅 및 모니터링
- **X-Ray**: 분산 추적

## 디렉토리 구조

```
src/
├── stacks/         # CDK 스택 정의
├── constructs/     # 재사용 가능한 CDK 구성 요소
├── lib/            # 공통 라이브러리
└── bin/            # CDK 앱 진입점
```

## 환경 구성

- **Development**: 개발 환경
- **Staging**: 스테이징 환경
- **Production**: 프로덕션 환경

## 배포 명령어

```bash
# 개발 환경 배포
npm run deploy:dev

# 스테이징 환경 배포
npm run deploy:staging

# 프로덕션 환경 배포
npm run deploy:prod
```

## 개발 가이드

- 모든 리소스는 CDK Construct로 정의
- 환경별 설정 분리
- 보안 모범 사례 적용
- 비용 최적화 고려
