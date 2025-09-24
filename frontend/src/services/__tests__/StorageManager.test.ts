import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Todo } from '../../types';
import { StorageManager } from '../StorageManager';
import { LocalStorageService } from '../LocalStorageService';
import { ApiStorageService } from '../ApiStorageService';
import { StorageError, STORAGE_ERROR_CODES } from '../StorageService';

describe('StorageManager', () => {
  let storageManager: StorageManager;
  let mockLocalStorage: LocalStorageService;
  let mockApiStorage: ApiStorageService;
  let mockTodos: Todo[];
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    mockTodos = [
      {
        id: '1',
        title: '테스트 Todo 1',
        priority: 'high',
        status: 'pending',
        createdAt: new Date('2024-01-01T08:00:00.000Z'),
        updatedAt: new Date('2024-01-01T08:00:00.000Z'),
      },
    ];

    // Mock services
    mockLocalStorage = {
      getTodos: vi.fn(),
      saveTodos: vi.fn(),
      clearTodos: vi.fn(),
      isAvailable: vi.fn().mockReturnValue(true),
    } as any;

    mockApiStorage = {
      getTodos: vi.fn(),
      saveTodos: vi.fn(),
      clearTodos: vi.fn(),
      isAvailable: vi.fn().mockReturnValue(true),
      setAuthToken: vi.fn(),
      clearAuthToken: vi.fn(),
      getStatus: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      sync: vi.fn(),
    } as any;

    storageManager = new StorageManager(mockLocalStorage, mockApiStorage);
  });

  describe('생성자', () => {
    it('기본 설정으로 생성되어야 한다', () => {
      const manager = new StorageManager();
      expect(manager).toBeInstanceOf(StorageManager);
    });

    it('커스텀 서비스로 생성되어야 한다', () => {
      const manager = new StorageManager(mockLocalStorage, mockApiStorage);
      expect(manager).toBeInstanceOf(StorageManager);
    });
  });

  describe('스토리지 전략', () => {
    it('기본적으로 로컬 스토리지를 사용해야 한다', () => {
      expect(storageManager.getCurrentStrategy()).toBe('local');
    });

    it('API 스토리지로 전환할 수 있어야 한다', async () => {
      vi.mocked(mockApiStorage.isAvailable).mockReturnValue(true);

      await storageManager.switchToApi();

      expect(storageManager.getCurrentStrategy()).toBe('api');
    });

    it('로컬 스토리지로 전환할 수 있어야 한다', async () => {
      await storageManager.switchToLocal();

      expect(storageManager.getCurrentStrategy()).toBe('local');
    });

    it('자동 전환 모드를 활성화할 수 있어야 한다', () => {
      storageManager.setAutoSwitch(true);
      expect(storageManager.isAutoSwitchEnabled()).toBe(true);
    });

    it('자동 전환 모드를 비활성화할 수 있어야 한다', () => {
      storageManager.setAutoSwitch(false);
      expect(storageManager.isAutoSwitchEnabled()).toBe(false);
    });
  });

  describe('getTodos', () => {
    it('현재 전략에 따라 데이터를 가져와야 한다', async () => {
      vi.mocked(mockLocalStorage.getTodos).mockResolvedValue(mockTodos);

      const result = await storageManager.getTodos();

      expect(result).toEqual(mockTodos);
      expect(mockLocalStorage.getTodos).toHaveBeenCalledTimes(1);
    });

    it('API 전략으로 전환 후 API에서 데이터를 가져와야 한다', async () => {
      vi.mocked(mockApiStorage.isAvailable).mockReturnValue(true);
      vi.mocked(mockApiStorage.getTodos).mockResolvedValue(mockTodos);

      await storageManager.switchToApi();
      const result = await storageManager.getTodos();

      expect(result).toEqual(mockTodos);
      expect(mockApiStorage.getTodos).toHaveBeenCalledTimes(1);
    });

    it('현재 전략이 실패하면 대체 전략을 시도해야 한다', async () => {
      vi.mocked(mockLocalStorage.getTodos).mockRejectedValue(new Error('Local storage error'));
      vi.mocked(mockApiStorage.getTodos).mockResolvedValue(mockTodos);

      const result = await storageManager.getTodos();

      expect(result).toEqual(mockTodos);
      expect(mockApiStorage.getTodos).toHaveBeenCalledTimes(1);
    });

    it('모든 전략이 실패하면 에러를 발생시켜야 한다', async () => {
      vi.mocked(mockLocalStorage.getTodos).mockRejectedValue(new Error('Local storage error'));
      vi.mocked(mockApiStorage.getTodos).mockRejectedValue(new Error('API error'));

      await expect(storageManager.getTodos()).rejects.toThrow();
    });
  });

  describe('saveTodos', () => {
    it('현재 전략에 따라 데이터를 저장해야 한다', async () => {
      vi.mocked(mockLocalStorage.saveTodos).mockResolvedValue(undefined);

      await storageManager.saveTodos(mockTodos);

      expect(mockLocalStorage.saveTodos).toHaveBeenCalledWith(mockTodos);
    });

    it('API 전략으로 전환 후 API에 데이터를 저장해야 한다', async () => {
      vi.mocked(mockApiStorage.isAvailable).mockReturnValue(true);
      vi.mocked(mockApiStorage.saveTodos).mockResolvedValue(undefined);

      await storageManager.switchToApi();
      await storageManager.saveTodos(mockTodos);

      expect(mockApiStorage.saveTodos).toHaveBeenCalledWith(mockTodos);
    });

    it('현재 전략이 실패하면 대체 전략을 시도해야 한다', async () => {
      vi.mocked(mockLocalStorage.saveTodos).mockRejectedValue(new Error('Local storage error'));
      vi.mocked(mockApiStorage.saveTodos).mockResolvedValue(undefined);

      await storageManager.saveTodos(mockTodos);

      expect(mockApiStorage.saveTodos).toHaveBeenCalledWith(mockTodos);
    });

    it('모든 전략이 실패하면 에러를 발생시켜야 한다', async () => {
      vi.mocked(mockLocalStorage.saveTodos).mockRejectedValue(new Error('Local storage error'));
      vi.mocked(mockApiStorage.saveTodos).mockRejectedValue(new Error('API error'));

      await expect(storageManager.saveTodos(mockTodos)).rejects.toThrow();
    });
  });

  describe('clearTodos', () => {
    it('현재 전략에 따라 데이터를 삭제해야 한다', async () => {
      vi.mocked(mockLocalStorage.clearTodos).mockResolvedValue(undefined);

      await storageManager.clearTodos();

      expect(mockLocalStorage.clearTodos).toHaveBeenCalledTimes(1);
    });

    it('API 전략으로 전환 후 API에서 데이터를 삭제해야 한다', async () => {
      vi.mocked(mockApiStorage.isAvailable).mockReturnValue(true);
      vi.mocked(mockApiStorage.clearTodos).mockResolvedValue(undefined);

      await storageManager.switchToApi();
      await storageManager.clearTodos();

      expect(mockApiStorage.clearTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('자동 전환', () => {
    it('자동 전환이 활성화되면 실패 시 자동으로 전환해야 한다', async () => {
      storageManager.setAutoSwitch(true);
      vi.mocked(mockLocalStorage.getTodos).mockRejectedValue(new Error('Local storage error'));
      vi.mocked(mockApiStorage.getTodos).mockResolvedValue(mockTodos);

      const result = await storageManager.getTodos();

      expect(result).toEqual(mockTodos);
      expect(storageManager.getCurrentStrategy()).toBe('api');
    });

    it('자동 전환이 비활성화되면 실패 시 전환하지 않아야 한다', async () => {
      storageManager.setAutoSwitch(false);
      vi.mocked(mockLocalStorage.getTodos).mockRejectedValue(new Error('Local storage error'));

      await expect(storageManager.getTodos()).rejects.toThrow('Local storage error');
      expect(storageManager.getCurrentStrategy()).toBe('local');
    });
  });

  describe('인증 토큰', () => {
    it('API 스토리지에 인증 토큰을 설정할 수 있어야 한다', () => {
      const token = 'bearer-token-123';
      storageManager.setAuthToken(token);

      expect(mockApiStorage.setAuthToken).toHaveBeenCalledWith(token);
    });

    it('API 스토리지에서 인증 토큰을 제거할 수 있어야 한다', () => {
      storageManager.clearAuthToken();

      expect(mockApiStorage.clearAuthToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('상태 관리', () => {
    it('현재 전략을 반환해야 한다', () => {
      expect(storageManager.getCurrentStrategy()).toBe('local');
    });

    it('사용 가능한 전략 목록을 반환해야 한다', () => {
      const availableStrategies = storageManager.getAvailableStrategies();
      
      expect(availableStrategies).toContain('local');
      expect(availableStrategies).toContain('api');
    });

    it('전략별 사용 가능 여부를 확인할 수 있어야 한다', () => {
      expect(storageManager.isStrategyAvailable('local')).toBe(true);
      expect(storageManager.isStrategyAvailable('api')).toBe(true);
    });
  });

  describe('에러 처리', () => {
    it('네트워크 에러를 올바르게 처리해야 한다', async () => {
      const networkError = new StorageError(
        'Network error',
        STORAGE_ERROR_CODES.NETWORK_ERROR
      );
      mockApiStorage.getTodos.mockRejectedValue(networkError);
      mockLocalStorage.getTodos.mockResolvedValue(mockTodos);

      await storageManager.switchToApi();
      storageManager.setAutoSwitch(false); // 자동 전환 비활성화
      await expect(storageManager.getTodos()).rejects.toThrow(StorageError);
    });

    it('권한 에러를 올바르게 처리해야 한다', async () => {
      const permissionError = new StorageError(
        'Permission denied',
        STORAGE_ERROR_CODES.PERMISSION_ERROR
      );
      mockApiStorage.saveTodos.mockRejectedValue(permissionError);
      mockLocalStorage.saveTodos.mockResolvedValue(undefined);

      await storageManager.switchToApi();
      storageManager.setAutoSwitch(false); // 자동 전환 비활성화
      await expect(storageManager.saveTodos(mockTodos)).rejects.toThrow(StorageError);
    });
  });

  describe('이벤트 처리', () => {
    it('API 스토리지 이벤트를 전달해야 한다', () => {
      const listener = vi.fn();
      storageManager.addEventListener(listener);

      expect(mockApiStorage.addEventListener).toHaveBeenCalledWith(listener);
    });

    it('API 스토리지 이벤트 리스너를 제거할 수 있어야 한다', () => {
      const listener = vi.fn();
      storageManager.removeEventListener(listener);

      expect(mockApiStorage.removeEventListener).toHaveBeenCalledWith(listener);
    });
  });

  describe('동기화', () => {
    it('수동 동기화를 실행할 수 있어야 한다', async () => {
      vi.mocked(mockApiStorage.sync).mockResolvedValue(undefined);

      await storageManager.sync();

      expect(mockApiStorage.sync).toHaveBeenCalledTimes(1);
    });

    it('API 스토리지 상태를 가져올 수 있어야 한다', () => {
      const status = {
        available: true,
        connected: true,
        lastSync: new Date(),
      };
      vi.mocked(mockApiStorage.getStatus).mockReturnValue(status);

      const result = storageManager.getApiStatus();

      expect(result).toEqual(status);
    });
  });
});
