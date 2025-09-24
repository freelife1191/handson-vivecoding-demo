import type { Todo } from '../types';
import type { TodoAction } from './TodoAction';
import { createTodo, toggleTodoStatus } from '../models/Todo.js';

/**
 * Todo 상태를 관리하는 리듀서 함수
 * @param state 현재 Todo 배열 상태
 * @param action 수행할 액션
 * @returns 새로운 Todo 배열 상태
 */
export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo = createTodo(action.payload);
      return [...state, newTodo];
    }

    case 'UPDATE_TODO': {
      return state.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
    }

    case 'DELETE_TODO': {
      return state.filter((todo) => todo.id !== action.payload);
    }

    case 'TOGGLE_TODO': {
      return state.map((todo) =>
        todo.id === action.payload ? toggleTodoStatus(todo) : todo
      );
    }

    case 'SET_TODOS': {
      return [...action.payload];
    }

    default: {
      // 알 수 없는 액션 타입에 대해 기존 상태 반환
      return state;
    }
  }
}

/**
 * Todo 상태의 초기값
 */
export const initialTodoState: Todo[] = [];

/**
 * Todo 상태를 초기화하는 액션
 */
export function resetTodosAction(): TodoAction {
  return {
    type: 'SET_TODOS',
    payload: [],
  };
}

/**
 * Todo 목록을 필터링하는 유틸리티 함수
 */
export function filterTodos(
  todos: Todo[],
  filter: {
    status?: 'all' | 'pending' | 'completed';
    priority?: 'all' | 'low' | 'medium' | 'high';
    search?: string;
  }
): Todo[] {
  return todos.filter((todo) => {
    // 상태 필터
    if (
      filter.status &&
      filter.status !== 'all' &&
      todo.status !== filter.status
    ) {
      return false;
    }

    // 우선순위 필터
    if (
      filter.priority &&
      filter.priority !== 'all' &&
      todo.priority !== filter.priority
    ) {
      return false;
    }

    // 검색 필터
    if (filter.search && filter.search.trim()) {
      const searchTerm = filter.search.toLowerCase().trim();
      const title = todo.title.toLowerCase();
      if (!title.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Todo 목록을 정렬하는 유틸리티 함수
 */
export function sortTodos(
  todos: Todo[],
  sort: {
    field: 'createdAt' | 'updatedAt' | 'priority' | 'title';
    direction: 'asc' | 'desc';
  }
): Todo[] {
  const sortedTodos = [...todos];

  switch (sort.field) {
    case 'createdAt': {
      return sortedTodos.sort((a, b) => {
        const aTime = a.createdAt.getTime();
        const bTime = b.createdAt.getTime();
        return sort.direction === 'asc' ? aTime - bTime : bTime - aTime;
      });
    }

    case 'updatedAt': {
      return sortedTodos.sort((a, b) => {
        const aTime = a.updatedAt.getTime();
        const bTime = b.updatedAt.getTime();
        return sort.direction === 'asc' ? aTime - bTime : bTime - aTime;
      });
    }

    case 'priority': {
      const priorityOrder: Record<string, number> = {
        low: 1,
        medium: 2,
        high: 3,
      };
      return sortedTodos.sort((a, b) => {
        const aOrder = priorityOrder[a.priority];
        const bOrder = priorityOrder[b.priority];
        return sort.direction === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      });
    }

    case 'title': {
      return sortedTodos.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (sort.direction === 'asc') {
          return aTitle.localeCompare(bTitle);
        } else {
          return bTitle.localeCompare(aTitle);
        }
      });
    }

    default: {
      return sortedTodos;
    }
  }
}

/**
 * Todo 통계를 계산하는 유틸리티 함수
 */
export function calculateTodoStats(todos: Todo[]): {
  total: number;
  completed: number;
  pending: number;
  priorityCount: {
    low: number;
    medium: number;
    high: number;
  };
} {
  const stats = {
    total: todos.length,
    completed: 0,
    pending: 0,
    priorityCount: {
      low: 0,
      medium: 0,
      high: 0,
    },
  };

  todos.forEach((todo) => {
    if (todo.status === 'completed') {
      stats.completed++;
    } else {
      stats.pending++;
    }

    stats.priorityCount[todo.priority]++;
  });

  return stats;
}
