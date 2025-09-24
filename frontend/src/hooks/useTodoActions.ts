import { useCallback } from 'react';
import { useTodoContext } from '../contexts/TodoContext';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

/**
 * Todo 액션을 관리하는 커스텀 훅
 * CRUD 작업과 배치 작업을 제공합니다.
 */
export function useTodoActions() {
  const {
    todos,
    addTodo: contextAddTodo,
    updateTodo: contextUpdateTodo,
    deleteTodo: contextDeleteTodo,
    toggleTodo: contextToggleTodo,
    setTodos: contextSetTodos,
    loading,
  } = useTodoContext();

  // 단일 Todo 추가
  const addTodo = useCallback(
    async (input: CreateTodoInput) => {
      return await contextAddTodo(input);
    },
    [contextAddTodo]
  );

  // 단일 Todo 업데이트
  const updateTodo = useCallback(
    async (id: string, input: UpdateTodoInput) => {
      const existingTodo = todos.find((todo) => todo.id === id);
      if (existingTodo) {
        const updatedTodo = {
          ...existingTodo,
          ...input,
          updatedAt: new Date(),
        };
        return contextUpdateTodo(updatedTodo);
      }
    },
    [contextUpdateTodo, todos]
  );

  // 단일 Todo 삭제
  const deleteTodo = useCallback(
    async (id: string) => {
      return await contextDeleteTodo(id);
    },
    [contextDeleteTodo]
  );

  // Todo 상태 토글
  const toggleTodo = useCallback(
    async (id: string) => {
      return await contextToggleTodo(id);
    },
    [contextToggleTodo]
  );

  // Todo 목록 설정
  const setTodos = useCallback(
    async (todos: Todo[]) => {
      return await contextSetTodos(todos);
    },
    [contextSetTodos]
  );

  // 여러 Todo 추가
  const addMultipleTodos = useCallback(
    async (inputs: CreateTodoInput[]) => {
      const promises = inputs.map((input) => contextAddTodo(input));
      return await Promise.all(promises);
    },
    [contextAddTodo]
  );

  // 여러 Todo 삭제
  const deleteMultipleTodos = useCallback(
    async (ids: string[]) => {
      const promises = ids.map((id) => contextDeleteTodo(id));
      return await Promise.all(promises);
    },
    [contextDeleteTodo]
  );

  // 완료된 모든 Todo 삭제
  const clearCompletedTodos = useCallback(async () => {
    const completedTodoIds = todos
      .filter((todo) => todo.status === 'completed')
      .map((todo) => todo.id);

    if (completedTodoIds.length > 0) {
      return await deleteMultipleTodos(completedTodoIds);
    }
  }, [deleteMultipleTodos, todos]);

  // 모든 Todo 삭제
  const clearAllTodos = useCallback(async () => {
    return await contextSetTodos([]);
  }, [contextSetTodos]);

  // Todo 복제
  const duplicateTodo = useCallback(
    async (id: string) => {
      const todoToDuplicate = todos.find((todo) => todo.id === id);

      if (todoToDuplicate) {
        const duplicatedInput: CreateTodoInput = {
          title: `${todoToDuplicate.title} (복사본)`,
          priority: todoToDuplicate.priority,
        };
        return await contextAddTodo(duplicatedInput);
      }
    },
    [contextAddTodo, todos]
  );

  // Todo 우선순위 일괄 변경
  const updateMultipleTodoPriorities = useCallback(
    async (ids: string[], priority: 'high' | 'medium' | 'low') => {
      const promises = ids.map((id) => {
        const existingTodo = todos.find((todo) => todo.id === id);
        if (existingTodo) {
          const updatedTodo = {
            ...existingTodo,
            priority,
            updatedAt: new Date(),
          };
          return contextUpdateTodo(updatedTodo);
        }
      });
      return await Promise.all(promises);
    },
    [contextUpdateTodo, todos]
  );

  // Todo 상태 일괄 변경
  const updateMultipleTodoStatuses = useCallback(
    async (ids: string[], status: 'pending' | 'completed') => {
      const promises = ids.map((id) => {
        const existingTodo = todos.find((todo) => todo.id === id);
        if (existingTodo) {
          const updatedTodo = {
            ...existingTodo,
            status,
            updatedAt: new Date(),
          };
          return contextUpdateTodo(updatedTodo);
        }
      });
      return await Promise.all(promises);
    },
    [contextUpdateTodo, todos]
  );

  return {
    // 기본 CRUD 작업
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setTodos,

    // 배치 작업
    addMultipleTodos,
    deleteMultipleTodos,
    clearCompletedTodos,
    clearAllTodos,

    // 유틸리티 작업
    duplicateTodo,
    updateMultipleTodoPriorities,
    updateMultipleTodoStatuses,

    // 상태
    loading,
  };
}
