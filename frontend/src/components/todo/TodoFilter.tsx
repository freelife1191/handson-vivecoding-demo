import { 
  Paper, 
  Group, 
  Select, 
  TextInput,
  Stack,
  useMantineColorScheme 
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TodoFilter as TodoFilterType } from '../../types';

interface TodoFilterProps {
  filter: TodoFilterType;
  onFilterChange: (filter: TodoFilterType) => void;
}

/**
 * Todo 필터링 컴포넌트
 * - 상태별 필터 (모두 보기, 미완료, 완료)
 * - 우선순위별 필터 (모두 보기, 낮음, 중간, 높음)
 * - 검색 기능
 */
export function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  const { colorScheme } = useMantineColorScheme();

  const statusOptions = [
    { value: 'all', label: '모두 보기' },
    { value: 'pending', label: '미완료' },
    { value: 'completed', label: '완료' },
  ];

  const priorityOptions = [
    { value: 'all', label: '모든 우선순위' },
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '중간' },
    { value: 'high', label: '높음' },
  ];

  const handleStatusChange = (value: string | null) => {
    onFilterChange({
      ...filter,
      status: value as TodoFilterType['status'],
    });
  };

  const handlePriorityChange = (value: string | null) => {
    onFilterChange({
      ...filter,
      priority: value as TodoFilterType['priority'],
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      search: event.currentTarget.value,
    });
  };

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
        {/* 검색 필드 - 모바일에서 전체 너비 */}
        <TextInput
          placeholder="할일 검색..."
          leftSection={<IconSearch size={16} />}
          value={filter.search || ''}
          onChange={handleSearchChange}
          size="sm"
        />
        
        {/* 필터 옵션들 - 왼쪽 정렬 */}
        <Group gap="md" align="flex-end" justify="flex-start">
          <Select
            label="상태"
            placeholder="상태 선택"
            data={statusOptions}
            value={filter.status || 'all'}
            onChange={handleStatusChange}
            size="sm"
            style={{ minWidth: 120 }}
          />
          
          <Select
            label="우선순위"
            placeholder="우선순위 선택"
            data={priorityOptions}
            value={filter.priority || 'all'}
            onChange={handlePriorityChange}
            size="sm"
            style={{ minWidth: 140 }}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
