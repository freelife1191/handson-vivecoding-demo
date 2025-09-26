import { AppShell, Group, ActionIcon, Container } from '@mantine/core';
import { IconUser, IconSettings } from '@tabler/icons-react';

/**
 * 모바일용 하단 네비게이션 푸터 컴포넌트
 * - 프로필, 설정 버튼 (홈 버튼 제거)
 * - 모바일에서만 표시
 */
export function Footer() {
  return (
    <AppShell.Footer>
      <Container size="xl" h="100%">
        <Group h="100%" px="md" justify="center" gap="xl">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            aria-label="프로필"
          >
            <IconUser size={20} />
          </ActionIcon>
          
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            aria-label="설정"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>
      </Container>
    </AppShell.Footer>
  );
}
