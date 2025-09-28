# TODO Web Application

현대적인 웹 기술 스택을 활용한 TODO 관리 애플리케이션입니다. 모노레포 구조로 구성되어 있으며, 프론트엔드는 React + Mantine UI, 백엔드는 AWS 서버리스 아키텍처를 사용합니다.

## 🚀 기술 스택

### 프론트엔드
- **React 18** - 사용자 인터페이스 라이브러리
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **TypeScript** - 타입 안전성을 위한 정적 타입 검사
- **Mantine UI** - 현대적이고 접근성이 뛰어난 UI 컴포넌트 라이브러리
- **React Router** - 클라이언트 사이드 라우팅
- **React Context API + useReducer** - 상태 관리

### 백엔드
- **Node.js + TypeScript** - 서버 사이드 런타임
- **AWS Lambda** - 서버리스 함수 실행 환경
- **AWS DynamoDB** - NoSQL 데이터베이스
- **AWS API Gateway** - RESTful API 엔드포인트
- **AWS Cognito** - 사용자 인증 및 권한 관리

### 인프라
- **AWS CDK** - Infrastructure as Code
- **GitHub Actions** - CI/CD 파이프라인
- **GitHub Pages** - 프론트엔드 배포

## 📁 프로젝트 구조

```
handson-vivecoding-demo/
├── frontend/           # React + Mantine 기반 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 가능한 UI 컴포넌트
│   │   ├── contexts/   # React Context API
│   │   ├── hooks/      # 커스텀 훅
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── services/   # 외부 서비스 통신 로직
│   │   ├── types/      # TypeScript 타입 정의
│   │   └── utils/      # 유틸리티 함수
│   └── package.json
├── backend/            # Node.js + TypeScript 기반 백엔드
│   ├── src/
│   │   ├── handlers/   # Lambda 함수 핸들러
│   │   ├── models/     # 데이터 모델 및 스키마
│   │   ├── services/   # 비즈니스 로직
│   │   ├── utils/      # 유틸리티 함수
│   │   └── types/      # TypeScript 타입 정의
│   └── package.json
├── shared/             # 공통 타입, 상수, 유틸리티
│   ├── src/
│   │   ├── types/      # 공통 타입 정의
│   │   ├── constants/  # 상수 정의
│   │   └── utils/      # 유틸리티 함수
│   └── package.json
├── infrastructure/     # AWS CDK 인프라 코드
│   ├── src/
│   │   ├── stacks/     # CDK 스택 정의
│   │   ├── constructs/ # 재사용 가능한 CDK 구성 요소
│   │   └── lib/        # 공통 라이브러리
│   └── package.json
├── scripts/            # 빌드, 배포, 유틸리티 스크립트
├── docs/               # 프로젝트 문서
│   ├── requirements.md # 요구사항 정의
│   ├── design.md       # 아키텍처 및 설계 문서
│   └── checklist.md    # 진행상황 체크리스트
└── README.md           # 프로젝트 설명서
```

## 🛠️ 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- AWS CLI (백엔드 배포 시)
- Git

### 프로젝트 클론
```bash
git clone <repository-url>
cd handson-vivecoding-demo
```

### 의존성 설치
```bash
# 루트에서 모든 패키지 설치
npm install

# 또는 개별 패키지 설치
cd frontend && npm install
cd ../backend && npm install
cd ../shared && npm install
cd ../infrastructure && npm install
```

### 개발 서버 실행
```bash
# 프론트엔드 개발 서버
cd frontend
npm run dev

# 백엔드 개발 서버 (로컬)
cd backend
npm run dev
```

## 🧪 테스트

### 프론트엔드 테스트
```bash
cd frontend
npm run test          # 단위 테스트
npm run test:coverage # 커버리지 포함 테스트
npm run test:e2e      # E2E 테스트
```

### 백엔드 테스트
```bash
cd backend
npm run test          # 단위 테스트
npm run test:coverage # 커버리지 포함 테스트
```

### 전체 테스트
```bash
npm run test:all      # 모든 패키지 테스트
```

## 🚀 배포

### 프론트엔드 배포 (GitHub Pages)
```bash
cd frontend
npm run build
npm run deploy
```

### 백엔드 배포 (AWS)
```bash
cd infrastructure
npm run deploy:dev    # 개발 환경
npm run deploy:prod   # 프로덕션 환경
```

### 전체 배포
```bash
npm run deploy:all
```

## 📋 개발 가이드라인

### 코딩 스타일
- **TypeScript**: 모든 코드는 TypeScript로 작성
- **ESLint + Prettier**: 일관된 코드 스타일 유지
- **네이밍 컨벤션**: 
  - 파일/디렉토리: kebab-case
  - 컴포넌트: PascalCase
  - 함수/변수: camelCase
  - 상수: UPPER_SNAKE_CASE

### 커밋 규칙
- **커밋 전**: `docs/checklist.md` 진행상황 업데이트 필수
- **커밋 메시지**: 명확하고 간결한 메시지 작성
- **브랜치 전략**: feature/기능명, bugfix/버그명

### Git Hook을 통한 자동화된 코드 품질 관리

프론트엔드 개발 시 코드 품질을 자동으로 보장하기 위해 Git Hook이 설정되어 있습니다:

#### 🎯 Pre-commit Hook 기능
- **위치**: 루트 `.husky/pre-commit` (모노레포 전체 관리)
- **스마트 감지**: frontend 디렉토리 변경 시에만 실행
- **자동 실행 순서**:
  1. **🔧 Lint Fix**: ESLint를 통한 코드 스타일 자동 수정
  2. **🏗️ Build**: TypeScript 컴파일 및 Vite 빌드 검증
  3. **🧪 Test**: Vitest를 통한 테스트 실행 및 통과 확인

#### 📝 사용 예시
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

#### 🏗️ 모노레포 관리 장점
- **중앙화된 관리**: 루트에서 모든 git hook 관리
- **확장성**: 향후 backend, shared 등 다른 패키지에도 hook 추가 가능
- **일관성**: 프로젝트 전체에서 동일한 git hook 정책 적용
- **유지보수성**: 하나의 위치에서 모든 hook 관리

#### ✅ 장점
- **코드 품질 보장**: 커밋 전 자동 검증으로 품질 저하 방지
- **개발 효율성**: 수동 검증 과정 생략으로 개발 속도 향상
- **일관성 유지**: 팀 전체가 동일한 코드 품질 기준 적용
- **선택적 실행**: frontend 변경 시에만 실행되어 불필요한 오버헤드 방지

### 테스트 전략
- **프론트엔드**: UI 구현 시 실행 코드 우선, 코어 비즈니스 로직만 TDD
- **백엔드**: 모든 구현을 TDD로 진행
- **테스트 커버리지**: 주요 기능과 컴포넌트에 대한 테스트 필수

## 🎨 UI/UX 가이드라인

### 디자인 원칙
- **모바일 우선**: 반응형 디자인으로 모든 디바이스 지원
- **접근성**: WCAG 2.1 AA 수준 준수
- **Mantine 디자인 시스템**: 일관된 디자인 언어 사용

### 컴포넌트 규칙
- **함수형 컴포넌트**: 모든 컴포넌트는 함수형으로 작성
- **Props 인터페이스**: TypeScript 인터페이스로 명시적 정의
- **단일 책임 원칙**: 작고 명확한 컴포넌트 작성

## 🔒 보안 및 성능

### 보안
- **JWT 토큰 검증**: API 요청 시 토큰 유효성 검증
- **입력 데이터 검증**: 모든 사용자 입력에 대한 유효성 검사
- **XSS 및 CSRF 공격 방지**: 적절한 보안 헤더 및 입력 검증

### 성능 최적화
- **로딩 성능**: 페이지 로드 시간 < 2초 목표
- **렌더링 최적화**: React.memo, useMemo, useCallback 활용
- **코드 스플리팅**: Vite의 동적 import를 활용한 코드 분할

## 📚 문서

- [요구사항 정의](docs/requirements.md)
- [아키텍처 설계](docs/design.md)
- [진행상황 체크리스트](docs/checklist.md)
- [프론트엔드 가이드](frontend/README.md)
- [백엔드 가이드](backend/README.md)
- [공통 모듈 가이드](shared/README.md)
- [인프라 가이드](infrastructure/README.md)
- [스크립트 가이드](scripts/README.md)

## 🤝 기여 방법

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -m '새 기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 [Issues](https://github.com/your-repo/issues)를 통해 문의해 주세요.

---

**핸즈온 바이브코딩** 프로젝트의 일부로 개발되었습니다.

## 강의 진행상황 업데이트
https://m.hanbit.co.kr/product/C7620533084

- [X] 01차시_강의 개요
- [X] 02차시_바이브 코딩이란 무엇인가
- [X] 03차시_일반적인 모범사례 활용
- [X] 04차시_바이브코딩을 위한 프롬프트 엔지니어링
- [X] 05차시_프로젝트 기획 및 설계
- [X] 06차시_모노레포 초기화 및 기본 설정
- [X] 07차시_프론트엔드 프로젝트 설정
- [X] 08차시_프론트엔드 모듈 설정
- [X] 09차시_메인로직 구현
- [X] 10차시_UI 구현
- [ ] 11차시_프론트엔드 테스트
- [ ] 12차시_프론트엔드 배포
- [ ] 13차시_프론트엔드 내용 정리
- [ ] 14차시_백엔드 개발을 위한 바이브 코딩
- [ ] 15차시_백엔드 프로젝트 설정
- [ ] 16차시_도메인 모델 및 인터페이스 구현
- [ ] 17차시_CDK 스택 구현 및 MCP 설정
- [ ] 18차시_유스케이스 구현
- [ ] 19차시_인프라 어댑터 구현
- [ ] 20차시_API 컨트롤러 및 Lambda 핸들러 구현
- [ ] 21차시_백엔드 정리
- [ ] 22차시_바이브 코딩을 이용한 데브옵스
- [ ] 23차시_엔지니어링 모범 사례와 클로드 코드
- [ ] 24차시_Tidy First와 클로드 코드
- [ ] 25차시_컨텍스트 엔지니어링 대규모 AI 코딩 기법
- [ ] 26차시_AI를 활용한 코드 리뷰
- [ ] 27차시_바이브 코딩에서의 작업 흐름
- [ ] 28차시_데브옵스와 클로드 코드
- [ ] 29차시_클로드 코드 규칙 정비
- [ ] 30차시_데브옵스 프로젝트 계획 수립
- [ ] 31차시_Github Actions 워크플로우 설정
- [ ] 32차시_배포 자동화 와 E2E 테스트 구현
- [ ] 33차시_AI를 활용한 문서 최신화
- [ ] 34차시_서브 에이전트를 이용한 리뷰 자동화
- [ ] 35차시_대시보드 구현
- [ ] 36차시_트러블슈팅 업데이트 자동화
- [ ] 37차시_데브옵스 정리
- [ ] 38차시_바이브 코딩으로 구축하는 보안
- [ ] 39차시_보안 요구사항 정의 단계
- [ ] 40차시_보안 구현 및 자동화 단계
- [ ] 41차시_AWS 보안 서비스 개요
- [ ] 42차시_보안 프로젝트 요건정의
- [ ] 43차시_Task 문서화 및 Github 이슈 생성
- [ ] 44차시_정보자산 전수조사
- [ ] 45차시_보안 수준 평가 및 ISMS-P Gap 분석
- [ ] 46차시_AWS 보안 서비스와 ISMS 규정 매핑
- [ ] 47차시_Github Projects를 이용한 로드맵 수립
- [ ] ★바이브 코딩 2025★ 바이브 코딩의 환상과 현실
- [ ] ★바이브 코딩 2025★ AI는 주문을 외워주는 마법사인가, 구조를 이해하는 비서인가?
- [ ] ★바이브 코딩 2025★ 당신의 프로덕션 바이브 코딩이 실패하는 이유