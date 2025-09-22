# Backend

TODO 앱의 백엔드 API 서버입니다.

## 기술 스택
- Node.js
- TypeScript
- Express.js
- Jest + Supertest
- ESLint + Prettier

## 주요 기능
- Todo CRUD API (예정)
- 사용자 인증 (향후 확장)
- 데이터 검증
- 에러 처리
- 보안 미들웨어 (Helmet, CORS)

## 개발 환경 설정
```bash
npm install
npm run dev
```

## 빌드 및 실행
```bash
npm run build    # TypeScript 컴파일
npm start        # 프로덕션 서버 실행
```

## 테스트 실행
```bash
npm test              # 테스트 실행
npm run test:watch    # 테스트 감시 모드
npm run test:coverage # 커버리지 포함 테스트
```

## 코드 품질
```bash
npm run lint      # ESLint 검사
npm run lint:fix  # ESLint 자동 수정
npm run format    # Prettier 포맷팅
```

## 프로젝트 구조
```
src/
├── controllers/  # API 컨트롤러
├── models/       # 데이터 모델
├── routes/       # 라우트 정의
├── middleware/   # 커스텀 미들웨어
├── services/     # 비즈니스 로직
├── utils/        # 유틸리티 함수
├── types/        # TypeScript 타입 정의
├── test/         # 테스트 설정
├── app.ts        # Express 앱 설정
└── server.ts     # 서버 시작
```

## API 엔드포인트
- GET / - API 정보
- GET /health - 헬스 체크
- GET /api/todos - Todo 목록 조회 (예정)
- POST /api/todos - Todo 생성 (예정)
- PUT /api/todos/:id - Todo 수정 (예정)
- DELETE /api/todos/:id - Todo 삭제 (예정)
