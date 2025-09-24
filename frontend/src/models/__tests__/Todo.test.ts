import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  Priority,
} from '../../types';
import {
  createTodo,
  updateTodo,
  toggleTodoStatus,
  validateTodo,
} from '../Todo.js';

describe('Todo 모델', () => {
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);
  });

  describe('createTodo', () => {
    it('기본 Todo 항목을 생성해야 한다', () => {
      const input: CreateTodoInput = {
        title: '테스트 Todo',
        priority: 'medium',
      };

      const todo = createTodo(input);

      expect(todo).toMatchObject({
        title: '테스트 Todo',
        priority: 'medium',
        status: 'pending',
      });
      expect(todo.id).toBeDefined();
      expect(todo.createdAt).toEqual(mockDate);
      expect(todo.updatedAt).toEqual(mockDate);
    });

    it('우선순위가 없으면 기본값 medium을 사용해야 한다', () => {
      const input: CreateTodoInput = {
        title: '우선순위 없는 Todo',
      };

      const todo = createTodo(input);

      expect(todo.priority).toBe('medium');
    });

    it('모든 우선순위 레벨로 Todo를 생성할 수 있어야 한다', () => {
      const priorities: Priority[] = ['low', 'medium', 'high'];

      priorities.forEach((priority) => {
        const input: CreateTodoInput = {
          title: `${priority} 우선순위 Todo`,
          priority,
        };

        const todo = createTodo(input);
        expect(todo.priority).toBe(priority);
      });
    });

    it('빈 제목으로는 Todo를 생성할 수 없어야 한다', () => {
      const input: CreateTodoInput = {
        title: '',
        priority: 'medium',
      };

      expect(() => createTodo(input)).toThrow('Todo 제목은 필수입니다');
    });

    it('공백만 있는 제목으로는 Todo를 생성할 수 없어야 한다', () => {
      const input: CreateTodoInput = {
        title: '   ',
        priority: 'medium',
      };

      expect(() => createTodo(input)).toThrow('Todo 제목은 필수입니다');
    });
  });

  describe('updateTodo', () => {
    let existingTodo: Todo;

    beforeEach(() => {
      existingTodo = {
        id: '1',
        title: '기존 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
    });

    it('Todo 제목을 업데이트해야 한다', () => {
      const updateInput: UpdateTodoInput = {
        title: '업데이트된 제목',
      };

      const updatedTodo = updateTodo(existingTodo, updateInput);

      expect(updatedTodo.title).toBe('업데이트된 제목');
      expect(updatedTodo.updatedAt).toEqual(mockDate);
      expect(updatedTodo.id).toBe(existingTodo.id);
      expect(updatedTodo.priority).toBe(existingTodo.priority);
      expect(updatedTodo.status).toBe(existingTodo.status);
    });

    it('Todo 우선순위를 업데이트해야 한다', () => {
      const updateInput: UpdateTodoInput = {
        priority: 'high',
      };

      const updatedTodo = updateTodo(existingTodo, updateInput);

      expect(updatedTodo.priority).toBe('high');
      expect(updatedTodo.updatedAt).toEqual(mockDate);
      expect(updatedTodo.title).toBe(existingTodo.title);
    });

    it('Todo 상태를 업데이트해야 한다', () => {
      const updateInput: UpdateTodoInput = {
        status: 'completed',
      };

      const updatedTodo = updateTodo(existingTodo, updateInput);

      expect(updatedTodo.status).toBe('completed');
      expect(updatedTodo.updatedAt).toEqual(mockDate);
    });

    it('여러 필드를 동시에 업데이트해야 한다', () => {
      const updateInput: UpdateTodoInput = {
        title: '새로운 제목',
        priority: 'low',
        status: 'completed',
      };

      const updatedTodo = updateTodo(existingTodo, updateInput);

      expect(updatedTodo.title).toBe('새로운 제목');
      expect(updatedTodo.priority).toBe('low');
      expect(updatedTodo.status).toBe('completed');
      expect(updatedTodo.updatedAt).toEqual(mockDate);
    });

    it('빈 제목으로 업데이트할 수 없어야 한다', () => {
      const updateInput: UpdateTodoInput = {
        title: '',
      };

      expect(() => updateTodo(existingTodo, updateInput)).toThrow(
        'Todo 제목은 필수입니다'
      );
    });

    it('변경사항이 없으면 기존 Todo를 반환해야 한다', () => {
      const updateInput: UpdateTodoInput = {};

      const updatedTodo = updateTodo(existingTodo, updateInput);

      expect(updatedTodo).toEqual(existingTodo);
    });
  });

  describe('toggleTodoStatus', () => {
    it('pending 상태를 completed로 토글해야 한다', () => {
      const todo: Todo = {
        id: '1',
        title: '테스트 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const toggledTodo = toggleTodoStatus(todo);

      expect(toggledTodo.status).toBe('completed');
      expect(toggledTodo.updatedAt).toEqual(mockDate);
      expect(toggledTodo.id).toBe(todo.id);
      expect(toggledTodo.title).toBe(todo.title);
      expect(toggledTodo.priority).toBe(todo.priority);
    });

    it('completed 상태를 pending으로 토글해야 한다', () => {
      const todo: Todo = {
        id: '1',
        title: '테스트 Todo',
        priority: 'medium',
        status: 'completed',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const toggledTodo = toggleTodoStatus(todo);

      expect(toggledTodo.status).toBe('pending');
      expect(toggledTodo.updatedAt).toEqual(mockDate);
    });
  });

  describe('validateTodo', () => {
    it('유효한 Todo 객체를 검증해야 한다', () => {
      const validTodo: Todo = {
        id: '1',
        title: '유효한 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      expect(validateTodo(validTodo)).toBe(true);
    });

    it('id가 없는 Todo를 거부해야 한다', () => {
      const invalidTodo = {
        title: '유효한 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      } as Todo;

      expect(validateTodo(invalidTodo)).toBe(false);
    });

    it('제목이 없는 Todo를 거부해야 한다', () => {
      const invalidTodo: Todo = {
        id: '1',
        title: '',
        priority: 'medium',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      expect(validateTodo(invalidTodo)).toBe(false);
    });

    it('잘못된 우선순위를 가진 Todo를 거부해야 한다', () => {
      const invalidTodo = {
        id: '1',
        title: '유효한 Todo',
        priority: 'invalid',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      } as unknown as Todo;

      expect(validateTodo(invalidTodo)).toBe(false);
    });

    it('잘못된 상태를 가진 Todo를 거부해야 한다', () => {
      const invalidTodo = {
        id: '1',
        title: '유효한 Todo',
        priority: 'medium',
        status: 'invalid',
        createdAt: mockDate,
        updatedAt: mockDate,
      } as unknown as Todo;

      expect(validateTodo(invalidTodo)).toBe(false);
    });

    it('createdAt이 Date 객체가 아닌 Todo를 거부해야 한다', () => {
      const invalidTodo = {
        id: '1',
        title: '유효한 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-01-01',
        updatedAt: mockDate,
      } as unknown as Todo;

      expect(validateTodo(invalidTodo)).toBe(false);
    });

    it('updatedAt이 Date 객체가 아닌 Todo를 거부해야 한다', () => {
      const invalidTodo = {
        id: '1',
        title: '유효한 Todo',
        priority: 'medium',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: '2024-01-01',
      } as unknown as Todo;

      expect(validateTodo(invalidTodo)).toBe(false);
    });
  });
});
