import type { Todo } from '../types';
import type {
  StorageService,
  ExtendedStorageService,
  StorageServiceStatus,
  StorageServiceEventListener,
} from './StorageService';
import { LocalStorageService } from './LocalStorageService';
import { ApiStorageService } from './ApiStorageService';

/**
 * 스토리지 전략 타입
 */
export type StorageStrategy = 'local' | 'api';

/**
 * 스토리지 매니저 설정
 */
export interface StorageManagerConfig {
  /** 기본 전략 */
  defaultStrategy?: StorageStrategy;
  /** 자동 전환 활성화 여부 */
  autoSwitch?: boolean;
  /** API 기본 URL */
  apiBaseURL?: string;
}

/**
 * 스토리지 매니저
 * 로컬 스토리지와 API 스토리지 간의 전환을 관리합니다.
 */
export class StorageManager {
  private currentStrategy: StorageStrategy;
  private autoSwitch: boolean;
  private localStorage: StorageService;
  private apiStorage: ExtendedStorageService;

  constructor(
    localStorage?: StorageService,
    apiStorage?: ExtendedStorageService,
    config: StorageManagerConfig = {}
  ) {
    this.localStorage = localStorage || new LocalStorageService();
    this.apiStorage = apiStorage || new ApiStorageService(config.apiBaseURL);
    this.currentStrategy = config.defaultStrategy || 'local';
    this.autoSwitch = config.autoSwitch ?? true;
  }

  /**
   * 현재 사용 중인 전략을 반환합니다.
   */
  getCurrentStrategy(): StorageStrategy {
    return this.currentStrategy;
  }

  /**
   * 사용 가능한 전략 목록을 반환합니다.
   */
  getAvailableStrategies(): StorageStrategy[] {
    const strategies: StorageStrategy[] = [];

    if (this.localStorage.isAvailable()) {
      strategies.push('local');
    }

    if (this.apiStorage.isAvailable()) {
      strategies.push('api');
    }

    return strategies;
  }

  /**
   * 특정 전략이 사용 가능한지 확인합니다.
   */
  isStrategyAvailable(strategy: StorageStrategy): boolean {
    switch (strategy) {
      case 'local':
        return this.localStorage.isAvailable();
      case 'api':
        return this.apiStorage.isAvailable();
      default:
        return false;
    }
  }

  /**
   * 로컬 스토리지로 전환합니다.
   */
  async switchToLocal(): Promise<void> {
    if (!this.isStrategyAvailable('local')) {
      throw new Error('Local storage is not available');
    }

    this.currentStrategy = 'local';
  }

  /**
   * API 스토리지로 전환합니다.
   */
  async switchToApi(): Promise<void> {
    if (!this.isStrategyAvailable('api')) {
      throw new Error('API storage is not available');
    }

    this.currentStrategy = 'api';
  }

  /**
   * 자동 전환 모드를 설정합니다.
   */
  setAutoSwitch(enabled: boolean): void {
    this.autoSwitch = enabled;
  }

  /**
   * 자동 전환이 활성화되어 있는지 확인합니다.
   */
  isAutoSwitchEnabled(): boolean {
    return this.autoSwitch;
  }

  /**
   * 현재 전략의 스토리지 서비스를 반환합니다.
   */
  private getCurrentStorage(): StorageService {
    return this.currentStrategy === 'local'
      ? this.localStorage
      : this.apiStorage;
  }

  /**
   * 대체 전략의 스토리지 서비스를 반환합니다.
   */
  private getFallbackStorage(): StorageService {
    return this.currentStrategy === 'local'
      ? this.apiStorage
      : this.localStorage;
  }

  /**
   * 저장된 Todo 목록을 가져옵니다.
   */
  async getTodos(): Promise<Todo[]> {
    try {
      const storage = this.getCurrentStorage();
      return await storage.getTodos();
    } catch (error) {
      if (this.autoSwitch && this.getAvailableStrategies().length > 1) {
        // 대체 전략으로 자동 전환
        const fallbackStorage = this.getFallbackStorage();
        const result = await fallbackStorage.getTodos();

        // 전략 전환
        this.currentStrategy =
          this.currentStrategy === 'local' ? 'api' : 'local';

        return result;
      }

      throw error;
    }
  }

  /**
   * Todo 목록을 저장합니다.
   */
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const storage = this.getCurrentStorage();
      await storage.saveTodos(todos);
    } catch (error) {
      if (this.autoSwitch && this.getAvailableStrategies().length > 1) {
        // 대체 전략으로 자동 전환
        const fallbackStorage = this.getFallbackStorage();
        await fallbackStorage.saveTodos(todos);

        // 전략 전환
        this.currentStrategy =
          this.currentStrategy === 'local' ? 'api' : 'local';

        return;
      }

      throw error;
    }
  }

  /**
   * 모든 Todo를 삭제합니다.
   */
  async clearTodos(): Promise<void> {
    try {
      const storage = this.getCurrentStorage();
      await storage.clearTodos();
    } catch (error) {
      if (this.autoSwitch && this.getAvailableStrategies().length > 1) {
        // 대체 전략으로 자동 전환
        const fallbackStorage = this.getFallbackStorage();
        await fallbackStorage.clearTodos();

        // 전략 전환
        this.currentStrategy =
          this.currentStrategy === 'local' ? 'api' : 'local';

        return;
      }

      throw error;
    }
  }

  /**
   * 인증 토큰을 설정합니다.
   */
  setAuthToken(token: string): void {
    if ('setAuthToken' in this.apiStorage) {
      (this.apiStorage as ExtendedStorageService).setAuthToken(token);
    }
  }

  /**
   * 인증 토큰을 제거합니다.
   */
  clearAuthToken(): void {
    if ('clearAuthToken' in this.apiStorage) {
      (this.apiStorage as ExtendedStorageService).clearAuthToken();
    }
  }

  /**
   * API 스토리지 상태를 가져옵니다.
   */
  getApiStatus(): StorageServiceStatus {
    return this.apiStorage.getStatus();
  }

  /**
   * 이벤트 리스너를 추가합니다.
   */
  addEventListener(listener: StorageServiceEventListener): void {
    this.apiStorage.addEventListener(listener);
  }

  /**
   * 이벤트 리스너를 제거합니다.
   */
  removeEventListener(listener: StorageServiceEventListener): void {
    this.apiStorage.removeEventListener(listener);
  }

  /**
   * 수동으로 동기화를 실행합니다.
   */
  async sync(): Promise<void> {
    await this.apiStorage.sync();
  }

  /**
   * 연결 상태를 확인하고 업데이트합니다.
   */
  checkConnection(): void {
    if ('checkConnection' in this.apiStorage) {
      (this.apiStorage as ExtendedStorageService).checkConnection();
    }
  }

  /**
   * 스토리지 매니저 상태를 반환합니다.
   */
  getStatus(): {
    currentStrategy: StorageStrategy;
    availableStrategies: StorageStrategy[];
    autoSwitch: boolean;
    apiStatus: StorageServiceStatus;
  } {
    return {
      currentStrategy: this.currentStrategy,
      availableStrategies: this.getAvailableStrategies(),
      autoSwitch: this.autoSwitch,
      apiStatus: this.getApiStatus(),
    };
  }

  /**
   * 두 스토리지 간의 데이터를 동기화합니다.
   */
  async syncBetweenStorages(): Promise<void> {
    try {
      // 현재 전략에서 데이터 가져오기
      const currentData = await this.getCurrentStorage().getTodos();

      // 대체 전략에 데이터 저장
      const fallbackStorage = this.getFallbackStorage();
      await fallbackStorage.saveTodos(currentData);
    } catch (error) {
      console.warn('Failed to sync between storages:', error);
    }
  }

  /**
   * 스토리지 매니저를 초기화합니다.
   */
  async initialize(): Promise<void> {
    // 사용 가능한 전략 확인
    const availableStrategies = this.getAvailableStrategies();

    if (availableStrategies.length === 0) {
      throw new Error('No storage strategies are available');
    }

    // 기본 전략이 사용 불가능하면 첫 번째 사용 가능한 전략으로 전환
    if (!this.isStrategyAvailable(this.currentStrategy)) {
      this.currentStrategy = availableStrategies[0];
    }

    // API 스토리지가 사용 가능하면 연결 상태 확인
    if (this.isStrategyAvailable('api')) {
      this.checkConnection();
    }
  }
}
