# TODO 웹앱 프로젝트를 위한 SuperClaude 활용 가이드라인

## 📋 프로젝트 개요

이 가이드라인은 TODO 웹 애플리케이션 개발 프로젝트에서 **SuperClaude Framework를 효과적으로 활용**하기 위한 체계적인 접근법을 제공합니다. 프로젝트의 현재 상태 (3단계 완료, TDD 방식 코어 로직 완성)를 고려하여 단계별 SuperClaude 워크플로우를 설계했습니다.

### 현재 프로젝트 상태
- ✅ **1-3단계 완료**: 프론트엔드 개발 환경, 코어 비즈니스 로직 (TDD), UI 컴포넌트 구현 완료
- 🔄 **4단계 진행중**: 라우팅 및 앱 통합
- 📋 **남은 단계**: 4-10단계 (라우팅, 기능 개선, 테스트, 백엔드, 통합, 배포)

### 기술 스택
- Frontend: React + Vite + TypeScript + Mantine UI
- Backend: Node.js + TypeScript + AWS (Lambda, DynamoDB, Cognito)
- Testing: Vitest + React Testing Library
- Deployment: AWS CDK, GitHub Actions

## 🎯 SuperClaude 핵심 활용 전략

### 1. 세션 관리 및 컨텍스트 유지
모든 작업 시작 전에 프로젝트 컨텍스트를 로드하고 세션 상태를 관리합니다.

```bash
# 세션 시작 시 항상 실행
/sc:load .

# 정기적으로 진행 상황 저장 (30분마다)
/sc:save

# 작업 완료 후 세션 종료
/sc:save
```

### 2. 단계별 SuperClaude 워크플로우 매트릭스

| 개발 단계 | 주요 명령어 | 전문 에이전트 | MCP 서버 | 행동 모드 |
|----------|------------|-------------|----------|----------|
| **기획/분석** | `/sc:brainstorm`, `/sc:analyze` | `@agent-system-architect` | `serena`, `context7` | 🧠 Brainstorming |
| **아키텍처 설계** | `/sc:design`, `/sc:workflow` | `@agent-system-architect`, `@agent-frontend-architect` | `sequential-thinking` | 🔬 Deep Research |
| **코드 구현** | `/sc:implement`, `/sc:build` | 도메인별 에이전트 | `magic`, `context7` | 🎯 Orchestration |
| **테스트** | `/sc:test`, `/sc:analyze` | `@agent-quality-engineer` | `playwright`, `serena` | 📋 Task Management |
| **리팩토링** | `/sc:improve` | `@agent-refactoring-expert` | `morphllm-fast-apply` | ⚡ Token Efficiency |
| **배포/운영** | `/sc:build`, `/sc:troubleshoot` | `@agent-devops-architect` | `serena` | 🎯 Orchestration |

## 📊 현재 단계별 SuperClaude 활용 계획

### 4단계: 라우팅 및 앱 통합 (현재 진행 중)

#### 4.1 라우팅 설정
```bash
# 설계 단계
/sc:design "React Router 설정 및 라우트 구성" --focus frontend

# 구현 단계
/sc:implement "React Router 기본 라우트 구성" --type frontend
@agent-frontend-architect 라우트 가드 및 권한 관리 패턴 추천

# 테스트 단계
/sc:test --type unit --focus routing
```

#### 워크플로우 예시:
```bash
# 1. 컨텍스트 로드
/sc:load src/

# 2. 라우팅 아키텍처 분석
/sc:analyze --focus architecture --think
@agent-frontend-architect React Router v6 베스트 프랙티스 적용

# 3. 구현 계획 수립
/sc:workflow "React Router 구현 계획" --format checklist

# 4. 단계별 구현
/sc:implement "기본 라우트 설정"
/sc:implement "라우트 가드 구현"
/sc:implement "404 페이지 처리"

# 5. 테스트 및 검증
/sc:test --type integration --focus routing
```

### 5단계: 프론트엔드 기능 개선 및 최적화

#### 5.1 필터링 및 정렬 기능
```bash
# TDD 접근법으로 테스트 먼저 작성
@agent-quality-engineer 필터링 및 정렬 기능 테스트 전략 수립
/sc:test --write-first --type unit --focus filtering

# 구현
/sc:implement "우선순위별 필터링" --tdd
/sc:implement "제목 기반 검색 기능" --tdd

# 성능 최적화
@agent-performance-engineer 검색/필터 성능 최적화 방안
```

#### 5.2 성능 최적화
```bash
# 성능 분석
@agent-performance-engineer 현재 앱 성능 병목점 분석
/sc:analyze --focus performance --ultrathink

# 최적화 구현
/sc:improve --focus performance
@agent-performance-engineer React 최적화 기법 적용

# 성능 측정
/sc:test --type performance --target "페이지 로드 < 2초"
```

#### 5.3 접근성 개선
```bash
# 접근성 감사
@agent-quality-engineer WCAG 2.1 AA 준수를 위한 접근성 체크리스트

# 개선 구현
/sc:improve --focus accessibility
/sc:test --type accessibility --playwright

# 검증
/sc:test --type e2e --focus accessibility
```

### 6단계: 프론트엔드 테스트 및 품질 보증

```bash
# 테스트 전략 수립
@agent-quality-engineer 포괄적인 테스트 전략 수립
/sc:workflow "테스트 구현 계획" --format detailed

# 단위 테스트 완성
/sc:test --type unit --coverage 90
@agent-quality-engineer 테스트 커버리지 분석

# 통합 테스트
/sc:test --type integration --focus "사용자 시나리오"

# E2E 테스트 (Playwright MCP 활용)
/sc:test --type e2e --playwright
@agent-quality-engineer E2E 테스트 시나리오 추천
```

### 7-8단계: 백엔드 개발 (완전 TDD 접근)

```bash
# 백엔드 아키텍처 설계
@agent-backend-architect AWS 서버리스 아키텍처 설계
@agent-system-architect DynamoDB 스키마 설계 및 최적화

# 개발 환경 설정
/sc:build "백엔드 개발 환경" --type nodejs-typescript

# TDD로 API 개발
@agent-quality-engineer 백엔드 TDD 전략 수립
/sc:implement --tdd "Todo CRUD API"
/sc:test --type unit --backend

# 인증 시스템
@agent-security-engineer AWS Cognito 인증 보안 가이드
/sc:implement "AWS Cognito 인증" --focus security
```

### 9단계: 프론트엔드-백엔드 통합

```bash
# API 클라이언트 구현
/sc:implement "API 클라이언트" --pattern adapter

# 스토리지 전략 전환
@agent-system-architect 로컬↔원격 스토리지 전환 전략
/sc:implement "스토리지 어댑터 패턴"

# 통합 테스트
/sc:test --type integration --full-stack
@agent-quality-engineer 프론트엔드-백엔드 통합 테스트 시나리오
```

### 10단계: 인프라 및 배포

```bash
# 인프라 코드 작성
@agent-devops-architect AWS CDK 인프라 설계
/sc:implement "CDK 인프라 코드" --type infrastructure

# CI/CD 파이프라인
@agent-devops-architect GitHub Actions 워크플로우 설계
/sc:build "CI/CD 파이프라인" --automation

# 배포 및 모니터링
/sc:troubleshoot --type deployment
@agent-devops-architect 운영 모니터링 및 알람 설정
```

## 🎨 상황별 SuperClaude 명령어 조합

### 새로운 기능 개발 시

```bash
# 1. 기획 및 분석
/sc:brainstorm "[기능명] 구현 방안"
/sc:analyze --focus requirements

# 2. 설계
@agent-system-architect 아키텍처 설계 리뷰
/sc:design "[기능명] 상세 설계" --format detailed

# 3. 워크플로우 수립
/sc:workflow "[기능명] 구현 계획" --format checklist

# 4. TDD 구현 (코어 로직)
@agent-quality-engineer TDD 전략 수립
/sc:test --write-first --type unit
/sc:implement --tdd "[기능명] 비즈니스 로직"

# 5. UI 구현
/sc:implement "[기능명] UI 컴포넌트" --magic
@agent-frontend-architect UI/UX 패턴 추천

# 6. 통합 및 테스트
/sc:test --type integration
/sc:test --type e2e --playwright

# 7. 검토 및 개선
@agent-refactoring-expert 코드 품질 검토
/sc:improve --focus quality
```

### 버그 수정 시

```bash
# 1. 문제 분석
/sc:troubleshoot "[버그 설명]" --type runtime
@agent-root-cause-analyst 근본 원인 분석

# 2. 재현 테스트 작성
/sc:test --write-first --type regression

# 3. 수정 구현
/sc:implement "버그 수정" --focus stability

# 4. 검증
/sc:test --type regression --full-coverage
```

### 성능 최적화 시

```bash
# 1. 성능 측정 및 분석
@agent-performance-engineer 성능 프로파일링
/sc:analyze --focus performance --ultrathink

# 2. 최적화 계획
/sc:workflow "성능 최적화 계획" --priority performance

# 3. 최적화 구현
/sc:improve --focus performance
@agent-performance-engineer React 최적화 패턴 적용

# 4. 성능 검증
/sc:test --type performance --benchmark
```

### 리팩토링 시

```bash
# 1. 코드 품질 분석
@agent-refactoring-expert 코드 품질 분석
/sc:analyze --focus quality --think-hard

# 2. 리팩토링 계획
/sc:workflow "리팩토링 계획" --format systematic

# 3. 리팩토링 실행
@agent-refactoring-expert 단계별 리팩토링 수행
/sc:improve --focus maintainability

# 4. 회귀 테스트
/sc:test --type regression --comprehensive
```

## 🧭 전문 에이전트별 활용 전략

### Frontend 도메인

#### @agent-frontend-architect
- **사용 시점**: UI/UX 설계, 컴포넌트 아키텍처, 상태 관리 최적화
- **주요 역할**: React 패턴, Mantine UI 최적 활용, 반응형 디자인
```bash
@agent-frontend-architect Mantine UI로 일관된 디자인 시스템 구축
@agent-frontend-architect React Context 최적화 패턴 추천
```

#### @agent-performance-engineer
- **사용 시점**: 성능 분석, 최적화, 번들 사이즈 관리
- **주요 역할**: React 성능 최적화, 가상화, 코드 스플리팅
```bash
@agent-performance-engineer React.memo, useMemo, useCallback 최적화 전략
@agent-performance-engineer 번들 사이즈 최적화 방안
```

#### @agent-quality-engineer
- **사용 시점**: 테스트 전략 수립, 품질 기준 정의, 테스트 코드 리뷰
- **주요 역할**: Vitest + RTL 테스트 패턴, 커버리지 관리
```bash
@agent-quality-engineer 컴포넌트 단위 테스트 전략 수립
@agent-quality-engineer E2E 테스트 시나리오 설계
```

### Backend 도메인

#### @agent-backend-architect
- **사용 시점**: API 설계, 데이터베이스 스키마, 서버리스 아키텍처
- **주요 역할**: AWS Lambda, DynamoDB 최적화, API Gateway 설계
```bash
@agent-backend-architect DynamoDB 파티션 키 최적화 전략
@agent-backend-architect Lambda 콜드 스타트 최소화 방안
```

#### @agent-security-engineer
- **사용 시점**: 인증/인가, 보안 취약점 분석, OWASP 준수
- **주요 역할**: AWS Cognito 설정, JWT 보안, API 보안
```bash
@agent-security-engineer AWS Cognito 보안 모범 사례
@agent-security-engineer API 엔드포인트 보안 강화 방안
```

### DevOps 도메인

#### @agent-devops-architect
- **사용 시점**: 인프라 설계, CI/CD 파이프라인, 배포 전략
- **주요 역할**: AWS CDK, GitHub Actions, 모니터링 설정
```bash
@agent-devops-architect 모노레포 CI/CD 최적화 전략
@agent-devops-architect AWS CloudWatch 모니터링 설정
```

## 🔧 MCP 서버별 활용 시나리오

### serena 🧭 (프로젝트 메모리 및 세션 관리)
```bash
# 세션 시작 시
/sc:load .  # serena를 통해 프로젝트 컨텍스트 로드

# 코드베이스 분석
@agent-system-architect serena를 활용한 아키텍처 분석

# 세션 저장
/sc:save  # serena를 통해 컨텍스트 저장
```

### context7 📚 (공식 문서 및 라이브러리 가이드)
```bash
# React/Vite 공식 패턴 조회
/sc:implement "React Router 설정" --context7

# Mantine 컴포넌트 활용
@agent-frontend-architect Mantine UI 베스트 프랙티스 조회 (context7)

# AWS SDK 사용법
@agent-backend-architect AWS SDK v3 사용 패턴 (context7)
```

### magic ✨ (UI 컴포넌트 생성)
```bash
# 새로운 UI 컴포넌트 생성
/sc:implement "Todo 필터링 컴포넌트" --magic

# Mantine 기반 폼 컴포넌트
@agent-frontend-architect 접근성 고려한 폼 컴포넌트 (magic)
```

### playwright 🎭 (E2E 테스트)
```bash
# E2E 테스트 시나리오 실행
/sc:test --type e2e --playwright

# 접근성 테스트
@agent-quality-engineer 접근성 자동 테스트 (playwright)
```

### sequential-thinking 🧠 (복잡한 분석)
```bash
# 아키텍처 의사결정
/sc:analyze --focus architecture --sequential

# 복잡한 문제 해결
/sc:troubleshoot "복잡한 상태 관리 이슈" --sequential
```

### morphllm-fast-apply 🔄 (대량 코드 변경)
```bash
# 대량 리팩토링
@agent-refactoring-expert 전체 컴포넌트 TypeScript 엄격 타입 적용 (morphllm)

# 패턴 기반 수정
/sc:improve "모든 console.log를 logger로 변경" --morphllm
```

## 🎯 실제 작업 시나리오별 워크플로우

### 시나리오 1: 새로운 기능 (Todo 검색) 구현

```bash
# Phase 1: 기획 및 설계 (Brainstorming Mode)
/sc:load .
/sc:brainstorm "Todo 검색 기능 구현"
@agent-frontend-architect 검색 UI/UX 패턴 추천
/sc:design "Todo 검색 기능 상세 설계" --magic

# Phase 2: 워크플로우 수립 (Task Management Mode)
/sc:workflow "Todo 검색 구현 계획" --format checklist

# Phase 3: TDD 구현 (Deep Research Mode)
@agent-quality-engineer 검색 기능 TDD 전략
/sc:test --write-first --type unit --focus search
/sc:implement --tdd "검색 비즈니스 로직"

# Phase 4: UI 구현 (Orchestration Mode)
/sc:implement "검색 UI 컴포넌트" --magic
@agent-frontend-architect 검색 결과 하이라이팅 구현

# Phase 5: 통합 및 테스트
/sc:test --type integration --focus search
/sc:test --type e2e --playwright --scenario "검색 워크플로우"

# Phase 6: 최적화 및 정리
@agent-performance-engineer 검색 성능 최적화
/sc:improve --focus performance
/sc:save
```

### 시나리오 2: 성능 이슈 해결

```bash
# Phase 1: 문제 분석 (Introspection Mode)
/sc:load .
/sc:troubleshoot "리스트 렌더링 성능 이슈" --type performance
@agent-performance-engineer 성능 병목점 분석 --sequential

# Phase 2: 성능 측정
/sc:analyze --focus performance --ultrathink
@agent-performance-engineer 현재 성능 메트릭 측정

# Phase 3: 최적화 구현
@agent-performance-engineer React 가상화 적용 방안
/sc:implement "리스트 가상화" --focus performance
/sc:improve --focus performance

# Phase 4: 성능 검증
/sc:test --type performance --benchmark
@agent-performance-engineer 최적화 효과 측정

# Phase 5: 문서화 및 저장
/sc:document "성능 최적화 가이드"
/sc:save
```

### 시나리오 3: 백엔드 API 개발

```bash
# Phase 1: 아키텍처 설계
/sc:load .
@agent-backend-architect AWS 서버리스 아키텍처 설계
@agent-system-architect DynamoDB 스키마 최적화
/sc:design "Todo API 설계" --format openapi

# Phase 2: 보안 검토
@agent-security-engineer API 보안 가이드라인
/sc:analyze --focus security --think-hard

# Phase 3: TDD 구현
@agent-quality-engineer 백엔드 TDD 전략
/sc:test --write-first --type unit --backend
/sc:implement --tdd "Todo CRUD Lambda"

# Phase 4: 통합 테스트
/sc:test --type integration --api
@agent-quality-engineer API 엔드포인트 테스트

# Phase 5: 배포 준비
@agent-devops-architect AWS CDK 배포 스크립트
/sc:build "Lambda 배포 패키지"
/sc:save
```

## 📈 단계별 성과 측정 및 검증

### 품질 메트릭 체크리스트

#### 코드 품질
```bash
# 코드 커버리지 90% 이상
/sc:test --coverage --target 90

# TypeScript 엄격 모드 준수
@agent-quality-engineer TypeScript 타입 안전성 검증

# ESLint/Prettier 규칙 준수
/sc:analyze --focus code-quality
```

#### 성능 기준
```bash
# 페이지 로드 시간 < 2초
/sc:test --type performance --target "load-time < 2s"

# 번들 사이즈 최적화
@agent-performance-engineer 번들 분석 및 최적화
```

#### 접근성 기준
```bash
# WCAG 2.1 AA 준수
/sc:test --type accessibility --playwright

# 키보드 네비게이션 지원
@agent-quality-engineer 키보드 접근성 테스트
```

## 🔄 지속적 개선 사이클

### 주간 리뷰 (매주 금요일)
```bash
# 진행 상황 분석
/sc:load .
/sc:analyze --focus progress --weekly-review

# 코드 품질 체크
@agent-refactoring-expert 주간 코드 품질 리뷰

# 기술적 부채 평가
@agent-system-architect 기술적 부채 분석
```

### 스프린트 회고 (2주마다)
```bash
# 스프린트 회고 분석
/sc:brainstorm "지난 스프린트 회고 및 개선점"
@agent-quality-engineer 품질 메트릭 트렌드 분석

# 다음 스프린트 계획
/sc:workflow "다음 스프린트 계획" --format roadmap
```

## 🚀 고급 활용 패턴

### 복합 워크플로우 (여러 명령어 체인)

```bash
# 완전한 기능 개발 파이프라인
/sc:load . && \
/sc:brainstorm "[기능명]" && \
/sc:design "[기능명] 설계" && \
/sc:workflow "[기능명] 구현 계획" && \
/sc:implement --tdd "[기능명]" && \
/sc:test --comprehensive && \
/sc:improve --focus quality && \
/sc:save
```

### 에이전트 협업 패턴

```bash
# 아키텍처 검토 위원회
@agent-system-architect 전체 아키텍처 검토
@agent-frontend-architect 프론트엔드 아키텍처 피드백
@agent-backend-architect 백엔드 아키텍처 피드백
@agent-security-engineer 보안 관점 검토

# 품질 게이트
@agent-quality-engineer 테스트 전략 수립
@agent-performance-engineer 성능 기준 검증
@agent-refactoring-expert 코드 품질 검증
```

## 📚 학습 및 참고 자료

### SuperClaude 명령어 치트시트

| 카테고리 | 명령어 | 용도 | 주요 옵션 |
|---------|--------|------|----------|
| **분석** | `/sc:analyze` | 코드 분석 | `--focus`, `--think`, `--ultrathink` |
| **설계** | `/sc:design` | 시스템 설계 | `--format`, `--focus` |
| **구현** | `/sc:implement` | 기능 구현 | `--tdd`, `--type`, `--magic` |
| **테스트** | `/sc:test` | 테스트 실행 | `--type`, `--coverage`, `--playwright` |
| **개선** | `/sc:improve` | 코드 개선 | `--focus`, `--morphllm` |
| **문제해결** | `/sc:troubleshoot` | 문제 진단 | `--type`, `--sequential` |
| **빌드** | `/sc:build` | 빌드/배포 | `--type`, `--automation` |
| **세션** | `/sc:load`, `/sc:save` | 컨텍스트 관리 | - |

### 모드별 활용 상황

| 모드 | 상황 | 특징 |
|------|------|------|
| 🧠 **Brainstorming** | 아이디어 구체화, 요구사항 분석 | 대화형 발견, 질문 중심 |
| 🔍 **Introspection** | 복잡한 문제 해결, 학습 | 추론 과정 노출, 메타인지 |
| 🔬 **Deep Research** | 심층 분석, 기술 조사 | 체계적 조사, 증거 기반 |
| 📋 **Task Management** | 복잡한 프로젝트, 다단계 작업 | 계층적 조직, 메모리 유지 |
| 🎯 **Orchestration** | 다중 도구 사용, 성능 중시 | 도구 최적화, 병렬 처리 |
| ⚡ **Token Efficiency** | 대규모 작업, 효율성 중시 | 압축 통신, 심볼 사용 |

## 🎯 결론 및 실행 계획

이 가이드라인을 통해 TODO 웹앱 프로젝트에서 SuperClaude Framework를 최대한 효과적으로 활용할 수 있습니다.

### 즉시 실행 가능한 액션 아이템:

1. **세션 시작**: `/sc:load .`로 현재 프로젝트 컨텍스트 로드
2. **현재 단계 분석**: `/sc:analyze --focus progress`로 현재 상태 파악
3. **다음 단계 계획**: `/sc:workflow "4단계 라우팅 구현"`으로 구체적 계획 수립
4. **전문가 자문**: `@agent-frontend-architect`와 함께 라우팅 최적화 방안 검토

### 성공적인 SuperClaude 활용을 위한 핵심 원칙:

✅ **항상 컨텍스트 로드/저장으로 시작/종료**
✅ **상황에 맞는 적절한 에이전트와 MCP 서버 조합 사용**
✅ **TDD 원칙을 SuperClaude와 함께 체계적으로 적용**
✅ **단계별 검증과 품질 게이트 통과**
✅ **정기적인 코드 품질 검토 및 리팩토링**

이 가이드라인을 따라 진행하면, SuperClaude의 강력한 기능들을 활용하여 고품질의 TODO 웹 애플리케이션을 효율적으로 완성할 수 있을 것입니다.