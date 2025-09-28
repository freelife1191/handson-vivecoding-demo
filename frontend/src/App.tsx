import { Layout } from './components/layout';
import { ErrorBoundary } from './components/common';
import { TodoPage } from './pages';

/**
 * 메인 App 컴포넌트
 * - ErrorBoundary로 에러 처리
 * - Layout으로 전체 레이아웃 구성
 * - TodoPage를 메인 콘텐츠로 표시
 */
function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <TodoPage />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
// Git Hook 테스트용 주석 - E2E 테스트 및 GitHub Actions 배포 확인
