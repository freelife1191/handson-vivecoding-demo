import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Todo } from '../../types';
import { LocalStorageService } from '../LocalStorageService';
import { STORAGE_KEYS } from '../../types';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;
  let mockLocalStorage: Storage;
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

    // localStorage 모킹
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    localStorageService = new LocalStorageService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('생성자', () => {
    it('기본 키로 생성되어야 한다', () => {
      const service = new LocalStorageService();
      expect(service).toBeInstanceOf(LocalStorageService);
    });

    it('커스텀 키로 생성되어야 한다', () => {
      const customKey = 'custom-todos';
      const service = new LocalStorageService(customKey);
      expect(service).toBeInstanceOf(LocalStorageService);
    });
  });

  describe('isAvailable', () => {
    it('localStorage가 사용 가능하면 true를 반환해야 한다', () => {
      expect(localStorageService.isAvailable()).toBe(true);
    });

    it('localStorage가 없으면 false를 반환해야 한다', () => {
      // @ts-ignore
      window.localStorage = null;
      const service = new LocalStorageService();
      expect(service.isAvailable()).toBe(false);
    });

    it('localStorage가 객체가 아니면 false를 반환해야 한다', () => {
      // @ts-ignore
      window.localStorage = null;
      const service = new LocalStorageService();
      expect(service.isAvailable()).toBe(false);
    });
  });

  describe('getTodos', () => {
    it('저장된 Todo 목록을 반환해야 한다', async () => {
      const storedData = JSON.stringify(mockTodos);
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(storedData);

      const result = await localStorageService.getTodos();

      expect(result).toEqual(mockTodos);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('저장된 데이터가 없으면 빈 배열을 반환해야 한다', async () => {
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(null);

      const result = await localStorageService.getTodos();

      expect(result).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('잘못된 JSON 데이터에 대해 에러를 발생시켜야 한다', async () => {
      vi.mocked(mockLocalStorage.getItem).mockReturnValue('invalid json');

      await expect(localStorageService.getTodos()).rejects.toThrow();
    });

    it('localStorage가 사용 불가능하면 에러를 발생시켜야 한다', async () => {
      // @ts-ignore
      window.localStorage = null;
      const service = new LocalStorageService();

      await expect(service.getTodos()).rejects.toThrow('localStorage is not available');
    });

    it('날짜 문자열을 Date 객체로 변환해야 한다', async () => {
      const todosWithStringDates = [
        {
          ...mockTodos[0],
          createdAt: '2024-01-01T08:00:00.000Z',
          updatedAt: '2024-01-01T08:00:00.000Z',
        },
      ];
      const storedData = JSON.stringify(todosWithStringDates);
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(storedData);

      const result = await localStorageService.getTodos();

      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.getTime()).toBe(new Date('2024-01-01T08:00:00.000Z').getTime());
    });
  });

  describe('saveTodos', () => {
    it('Todo 목록을 저장해야 한다', async () => {
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});

      await localStorageService.saveTodos(mockTodos);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TODOS,
        JSON.stringify(mockTodos)
      );
    });

    it('빈 배열을 저장할 수 있어야 한다', async () => {
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});

      await localStorageService.saveTodos([]);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TODOS,
        JSON.stringify([])
      );
    });

    it('localStorage가 사용 불가능하면 에러를 발생시켜야 한다', async () => {
      // @ts-ignore
      window.localStorage = null;
      const service = new LocalStorageService();

      await expect(service.saveTodos(mockTodos)).rejects.toThrow('localStorage is not available');
    });

    it('저장 공간 부족 시 에러를 발생시켜야 한다', async () => {
      const quotaError = new DOMException('QuotaExceededError');
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {
        throw quotaError;
      });

      await expect(localStorageService.saveTodos(mockTodos)).rejects.toThrow();
    });

    it('Date 객체를 문자열로 직렬화해야 한다', async () => {
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});

      await localStorageService.saveTodos(mockTodos);

      const savedData = vi.mocked(mockLocalStorage.setItem).mock.calls[0][1];
      const parsedData = JSON.parse(savedData as string);
      
      expect(parsedData[0].createdAt).toBe('2024-01-01T08:00:00.000Z');
      expect(parsedData[0].updatedAt).toBe('2024-01-01T08:00:00.000Z');
    });
  });

  describe('clearTodos', () => {
    it('저장된 Todo를 삭제해야 한다', async () => {
      vi.mocked(mockLocalStorage.removeItem).mockImplementation(() => {});

      await localStorageService.clearTodos();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('localStorage가 사용 불가능하면 에러를 발생시켜야 한다', async () => {
      // @ts-ignore
      window.localStorage = null;
      const service = new LocalStorageService();

      await expect(service.clearTodos()).rejects.toThrow('localStorage is not available');
    });
  });

  describe('커스텀 키 사용', () => {
    it('커스텀 키로 데이터를 저장하고 읽을 수 있어야 한다', async () => {
      const customKey = 'custom-todos';
      const customService = new LocalStorageService(customKey);
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(JSON.stringify(mockTodos));

      await customService.saveTodos(mockTodos);
      const result = await customService.getTodos();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(customKey, JSON.stringify(mockTodos));
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(customKey);
      expect(result).toEqual(mockTodos);
    });
  });

  describe('에러 처리', () => {
    it('localStorage 접근 에러를 처리해야 한다', async () => {
      const accessError = new DOMException('Access denied');
      vi.mocked(mockLocalStorage.getItem).mockImplementation(() => {
        throw accessError;
      });

      await expect(localStorageService.getTodos()).rejects.toThrow();
    });

    it('JSON 파싱 에러를 처리해야 한다', async () => {
      vi.mocked(mockLocalStorage.getItem).mockReturnValue('{"invalid": json}');

      await expect(localStorageService.getTodos()).rejects.toThrow();
    });
  });

  describe('데이터 무결성', () => {
    it('저장 후 읽은 데이터가 동일해야 한다', async () => {
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(JSON.stringify(mockTodos));

      await localStorageService.saveTodos(mockTodos);
      const result = await localStorageService.getTodos();

      expect(result).toEqual(mockTodos);
    });

    it('큰 데이터도 올바르게 처리해야 한다', async () => {
      const largeTodos: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `todo-${i}`,
        title: `Todo ${i}`,
        priority: 'medium' as const,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {});
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(JSON.stringify(largeTodos));

      await localStorageService.saveTodos(largeTodos);
      const result = await localStorageService.getTodos();

      expect(result).toHaveLength(1000);
      expect(result[0].id).toBe('todo-0');
      expect(result[999].id).toBe('todo-999');
    });
  });
});
