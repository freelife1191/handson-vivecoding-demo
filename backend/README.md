# Backend

Node.js + TypeScript 기반의 AWS 서버리스 아키텍처를 사용한 TODO 애플리케이션 백엔드입니다.

## 기술 스택

- **Node.js**: JavaScript 런타임 환경
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **AWS Lambda**: 서버리스 함수 실행 환경
- **AWS DynamoDB**: NoSQL 데이터베이스
- **AWS API Gateway**: RESTful API 엔드포인트
- **AWS Cognito**: 사용자 인증 및 권한 관리
- **Jest**: 테스트 프레임워크

## 아키텍처

- **서버리스**: AWS Lambda를 통한 이벤트 기반 실행
- **NoSQL**: DynamoDB를 통한 확장 가능한 데이터 저장
- **RESTful API**: 표준 HTTP 메서드를 사용한 API 설계
- **JWT 인증**: Cognito를 통한 보안 인증

## 주요 기능

- TODO CRUD 작업 (생성, 조회, 수정, 삭제)
- 사용자 인증 및 권한 관리
- 데이터 검증 및 에러 처리
- API 레이트 리미팅
- 로깅 및 모니터링

## 디렉토리 구조

```
src/
├── handlers/       # Lambda 함수 핸들러
├── models/         # 데이터 모델 및 스키마
├── services/       # 비즈니스 로직
├── utils/          # 유틸리티 함수
├── middleware/     # 미들웨어 (인증, 검증 등)
└── types/          # TypeScript 타입 정의
```

## 개발 가이드

- 모든 구현을 TDD 방식으로 진행
- Clean Architecture 원칙 준수
- SOLID 원칙 적용
- 에러 처리 및 로깅 체계 구축
