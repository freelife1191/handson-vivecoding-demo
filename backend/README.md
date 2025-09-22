# Backend

TODO 앱의 백엔드 API 서버입니다.

## 기술 스택
- Node.js
- TypeScript
- Express.js
- Jest

## 주요 기능
- Todo CRUD API
- 사용자 인증 (향후 확장)
- 데이터 검증
- 에러 처리

## 개발 환경 설정
```bash
npm install
npm run dev
```

## 테스트 실행
```bash
npm test
```

## API 문서
- GET /api/todos - Todo 목록 조회
- POST /api/todos - Todo 생성
- PUT /api/todos/:id - Todo 수정
- DELETE /api/todos/:id - Todo 삭제
