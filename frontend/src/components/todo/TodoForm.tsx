import { 
  Paper, 
  TextInput, 
  Select, 
  Button, 
  Group, 
  Stack,
  useMantineColorScheme 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import type { CreateTodoInput } from '../../types';

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void;
  initialValues?: Partial<CreateTodoInput>;
  isLoading?: boolean;
}

/**
 * Todo 추가/편집 폼 컴포넌트
 * - 제목 입력 필드
 * - 우선순위 선택
 * - 추가/수정 버튼
 */
export function TodoForm({ onSubmit, initialValues, isLoading = false }: TodoFormProps) {
  const { colorScheme } = useMantineColorScheme();
  
  const form = useForm<CreateTodoInput>({
    initialValues: {
      title: initialValues?.title || '',
      priority: initialValues?.priority || 'medium',
    },
    validate: {
      title: (value) => {
        if (!value || value.trim().length === 0) {
          return '제목을 입력해주세요';
        }
        if (value.trim().length > 100) {
          return '제목은 100자 이하로 입력해주세요';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: CreateTodoInput) => {
    onSubmit({
      ...values,
      title: values.title.trim(),
    });
    form.reset();
  };

  const priorityOptions = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '중간' },
    { value: 'high', label: '높음' },
  ];

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            placeholder="새 할일 추가"
            leftSection={<IconPlus size={16} />}
            size="md"
            {...form.getInputProps('title')}
            disabled={isLoading}
          />
          
          <Group justify="flex-start" align="flex-end" gap="md">
            <Select
              label="우선순위"
              placeholder="우선순위 선택"
              data={priorityOptions}
              style={{ minWidth: 140 }}
              {...form.getInputProps('priority')}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              size="md"
              loading={isLoading}
              disabled={!form.isValid()}
              style={{ flexShrink: 0 }}
            >
              추가
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
