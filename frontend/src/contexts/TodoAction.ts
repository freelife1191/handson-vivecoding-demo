import type { Todo, CreateTodoInput } from '../types';

/**
 * Todo 상태 관리를 위한 액션 타입 정의
 */

/**
 * Todo 관련 액션 타입
 */
export type TodoAction =
  | {
      /** 새로운 Todo 항목 추가 */
      type: 'ADD_TODO';
      /** 생성할 Todo의 입력 데이터 */
      payload: CreateTodoInput;
    }
  | {
      /** 기존 Todo 항목 업데이트 */
      type: 'UPDATE_TODO';
      /** 업데이트할 Todo 객체 */
      payload: Todo;
    }
  | {
      /** Todo 항목 삭제 */
      type: 'DELETE_TODO';
      /** 삭제할 Todo의 ID */
      payload: string;
    }
  | {
      /** Todo 완료 상태 토글 */
      type: 'TOGGLE_TODO';
      /** 토글할 Todo의 ID */
      payload: string;
    }
  | {
      /** Todo 목록 전체 설정 */
      type: 'SET_TODOS';
      /** 설정할 Todo 배열 */
      payload: Todo[];
    };

/**
 * 액션 타입 가드 함수들
 */

/**
 * ADD_TODO 액션인지 확인
 */
export function isAddTodoAction(
  action: TodoAction
): action is Extract<TodoAction, { type: 'ADD_TODO' }> {
  return action.type === 'ADD_TODO';
}

/**
 * UPDATE_TODO 액션인지 확인
 */
export function isUpdateTodoAction(
  action: TodoAction
): action is Extract<TodoAction, { type: 'UPDATE_TODO' }> {
  return action.type === 'UPDATE_TODO';
}

/**
 * DELETE_TODO 액션인지 확인
 */
export function isDeleteTodoAction(
  action: TodoAction
): action is Extract<TodoAction, { type: 'DELETE_TODO' }> {
  return action.type === 'DELETE_TODO';
}

/**
 * TOGGLE_TODO 액션인지 확인
 */
export function isToggleTodoAction(
  action: TodoAction
): action is Extract<TodoAction, { type: 'TOGGLE_TODO' }> {
  return action.type === 'TOGGLE_TODO';
}

/**
 * SET_TODOS 액션인지 확인
 */
export function isSetTodosAction(
  action: TodoAction
): action is Extract<TodoAction, { type: 'SET_TODOS' }> {
  return action.type === 'SET_TODOS';
}

/**
 * 액션 생성 헬퍼 함수들
 */

/**
 * ADD_TODO 액션 생성
 */
export function createAddTodoAction(payload: CreateTodoInput): TodoAction {
  return {
    type: 'ADD_TODO',
    payload,
  };
}

/**
 * UPDATE_TODO 액션 생성
 */
export function createUpdateTodoAction(payload: Todo): TodoAction {
  return {
    type: 'UPDATE_TODO',
    payload,
  };
}

/**
 * DELETE_TODO 액션 생성
 */
export function createDeleteTodoAction(payload: string): TodoAction {
  return {
    type: 'DELETE_TODO',
    payload,
  };
}

/**
 * TOGGLE_TODO 액션 생성
 */
export function createToggleTodoAction(payload: string): TodoAction {
  return {
    type: 'TOGGLE_TODO',
    payload,
  };
}

/**
 * SET_TODOS 액션 생성
 */
export function createSetTodosAction(payload: Todo[]): TodoAction {
  return {
    type: 'SET_TODOS',
    payload,
  };
}
