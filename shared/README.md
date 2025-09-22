# Shared

프론트엔드와 백엔드에서 공통으로 사용하는 모듈입니다.

## 포함 내용
- **types**: 공통 타입 정의 (Todo, User 등)
- **constants**: 상수 정의
- **utils**: 유틸리티 함수
- **validators**: 데이터 검증 함수

## 사용 방법
```typescript
// 프론트엔드에서
import { Todo, TodoPriority } from '../shared/types';

// 백엔드에서
import { Todo, validateTodo } from '../shared';
```

## 구조
```
shared/
├── types/          # 타입 정의
├── constants/      # 상수
├── utils/          # 유틸리티 함수
├── validators/     # 검증 함수
└── index.ts        # 메인 export
```
