import {
  Paper,
  Group,
  Text,
  Badge,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { IconClipboardList, IconCheck, IconClock } from '@tabler/icons-react';
import type { TodoStats as TodoStatsType } from '../../types';

interface TodoStatsProps {
  stats: TodoStatsType;
}

/**
 * Todo 통계 컴포넌트
 * - 전체, 완료, 미완료 개수 표시
 * - 우선순위별 개수 표시
 * - 진행률 표시
 */
export function TodoStats({ stats }: TodoStatsProps) {
  const { colorScheme } = useMantineColorScheme();
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#f9f9f9',
      }}
    >
      <Stack gap="md">
        {/* 기본 통계 - 모바일에서 세로 배치 */}
        <Group gap="lg" justify="center" wrap="wrap">
          <Group gap="xs">
            <IconClipboardList size={20} color="#4a90e2" />
            <Text size="sm" fw={500}>
              전체: {stats.total}
            </Text>
          </Group>

          <Group gap="xs">
            <IconCheck size={20} color="#40c057" />
            <Text size="sm" fw={500}>
              완료: {stats.completed}
            </Text>
          </Group>

          <Group gap="xs">
            <IconClock size={20} color="#fab005" />
            <Text size="sm" fw={500}>
              미완료: {stats.pending}
            </Text>
          </Group>
        </Group>

        {/* 우선순위 및 완료율 배지 - 반응형 배치 */}
        <Group gap="sm" justify="center" wrap="wrap">
          <Badge color="blue" variant="light" size="sm">
            높음: {stats.priorityCount.high}
          </Badge>
          <Badge color="yellow" variant="light" size="sm">
            중간: {stats.priorityCount.medium}
          </Badge>
          <Badge color="green" variant="light" size="sm">
            낮음: {stats.priorityCount.low}
          </Badge>

          <Badge
            color={completionRate === 100 ? 'green' : 'blue'}
            variant="filled"
            size="sm"
          >
            {completionRate}% 완료
          </Badge>
        </Group>
      </Stack>
    </Paper>
  );
}
