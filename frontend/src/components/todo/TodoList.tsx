import {
  Stack,
  Text,
  Center,
  Loader,
  useMantineColorScheme,
} from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import type { Todo } from '../../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading?: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Todo 목록 컴포넌트
 * - Todo 항목들을 리스트로 표시
 * - 빈 상태 및 로딩 상태 처리
 * - 반응형 레이아웃
 */
export function TodoList({
  todos,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  const { colorScheme } = useMantineColorScheme();

  if (isLoading) {
    return (
      <Center h={200}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">할일을 불러오는 중...</Text>
        </Stack>
      </Center>
    );
  }

  if (todos.length === 0) {
    return (
      <Center h={200}>
        <Stack align="center" gap="md">
          <IconClipboardList
            size={48}
            color={colorScheme === 'dark' ? '#5c5f66' : '#868e96'}
          />
          <Text c="dimmed" size="lg">
            등록된 할일이 없습니다
          </Text>
          <Text c="dimmed" size="sm">
            새로운 할일을 추가해보세요
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="sm">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
