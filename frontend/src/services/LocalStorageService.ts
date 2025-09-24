import type { Todo } from '../types';
import type { StorageService } from './StorageService';
import { StorageError, STORAGE_ERROR_CODES } from './StorageService';
import { STORAGE_KEYS } from '../types';

/**
 * 로컬 스토리지를 사용하는 스토리지 서비스 구현체
 */
export class LocalStorageService implements StorageService {
  private readonly key: string;

  constructor(key: string = STORAGE_KEYS.TODOS) {
    this.key = key;
  }

  /**
   * localStorage 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    try {
      return (
        typeof window !== 'undefined' &&
        window.localStorage !== null &&
        typeof window.localStorage === 'object'
      );
    } catch {
      return false;
    }
  }

  /**
   * 저장된 Todo 목록을 가져옵니다.
   */
  async getTodos(): Promise<Todo[]> {
    if (!this.isAvailable()) {
      throw new StorageError(
        'localStorage is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    try {
      const storedData = localStorage.getItem(this.key);

      if (storedData === null) {
        return [];
      }

      const todos = JSON.parse(storedData);

      // 날짜 문자열을 Date 객체로 변환
      return todos.map((todo: Record<string, unknown>) => ({
        ...todo,
        createdAt: new Date(todo.createdAt as string),
        updatedAt: new Date(todo.updatedAt as string),
      }));
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new StorageError(
          'Invalid JSON data in localStorage',
          STORAGE_ERROR_CODES.INVALID_DATA,
          error
        );
      }

      throw new StorageError(
        'Failed to read from localStorage',
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
        'localStorage is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    try {
      // Date 객체를 문자열로 직렬화
      const serializedTodos = todos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
      }));

      localStorage.setItem(this.key, JSON.stringify(serializedTodos));
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          throw new StorageError(
            'Storage quota exceeded',
            STORAGE_ERROR_CODES.QUOTA_EXCEEDED,
            error
          );
        }

        if (error.name === 'SecurityError') {
          throw new StorageError(
            'Permission denied to access localStorage',
            STORAGE_ERROR_CODES.PERMISSION_ERROR,
            error
          );
        }
      }

      throw new StorageError(
        'Failed to save to localStorage',
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
        'localStorage is not available',
        STORAGE_ERROR_CODES.SERVICE_UNAVAILABLE
      );
    }

    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        throw new StorageError(
          'Permission denied to access localStorage',
          STORAGE_ERROR_CODES.PERMISSION_ERROR,
          error
        );
      }

      throw new StorageError(
        'Failed to clear localStorage',
        STORAGE_ERROR_CODES.UNKNOWN_ERROR,
        error
      );
    }
  }

  /**
   * 저장된 데이터 크기를 바이트 단위로 반환합니다.
   */
  getStorageSize(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const data = localStorage.getItem(this.key);
      return data ? new Blob([data]).size : 0;
    } catch {
      return 0;
    }
  }

  /**
   * 사용 가능한 저장 공간을 확인합니다.
   */
  getAvailableSpace(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      // 대략적인 사용 가능 공간 계산
      const testKey = '__storage_test__';
      const testData = 'x'.repeat(1024); // 1KB 테스트 데이터

      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);

      // 대부분의 브라우저에서 localStorage는 5-10MB 제한
      return 5 * 1024 * 1024; // 5MB로 가정
    } catch {
      return 0;
    }
  }

  /**
   * 저장소 사용률을 백분율로 반환합니다.
   */
  getStorageUsage(): number {
    const used = this.getStorageSize();
    const available = this.getAvailableSpace();

    if (available === 0) {
      return 0;
    }

    return Math.round((used / available) * 100);
  }
}
