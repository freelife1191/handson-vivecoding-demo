# Frontend

TODO 앱의 프론트엔드 애플리케이션입니다.

## 기술 스택
- React 19
- TypeScript
- Vite
- Mantine UI
- React Router (예정)
- Vitest + React Testing Library

## 주요 기능
- Todo 아이템 생성, 수정, 삭제
- 우선순위별 필터링 및 정렬
- 완료 상태 관리
- 반응형 디자인

## 개발 환경 설정
```bash
npm install
npm run dev
```

## 테스트 실행
```bash
npm test          # 테스트 실행
npm run test:ui   # 테스트 UI 실행
npm run test:run  # 테스트 한 번 실행
```

## 코드 품질
```bash
npm run lint      # ESLint 검사
npm run format    # Prettier 포맷팅
```

## 프로젝트 구조
```
src/
├── components/   # 재사용 가능한 컴포넌트
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
├── contexts/     # React Context
├── types/        # TypeScript 타입 정의
├── utils/        # 유틸리티 함수
└── test/         # 테스트 설정
```