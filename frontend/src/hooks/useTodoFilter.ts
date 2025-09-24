import { useState, useMemo, useCallback } from 'react';
import { useTodoContext } from '../contexts/TodoContext';
import type { TodoFilter } from '../types';

/**
 * Todo 필터링을 관리하는 커스텀 훅
 * 상태, 우선순위, 검색어 기반 필터링을 제공합니다.
 */
export function useTodoFilter() {
  const { todos, error } = useTodoContext();
  const [filter, setFilter] = useState<TodoFilter>({});

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
        if (!todo.title.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [todos, filter]);

  // 필터 설정
  const handleSetFilter = useCallback((newFilter: TodoFilter) => {
    setFilter(newFilter);
  }, []);

  // 필터 업데이트 (기존 필터와 병합)
  const handleUpdateFilter = useCallback((updates: Partial<TodoFilter>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  }, []);

  // 필터 초기화
  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, []);

  // 활성 필터 개수
  const activeFilterCount = useMemo(() => {
    return Object.values(filter).filter(
      (value) => value !== undefined && value !== null && value !== ''
    ).length;
  }, [filter]);

  // 필터 활성화 여부
  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0;
  }, [activeFilterCount]);

  // 특정 필터 활성화 여부 확인
  const isFilterActive = useCallback(
    (filterKey: keyof TodoFilter) => {
      const value = filter[filterKey];
      return value !== undefined && value !== null && value !== '';
    },
    [filter]
  );

  return {
    // 필터 상태
    filter,
    filteredTodos,
    error,

    // 필터 조작 함수
    setFilter: handleSetFilter,
    updateFilter: handleUpdateFilter,
    clearFilter: handleClearFilter,

    // 필터 상태 확인
    activeFilterCount,
    hasActiveFilters,
    isFilterActive,
  };
}
