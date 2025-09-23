import { describe, it, expect } from 'vitest';
import type {
  Priority,
  TodoStatus,
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
  TodoSort,
  TodoStats,
  Theme,
  AppSettings,
} from '../index';
import {
  PRIORITY_INFO,
  STATUS_INFO,
  DEFAULT_FILTER,
  DEFAULT_SORT,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
} from '../index';

describe('타입 정의 테스트', () => {
  describe('기본 타입', () => {
    it('Priority 타입이 올바르게 정의되어야 한다', () => {
      const priorities: Priority[] = ['low', 'medium', 'high'];
      expect(priorities).toHaveLength(3);
    });

    it('TodoStatus 타입이 올바르게 정의되어야 한다', () => {
      const statuses: TodoStatus[] = ['pending', 'completed'];
      expect(statuses).toHaveLength(2);
    });
  });

  describe('Todo 인터페이스', () => {
    it('Todo 객체가 올바른 구조를 가져야 한다', () => {
      const todo: Todo = {
        id: '1',
        title: '테스트 TODO',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      expect(todo.id).toBe('1');
      expect(todo.title).toBe('테스트 TODO');
      expect(todo.priority).toBe('medium');
      expect(todo.status).toBe('pending');
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('CreateTodoInput 인터페이스', () => {
    it('필수 필드만으로 생성할 수 있어야 한다', () => {
      const input: CreateTodoInput = {
        title: '새로운 TODO',
      };

      expect(input.title).toBe('새로운 TODO');
      expect(input.priority).toBeUndefined();
    });

    it('우선순위와 함께 생성할 수 있어야 한다', () => {
      const input: CreateTodoInput = {
        title: '새로운 TODO',
        priority: 'high',
      };

      expect(input.title).toBe('새로운 TODO');
      expect(input.priority).toBe('high');
    });
  });

  describe('UpdateTodoInput 인터페이스', () => {
    it('부분 업데이트가 가능해야 한다', () => {
      const input: UpdateTodoInput = {
        title: '수정된 제목',
      };

      expect(input.title).toBe('수정된 제목');
      expect(input.priority).toBeUndefined();
      expect(input.status).toBeUndefined();
    });
  });

  describe('TodoFilter 인터페이스', () => {
    it('필터 옵션이 올바르게 정의되어야 한다', () => {
      const filter: TodoFilter = {
        status: 'completed',
        priority: 'high',
        search: '검색어',
      };

      expect(filter.status).toBe('completed');
      expect(filter.priority).toBe('high');
      expect(filter.search).toBe('검색어');
    });
  });

  describe('TodoSort 인터페이스', () => {
    it('정렬 옵션이 올바르게 정의되어야 한다', () => {
      const sort: TodoSort = {
        field: 'priority',
        direction: 'desc',
      };

      expect(sort.field).toBe('priority');
      expect(sort.direction).toBe('desc');
    });
  });

  describe('TodoStats 인터페이스', () => {
    it('통계 정보가 올바르게 정의되어야 한다', () => {
      const stats: TodoStats = {
        total: 10,
        completed: 3,
        pending: 7,
        priorityCount: {
          low: 2,
          medium: 5,
          high: 3,
        },
      };

      expect(stats.total).toBe(10);
      expect(stats.completed).toBe(3);
      expect(stats.pending).toBe(7);
      expect(stats.priorityCount.low).toBe(2);
      expect(stats.priorityCount.medium).toBe(5);
      expect(stats.priorityCount.high).toBe(3);
    });
  });

  describe('상수 정의', () => {
    it('PRIORITY_INFO가 올바르게 정의되어야 한다', () => {
      expect(PRIORITY_INFO.low.label).toBe('낮음');
      expect(PRIORITY_INFO.medium.label).toBe('중간');
      expect(PRIORITY_INFO.high.label).toBe('높음');
      expect(PRIORITY_INFO.low.order).toBe(1);
      expect(PRIORITY_INFO.medium.order).toBe(2);
      expect(PRIORITY_INFO.high.order).toBe(3);
    });

    it('STATUS_INFO가 올바르게 정의되어야 한다', () => {
      expect(STATUS_INFO.pending.label).toBe('미완료');
      expect(STATUS_INFO.completed.label).toBe('완료');
    });

    it('DEFAULT_FILTER가 올바르게 정의되어야 한다', () => {
      expect(DEFAULT_FILTER.status).toBe('all');
      expect(DEFAULT_FILTER.priority).toBe('all');
      expect(DEFAULT_FILTER.search).toBe('');
    });

    it('DEFAULT_SORT가 올바르게 정의되어야 한다', () => {
      expect(DEFAULT_SORT.field).toBe('createdAt');
      expect(DEFAULT_SORT.direction).toBe('desc');
    });

    it('STORAGE_KEYS가 올바르게 정의되어야 한다', () => {
      expect(STORAGE_KEYS.TODOS).toBe('todos');
      expect(STORAGE_KEYS.FILTER).toBe('todo_filter');
      expect(STORAGE_KEYS.SORT).toBe('todo_sort');
      expect(STORAGE_KEYS.THEME).toBe('theme');
    });
  });

  describe('앱 설정', () => {
    it('Theme 타입이 올바르게 정의되어야 한다', () => {
      const themes: Theme[] = ['light', 'dark', 'auto'];
      expect(themes).toHaveLength(3);
    });

    it('AppSettings 인터페이스가 올바르게 정의되어야 한다', () => {
      const settings: AppSettings = {
        theme: 'dark',
        autoSave: true,
        notifications: false,
      };

      expect(settings.theme).toBe('dark');
      expect(settings.autoSave).toBe(true);
      expect(settings.notifications).toBe(false);
    });

    it('DEFAULT_SETTINGS가 올바르게 정의되어야 한다', () => {
      expect(DEFAULT_SETTINGS.theme).toBe('auto');
      expect(DEFAULT_SETTINGS.autoSave).toBe(true);
      expect(DEFAULT_SETTINGS.notifications).toBe(false);
    });
  });
});
