# Shared

프론트엔드와 백엔드에서 공통으로 사용하는 타입, 상수, 유틸리티 함수 등을 포함하는 공통 모듈입니다.

## 목적

- **타입 일관성**: 프론트엔드와 백엔드 간 동일한 타입 정의 보장
- **코드 재사용**: 공통 로직의 중복 방지
- **유지보수성**: 중앙화된 공통 코드 관리
- **개발 효율성**: 공통 기능의 빠른 개발 및 배포

## 주요 구성 요소

### 타입 정의 (Types)
- **Todo**: TODO 항목의 데이터 구조
- **User**: 사용자 정보 구조
- **API**: API 요청/응답 타입
- **Common**: 공통으로 사용되는 유틸리티 타입

### 상수 (Constants)
- **API_ENDPOINTS**: API 엔드포인트 URL
- **STORAGE_KEYS**: 로컬 스토리지 키
- **PRIORITY_LEVELS**: 우선순위 레벨
- **STATUS_CODES**: HTTP 상태 코드

### 유틸리티 함수 (Utils)
- **validation**: 데이터 검증 함수
- **formatting**: 데이터 포맷팅 함수
- **date**: 날짜 관련 유틸리티
- **string**: 문자열 처리 함수

## 디렉토리 구조

```
src/
├── types/          # TypeScript 타입 정의
├── constants/      # 상수 정의
├── utils/          # 유틸리티 함수
├── interfaces/     # 인터페이스 정의
└── schemas/        # 데이터 스키마 (Zod 등)
```

## 사용 방법

### 프론트엔드에서 사용
```typescript
import { Todo, API_ENDPOINTS } from '@shared/types';
import { validateTodo } from '@shared/utils';
```

### 백엔드에서 사용
```typescript
import { Todo, API_ENDPOINTS } from '@shared/types';
import { validateTodo } from '@shared/utils';
```

## 개발 가이드

- 모든 타입은 명확하고 문서화된 인터페이스로 정의
- 유틸리티 함수는 순수 함수로 작성
- 상수는 명확한 네이밍 컨벤션 사용
- 프론트엔드와 백엔드 모두에서 사용 가능하도록 설계
