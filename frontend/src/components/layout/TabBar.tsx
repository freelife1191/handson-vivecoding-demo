import {
  Box,
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

/**
 * 반응형 Tab Bar 컴포넌트
 * - 모바일에서만 표시 (768px 미만)
 * - 하단 고정 위치 (스크롤 시에도 계속 보임)
 * - 홈, 프로필, 설정 버튼 포함
 * - Mantine V8 기반 구현
 */
export function TabBar() {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // 모바일이 아닌 경우 Tab Bar를 렌더링하지 않음
  if (!isMobile) {
    return null;
  }

  const handleTabClick = (tabName: string) => {
    console.log(`${tabName} 탭 클릭됨`);
    // TODO: 실제 라우팅 로직 구현 시 사용
  };

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#f5f5f5',
        borderTop: `1px solid ${colorScheme === 'dark' ? '#373a40' : '#dee2e6'}`,
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '60px',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 홈 버튼 */}
      <ActionIcon
        variant="filled"
        size="lg"
        radius="xl"
        color="blue"
        onClick={() => handleTabClick('home')}
        style={{
          width: '48px',
          height: '48px',
        }}
        aria-label="홈"
      >
        🏠
      </ActionIcon>

      {/* 프로필 버튼 */}
      <ActionIcon
        variant="outline"
        size="lg"
        radius="xl"
        color="gray"
        onClick={() => handleTabClick('profile')}
        style={{
          width: '48px',
          height: '48px',
          borderColor: colorScheme === 'dark' ? '#373a40' : '#dee2e6',
        }}
        aria-label="프로필"
      >
        👤
      </ActionIcon>

      {/* 설정 버튼 */}
      <ActionIcon
        variant="outline"
        size="lg"
        radius="xl"
        color="gray"
        onClick={() => handleTabClick('settings')}
        style={{
          width: '48px',
          height: '48px',
          borderColor: colorScheme === 'dark' ? '#373a40' : '#dee2e6',
        }}
        aria-label="설정"
      >
        ⚙️
      </ActionIcon>
    </Box>
  );
}
