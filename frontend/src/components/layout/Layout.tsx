import { Box, useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Header } from './Header';
import { TabBar } from './TabBar';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트
 * - AppShell 대신 직접적인 레이아웃 구성
 * - 완전한 반응형 지원
 * - 다크모드 지원
 * - 데스크톱에서 브라우저 전체 너비 활용
 */
export function Layout({ children }: LayoutProps) {
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: 767px)`);

  return (
    <Box
      style={{
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorScheme === 'dark' ? '#1a1b23' : '#f8f9fa',
      }}
    >
      {/* 헤더 */}
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#4a90e2',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        <Header />
      </Box>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 'none',
          padding: '16px',
          paddingBottom: isMobile ? '80px' : '16px', // Tab Bar 공간 확보 (모바일에서만 적용됨)
          backgroundColor: colorScheme === 'dark' ? '#1a1b23' : '#f8f9fa',
        }}
      >
        {children}
      </Box>

      {/* Tab Bar - 모바일에서만 표시 */}
      <TabBar />
    </Box>
  );
}
