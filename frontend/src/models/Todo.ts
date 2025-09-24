import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  Priority,
  TodoStatus,
} from '../types';

/**
 * Todo 모델 관련 유틸리티 함수들
 */

/**
 * 새로운 Todo 항목을 생성합니다.
 * @param input Todo 생성 입력 데이터
 * @returns 생성된 Todo 객체
 * @throws {Error} 제목이 비어있거나 공백만 있는 경우
 */
export function createTodo(input: CreateTodoInput): Todo {
  const { title, priority = 'medium' } = input;

  // 제목 유효성 검사
  if (!title || title.trim().length === 0) {
    throw new Error('Todo 제목은 필수입니다');
  }

  const now = new Date();
  const id = generateTodoId();

  return {
    id,
    title: title.trim(),
    priority,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 기존 Todo 항목을 업데이트합니다.
 * @param existingTodo 기존 Todo 객체
 * @param updateInput 업데이트할 데이터
 * @returns 업데이트된 Todo 객체
 * @throws {Error} 제목이 비어있거나 공백만 있는 경우
 */
export function updateTodo(
  existingTodo: Todo,
  updateInput: UpdateTodoInput
): Todo {
  // 변경사항이 없으면 기존 객체 반환
  if (Object.keys(updateInput).length === 0) {
    return existingTodo;
  }

  const { title, priority, status } = updateInput;

  // 제목 유효성 검사
  if (title !== undefined && (!title || title.trim().length === 0)) {
    throw new Error('Todo 제목은 필수입니다');
  }

  const now = new Date();

  return {
    ...existingTodo,
    ...(title !== undefined && { title: title.trim() }),
    ...(priority !== undefined && { priority }),
    ...(status !== undefined && { status }),
    updatedAt: now,
  };
}

/**
 * Todo 항목의 완료 상태를 토글합니다.
 * @param todo 토글할 Todo 객체
 * @returns 상태가 토글된 Todo 객체
 */
export function toggleTodoStatus(todo: Todo): Todo {
  const newStatus: TodoStatus =
    todo.status === 'pending' ? 'completed' : 'pending';

  return updateTodo(todo, { status: newStatus });
}

/**
 * Todo 객체의 유효성을 검사합니다.
 * @param todo 검사할 Todo 객체
 * @returns 유효한 경우 true, 그렇지 않으면 false
 */
export function validateTodo(todo: Todo): boolean {
  // 기본 속성 검사
  if (!todo.id || typeof todo.id !== 'string') {
    return false;
  }

  if (
    !todo.title ||
    typeof todo.title !== 'string' ||
    todo.title.trim().length === 0
  ) {
    return false;
  }

  // 우선순위 검사
  const validPriorities: Priority[] = ['low', 'medium', 'high'];
  if (!validPriorities.includes(todo.priority)) {
    return false;
  }

  // 상태 검사
  const validStatuses: TodoStatus[] = ['pending', 'completed'];
  if (!validStatuses.includes(todo.status)) {
    return false;
  }

  // 날짜 검사
  if (!(todo.createdAt instanceof Date) || !(todo.updatedAt instanceof Date)) {
    return false;
  }

  return true;
}

/**
 * 고유한 Todo ID를 생성합니다.
 * @returns 고유한 ID 문자열
 */
function generateTodoId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Todo 목록을 우선순위별로 정렬합니다.
 * @param todos 정렬할 Todo 배열
 * @param direction 정렬 방향 ('asc' | 'desc')
 * @returns 정렬된 Todo 배열
 */
export function sortTodosByPriority(
  todos: Todo[],
  direction: 'asc' | 'desc' = 'desc'
): Todo[] {
  const priorityOrder: Record<Priority, number> = {
    low: 1,
    medium: 2,
    high: 3,
  };

  return [...todos].sort((a, b) => {
    const aOrder = priorityOrder[a.priority];
    const bOrder = priorityOrder[b.priority];

    return direction === 'asc' ? aOrder - bOrder : bOrder - aOrder;
  });
}

/**
 * Todo 목록을 생성일시별로 정렬합니다.
 * @param todos 정렬할 Todo 배열
 * @param direction 정렬 방향 ('asc' | 'desc')
 * @returns 정렬된 Todo 배열
 */
export function sortTodosByCreatedAt(
  todos: Todo[],
  direction: 'asc' | 'desc' = 'desc'
): Todo[] {
  return [...todos].sort((a, b) => {
    const aTime = a.createdAt.getTime();
    const bTime = b.createdAt.getTime();

    return direction === 'asc' ? aTime - bTime : bTime - aTime;
  });
}

/**
 * Todo 목록을 수정일시별로 정렬합니다.
 * @param todos 정렬할 Todo 배열
 * @param direction 정렬 방향 ('asc' | 'desc')
 * @returns 정렬된 Todo 배열
 */
export function sortTodosByUpdatedAt(
  todos: Todo[],
  direction: 'asc' | 'desc' = 'desc'
): Todo[] {
  return [...todos].sort((a, b) => {
    const aTime = a.updatedAt.getTime();
    const bTime = b.updatedAt.getTime();

    return direction === 'asc' ? aTime - bTime : bTime - aTime;
  });
}

/**
 * Todo 목록을 제목별로 정렬합니다.
 * @param todos 정렬할 Todo 배열
 * @param direction 정렬 방향 ('asc' | 'desc')
 * @returns 정렬된 Todo 배열
 */
export function sortTodosByTitle(
  todos: Todo[],
  direction: 'asc' | 'desc' = 'asc'
): Todo[] {
  return [...todos].sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();

    if (direction === 'asc') {
      return aTitle.localeCompare(bTitle);
    } else {
      return bTitle.localeCompare(aTitle);
    }
  });
}
