# SuperClaude Framework 사용 가이드라인

## 📋 개요

SuperClaude Framework는 Claude Code를 위한 컨텍스트 프레임워크로, AI 기반 소프트웨어 개발 워크플로우를 향상시키는 도구입니다. 이 프레임워크는 21개의 명령어, 15개의 전문 에이전트, 7개의 행동 모드, 7개의 MCP 서버를 제공하여 체계적이고 효율적인 개발 경험을 제공합니다.

## 🚀 설치 및 시작하기

### 설치 방법

**권장 방법 (pipx):**
```bash
pipx install SuperClaude && SuperClaude install
```

**전통적인 방법 (pip):**
```bash
pip install SuperClaude && SuperClaude install
```

**Node.js 개발자용 (npm):**
```bash
npm install -g @bifrost_inc/superclaude && superclaude install
```

### 설치 확인

```bash
# 버전 확인
python3 -m SuperClaude --version

# 컴포넌트 목록 확인
SuperClaude install --list-components

# Claude Code에서 테스트
/sc:brainstorm
```

### 시스템 요구사항
- Python 3.8+
- 최신 pip
- Claude Code
- 최소 50MB 디스크 공간
- 선택사항: Node.js, Git

## 🎯 핵심 개념

### 1. 명령어 시스템 (/sc:*)

SuperClaude는 21개의 슬래시 명령어를 제공하며, 각각은 특정 작업에 최적화되어 있습니다:

#### 🔍 분석 및 조사
- `/sc:brainstorm`: 대화형 요구사항 발견
- `/sc:analyze`: 코드 품질, 보안, 성능 분석
- `/sc:research`: 체계적인 웹 리서치

#### 🛠️ 개발 및 구현
- `/sc:implement`: 전체 스택 기능 개발
- `/sc:design`: 시스템 아키텍처 설계
- `/sc:workflow`: 구현 계획 생성
- `/sc:build`: 빌드 및 컴파일

#### 📊 비즈니스 및 전략
- `/sc:business-panel`: 9명의 비즈니스 전문가 패널 분석
- `/sc:spec-panel`: 소프트웨어 엔지니어링 전문가 명세 검토

#### 🔧 품질 및 최적화
- `/sc:test`: 포괄적인 품질 보증
- `/sc:improve`: 코드 향상 및 최적화
- `/sc:troubleshoot`: 체계적인 문제 진단

#### 📝 문서화 및 관리
- `/sc:document`: 문서 생성
- `/sc:save`: 세션 상태 저장
- `/sc:load`: 프로젝트 컨텍스트 로드

### 2. 전문 에이전트 (@agent-*)

15개의 전문 도메인 에이전트가 특정 영역에서 전문성을 제공합니다:

#### 아키텍처 & 시스템 설계
- `@agent-system-architect`: 대규모 분산 시스템 설계
- `@agent-backend-architect`: 서버측 시스템 및 API 설계
- `@agent-frontend-architect`: 웹 애플리케이션 아키텍처
- `@agent-devops-architect`: 인프라 자동화 및 배포

#### 품질 & 분석
- `@agent-security-engineer`: 애플리케이션 보안
- `@agent-performance-engineer`: 성능 최적화
- `@agent-quality-engineer`: 테스트 전략 및 품질 보증
- `@agent-root-cause-analyst`: 문제 조사 및 근본 원인 분석
- `@agent-refactoring-expert`: 코드 품질 개선

#### 특화 개발
- `@agent-python-expert`: Python 전문
- `@agent-technical-writer`: 기술 문서화
- `@agent-learning-guide`: 교육 및 학습 지원

### 3. 행동 모드

7가지 행동 모드가 다양한 작업 스타일을 지원합니다:

#### 🧠 Brainstorming Mode
- **목적**: 모호한 아이디어를 구조화된 요구사항으로 변환
- **트리거**: "maybe", "possibly" 같은 불확실한 언어
- **특징**: 소크라테스식 질문, 협력적 발견

#### 🔍 Introspection Mode
- **목적**: 추론 과정을 노출하여 학습 및 최적화
- **트리거**: 오류 복구, 자기 분석 요청
- **특징**: 투명한 사고 마커 사용 (🤔, 🎯, 💡)

#### 🔬 Deep Research Mode
- **목적**: 증거 기반 추론을 통한 체계적 조사
- **특징**: 6단계 워크플로우, 병렬 실행, 신뢰도 점수

#### 📋 Task Management Mode
- **목적**: 다단계 작업을 위한 계층적 작업 조직
- **트리거**: 3단계 이상의 작업, 여러 디렉토리
- **특징**: 계획 → 단계 → 작업 구조

#### 🎯 Orchestration Mode
- **목적**: 지능적 도구 라우팅 및 병렬 조정
- **특징**: 최적 도구 선택, 리소스 인식 실행

#### ⚡ Token Efficiency Mode
- **목적**: 정보를 보존하면서 커뮤니케이션 압축
- **특징**: 심볼 시스템 사용, 30-50% 커뮤니케이션 감소

#### 🎨 Standard Mode
- **목적**: 간단한 작업을 위한 균형 잡힌 전문 커뮤니케이션

### 4. MCP 서버

7개의 MCP 서버가 특수 기능을 제공합니다:

- **context7** 📚: 공식 라이브러리 문서 액세스
- **sequential-thinking** 🧠: 다단계 추론 및 체계적 분석
- **magic** ✨: 모던 UI 컴포넌트 생성
- **playwright** 🎭: 브라우저 자동화 및 E2E 테스트
- **morphllm-fast-apply** 🔄: 패턴 기반 코드 변환
- **serena** 🧭: 의미론적 코드 이해 및 프로젝트 메모리
- **tavily** 🔍: 웹 검색 및 실시간 정보 검색

### 5. 플래그 시스템

다양한 플래그로 세밀한 제어가 가능합니다:

#### 분석 깊이 플래그
- `--think`: 표준 분석 (~4K 토큰)
- `--think-hard`: 심층 분석 (~10K 토큰)
- `--ultrathink`: 최대 깊이 분석 (~32K 토큰)

#### MCP 서버 플래그
- `--c7/--context7`: 공식 문서, 프레임워크 패턴
- `--seq/--sequential`: 다단계 추론
- `--magic`: UI 컴포넌트 생성
- `--play/--playwright`: 브라우저 테스트

#### 실행 제어 플래그
- `--loop`: 반복적 개선
- `--safe-mode`: 최대 검증
- `--validate`: 실행 전 위험 평가
- `--delegate`: 하위 에이전트 병렬 처리

## 📖 실용적 사용 예시

### 새로운 프로젝트 시작

```bash
# 1. 아이디어 브레인스토밍
/sc:brainstorm "전자상거래 앱"

# 2. 컨텍스트 로드
/sc:load src/

# 3. 아키텍처 분석
/sc:analyze --focus architecture

# 4. 워크플로우 계획
/sc:workflow "결제 통합"

# 5. 구현
/sc:implement "Stripe 체크아웃"
```

### 코드 품질 개선

```bash
# 1. 포괄적 분석
/sc:analyze --think-hard

# 2. 보안 검토
@agent-security-engineer 보안 취약점 검사

# 3. 성능 최적화
@agent-performance-engineer 성능 병목 찾기

# 4. 리팩토링
@agent-refactoring-expert 코드 품질 개선

# 5. 테스트
/sc:test --coverage
```

### 비즈니스 전략 분석

```bash
# 1. 비즈니스 패널 분석
/sc:business-panel @business_plan.pdf

# 2. 토론 모드로 협업 분석
/sc:business-panel --mode discussion

# 3. 토론 모드로 도전적 분석
/sc:business-panel --mode debate

# 4. 소크라테스 모드로 학습 중심 탐색
/sc:business-panel --mode socratic
```

### 문제 해결

```bash
# 1. 체계적 문제 진단
/sc:troubleshoot --type runtime

# 2. 근본 원인 분석
@agent-root-cause-analyst 오류 패턴 분석

# 3. 솔루션 구현
/sc:implement "버그 수정"

# 4. 검증
/sc:test --type regression
```

## 🛠️ 고급 워크플로우

### 1. TDD (Test-Driven Development) 워크플로우

```bash
# 1. 테스트 작성
/sc:test --type unit --write-first

# 2. 구현
/sc:implement --tdd

# 3. 리팩토링
@agent-refactoring-expert 코드 개선

# 4. 통합 테스트
/sc:test --type integration
```

### 2. 성능 최적화 워크플로우

```bash
# 1. 성능 분석
@agent-performance-engineer 병목 지점 식별

# 2. 프로파일링
/sc:analyze --focus performance --think-hard

# 3. 최적화 구현
/sc:improve --focus performance

# 4. 벤치마킹
/sc:test --type performance
```

### 3. 보안 강화 워크플로우

```bash
# 1. 보안 감사
@agent-security-engineer 취약점 스캔

# 2. 위협 모델링
/sc:analyze --focus security --ultrathink

# 3. 보안 제어 구현
/sc:implement "보안 강화"

# 4. 침투 테스트
/sc:test --type security
```

## 🎓 학습 경로

### 1주차: 핵심 명령어 마스터
- `/sc:help`로 명령어 목록 확인
- `/sc:brainstorm`, `/sc:analyze`, `/sc:implement` 실습
- 기본 플래그 사용법 학습

### 2주차: 행동 모드 이해
- 각 모드의 트리거와 특징 학습
- 상황별 적절한 모드 선택 연습
- 토큰 효율성 모드 활용법

### 3주차: MCP 서버 통합
- MCP 서버별 특화 기능 학습
- API 키 설정 및 구성
- 서버 간 협업 패턴 이해

### 4주차: 고급 워크플로우 패턴
- 복합 워크플로우 설계
- 에이전트 체인 구성
- 프로젝트별 커스터마이제이션

## 🔧 설정 및 커스터마이제이션

### MCP 서버 설정

`~/.claude.json` 파일에서 MCP 서버를 구성할 수 있습니다:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@context7/mcp-server"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["sequential-thinking"]
    }
  }
}
```

### API 키 설정

필요한 API 키들:
- `TWENTYFIRST_API_KEY`: Magic UI 컴포넌트 생성용
- `MORPH_API_KEY`: 코드 변환용
- `TAVILY_API_KEY`: 웹 검색용

## ⚠️ 중요한 제한 사항 및 주의점

### 1. SuperClaude는 AI 어시스턴트가 아닙니다
- Claude Code를 위한 컨텍스트 프레임워크입니다
- Claude Code가 설치되어 있어야 작동합니다

### 2. 점진적 복잡성
- 간단한 명령어부터 시작하세요
- 복잡한 워크플로우는 경험을 쌓은 후 사용하세요

### 3. 리소스 관리
- 토큰 사용량을 모니터링하세요
- 필요에 따라 효율성 모드를 활성화하세요

### 4. API 키 관리
- API 키를 안전하게 보관하세요
- 불필요한 MCP 서버는 비활성화하세요

## 🚨 문제 해결

### 일반적인 문제들

#### 설치 문제
```bash
# Python 버전 확인
python3 --version

# 권한 문제 해결
pip install --user SuperClaude

# 의존성 문제 해결
pip install --upgrade pip setuptools wheel
```

#### MCP 서버 문제
```bash
# 서버 상태 확인
SuperClaude install --list-components

# 설정 파일 확인
cat ~/.claude.json

# 서버 재시작
SuperClaude install --force
```

#### 명령어 인식 문제
- Claude Code가 최신 버전인지 확인
- SuperClaude 설치가 완료되었는지 확인
- 명령어 문법이 정확한지 확인 (`/sc:` 접두사 사용)

## 📚 추가 리소스

### 공식 문서
- [GitHub Repository](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- [사용자 가이드](https://github.com/SuperClaude-Org/SuperClaude_Framework/tree/master/Docs/User-Guide)
- [예제 쿡북](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/Docs/Reference/examples-cookbook.md)

### 커뮤니티
- GitHub Issues를 통한 버그 리포트
- 디스커션을 통한 기능 요청
- 커뮤니티 베스트 프랙티스 공유

## 🎯 결론

SuperClaude Framework는 단순한 도구가 아닌 AI 기반 개발의 패러다임을 바꾸는 프레임워크입니다. "무작위 요청을 구조화된 워크플로우로 변환"하는 핵심 원칙을 따라, 체계적이고 효율적인 개발 경험을 제공합니다.

성공적인 활용을 위해서는:
1. 작은 것부터 시작하여 점진적으로 복잡한 기능을 학습
2. 각 상황에 맞는 적절한 도구와 모드 선택
3. 워크플로우를 개인과 팀의 필요에 맞게 커스터마이제이션
4. 지속적인 학습과 실험을 통한 숙련도 향상

이 가이드라인을 따라 SuperClaude Framework를 활용하시면, AI와 함께하는 소프트웨어 개발의 새로운 가능성을 발견하실 수 있을 것입니다.