# Frontend

React + Vite + TypeScript + Mantine UI 기반의 TODO 애플리케이션 프론트엔드입니다.

> **참고**: 모노레포 구조, 공통 타입 시스템, 스토리지 전략 등 프로젝트 전체 정보는 [루트 README.md](../README.md)를 참조하세요.

## 기술 스택

- **React 18**: 사용자 인터페이스 라이브러리
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Mantine UI**: 현대적이고 접근성이 뛰어난 UI 컴포넌트 라이브러리
- **Vitest + React Testing Library**: 테스트 프레임워크 (Jest 호환)
- **React Context API + useReducer**: 상태 관리

## 주요 기능

- TODO 항목 생성, 수정, 삭제
- 우선순위 설정 및 필터링
- 완료 상태 관리
- 반응형 디자인 (모바일 우선)
- 다크/라이트 모드 지원
- 접근성 준수 (WCAG 2.1 AA)

## 상태 관리 아키텍처

프로젝트는 React Context API와 useReducer를 활용한 중앙화된 상태 관리를 구현합니다:

### 상태 관리 구조
```typescript
// TodoContext + useReducer 패턴
const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// 커스텀 훅을 통한 상태 접근
const useTodoState = () => {
  const context = useContext(TodoContext);
  return context.state;
};

const useTodoActions = () => {
  const context = useContext(TodoContext);
  return context.dispatch;
};
```

### 액션 타입 시스템
```typescript
type TodoAction = 
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };
```

### 장점
- **타입 안전성**: TypeScript로 액션과 상태 타입 보장
- **예측 가능성**: Reducer 패턴으로 상태 변경 로직 중앙화
- **테스트 용이성**: 순수 함수로 구성된 Reducer 테스트 간소화
- **성능 최적화**: Context 분할로 불필요한 리렌더링 방지

## 테스트 전략

프로젝트는 포괄적인 테스트 전략을 통해 코드 품질을 보장합니다:

### 테스트 피라미드
```
    🔺 E2E Tests (Cypress)
   🔺🔺 Integration Tests (React Testing Library)
  🔺🔺🔺 Unit Tests (Vitest + React Testing Library)
```

### 테스트 커버리지
- **단위 테스트**: 253개 테스트 (모든 컴포넌트, 훅, 유틸리티)
- **통합 테스트**: 9개 테스트 (컴포넌트 간 상호작용)
- **전체 커버리지**: 59.21% (핵심 비즈니스 로직 100%)

### TDD 적용 영역
- **비즈니스 로직**: Todo 모델, 상태 관리, 스토리지 어댑터
- **커스텀 훅**: useTodoState, useTodoActions, useTodoFilter
- **유틸리티 함수**: 데이터 변환, 검증 로직

### 테스트 도구
- **Vitest**: Jest 호환 API로 빠른 테스트 실행
- **React Testing Library**: 사용자 중심 테스트 접근법
- **MSW**: API 모킹을 통한 네트워크 테스트

## 디렉토리 구조

```
src/
├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── common/     # 공통 컴포넌트 (ErrorBoundary 등)
│   ├── layout/     # 레이아웃 컴포넌트 (Header, Layout, TabBar)
│   └── todo/       # Todo 관련 컴포넌트
├── contexts/       # React Context API (TodoContext, TodoReducer)
├── hooks/          # 커스텀 훅 (useTodoState, useTodoActions, useTodoFilter)
├── models/         # 비즈니스 로직 모델 (Todo, TodoSorting)
├── pages/          # 페이지 컴포넌트 (TodoPage, SettingsPage)
├── services/       # 외부 서비스 통신 로직
│   ├── api/        # API 클라이언트
│   └── storage/    # 스토리지 어댑터 (LocalStorage, ApiStorage)
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── App.tsx         # 애플리케이션 진입점
```

## 성능 최적화

프로젝트는 다양한 성능 최적화 기법을 적용하여 빠른 사용자 경험을 제공합니다:

### 렌더링 최적화
- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 계산 비용이 큰 연산 메모이제이션
- **Context 분할**: 상태별 Context 분리로 리렌더링 범위 최소화

### 번들 최적화
- **Vite**: 빠른 개발 서버 및 최적화된 프로덕션 빌드
- **Tree Shaking**: 사용하지 않는 코드 자동 제거
- **Code Splitting**: 동적 import를 통한 코드 분할

### 성능 지표
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3초

## 개발 가이드

### 코딩 컨벤션
- **함수형 컴포넌트**: 모든 컴포넌트는 함수형으로 작성
- **TypeScript**: 엄격한 타입 체크로 런타임 에러 방지
- **Mantine UI**: 일관된 디자인 시스템을 위한 Mantine 컴포넌트 우선 사용
- **접근성**: WCAG 2.1 AA 수준 준수

### 아키텍처 원칙
- **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 역할
- **의존성 역전**: 인터페이스를 통한 느슨한 결합
- **관심사 분리**: UI, 비즈니스 로직, 데이터 계층 분리
- **테스트 가능성**: 모든 코드는 테스트 가능하도록 설계

### 코드 품질
- **ESLint**: 코드 스타일 및 잠재적 버그 검출
- **Prettier**: 일관된 코드 포맷팅
- **Husky**: Git Hook을 통한 커밋 전 자동 검증
- **TypeScript strict**: 엄격한 타입 체크 활성화

## 🚀 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 테스트 실행
npm run test
npm run test:coverage
```

## 📚 관련 문서

- [프로젝트 전체 가이드](../README.md) - 모노레포 구조, 공통 타입, 스토리지 전략
- [Git Hook 자동화](../README.md#git-hook을-통한-자동화된-코드-품질-관리) - 코드 품질 자동 검증
- [진행상황 체크리스트](../docs/checklist.md) - 개발 진행상황
# CI Test
