import { Group, Text, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

/**
 * 앱 헤더 컴포넌트
 * - 앱 제목 표시
 * - 다크모드/라이트모드 토글 버튼
 * - 완전한 반응형 지원
 */
export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group
      h="100%"
      w="100%"
      justify="space-between"
      wrap="nowrap"
      gap="md"
      px="md"
    >
      <Text
        size="xl"
        fw={700}
        c="white"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          minWidth: 0,
          userSelect: 'none',
        }}
      >
        TODO APP
      </Text>

      <ActionIcon
        variant="subtle"
        color="gray.2"
        onClick={() => toggleColorScheme()}
        aria-label="테마 전환"
        size="lg"
        style={{
          flexShrink: 0,
          transition: 'all 200ms ease',
        }}
      >
        {colorScheme === 'dark' ? (
          <IconSun size={18} />
        ) : (
          <IconMoon size={18} />
        )}
      </ActionIcon>
    </Group>
  );
}
