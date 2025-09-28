#!/bin/bash

# TODO Web Application 배포 자동화 스크립트
# 사용법: ./scripts/deploy.sh [environment]
# 환경: dev, staging, prod (기본값: prod)

set -e  # 에러 발생 시 스크립트 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 환경 설정
ENVIRONMENT=${1:-prod}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

log_info "🚀 TODO Web Application 배포 시작"
log_info "📅 배포 시간: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "🌍 배포 환경: $ENVIRONMENT"
log_info "📂 프로젝트 루트: $PROJECT_ROOT"

# 환경별 설정
case $ENVIRONMENT in
    "dev")
        BRANCH="develop"
        DEPLOY_URL="https://$GITHUB_REPOSITORY_OWNER.github.io/$GITHUB_REPOSITORY_NAME/dev"
        ;;
    "staging")
        BRANCH="staging"
        DEPLOY_URL="https://$GITHUB_REPOSITORY_OWNER.github.io/$GITHUB_REPOSITORY_NAME/staging"
        ;;
    "prod")
        BRANCH="main"
        DEPLOY_URL="https://$GITHUB_REPOSITORY_OWNER.github.io/$GITHUB_REPOSITORY_NAME"
        ;;
    *)
        log_error "❌ 잘못된 환경입니다. 사용법: $0 [dev|staging|prod]"
        exit 1
        ;;
esac

log_info "🌿 배포 브랜치: $BRANCH"
log_info "🔗 배포 URL: $DEPLOY_URL"

# 사전 체크리스트
log_info "🔍 배포 전 체크리스트 검증 중..."

# 1. Git 상태 확인
log_info "1️⃣ Git 상태 확인"
if ! git diff --quiet HEAD; then
    log_error "❌ 커밋되지 않은 변경사항이 있습니다."
    log_error "   모든 변경사항을 커밋한 후 배포를 진행하세요."
    exit 1
fi

# 2. 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    # master 브랜치를 main으로 인식 (GitHub 기본 브랜치)
    if [ "$CURRENT_BRANCH" = "master" ] && [ "$BRANCH" = "main" ]; then
        log_info "ℹ️  master 브랜치를 main으로 인식하여 배포를 진행합니다."
        BRANCH="master"
    else
        log_warning "⚠️  현재 브랜치($CURRENT_BRANCH)가 배포 브랜치($BRANCH)와 다릅니다."
        read -p "계속 진행하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "배포가 취소되었습니다."
            exit 0
        fi
    fi
fi

# 3. 원격 저장소와 동기화 확인
log_info "2️⃣ 원격 저장소와 동기화 확인"
git fetch origin
BEHIND=$(git rev-list --count HEAD..origin/$BRANCH)
if [ "$BEHIND" -gt 0 ]; then
    log_error "❌ 로컬 브랜치가 원격 브랜치보다 $BEHIND 커밋 뒤처져 있습니다."
    log_error "   git pull을 실행한 후 배포를 진행하세요."
    exit 1
fi

# 4. frontend 디렉토리 존재 확인
log_info "3️⃣ frontend 디렉토리 확인"
if [ ! -d "$FRONTEND_DIR" ]; then
    log_error "❌ frontend 디렉토리를 찾을 수 없습니다: $FRONTEND_DIR"
    exit 1
fi

# 5. package.json 존재 확인
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    log_error "❌ frontend/package.json을 찾을 수 없습니다."
    exit 1
fi

log_success "✅ 배포 전 체크리스트 통과"

# frontend 디렉토리로 이동
cd "$FRONTEND_DIR"

# 6. 의존성 설치
log_info "4️⃣ 의존성 설치"
if [ ! -d "node_modules" ]; then
    log_info "📦 node_modules가 없습니다. npm install을 실행합니다..."
    npm install
    if [ $? -ne 0 ]; then
        log_error "❌ npm install 실패"
        exit 1
    fi
fi

# 7. Lint 검사
log_info "5️⃣ Lint 검사"
npm run lint
if [ $? -ne 0 ]; then
    log_error "❌ Lint 검사 실패"
    exit 1
fi

# 8. 타입 체크
log_info "6️⃣ 타입 체크"
npm run type-check
if [ $? -ne 0 ]; then
    log_error "❌ 타입 체크 실패"
    exit 1
fi

# 9. 테스트 실행
log_info "7️⃣ 테스트 실행"
npm run test -- --run
if [ $? -ne 0 ]; then
    log_error "❌ 테스트 실패"
    exit 1
fi

# 10. 빌드
log_info "8️⃣ 프로덕션 빌드"
npm run build
if [ $? -ne 0 ]; then
    log_error "❌ 빌드 실패"
    exit 1
fi

# 11. 빌드 결과 확인
log_info "9️⃣ 빌드 결과 확인"
if [ ! -d "dist" ]; then
    log_error "❌ dist 디렉토리가 생성되지 않았습니다."
    exit 1
fi

# 12. 빌드 파일 크기 확인
BUILD_SIZE=$(du -sh dist | cut -f1)
log_info "📊 빌드 크기: $BUILD_SIZE"

# 13. GitHub Actions를 통한 배포 (CI 환경에서만)
if [ "$CI" = "true" ]; then
    log_info "🔧 CI 환경에서 GitHub Actions를 통한 배포"
    log_info "   GitHub Actions 워크플로우가 자동으로 배포를 처리합니다."
else
    log_info "💻 로컬 환경에서 배포"
    log_warning "⚠️  로컬에서 직접 배포하는 경우 GitHub Actions를 사용하는 것을 권장합니다."
    log_info "   git push origin $BRANCH를 실행하여 GitHub Actions를 통한 배포를 진행하세요."
fi

# 14. 배포 후 상태 확인 (CI 환경에서만)
if [ "$CI" = "true" ]; then
    log_info "🔍 배포 후 상태 확인"
    sleep 30  # 배포 완료 대기
    
    # 배포된 사이트 접근성 확인
    if curl -f -s -o /dev/null "$DEPLOY_URL"; then
        log_success "✅ 배포된 사이트에 접근 가능: $DEPLOY_URL"
    else
        log_error "❌ 배포된 사이트에 접근할 수 없습니다: $DEPLOY_URL"
        exit 1
    fi
    
    # HTML 내용 확인
    if curl -s "$DEPLOY_URL" | grep -q "TODO"; then
        log_success "✅ 배포된 사이트에 예상된 내용이 포함되어 있습니다."
    else
        log_warning "⚠️  배포된 사이트에 예상된 내용이 없을 수 있습니다."
    fi
fi

# 배포 완료
log_success "🎉 배포가 성공적으로 완료되었습니다!"
log_info "📊 배포 요약:"
log_info "   - 환경: $ENVIRONMENT"
log_info "   - 브랜치: $BRANCH"
log_info "   - 빌드 크기: $BUILD_SIZE"
if [ "$CI" = "true" ]; then
    log_info "   - 배포 URL: $DEPLOY_URL"
fi
log_info "📅 배포 완료 시간: $(date '+%Y-%m-%d %H:%M:%S')"

# 배포 알림 (선택사항)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    log_info "📢 Slack 알림 전송"
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 TODO Web Application 배포 완료\\n환경: $ENVIRONMENT\\n브랜치: $BRANCH\\n시간: $(date '+%Y-%m-%d %H:%M:%S')\"}" \
        "$SLACK_WEBHOOK_URL"
fi

log_success "✨ 배포 프로세스가 완료되었습니다!"
