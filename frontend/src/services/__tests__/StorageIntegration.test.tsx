import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TodoProvider } from '../../contexts';
import { TodoPage } from '../../pages';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <TodoProvider>{component}</TodoProvider>
    </MantineProvider>
  );
};

describe('스토리지 통합 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('LocalStorageService가 Todo 데이터를 올바르게 저장하고 불러와야 함', async () => {
    renderWithProviders(<TodoPage />);

    // Todo 추가
    const input = screen.getByPlaceholderText('새 할일 추가');
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.change(input, { target: { value: '스토리지 테스트 할일' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('스토리지 테스트 할일')).toBeInTheDocument();
    });

    // localStorage에 저장되었는지 확인
    const savedTodos = localStorage.getItem('todos');
    expect(savedTodos).toBeTruthy();

    const todos = JSON.parse(savedTodos || '[]');
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('스토리지 테스트 할일');
    expect(todos[0].status).toBe('pending');
    expect(todos[0].priority).toBe('medium');
  });

  it('페이지 새로고침 후에도 데이터가 유지되어야 함', async () => {
    // 첫 번째 렌더링에서 Todo 추가
    const { unmount } = renderWithProviders(<TodoPage />);

    const input = screen.getByPlaceholderText('새 할일 추가');
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.change(input, { target: { value: '지속성 테스트 할일' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('지속성 테스트 할일')).toBeInTheDocument();
    });

    // 컴포넌트 언마운트 (페이지 새로고침 시뮬레이션)
    unmount();

    // 두 번째 렌더링에서 데이터 복원 확인
    renderWithProviders(<TodoPage />);

    await waitFor(() => {
      expect(screen.getByText('지속성 테스트 할일')).toBeInTheDocument();
      expect(screen.getByText('전체: 1')).toBeInTheDocument();
    });
  });

  it('여러 Todo의 상태 변경이 올바르게 저장되어야 함', async () => {
    renderWithProviders(<TodoPage />);

    // 여러 Todo 추가
    const input = screen.getByPlaceholderText('새 할일 추가');
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.change(input, { target: { value: '할일 1' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: '할일 2' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('할일 1')).toBeInTheDocument();
      expect(screen.getByText('할일 2')).toBeInTheDocument();
    });

    // 첫 번째 할일 완료 처리
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getByText('완료: 1')).toBeInTheDocument();
      expect(screen.getByText('미완료: 1')).toBeInTheDocument();
    });

    // localStorage에서 상태 확인
    const savedTodos = localStorage.getItem('todos');
    const todos = JSON.parse(savedTodos || '[]');

    expect(todos).toHaveLength(2);
    const completedTodo = todos.find(
      (todo: { status: string }) => todo.status === 'completed'
    );
    const pendingTodo = todos.find(
      (todo: { status: string }) => todo.status === 'pending'
    );

    expect(completedTodo).toBeTruthy();
    expect(pendingTodo).toBeTruthy();
  });
});
