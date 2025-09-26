// 타입 정의 내보내기

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
 * 필터링 옵션
 */
export interface TodoFilter {
  /** 완료 상태별 필터 */
  status?: TodoStatus | 'all';
  /** 우선순위별 필터 */
  priority?: Priority | 'all';
  /** 검색 키워드 (제목 기준) */
  search?: string;
}

/**
 * 정렬 옵션
 */
export interface TodoSort {
  /** 정렬 기준 */
  field: 'createdAt' | 'updatedAt' | 'priority' | 'title';
  /** 정렬 방향 */
  direction: 'asc' | 'desc';
}

/**
 * TODO 목록의 통계 정보
 */
export interface TodoStats {
  /** 전체 TODO 개수 */
  total: number;
  /** 완료된 TODO 개수 */
  completed: number;
  /** 미완료 TODO 개수 */
  pending: number;
  /** 우선순위별 개수 */
  priorityCount: {
    low: number;
    medium: number;
    high: number;
  };
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
 * 기본 필터 설정
 */
export const DEFAULT_FILTER: TodoFilter = {
  status: 'all',
  priority: 'all',
  search: '',
};

/**
 * 기본 정렬 설정
 */
export const DEFAULT_SORT: TodoSort = {
  field: 'createdAt',
  direction: 'desc',
};

/**
 * 로컬 스토리지 키 상수
 */
export const STORAGE_KEYS = {
  TODOS: 'todos',
  FILTER: 'todo_filter',
  SORT: 'todo_sort',
  THEME: 'theme',
} as const;

/**
 * 테마 타입
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * 앱 설정 인터페이스
 */
export interface AppSettings {
  /** 테마 설정 */
  theme: Theme;
  /** 자동 저장 여부 */
  autoSave: boolean;
  /** 알림 설정 */
  notifications: boolean;
}

/**
 * 기본 앱 설정
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  autoSave: true,
  notifications: false,
};