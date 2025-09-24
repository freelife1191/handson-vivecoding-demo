import type { Todo } from '../types';

/**
 * 스토리지 서비스 인터페이스
 * 다양한 스토리지 구현체(로컬 스토리지, API 등)를 위한 공통 인터페이스
 */
export interface StorageService {
  /**
   * 저장된 모든 Todo 목록을 가져옵니다.
   * @returns Promise<Todo[]> Todo 배열
   * @throws {Error} 스토리지에서 데이터를 읽을 수 없는 경우
   */
  getTodos(): Promise<Todo[]>;

  /**
   * Todo 목록을 저장합니다.
   * @param todos 저장할 Todo 배열
   * @returns Promise<void>
   * @throws {Error} 스토리지에 데이터를 저장할 수 없는 경우
   */
  saveTodos(todos: Todo[]): Promise<void>;

  /**
   * 모든 Todo를 삭제합니다.
   * @returns Promise<void>
   * @throws {Error} 스토리지에서 데이터를 삭제할 수 없는 경우
   */
  clearTodos(): Promise<void>;

  /**
   * 스토리지 서비스가 사용 가능한지 확인합니다.
   * @returns boolean 사용 가능 여부
   */
  isAvailable(): boolean;
}

/**
 * 스토리지 서비스 에러 타입
 */
export class StorageError extends Error {
  public readonly code?: string;
  public readonly cause?: unknown;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.cause = cause;
  }
}

/**
 * 스토리지 서비스 에러 코드 상수
 */
export const STORAGE_ERROR_CODES = {
  /** 네트워크 에러 */
  NETWORK_ERROR: 'NETWORK_ERROR',
  /** 권한 에러 */
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  /** 저장 공간 부족 */
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  /** 데이터 형식 에러 */
  INVALID_DATA: 'INVALID_DATA',
  /** 서비스 사용 불가 */
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  /** 알 수 없는 에러 */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * 스토리지 서비스 에러 코드 타입
 */
export type StorageErrorCode =
  (typeof STORAGE_ERROR_CODES)[keyof typeof STORAGE_ERROR_CODES];

/**
 * 스토리지 서비스 설정 인터페이스
 */
export interface StorageServiceConfig {
  /** 스토리지 키 */
  key?: string;
  /** 타임아웃 (밀리초) */
  timeout?: number;
  /** 재시도 횟수 */
  retryCount?: number;
  /** 재시도 간격 (밀리초) */
  retryDelay?: number;
}

/**
 * 스토리지 서비스 상태
 */
export interface StorageServiceStatus {
  /** 서비스 사용 가능 여부 */
  available: boolean;
  /** 마지막 동기화 시간 */
  lastSync?: Date;
  /** 에러 메시지 */
  error?: string;
  /** 연결 상태 */
  connected: boolean;
}

/**
 * 스토리지 서비스 이벤트 타입
 */
export type StorageServiceEvent =
  | { type: 'sync_start'; timestamp: Date }
  | { type: 'sync_success'; timestamp: Date; count: number }
  | { type: 'sync_error'; timestamp: Date; error: Error }
  | { type: 'connection_change'; connected: boolean; timestamp: Date };

/**
 * 스토리지 서비스 이벤트 리스너 타입
 */
export type StorageServiceEventListener = (event: StorageServiceEvent) => void;

/**
 * 확장된 스토리지 서비스 인터페이스 (선택적 기능)
 */
export interface ExtendedStorageService extends StorageService {
  /**
   * 스토리지 서비스 상태를 가져옵니다.
   */
  getStatus(): StorageServiceStatus;

  /**
   * 이벤트 리스너를 추가합니다.
   */
  addEventListener(listener: StorageServiceEventListener): void;

  /**
   * 이벤트 리스너를 제거합니다.
   */
  removeEventListener(listener: StorageServiceEventListener): void;

  /**
   * 수동으로 동기화를 실행합니다.
   */
  sync(): Promise<void>;

  /**
   * 인증 토큰을 설정합니다.
   */
  setAuthToken(token: string): void;

  /**
   * 인증 토큰을 제거합니다.
   */
  clearAuthToken(): void;

  /**
   * 연결 상태를 확인하고 업데이트합니다.
   */
  checkConnection(): void;
}
