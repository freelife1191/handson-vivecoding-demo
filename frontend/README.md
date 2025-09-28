# Frontend

React + Vite + TypeScript + Mantine UI 기반의 TODO 애플리케이션 프론트엔드입니다.

## 모노레포 구조

이 프로젝트는 모노레포 구조로 설계되어 있으며, frontend는 전체 구조의 일부입니다:

```
handson-vivecoding-demo/
├── frontend/          # React + Vite + TypeScript + Mantine (현재 위치)
├── backend/           # Node.js + TypeScript + AWS 서버리스
├── shared/            # 프론트엔드/백엔드 공통 타입 및 유틸리티
├── infrastructure/    # AWS CDK 인프라 코드
├── docs/              # 프로젝트 문서
└── scripts/           # 개발/배포 스크립트
```

### 모노레포 장점
- **코드 공유**: shared 디렉토리를 통한 타입 및 유틸리티 공유
- **일관성**: 프론트엔드/백엔드 간 동일한 타입 정의 사용
- **효율성**: 단일 저장소에서 전체 프로젝트 관리
- **확장성**: 새로운 패키지 추가 시 기존 구조 활용

## 기술 스택

- **React 18**: 사용자 인터페이스 라이브러리
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Mantine UI**: 현대적이고 접근성이 뛰어난 UI 컴포넌트 라이브러리
- **Vitest + React Testing Library**: 테스트 프레임워크 (Jest 호환)
- **React Context API + useReducer**: 상태 관리

## 공통 타입 시스템

프로젝트는 체계적인 타입 시스템을 통해 타입 안전성을 보장합니다:

### 핵심 타입 정의
```typescript
// Todo 관련 타입
interface Todo {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// 우선순위 정보
const PRIORITY_INFO = {
  low: { label: '낮음', color: 'green' },
  medium: { label: '중간', color: 'yellow' },
  high: { label: '높음', color: 'red' }
};

// 필터 및 정렬 타입
type TodoFilter = 'all' | 'pending' | 'completed';
type TodoSortBy = 'createdAt' | 'priority' | 'title';
type SortOrder = 'asc' | 'desc';
```

### 타입 시스템 특징
- **엄격한 타입 체크**: TypeScript strict 모드 활성화
- **공통 타입 공유**: shared 디렉토리를 통한 프론트엔드/백엔드 타입 동기화
- **런타임 검증**: Zod를 통한 데이터 유효성 검사
- **자동 완성**: IDE에서 완벽한 타입 추론 및 자동 완성 지원

## 스토리지 전략

프로젝트는 유연한 스토리지 전략을 통해 로컬 개발과 프로덕션 환경을 모두 지원합니다:

### 스토리지 아키텍처
```typescript
// 스토리지 서비스 인터페이스
interface StorageService {
  getTodos(): Promise<Todo[]>;
  saveTodos(todos: Todo[]): Promise<void>;
  clearTodos(): Promise<void>;
}

// 구현체들
- LocalStorageService    # 로컬 개발용 (localStorage)
- ApiStorageService      # 프로덕션용 (REST API)
- StorageManager         # 전략 전환 관리
```

### 전환 메커니즘
1. **개발 단계**: LocalStorageService 사용 (완전 독립 동작)
2. **통합 단계**: StorageManager를 통한 자동 전환
3. **프로덕션**: ApiStorageService 사용 (AWS 서버리스 API)

### 장점
- **독립 개발**: 백엔드 없이도 완전한 프론트엔드 개발 가능
- **점진적 통합**: 단계별 백엔드 연결로 리스크 최소화
- **유연성**: 환경에 따른 스토리지 전략 자동 선택
- **테스트 용이성**: Mock 스토리지 서비스로 테스트 간소화

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

## Git Hook을 통한 자동화된 코드 품질 관리

프론트엔드 개발 시 코드 품질을 자동으로 보장하기 위해 Git Hook이 설정되어 있습니다:

### 🎯 Pre-commit Hook 기능
- **위치**: 루트 `.husky/pre-commit` (모노레포 전체 관리)
- **스마트 감지**: frontend 디렉토리 변경 시에만 실행
- **자동 실행 순서**:
  1. **🔧 Lint Fix**: ESLint를 통한 코드 스타일 자동 수정
  2. **🏗️ Build**: TypeScript 컴파일 및 Vite 빌드 검증
  3. **🧪 Test**: Vitest를 통한 테스트 실행 및 통과 확인

### 📝 사용 예시
```bash
# frontend 디렉토리 변경 시
git add frontend/src/components/MyComponent.tsx
git commit -m "feat: 새로운 컴포넌트 추가"
# → 자동으로 lint fix, build, test 실행

# 다른 디렉토리 변경 시
git add docs/README.md
git commit -m "docs: 문서 업데이트"
# → frontend 변경 없으므로 hook 실행 안됨
```

### 🏗️ 모노레포 관리 장점
- **중앙화된 관리**: 루트에서 모든 git hook 관리
- **확장성**: 향후 backend, shared 등 다른 패키지에도 hook 추가 가능
- **일관성**: 프로젝트 전체에서 동일한 git hook 정책 적용
- **유지보수성**: 하나의 위치에서 모든 hook 관리

### ✅ 장점
- **코드 품질 보장**: 커밋 전 자동 검증으로 품질 저하 방지
- **개발 효율성**: 수동 검증 과정 생략으로 개발 속도 향상
- **일관성 유지**: 팀 전체가 동일한 코드 품질 기준 적용
- **선택적 실행**: frontend 변경 시에만 실행되어 불필요한 오버헤드 방지
