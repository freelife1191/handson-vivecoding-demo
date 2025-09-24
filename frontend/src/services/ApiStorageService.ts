import type { Todo } from '../types';
import type {
  StorageServiceConfig,
  ExtendedStorageService,
  StorageServiceStatus,
  StorageServiceEvent,
  StorageServiceEventListener,
} from './StorageService';
import { StorageError, STORAGE_ERROR_CODES } from './StorageService';

/**
 * API를 사용하는 스토리지 서비스 구현체
 */
export class ApiStorageService implements ExtendedStorageService {
  private readonly baseURL: string;
  private readonly config: Required<StorageServiceConfig>;
  private authToken: string | null = null;
  private eventListeners: StorageServiceEventListener[] = [];
  private lastSync: Date | undefined;
  private connected: boolean = true;

  constructor(baseURL: string = '/api', config: StorageServiceConfig = {}) {
    this.baseURL = baseURL.replace(/\/$/, ''); // 끝의 슬래시 제거
    this.config = {
      key: 'todos',
      timeout: 10000, // 10초
      retryCount: 3,
      retryDelay: 1000, // 1초
      ...config,
    };
  }

  /**
   * 네트워크 연결 상태 확인
   */
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  /**
   * 인증 토큰 설정
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * 인증 토큰 제거
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * 이벤트 발생
   */
  private emitEvent(event: StorageServiceEvent): void {
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in storage event listener:', error);
      }
    });
  }

  /**
   * HTTP 요청 실행 (재시도 로직 포함)
   */
  private async makeRequest(
    url: string,
    options: RequestInit,
    retryCount: number = this.config.retryCount
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new StorageError(
          'Request timeout',
          STORAGE_ERROR_CODES.NETWORK_ERROR,
          error
        );
      }

      if (retryCount > 0) {
        await this.delay(this.config.retryDelay);
        return this.makeRequest(url, options, retryCount - 1);
      }

      throw new StorageError(
        'Network request failed',
        STORAGE_ERROR_CODES.NETWORK_ERROR,
        error
      );
    }
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * HTTP 응답 에러 처리
   */
  private handleResponseError(response: Response): never {
    let errorCode: string;
    let errorMessage: string;

    switch (response.status) {
      case 401:
        errorCode = STORAGE_ERROR_CODES.PERMISSION_ERROR;
        errorMessage = 'Authentication required';
        break;
      case 403:
        errorCode = STORAGE_ERROR_CODES.PERMISSION_ERROR;
        errorMessage = 'Access forbidden';
        break;
      case 404:
        errorCode = STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE;
        errorMessage = 'API endpoint not found';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorCode = STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE;
        errorMessage = 'Server error';
        break;
      default:
        errorCode = STORAGE_ERROR_CODES.UNKNOWN_ERROR;
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new StorageError(errorMessage, errorCode);
  }

  /**
   * 저장된 Todo 목록을 가져옵니다.
   */
  async getTodos(): Promise<Todo[]> {
    if (!this.isAvailable()) {
      throw new StorageError(
        'Network is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    this.emitEvent({ type: 'sync_start', timestamp: new Date() });

    try {
      const response = await this.makeRequest(`${this.baseURL}/todos`, {
        method: 'GET',
      });

      if (!response.ok) {
        this.handleResponseError(response);
      }

      const todos = await response.json();
      this.lastSync = new Date();
      this.connected = true;

      this.emitEvent({
        type: 'sync_success',
        timestamp: new Date(),
        count: todos.length,
      });

      return todos;
    } catch (error) {
      this.connected = false;
      this.emitEvent({
        type: 'sync_error',
        timestamp: new Date(),
        error: error as Error,
      });

      if (error instanceof StorageError) {
        throw error;
      }

      throw new StorageError(
        'Failed to fetch todos',
        STORAGE_ERROR_CODES.UNKNOWN_ERROR,
        error
      );
    }
  }

  /**
   * Todo 목록을 저장합니다.
   */
  async saveTodos(todos: Todo[]): Promise<void> {
    if (!this.isAvailable()) {
      throw new StorageError(
        'Network is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    this.emitEvent({ type: 'sync_start', timestamp: new Date() });

    try {
      const response = await this.makeRequest(`${this.baseURL}/todos`, {
        method: 'POST',
        body: JSON.stringify(todos),
      });

      if (!response.ok) {
        this.handleResponseError(response);
      }

      this.lastSync = new Date();
      this.connected = true;

      this.emitEvent({
        type: 'sync_success',
        timestamp: new Date(),
        count: todos.length,
      });
    } catch (error) {
      this.connected = false;
      this.emitEvent({
        type: 'sync_error',
        timestamp: new Date(),
        error: error as Error,
      });

      if (error instanceof StorageError) {
        throw error;
      }

      throw new StorageError(
        'Failed to save todos',
        STORAGE_ERROR_CODES.UNKNOWN_ERROR,
        error
      );
    }
  }

  /**
   * 모든 Todo를 삭제합니다.
   */
  async clearTodos(): Promise<void> {
    if (!this.isAvailable()) {
      throw new StorageError(
        'Network is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    this.emitEvent({ type: 'sync_start', timestamp: new Date() });

    try {
      const response = await this.makeRequest(`${this.baseURL}/todos`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        this.handleResponseError(response);
      }

      this.lastSync = new Date();
      this.connected = true;

      this.emitEvent({
        type: 'sync_success',
        timestamp: new Date(),
        count: 0,
      });
    } catch (error) {
      this.connected = false;
      this.emitEvent({
        type: 'sync_error',
        timestamp: new Date(),
        error: error as Error,
      });

      if (error instanceof StorageError) {
        throw error;
      }

      throw new StorageError(
        'Failed to clear todos',
        STORAGE_ERROR_CODES.UNKNOWN_ERROR,
        error
      );
    }
  }

  /**
   * 스토리지 서비스 상태를 가져옵니다.
   */
  getStatus(): StorageServiceStatus {
    return {
      available: this.isAvailable(),
      lastSync: this.lastSync,
      connected: this.connected,
    };
  }

  /**
   * 이벤트 리스너를 추가합니다.
   */
  addEventListener(listener: StorageServiceEventListener): void {
    this.eventListeners.push(listener);
  }

  /**
   * 이벤트 리스너를 제거합니다.
   */
  removeEventListener(listener: StorageServiceEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * 수동으로 동기화를 실행합니다.
   */
  async sync(): Promise<void> {
    // 현재는 getTodos를 호출하여 동기화 상태를 확인
    await this.getTodos();
  }

  /**
   * 연결 상태를 확인하고 업데이트합니다.
   */
  checkConnection(): void {
    const wasConnected = this.connected;
    this.connected = this.isAvailable();

    if (wasConnected !== this.connected) {
      this.emitEvent({
        type: 'connection_change',
        connected: this.connected,
        timestamp: new Date(),
      });
    }
  }
}
