import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TodoProvider } from '../TodoContext';
import { TodoPage } from '../../pages';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <TodoProvider>{component}</TodoProvider>
    </MantineProvider>
  );
};

describe('Context 통합 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('TodoProvider가 모든 하위 컴포넌트에 올바른 상태를 제공해야 함', async () => {
    renderWithProviders(<TodoPage />);

    // 초기 상태 확인
    expect(screen.getByText('전체: 0')).toBeInTheDocument();
    expect(screen.getByText('미완료: 0')).toBeInTheDocument();
    expect(screen.getByText('완료: 0')).toBeInTheDocument();

    // Todo 추가
    const input = screen.getByPlaceholderText('새 할일 추가');
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.change(input, { target: { value: 'Context 테스트 할일' } });
    fireEvent.click(addButton);

    // 상태 업데이트 확인
    await waitFor(() => {
      expect(screen.getByText('Context 테스트 할일')).toBeInTheDocument();
      expect(screen.getByText('전체: 1')).toBeInTheDocument();
      expect(screen.getByText('미완료: 1')).toBeInTheDocument();
    });

    // 완료 토글
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // 완료 상태 확인
    await waitFor(() => {
      expect(screen.getByText('완료: 1')).toBeInTheDocument();
      expect(screen.getByText('미완료: 0')).toBeInTheDocument();
    });
  });

  it('Context 상태가 localStorage와 동기화되어야 함', async () => {
    renderWithProviders(<TodoPage />);

    // Todo 추가
    const input = screen.getByPlaceholderText('새 할일 추가');
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.change(input, { target: { value: '저장 테스트 할일' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('저장 테스트 할일')).toBeInTheDocument();
    });

    // localStorage에 저장되었는지 확인
    const savedTodos = localStorage.getItem('todos');
    expect(savedTodos).toBeTruthy();

    const todos = JSON.parse(savedTodos || '[]');
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('저장 테스트 할일');
  });
});
