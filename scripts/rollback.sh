#!/bin/bash

# TODO Web Application 롤백 스크립트
# 사용법: ./scripts/rollback.sh [commit-hash]
# commit-hash가 없으면 이전 커밋으로 롤백

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
TARGET_COMMIT=${1:-HEAD~1}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

log_info "🔄 TODO Web Application 롤백 시작"
log_info "📅 롤백 시간: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "🎯 롤백 대상: $TARGET_COMMIT"
log_info "📂 프로젝트 루트: $PROJECT_ROOT"

# 현재 커밋 정보
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_MESSAGE=$(git log -1 --pretty=format:"%s")

log_info "📍 현재 커밋: $CURRENT_COMMIT"
log_info "📝 현재 커밋 메시지: $CURRENT_MESSAGE"

# 롤백 대상 커밋 정보 확인
if ! git rev-parse --verify "$TARGET_COMMIT" >/dev/null 2>&1; then
    log_error "❌ 잘못된 커밋 해시입니다: $TARGET_COMMIT"
    log_info "사용 가능한 최근 커밋들:"
    git log --oneline -10
    exit 1
fi

TARGET_COMMIT_HASH=$(git rev-parse "$TARGET_COMMIT")
TARGET_MESSAGE=$(git log -1 --pretty=format:"%s" "$TARGET_COMMIT")

log_info "🎯 롤백 대상 커밋: $TARGET_COMMIT_HASH"
log_info "📝 롤백 대상 메시지: $TARGET_MESSAGE"

# 롤백 확인
log_warning "⚠️  롤백을 진행하면 현재 변경사항이 되돌려집니다."
log_warning "   현재 커밋: $CURRENT_MESSAGE"
log_warning "   롤백 대상: $TARGET_MESSAGE"
echo
read -p "정말로 롤백을 진행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "롤백이 취소되었습니다."
    exit 0
fi

# 롤백 전 백업 (선택사항)
log_info "💾 롤백 전 백업 생성"
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
git branch "$BACKUP_BRANCH"
log_success "✅ 백업 브랜치 생성: $BACKUP_BRANCH"

# 롤백 실행
log_info "🔄 롤백 실행 중..."

# 1. Git 롤백
log_info "1️⃣ Git 롤백"
git reset --hard "$TARGET_COMMIT"
if [ $? -ne 0 ]; then
    log_error "❌ Git 롤백 실패"
    exit 1
fi

log_success "✅ Git 롤백 완료"

# 2. frontend 디렉토리로 이동
cd "$FRONTEND_DIR"

# 3. 의존성 재설치 (필요한 경우)
log_info "2️⃣ 의존성 확인"
if [ -f "package-lock.json" ]; then
    # package-lock.json이 변경되었을 수 있으므로 재설치
    log_info "📦 의존성 재설치"
    npm install
    if [ $? -ne 0 ]; then
        log_error "❌ 의존성 재설치 실패"
        exit 1
    fi
fi

# 4. 빌드 테스트
log_info "3️⃣ 롤백된 코드 빌드 테스트"
npm run build
if [ $? -ne 0 ]; then
    log_error "❌ 롤백된 코드 빌드 실패"
    log_warning "⚠️  롤백된 코드에 문제가 있을 수 있습니다."
    log_info "백업 브랜치로 복구하려면: git checkout $BACKUP_BRANCH"
    exit 1
fi

# 5. 테스트 실행
log_info "4️⃣ 롤백된 코드 테스트 실행"
npm run test -- --run
if [ $? -ne 0 ]; then
    log_warning "⚠️  롤백된 코드 테스트 실패"
    log_warning "   롤백된 코드에 테스트 실패가 있을 수 있습니다."
fi

# 6. 원격 저장소에 강제 푸시 (주의!)
log_warning "⚠️  원격 저장소에 강제 푸시를 진행합니다."
log_warning "   이 작업은 되돌릴 수 없습니다."
echo
read -p "원격 저장소에 강제 푸시를 진행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "원격 저장소 푸시가 취소되었습니다."
    log_info "로컬 롤백은 완료되었습니다."
    log_info "수동으로 푸시하려면: git push --force-with-lease origin $(git branch --show-current)"
    exit 0
fi

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
log_info "🌿 현재 브랜치: $CURRENT_BRANCH"

# 강제 푸시
log_info "5️⃣ 원격 저장소에 강제 푸시"
git push --force-with-lease origin "$CURRENT_BRANCH"
if [ $? -ne 0 ]; then
    log_error "❌ 원격 저장소 푸시 실패"
    log_info "백업 브랜치로 복구하려면: git checkout $BACKUP_BRANCH"
    exit 1
fi

log_success "✅ 원격 저장소 푸시 완료"

# 7. GitHub Actions를 통한 재배포 확인
log_info "6️⃣ GitHub Actions 재배포 확인"
log_info "   GitHub Actions가 자동으로 재배포를 진행합니다."
log_info "   배포 상태는 GitHub Actions 탭에서 확인할 수 있습니다."

# 롤백 완료
log_success "🎉 롤백이 성공적으로 완료되었습니다!"
log_info "📊 롤백 요약:"
log_info "   - 롤백 대상: $TARGET_COMMIT_HASH"
log_info "   - 롤백 메시지: $TARGET_MESSAGE"
log_info "   - 백업 브랜치: $BACKUP_BRANCH"
log_info "   - 현재 브랜치: $CURRENT_BRANCH"
log_info "📅 롤백 완료 시간: $(date '+%Y-%m-%d %H:%M:%S')"

# 롤백 알림 (선택사항)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    log_info "📢 Slack 알림 전송"
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🔄 TODO Web Application 롤백 완료\\n롤백 대상: $TARGET_MESSAGE\\n백업 브랜치: $BACKUP_BRANCH\\n시간: $(date '+%Y-%m-%d %H:%M:%S')\"}" \
        "$SLACK_WEBHOOK_URL"
fi

log_success "✨ 롤백 프로세스가 완료되었습니다!"
log_info "💡 참고사항:"
log_info "   - 백업 브랜치 '$BACKUP_BRANCH'는 보존되어 있습니다."
log_info "   - 필요시 'git checkout $BACKUP_BRANCH'로 이전 상태로 복구할 수 있습니다."
log_info "   - GitHub Actions에서 재배포 상태를 확인하세요."
