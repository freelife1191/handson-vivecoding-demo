import {
  Paper,
  Group,
  Text,
  Checkbox,
  Badge,
  ActionIcon,
  Menu,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import type { Todo } from '../../types';
import { PRIORITY_INFO } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 개별 Todo 항목 컴포넌트
 * - 체크박스로 완료 상태 토글
 * - 우선순위 배지 표시
 * - 편집/삭제 메뉴
 */
export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const { colorScheme } = useMantineColorScheme();
  const priorityInfo = PRIORITY_INFO[todo.priority];
  const isCompleted = todo.status === 'completed';

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <Group justify="space-between" align="center">
        <Group gap="md" style={{ flex: 1 }}>
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggle(todo.id)}
            size="md"
            aria-label={`${todo.title} 완료 상태 토글`}
          />

          <div style={{ flex: 1 }}>
            <Text
              size="md"
              fw={500}
              td={isCompleted ? 'line-through' : 'none'}
              c={isCompleted ? 'dimmed' : undefined}
            >
              {todo.title}
            </Text>
          </div>
        </Group>

        <Group gap="sm">
          <Badge color={priorityInfo.color} variant="filled" size="sm">
            {priorityInfo.label}
          </Badge>

          <Menu shadow="md" width={120}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                aria-label="더보기 메뉴"
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={() => onEdit(todo.id)}
              >
                편집
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => onDelete(todo.id)}
              >
                삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
}
