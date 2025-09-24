import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoState } from '../useTodoState';
import { useTodoContext } from '../../contexts/TodoContext';
import type { Todo } from '../../types';

// TodoContext 모킹
vi.mock('../../contexts/TodoContext', () => ({
  useTodoContext: vi.fn(),
}));

const mockTodos: Todo[] = [
  {
    id: '1',
    title: '테스트 Todo 1',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-01T08:00:00.000Z'),
    updatedAt: new Date('2024-01-01T08:00:00.000Z'),
  },
  {
    id: '2',
    title: '테스트 Todo 2',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date('2024-01-01T09:00:00.000Z'),
    updatedAt: new Date('2024-01-01T09:00:00.000Z'),
  },
];

describe('useTodoState', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 기본 모킹 설정
    vi.mocked(useTodoContext).mockReturnValue({
      todos: mockTodos,
      loading: false,
      error: null,
      addTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodo: vi.fn(),
      setTodos: vi.fn(),
      clearError: vi.fn(),
    });
  });

  describe('기본 기능', () => {
    it('Todo 목록을 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      expect(result.current.todos).toEqual(mockTodos);
    });

    it('로딩 상태를 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      expect(result.current.loading).toBe(false);
    });

    it('에러 상태를 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      expect(result.current.error).toBe(null);
    });
  });

  describe('필터링 기능', () => {
    it('상태별로 Todo를 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ status: 'pending' });
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].status).toBe('pending');
    });

    it('우선순위별로 Todo를 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ priority: 'high' });
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].priority).toBe('high');
    });

    it('복합 필터로 Todo를 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].status).toBe('pending');
      expect(result.current.filteredTodos[0].priority).toBe('high');
    });

    it('검색어로 Todo를 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ search: '테스트' });
      });

      expect(result.current.filteredTodos).toHaveLength(2);
    });

    it('검색어가 없으면 모든 Todo를 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ search: '' });
      });

      expect(result.current.filteredTodos).toHaveLength(2);
    });
  });

  describe('정렬 기능', () => {
    it('생성일 기준으로 정렬할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setSort({ field: 'createdAt', direction: 'desc' });
      });

      expect(result.current.sortedTodos[0].id).toBe('2');
      expect(result.current.sortedTodos[1].id).toBe('1');
    });

    it('제목 기준으로 정렬할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setSort({ field: 'title', direction: 'asc' });
      });

      expect(result.current.sortedTodos[0].title).toBe('테스트 Todo 1');
      expect(result.current.sortedTodos[1].title).toBe('테스트 Todo 2');
    });

    it('우선순위 기준으로 정렬할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setSort({ field: 'priority', direction: 'asc' });
      });

      expect(result.current.sortedTodos[0].priority).toBe('medium');
      expect(result.current.sortedTodos[1].priority).toBe('high');
    });
  });

  describe('통계 기능', () => {
    it('Todo 통계를 계산해야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      expect(result.current.stats).toEqual({
        total: 2,
        pending: 1,
        completed: 1,
        priorityCount: {
          high: 1,
          medium: 1,
          low: 0,
        },
      });
    });

    it('빈 목록에 대한 통계를 계산해야 한다', () => {
      const emptyContext = {
        todos: [],
        loading: false,
        error: null,
        addTodo: vi.fn(),
        updateTodo: vi.fn(),
        deleteTodo: vi.fn(),
        toggleTodo: vi.fn(),
        setTodos: vi.fn(),
        clearError: vi.fn(),
      };

      vi.mocked(useTodoContext).mockReturnValue(emptyContext);

      const { result } = renderHook(() => useTodoState());

      expect(result.current.stats).toEqual({
        total: 0,
        pending: 0,
        completed: 0,
        priorityCount: {
          high: 0,
          medium: 0,
          low: 0,
        },
      });
    });
  });

  describe('필터 및 정렬 조합', () => {
    it('필터링과 정렬을 동시에 적용할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoState());

      act(() => {
        result.current.setFilter({ status: 'pending' });
        result.current.setSort({ field: 'title', direction: 'asc' });
      });

      expect(result.current.filteredAndSortedTodos).toHaveLength(1);
      expect(result.current.filteredAndSortedTodos[0].status).toBe('pending');
    });
  });

  describe('에러 처리', () => {
    it('에러 상태를 올바르게 처리해야 한다', () => {
      const errorContext = {
        todos: mockTodos,
        loading: false,
        error: '테스트 에러',
        addTodo: vi.fn(),
        updateTodo: vi.fn(),
        deleteTodo: vi.fn(),
        toggleTodo: vi.fn(),
        setTodos: vi.fn(),
        clearError: vi.fn(),
      };

      vi.mocked(useTodoContext).mockReturnValue(errorContext);

      const { result } = renderHook(() => useTodoState());

      expect(result.current.error).toBe('테스트 에러');
    });
  });

  describe('로딩 상태', () => {
    it('로딩 상태를 올바르게 처리해야 한다', () => {
      const loadingContext = {
        todos: mockTodos,
        loading: true,
        error: null,
        addTodo: vi.fn(),
        updateTodo: vi.fn(),
        deleteTodo: vi.fn(),
        toggleTodo: vi.fn(),
        setTodos: vi.fn(),
        clearError: vi.fn(),
      };

      vi.mocked(useTodoContext).mockReturnValue(loadingContext);

      const { result } = renderHook(() => useTodoState());

      expect(result.current.loading).toBe(true);
    });
  });
});
