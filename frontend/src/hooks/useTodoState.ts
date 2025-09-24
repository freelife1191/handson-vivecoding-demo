import { useState, useMemo } from 'react';
import { useTodoContext } from '../contexts/TodoContext';
import type { TodoFilter, TodoSort, TodoStats } from '../types';
import {
  sortTodosByCreatedAt,
  sortTodosByTitle,
  sortTodosByPriority,
} from '../models/Todo.js';

/**
 * Todo 상태를 관리하는 커스텀 훅
 * 필터링, 정렬, 통계 기능을 제공합니다.
 */
export function useTodoState() {
  const { todos, loading, error } = useTodoContext();
  const [filter, setFilter] = useState<TodoFilter>({});
  const [sort, setSort] = useState<TodoSort>({
    field: 'createdAt',
    direction: 'desc',
  });

  // 필터링된 Todo 목록
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 상태 필터
      if (filter.status && todo.status !== filter.status) {
        return false;
      }

      // 우선순위 필터
      if (filter.priority && todo.priority !== filter.priority) {
        return false;
      }

      // 검색어 필터
      if (filter.search && filter.search.trim()) {
        const searchTerm = filter.search.toLowerCase();
        return todo.title.toLowerCase().includes(searchTerm);
      }

      return true;
    });
  }, [todos, filter]);

  // 정렬된 Todo 목록
  const sortedTodos = useMemo(() => {
    if (!sort.field || !sort.direction) {
      return filteredTodos;
    }

    switch (sort.field) {
      case 'createdAt':
        return sortTodosByCreatedAt(filteredTodos, sort.direction);
      case 'title':
        return sortTodosByTitle(filteredTodos, sort.direction);
      case 'priority':
        return sortTodosByPriority(filteredTodos, sort.direction);
      default:
        return filteredTodos;
    }
  }, [filteredTodos, sort]);

  // 필터링과 정렬이 모두 적용된 Todo 목록
  const filteredAndSortedTodos = useMemo(() => {
    return sortedTodos;
  }, [sortedTodos]);

  // Todo 통계
  const stats = useMemo((): TodoStats => {
    const stats: TodoStats = {
      total: todos.length,
      pending: 0,
      completed: 0,
      priorityCount: {
        high: 0,
        medium: 0,
        low: 0,
      },
    };

    todos.forEach((todo) => {
      // 상태별 통계
      if (todo.status === 'pending') {
        stats.pending++;
      } else if (todo.status === 'completed') {
        stats.completed++;
      }

      // 우선순위별 통계
      if (todo.priority === 'high') {
        stats.priorityCount.high++;
      } else if (todo.priority === 'medium') {
        stats.priorityCount.medium++;
      } else if (todo.priority === 'low') {
        stats.priorityCount.low++;
      }
    });

    return stats;
  }, [todos]);

  return {
    // 기본 상태
    todos,
    loading,
    error,

    // 필터링 관련
    filter,
    setFilter,
    filteredTodos,

    // 정렬 관련
    sort,
    setSort,
    sortedTodos,

    // 조합된 결과
    filteredAndSortedTodos,

    // 통계
    stats,
  };
}
