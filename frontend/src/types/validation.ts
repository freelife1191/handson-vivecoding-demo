// 타입 정의 검증을 위한 간단한 유틸리티 함수들

/**
 * TODO 항목의 우선순위 레벨
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * TODO 항목의 완료 상태
 */
export type TodoStatus = 'pending' | 'completed';

/**
 * TODO 항목의 기본 인터페이스
 */
export interface Todo {
  /** 고유 식별자 */
  id: string;
  /** TODO 제목 (필수) */
  title: string;
  /** 우선순위 */
  priority: Priority;
  /** 완료 상태 */
  status: TodoStatus;
  /** 생성일시 */
  createdAt: Date;
  /** 수정일시 */
  updatedAt: Date;
}

/**
 * 새로운 TODO 항목 생성 시 사용하는 인터페이스
 */
export interface CreateTodoInput {
  /** TODO 제목 (필수) */
  title: string;
  /** 우선순위 (기본값: 'medium') */
  priority?: Priority;
}

/**
 * TODO 항목 수정 시 사용하는 인터페이스
 */
export interface UpdateTodoInput {
  /** TODO 제목 */
  title?: string;
  /** 우선순위 */
  priority?: Priority;
  /** 완료 상태 */
  status?: TodoStatus;
}

/**
 * 우선순위 레벨의 표시 정보
 */
export interface PriorityInfo {
  /** 우선순위 값 */
  value: Priority;
  /** 표시용 라벨 */
  label: string;
  /** 색상 코드 */
  color: string;
  /** 순서 (정렬용) */
  order: number;
}

/**
 * 우선순위 정보 상수
 */
export const PRIORITY_INFO: Record<Priority, PriorityInfo> = {
  low: {
    value: 'low',
    label: '낮음',
    color: '#40c057',
    order: 1,
  },
  medium: {
    value: 'medium',
    label: '중간',
    color: '#fab005',
    order: 2,
  },
  high: {
    value: 'high',
    label: '높음',
    color: '#fa5252',
    order: 3,
  },
} as const;

/**
 * 상태 정보 상수
 */
export const STATUS_INFO = {
  pending: {
    value: 'pending' as TodoStatus,
    label: '미완료',
    color: '#868e96',
  },
  completed: {
    value: 'completed' as TodoStatus,
    label: '완료',
    color: '#40c057',
  },
} as const;

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
    (input.priority === undefined ||
      ['low', 'medium', 'high'].includes(input.priority))
  );
}

/**
 * UpdateTodoInput이 유효한지 검증
 */
export function validateUpdateTodoInput(input: UpdateTodoInput): boolean {
  return (
    (input.title === undefined ||
      (typeof input.title === 'string' && input.title.length > 0)) &&
    (input.priority === undefined ||
      ['low', 'medium', 'high'].includes(input.priority)) &&
    (input.status === undefined ||
      ['pending', 'completed'].includes(input.status))
  );
}

/**
 * 우선순위 정보가 올바르게 정의되어 있는지 검증
 */
export function validatePriorityInfo(): boolean {
  const priorities: Priority[] = ['low', 'medium', 'high'];
  return priorities.every((priority) => {
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
  return statuses.every((status) => {
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
  return validatePriorityInfo() && validateStatusInfo();
}
