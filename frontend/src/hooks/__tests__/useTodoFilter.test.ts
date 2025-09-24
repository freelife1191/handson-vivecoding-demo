import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoFilter } from '../useTodoFilter';
import { useTodoContext } from '../../contexts/TodoContext';
import type { Todo } from '../../types';

// TodoContext 모킹
vi.mock('../../contexts/TodoContext', () => ({
  useTodoContext: vi.fn(),
}));

const mockTodos: Todo[] = [
  {
    id: '1',
    title: '높은 우선순위 작업',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-01T08:00:00.000Z'),
    updatedAt: new Date('2024-01-01T08:00:00.000Z'),
  },
  {
    id: '2',
    title: '중간 우선순위 작업',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date('2024-01-01T09:00:00.000Z'),
    updatedAt: new Date('2024-01-01T09:00:00.000Z'),
  },
  {
    id: '3',
    title: '낮은 우선순위 작업',
    status: 'pending',
    priority: 'low',
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
  },
  {
    id: '4',
    title: '완료된 작업',
    status: 'completed',
    priority: 'high',
    createdAt: new Date('2024-01-01T11:00:00.000Z'),
    updatedAt: new Date('2024-01-01T11:00:00.000Z'),
  },
];

describe('useTodoFilter', () => {
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
    it('기본 필터 상태를 제공해야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      expect(result.current.filter).toEqual({});
      expect(result.current.filteredTodos).toEqual(mockTodos);
    });

    it('필터 설정 함수를 제공해야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      expect(typeof result.current.setFilter).toBe('function');
      expect(typeof result.current.clearFilter).toBe('function');
      expect(typeof result.current.updateFilter).toBe('function');
    });
  });

  describe('상태별 필터링', () => {
    it('pending 상태로 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending' });
      });

      expect(result.current.filter.status).toBe('pending');
      expect(result.current.filteredTodos).toHaveLength(2);
      expect(
        result.current.filteredTodos.every((todo) => todo.status === 'pending')
      ).toBe(true);
    });

    it('completed 상태로 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'completed' });
      });

      expect(result.current.filter.status).toBe('completed');
      expect(result.current.filteredTodos).toHaveLength(2);
      expect(
        result.current.filteredTodos.every(
          (todo) => todo.status === 'completed'
        )
      ).toBe(true);
    });
  });

  describe('우선순위별 필터링', () => {
    it('high 우선순위로 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ priority: 'high' });
      });

      expect(result.current.filter.priority).toBe('high');
      expect(result.current.filteredTodos).toHaveLength(2);
      expect(
        result.current.filteredTodos.every((todo) => todo.priority === 'high')
      ).toBe(true);
    });

    it('medium 우선순위로 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ priority: 'medium' });
      });

      expect(result.current.filter.priority).toBe('medium');
      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].priority).toBe('medium');
    });

    it('low 우선순위로 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ priority: 'low' });
      });

      expect(result.current.filter.priority).toBe('low');
      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].priority).toBe('low');
    });
  });

  describe('검색어 필터링', () => {
    it('제목으로 검색할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ search: '높은' });
      });

      expect(result.current.filter.search).toBe('높은');
      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].title).toBe('높은 우선순위 작업');
    });

    it('부분 일치로 검색할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ search: '우선순위' });
      });

      expect(result.current.filteredTodos).toHaveLength(3);
      expect(
        result.current.filteredTodos.every((todo) =>
          todo.title.includes('우선순위')
        )
      ).toBe(true);
    });

    it('대소문자를 구분하지 않아야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ search: '작업' });
      });

      expect(result.current.filteredTodos).toHaveLength(4);
    });

    it('빈 검색어는 모든 Todo를 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ search: '' });
      });

      expect(result.current.filteredTodos).toHaveLength(4);
    });
  });

  describe('복합 필터링', () => {
    it('상태와 우선순위를 동시에 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      expect(result.current.filter.status).toBe('pending');
      expect(result.current.filter.priority).toBe('high');
      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].status).toBe('pending');
      expect(result.current.filteredTodos[0].priority).toBe('high');
    });

    it('상태와 검색어를 동시에 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'completed', search: '작업' });
      });

      expect(result.current.filteredTodos).toHaveLength(2);
      expect(
        result.current.filteredTodos.every(
          (todo) => todo.status === 'completed'
        )
      ).toBe(true);
    });

    it('우선순위와 검색어를 동시에 필터링할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ priority: 'high', search: '우선순위' });
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].priority).toBe('high');
      expect(result.current.filteredTodos[0].title).toContain('우선순위');
    });

    it('모든 필터를 동시에 적용할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({
          status: 'completed',
          priority: 'high',
          search: '작업',
        });
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].status).toBe('completed');
      expect(result.current.filteredTodos[0].priority).toBe('high');
    });
  });

  describe('필터 업데이트', () => {
    it('기존 필터를 업데이트할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending' });
      });

      act(() => {
        result.current.updateFilter({ priority: 'high' });
      });

      expect(result.current.filter).toEqual({
        status: 'pending',
        priority: 'high',
      });
      expect(result.current.filteredTodos).toHaveLength(1);
    });

    it('필터를 부분적으로 업데이트할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      act(() => {
        result.current.updateFilter({ search: '작업' });
      });

      expect(result.current.filter).toEqual({
        status: 'pending',
        priority: 'high',
        search: '작업',
      });
    });
  });

  describe('필터 초기화', () => {
    it('필터를 초기화할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      act(() => {
        result.current.clearFilter();
      });

      expect(result.current.filter).toEqual({});
      expect(result.current.filteredTodos).toEqual(mockTodos);
    });
  });

  describe('필터 상태 확인', () => {
    it('활성 필터 개수를 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      expect(result.current.activeFilterCount).toBe(2);
    });

    it('필터가 활성화되어 있는지 확인할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      expect(result.current.hasActiveFilters).toBe(false);

      act(() => {
        result.current.setFilter({ status: 'pending' });
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('특정 필터가 활성화되어 있는지 확인할 수 있어야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ status: 'pending', priority: 'high' });
      });

      expect(result.current.isFilterActive('status')).toBe(true);
      expect(result.current.isFilterActive('priority')).toBe(true);
      expect(result.current.isFilterActive('search')).toBe(false);
    });
  });

  describe('빈 결과 처리', () => {
    it('필터 결과가 없을 때 빈 배열을 반환해야 한다', () => {
      const { result } = renderHook(() => useTodoFilter());

      act(() => {
        result.current.setFilter({ search: '존재하지않는검색어' });
      });

      expect(result.current.filteredTodos).toHaveLength(0);
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

      const { result } = renderHook(() => useTodoFilter());

      expect(result.current.error).toBe('테스트 에러');
    });
  });
});
