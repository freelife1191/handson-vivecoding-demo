import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';
import { Layout } from '../Layout';

// useMediaQuery 훅을 모킹
const mockUseMediaQuery = vi.fn();
vi.mock('@mantine/hooks', () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('children이 렌더링되어야 함', () => {
    mockUseMediaQuery.mockReturnValue(false);

    renderWithMantine(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('Header가 렌더링되어야 함', () => {
    mockUseMediaQuery.mockReturnValue(false);

    renderWithMantine(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Header 컴포넌트가 렌더링되는지 확인 (TODO APP 텍스트로 확인)
    expect(screen.getByText('TODO APP')).toBeInTheDocument();
  });

  it('모바일에서 Tab Bar가 렌더링되어야 함', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderWithMantine(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Tab Bar 버튼들이 렌더링되는지 확인
    expect(screen.getByLabelText('홈')).toBeInTheDocument();
    expect(screen.getByLabelText('프로필')).toBeInTheDocument();
    expect(screen.getByLabelText('설정')).toBeInTheDocument();
  });

  it('데스크톱에서 Tab Bar가 렌더링되지 않아야 함', () => {
    mockUseMediaQuery.mockReturnValue(false);

    renderWithMantine(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Tab Bar 버튼들이 렌더링되지 않았는지 확인
    expect(screen.queryByLabelText('홈')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('프로필')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('설정')).not.toBeInTheDocument();
  });

  it('모바일에서 메인 콘텐츠에 적절한 paddingBottom이 적용되어야 함', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { container } = renderWithMantine(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveStyle({
      paddingBottom: '80px',
    });
  });

  it('데스크톱에서 메인 콘텐츠에 기본 paddingBottom이 적용되어야 함', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { container } = renderWithMantine(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveStyle({
      paddingBottom: '16px',
    });
  });
});
