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
