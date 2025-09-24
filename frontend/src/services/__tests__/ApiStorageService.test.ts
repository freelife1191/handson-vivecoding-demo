import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Todo } from '../../types';
import { ApiStorageService } from '../ApiStorageService';
import { StorageError, STORAGE_ERROR_CODES } from '../StorageService';

// fetch 모킹
globalThis.fetch = vi.fn();

describe('ApiStorageService', () => {
  let apiStorageService: ApiStorageService;
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
      {
        id: '2',
        title: '테스트 Todo 2',
        priority: 'medium',
        status: 'completed',
        createdAt: new Date('2024-01-01T09:00:00.000Z'),
        updatedAt: new Date('2024-01-01T10:00:00.000Z'),
      },
    ];

    // navigator.onLine 모킹
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    apiStorageService = new ApiStorageService('http://localhost:3000/api');
    vi.clearAllMocks();
  });

  describe('생성자', () => {
    it('기본 설정으로 생성되어야 한다', () => {
      const service = new ApiStorageService();
      expect(service).toBeInstanceOf(ApiStorageService);
    });

    it('커스텀 baseURL로 생성되어야 한다', () => {
      const customUrl = 'https://api.example.com';
      const service = new ApiStorageService(customUrl);
      expect(service).toBeInstanceOf(ApiStorageService);
    });
  });

  describe('isAvailable', () => {
    it('네트워크가 사용 가능하면 true를 반환해야 한다', () => {
      expect(apiStorageService.isAvailable()).toBe(true);
    });

    it('오프라인 상태에서는 false를 반환해야 한다', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      expect(apiStorageService.isAvailable()).toBe(false);
    });
  });

  describe('getTodos', () => {
    it('API에서 Todo 목록을 가져와야 한다', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockTodos),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const result = await apiStorageService.getTodos();

      expect(result).toEqual(mockTodos);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('빈 배열을 반환할 수 있어야 한다', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const result = await apiStorageService.getTodos();

      expect(result).toEqual([]);
    });

    it('네트워크 에러를 처리해야 한다', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(apiStorageService.getTodos()).rejects.toThrow(StorageError);
    });

    it('HTTP 에러 상태를 처리해야 한다', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(apiStorageService.getTodos()).rejects.toThrow(StorageError);
    });

    it('인증 에러를 처리해야 한다', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(apiStorageService.getTodos()).rejects.toThrow(StorageError);
    });
  });

  describe('saveTodos', () => {
    it('Todo 목록을 API에 저장해야 한다', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await apiStorageService.saveTodos(mockTodos);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockTodos),
        })
      );
    });

    it('빈 배열을 저장할 수 있어야 한다', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await apiStorageService.saveTodos([]);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([]),
        })
      );
    });

    it('네트워크 에러를 처리해야 한다', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(apiStorageService.saveTodos(mockTodos)).rejects.toThrow(
        StorageError
      );
    });

    it('서버 에러를 처리해야 한다', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(apiStorageService.saveTodos(mockTodos)).rejects.toThrow(
        StorageError
      );
    });
  });

  describe('clearTodos', () => {
    it('API에서 모든 Todo를 삭제해야 한다', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await apiStorageService.clearTodos();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('네트워크 에러를 처리해야 한다', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(apiStorageService.clearTodos()).rejects.toThrow(
        StorageError
      );
    });

    it('서버 에러를 처리해야 한다', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(apiStorageService.clearTodos()).rejects.toThrow(
        StorageError
      );
    });
  });

  describe('인증 토큰', () => {
    it('인증 토큰이 있으면 헤더에 포함해야 한다', async () => {
      const token = 'bearer-token-123';
      apiStorageService.setAuthToken(token);

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockTodos),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await apiStorageService.getTodos();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      );
    });

    it('인증 토큰을 제거할 수 있어야 한다', async () => {
      apiStorageService.setAuthToken('token');
      apiStorageService.clearAuthToken();

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockTodos),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await apiStorageService.getTodos();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/todos',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('타임아웃', () => {
    it('타임아웃 설정이 적용되어야 한다', async () => {
      const service = new ApiStorageService('http://localhost:3000/api', {
        timeout: 1000,
      });

      // fetch가 AbortError를 던지도록 모킹
      vi.mocked(fetch).mockImplementation(() =>
        Promise.reject(new Error('The operation was aborted'))
      );

      await expect(service.getTodos()).rejects.toThrow(StorageError);
    });
  });

  describe('재시도 로직', () => {
    it('실패 시 재시도해야 한다', async () => {
      const service = new ApiStorageService('http://localhost:3000/api', {
        retryCount: 2,
        retryDelay: 100,
      });

      let callCount = 0;
      vi.mocked(fetch).mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValue(mockTodos),
        } as unknown as Response);
      });

      const result = await service.getTodos();

      expect(result).toEqual(mockTodos);
      expect(callCount).toBe(3);
    });
  });

  describe('에러 코드 매핑', () => {
    it('네트워크 에러를 올바른 코드로 매핑해야 한다', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      try {
        await apiStorageService.getTodos();
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError);
        expect((error as StorageError).code).toBe(
          STORAGE_ERROR_CODES.NETWORK_ERROR
        );
      }
    });

    it('권한 에러를 올바른 코드로 매핑해야 한다', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      try {
        await apiStorageService.getTodos();
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError);
        expect((error as StorageError).code).toBe(
          STORAGE_ERROR_CODES.PERMISSION_ERROR
        );
      }
    });
  });
});
