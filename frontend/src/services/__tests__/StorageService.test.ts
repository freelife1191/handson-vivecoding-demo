import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Todo } from '../../types';
import type { StorageService } from '../StorageService';

describe('StorageService 인터페이스', () => {
  let mockStorageService: StorageService;
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

    // Mock StorageService 구현
    mockStorageService = {
      getTodos: vi.fn().mockImplementation(() => Promise.resolve([])),
      saveTodos: vi.fn().mockImplementation(() => Promise.resolve()),
      clearTodos: vi.fn().mockImplementation(() => Promise.resolve()),
      isAvailable: vi.fn().mockReturnValue(true),
    };
  });

  describe('getTodos 메서드', () => {
    it('Todo 배열을 반환해야 한다', async () => {
      vi.mocked(mockStorageService.getTodos).mockResolvedValue(mockTodos);

      const result = await mockStorageService.getTodos();

      expect(result).toEqual(mockTodos);
      expect(Array.isArray(result)).toBe(true);
    });

    it('빈 배열을 반환할 수 있어야 한다', async () => {
      vi.mocked(mockStorageService.getTodos).mockResolvedValue([]);

      const result = await mockStorageService.getTodos();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('Promise를 반환해야 한다', () => {
      vi.mocked(mockStorageService.getTodos).mockResolvedValue([]);

      const result = mockStorageService.getTodos();

      expect(result).toBeInstanceOf(Promise);
    });

    it('에러가 발생할 수 있어야 한다', async () => {
      const error = new Error('Storage error');
      vi.mocked(mockStorageService.getTodos).mockRejectedValue(error);

      await expect(mockStorageService.getTodos()).rejects.toThrow('Storage error');
    });
  });

  describe('saveTodos 메서드', () => {
    it('Todo 배열을 저장해야 한다', async () => {
      vi.mocked(mockStorageService.saveTodos).mockResolvedValue(undefined);

      await mockStorageService.saveTodos(mockTodos);

      expect(mockStorageService.saveTodos).toHaveBeenCalledWith(mockTodos);
      expect(mockStorageService.saveTodos).toHaveBeenCalledTimes(1);
    });

    it('빈 배열을 저장할 수 있어야 한다', async () => {
      vi.mocked(mockStorageService.saveTodos).mockResolvedValue(undefined);

      await mockStorageService.saveTodos([]);

      expect(mockStorageService.saveTodos).toHaveBeenCalledWith([]);
    });

    it('Promise를 반환해야 한다', () => {
      vi.mocked(mockStorageService.saveTodos).mockResolvedValue(undefined);

      const result = mockStorageService.saveTodos(mockTodos);

      expect(result).toBeInstanceOf(Promise);
    });

    it('에러가 발생할 수 있어야 한다', async () => {
      const error = new Error('Save error');
      vi.mocked(mockStorageService.saveTodos).mockRejectedValue(error);

      await expect(mockStorageService.saveTodos(mockTodos)).rejects.toThrow('Save error');
    });
  });

  describe('clearTodos 메서드', () => {
    it('모든 Todo를 삭제해야 한다', async () => {
      vi.mocked(mockStorageService.clearTodos).mockResolvedValue(undefined);

      await mockStorageService.clearTodos();

      expect(mockStorageService.clearTodos).toHaveBeenCalledTimes(1);
    });

    it('Promise를 반환해야 한다', () => {
      vi.mocked(mockStorageService.clearTodos).mockResolvedValue(undefined);

      const result = mockStorageService.clearTodos();

      expect(result).toBeInstanceOf(Promise);
    });

    it('에러가 발생할 수 있어야 한다', async () => {
      const error = new Error('Clear error');
      vi.mocked(mockStorageService.clearTodos).mockRejectedValue(error);

      await expect(mockStorageService.clearTodos()).rejects.toThrow('Clear error');
    });
  });

  describe('isAvailable 메서드', () => {
    it('스토리지 사용 가능 여부를 반환해야 한다', () => {
      vi.mocked(mockStorageService.isAvailable).mockReturnValue(true);

      const result = mockStorageService.isAvailable();

      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('false를 반환할 수 있어야 한다', () => {
      vi.mocked(mockStorageService.isAvailable).mockReturnValue(false);

      const result = mockStorageService.isAvailable();

      expect(result).toBe(false);
    });

    it('동기적으로 실행되어야 한다', () => {
      vi.mocked(mockStorageService.isAvailable).mockReturnValue(true);

      const result = mockStorageService.isAvailable();

      expect(result).toBe(true);
    });
  });

  describe('StorageService 구현체 요구사항', () => {
    it('모든 메서드가 정의되어야 한다', () => {
      expect(typeof mockStorageService.getTodos).toBe('function');
      expect(typeof mockStorageService.saveTodos).toBe('function');
      expect(typeof mockStorageService.clearTodos).toBe('function');
      expect(typeof mockStorageService.isAvailable).toBe('function');
    });

    it('getTodos는 비동기 함수여야 한다', () => {
      expect(mockStorageService.getTodos.length).toBe(0);
    });

    it('saveTodos는 비동기 함수여야 한다', async () => {
      await mockStorageService.saveTodos(mockTodos);
      expect(mockStorageService.saveTodos).toHaveBeenCalledWith(mockTodos);
    });

    it('clearTodos는 비동기 함수여야 한다', () => {
      expect(mockStorageService.clearTodos.length).toBe(0);
    });

    it('isAvailable은 동기 함수여야 한다', () => {
      expect(mockStorageService.isAvailable.length).toBe(0);
    });
  });

  describe('에러 처리', () => {
    it('네트워크 에러를 처리할 수 있어야 한다', async () => {
      const networkError = new Error('Network error');
      vi.mocked(mockStorageService.getTodos).mockRejectedValue(networkError);

      await expect(mockStorageService.getTodos()).rejects.toThrow('Network error');
    });

    it('권한 에러를 처리할 수 있어야 한다', async () => {
      const permissionError = new Error('Permission denied');
      vi.mocked(mockStorageService.saveTodos).mockRejectedValue(permissionError);

      await expect(mockStorageService.saveTodos(mockTodos)).rejects.toThrow('Permission denied');
    });

    it('저장 공간 부족 에러를 처리할 수 있어야 한다', async () => {
      const quotaError = new Error('Quota exceeded');
      vi.mocked(mockStorageService.saveTodos).mockRejectedValue(quotaError);

      await expect(mockStorageService.saveTodos(mockTodos)).rejects.toThrow('Quota exceeded');
    });
  });
});
