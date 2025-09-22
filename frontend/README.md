# Frontend

React + Vite + TypeScript + Mantine UI 기반의 TODO 애플리케이션 프론트엔드입니다.

## 기술 스택

- **React 18**: 사용자 인터페이스 라이브러리
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Mantine UI**: 현대적이고 접근성이 뛰어난 UI 컴포넌트 라이브러리
- **React Router**: 클라이언트 사이드 라우팅
- **Jest + React Testing Library**: 테스트 프레임워크

## 주요 기능

- TODO 항목 생성, 수정, 삭제
- 우선순위 설정 및 필터링
- 완료 상태 관리
- 반응형 디자인 (모바일 우선)
- 다크/라이트 모드 지원
- 접근성 준수 (WCAG 2.1 AA)

## 디렉토리 구조

```
src/
├── components/     # 재사용 가능한 UI 컴포넌트
├── contexts/       # React Context API
├── hooks/          # 커스텀 훅
├── pages/          # 페이지 컴포넌트
├── services/       # 외부 서비스 통신 로직
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── App.tsx         # 애플리케이션 진입점
```

## 개발 가이드

- 모든 컴포넌트는 함수형 컴포넌트로 작성
- TypeScript를 활용한 엄격한 타입 체크
- Mantine UI 컴포넌트를 우선적으로 활용
- 접근성과 사용자 경험을 최우선으로 고려
