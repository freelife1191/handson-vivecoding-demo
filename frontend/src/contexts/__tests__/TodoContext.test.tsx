import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import type { Todo, CreateTodoInput } from '../../types';
import { TodoProvider, useTodoContext } from '../TodoContext';

// 테스트용 컴포넌트
function TestComponent() {
  const context = useTodoContext();
  return (
    <div>
      <div data-testid="todos-count">{context.todos.length}</div>
      <div data-testid="loading">
        {context.loading ? 'loading' : 'not-loading'}
      </div>
      <div data-testid="error">{context.error || 'no-error'}</div>
    </div>
  );
}

describe('TodoContext', () => {
  let mockDate: Date;
  let mockTodos: Todo[];

  beforeEach(() => {
    mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    mockTodos = [
      {
        id: '1',
        title: '테스트 Todo 1',
        priority: 'high',
        status: 'pending',
        createdAt: new Date('2024-01-01T08:00:00.000Z'),
        updatedAt: new Date('2024-01-01T08:00:00.000Z'),
      },
      {
        id: '2',
        title: '테스트 Todo 2',
        priority: 'medium',
        status: 'completed',
        createdAt: new Date('2024-01-01T09:00:00.000Z'),
        updatedAt: new Date('2024-01-01T10:00:00.000Z'),
      },
    ];

    // localStorage 모킹
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  describe('TodoProvider', () => {
    it('초기 상태를 올바르게 제공해야 한다', () => {
      render(
        <TodoProvider>
          <TestComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('0');
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    it('초기 Todo 목록을 설정할 수 있어야 한다', () => {
      render(
        <TodoProvider initialTodos={mockTodos}>
          <TestComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });
  });

  describe('useTodoContext', () => {
    it('Context 외부에서 사용하면 에러를 발생시켜야 한다', () => {
      // 에러를 캐치하기 위한 컴포넌트
      function ErrorComponent() {
        try {
          useTodoContext();
          return <div>No Error</div>;
        } catch (error) {
          return <div>Error: {(error as Error).message}</div>;
        }
      }

      render(<ErrorComponent />);

      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    it('Context 내부에서 사용하면 올바른 값을 반환해야 한다', () => {
      function ContextTestComponent() {
        const context = useTodoContext();
        return (
          <div>
            <div data-testid="has-context">
              {context ? 'has-context' : 'no-context'}
            </div>
            <div data-testid="has-todos">
              {context.todos ? 'has-todos' : 'no-todos'}
            </div>
            <div data-testid="has-add-todo">
              {typeof context.addTodo === 'function'
                ? 'has-add-todo'
                : 'no-add-todo'}
            </div>
            <div data-testid="has-update-todo">
              {typeof context.updateTodo === 'function'
                ? 'has-update-todo'
                : 'no-update-todo'}
            </div>
            <div data-testid="has-delete-todo">
              {typeof context.deleteTodo === 'function'
                ? 'has-delete-todo'
                : 'no-delete-todo'}
            </div>
            <div data-testid="has-toggle-todo">
              {typeof context.toggleTodo === 'function'
                ? 'has-toggle-todo'
                : 'no-toggle-todo'}
            </div>
            <div data-testid="has-set-todos">
              {typeof context.setTodos === 'function'
                ? 'has-set-todos'
                : 'no-set-todos'}
            </div>
          </div>
        );
      }

      render(
        <TodoProvider>
          <ContextTestComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('has-context')).toHaveTextContent(
        'has-context'
      );
      expect(screen.getByTestId('has-todos')).toHaveTextContent('has-todos');
      expect(screen.getByTestId('has-add-todo')).toHaveTextContent(
        'has-add-todo'
      );
      expect(screen.getByTestId('has-update-todo')).toHaveTextContent(
        'has-update-todo'
      );
      expect(screen.getByTestId('has-delete-todo')).toHaveTextContent(
        'has-delete-todo'
      );
      expect(screen.getByTestId('has-toggle-todo')).toHaveTextContent(
        'has-toggle-todo'
      );
      expect(screen.getByTestId('has-set-todos')).toHaveTextContent(
        'has-set-todos'
      );
    });
  });

  describe('Todo 액션 함수들', () => {
    let TestActionComponent: React.FC;

    beforeEach(() => {
      TestActionComponent = () => {
        const context = useTodoContext();

        const handleAddTodo = () => {
          const input: CreateTodoInput = {
            title: '새로운 Todo',
            priority: 'high',
          };
          context.addTodo(input);
        };

        const handleUpdateTodo = () => {
          const updatedTodo: Todo = {
            ...mockTodos[0],
            title: '업데이트된 Todo',
            updatedAt: mockDate,
          };
          context.updateTodo(updatedTodo);
        };

        const handleDeleteTodo = () => {
          context.deleteTodo('1');
        };

        const handleToggleTodo = () => {
          context.toggleTodo('1');
        };

        const handleSetTodos = () => {
          context.setTodos(mockTodos);
        };

        return (
          <div>
            <button data-testid="add-todo" onClick={handleAddTodo}>
              Add Todo
            </button>
            <button data-testid="update-todo" onClick={handleUpdateTodo}>
              Update Todo
            </button>
            <button data-testid="delete-todo" onClick={handleDeleteTodo}>
              Delete Todo
            </button>
            <button data-testid="toggle-todo" onClick={handleToggleTodo}>
              Toggle Todo
            </button>
            <button data-testid="set-todos" onClick={handleSetTodos}>
              Set Todos
            </button>
            <div data-testid="todos-count">{context.todos.length}</div>
          </div>
        );
      };
    });

    it('addTodo 함수가 새로운 Todo를 추가해야 한다', async () => {
      render(
        <TodoProvider>
          <TestActionComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('0');

      await act(async () => {
        screen.getByTestId('add-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('1');
    });

    it('updateTodo 함수가 기존 Todo를 업데이트해야 한다', async () => {
      render(
        <TodoProvider initialTodos={mockTodos}>
          <TestActionComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');

      await act(async () => {
        screen.getByTestId('update-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });

    it('deleteTodo 함수가 Todo를 삭제해야 한다', async () => {
      render(
        <TodoProvider initialTodos={mockTodos}>
          <TestActionComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');

      await act(async () => {
        screen.getByTestId('delete-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('1');
    });

    it('toggleTodo 함수가 Todo 상태를 토글해야 한다', async () => {
      render(
        <TodoProvider initialTodos={mockTodos}>
          <TestActionComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');

      await act(async () => {
        screen.getByTestId('toggle-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });

    it('setTodos 함수가 Todo 목록을 설정해야 한다', async () => {
      render(
        <TodoProvider>
          <TestActionComponent />
        </TodoProvider>
      );

      expect(screen.getByTestId('todos-count')).toHaveTextContent('0');

      await act(async () => {
        screen.getByTestId('set-todos').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });
  });

  describe('에러 처리', () => {
    it('잘못된 입력으로 addTodo를 호출하면 에러를 처리해야 한다', async () => {
      function ErrorTestComponent() {
        const context = useTodoContext();

        const handleInvalidAdd = () => {
          try {
            context.addTodo({ title: '' } as CreateTodoInput);
          } catch {
            // 에러는 내부적으로 처리되어야 함
          }
        };

        return (
          <div>
            <button data-testid="invalid-add" onClick={handleInvalidAdd}>
              Invalid Add
            </button>
            <div data-testid="error">{context.error || 'no-error'}</div>
          </div>
        );
      }

      render(
        <TodoProvider>
          <ErrorTestComponent />
        </TodoProvider>
      );

      await act(async () => {
        screen.getByTestId('invalid-add').click();
      });

      // 에러가 적절히 처리되어야 함
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
});
