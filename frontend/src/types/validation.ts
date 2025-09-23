// 타입 정의 검증을 위한 간단한 유틸리티 함수들
import type { Todo, CreateTodoInput, UpdateTodoInput, Priority, TodoStatus } from './index';
import { PRIORITY_INFO, STATUS_INFO } from './index';

/**
 * Todo 객체가 유효한지 검증
 */
export function validateTodo(todo: Todo): boolean {
  return (
    typeof todo.id === 'string' &&
    todo.id.length > 0 &&
    typeof todo.title === 'string' &&
    todo.title.length > 0 &&
    ['low', 'medium', 'high'].includes(todo.priority) &&
    ['pending', 'completed'].includes(todo.status) &&
    todo.createdAt instanceof Date &&
    todo.updatedAt instanceof Date
  );
}

/**
 * CreateTodoInput이 유효한지 검증
 */
export function validateCreateTodoInput(input: CreateTodoInput): boolean {
  return (
    typeof input.title === 'string' &&
    input.title.length > 0 &&
    (input.priority === undefined || ['low', 'medium', 'high'].includes(input.priority))
  );
}

/**
 * UpdateTodoInput이 유효한지 검증
 */
export function validateUpdateTodoInput(input: UpdateTodoInput): boolean {
  return (
    (input.title === undefined || (typeof input.title === 'string' && input.title.length > 0)) &&
    (input.priority === undefined || ['low', 'medium', 'high'].includes(input.priority)) &&
    (input.status === undefined || ['pending', 'completed'].includes(input.status))
  );
}

/**
 * 우선순위 정보가 올바르게 정의되어 있는지 검증
 */
export function validatePriorityInfo(): boolean {
  const priorities: Priority[] = ['low', 'medium', 'high'];
  return priorities.every(priority => {
    const info = PRIORITY_INFO[priority];
    return (
      info.value === priority &&
      typeof info.label === 'string' &&
      typeof info.color === 'string' &&
      typeof info.order === 'number'
    );
  });
}

/**
 * 상태 정보가 올바르게 정의되어 있는지 검증
 */
export function validateStatusInfo(): boolean {
  const statuses: TodoStatus[] = ['pending', 'completed'];
  return statuses.every(status => {
    const info = STATUS_INFO[status];
    return (
      info.value === status &&
      typeof info.label === 'string' &&
      typeof info.color === 'string'
    );
  });
}

/**
 * 모든 타입 정의가 올바른지 검증
 */
export function validateAllTypes(): boolean {
  return (
    validatePriorityInfo() &&
    validateStatusInfo()
  );
}
