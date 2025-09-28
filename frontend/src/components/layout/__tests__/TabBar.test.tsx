import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';
import { TabBar } from '../TabBar';

// useMediaQuery 훅을 모킹
const mockUseMediaQuery = vi.fn();
vi.mock('@mantine/hooks', () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('TabBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('모바일 화면에서 Tab Bar가 렌더링되어야 함', () => {
    // 모바일 화면으로 설정
    mockUseMediaQuery.mockReturnValue(true);

    renderWithMantine(<TabBar />);

    // Tab Bar 버튼들이 렌더링되는지 확인
    expect(screen.getByLabelText('홈')).toBeInTheDocument();
    expect(screen.getByLabelText('프로필')).toBeInTheDocument();
    expect(screen.getByLabelText('설정')).toBeInTheDocument();
  });

  it('데스크톱 화면에서 Tab Bar가 렌더링되지 않아야 함', () => {
    // 데스크톱 화면으로 설정
    mockUseMediaQuery.mockReturnValue(false);

    renderWithMantine(<TabBar />);

    // Tab Bar 버튼들이 렌더링되지 않았는지 확인
    expect(screen.queryByLabelText('홈')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('프로필')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('설정')).not.toBeInTheDocument();
  });

  it('Tab Bar 버튼 클릭 시 콘솔 로그가 출력되어야 함', () => {
    // 모바일 화면으로 설정
    mockUseMediaQuery.mockReturnValue(true);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithMantine(<TabBar />);

    // 홈 버튼 클릭
    const homeButton = screen.getByLabelText('홈');
    homeButton.click();

    expect(consoleSpy).toHaveBeenCalledWith('home 탭 클릭됨');

    consoleSpy.mockRestore();
  });

  it('Tab Bar가 렌더링되어야 함', () => {
    // 모바일 화면으로 설정
    mockUseMediaQuery.mockReturnValue(true);

    const { container } = renderWithMantine(<TabBar />);

    // Tab Bar가 렌더링되었는지 확인
    expect(container.firstChild).toBeInTheDocument();
  });
});
