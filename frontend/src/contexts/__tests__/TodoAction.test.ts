import { describe, it, expect } from 'vitest';
import type { Todo, CreateTodoInput } from '../../types';
import type { TodoAction } from '../TodoAction';

describe('TodoAction 타입', () => {
  const mockTodo: Todo = {
    id: '1',
    title: '테스트 Todo',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockCreateInput: CreateTodoInput = {
    title: '새 Todo',
    priority: 'high',
  };

  describe('ADD_TODO 액션', () => {
    it('올바른 ADD_TODO 액션을 생성해야 한다', () => {
      const action: TodoAction = {
        type: 'ADD_TODO',
        payload: mockCreateInput,
      };

      expect(action.type).toBe('ADD_TODO');
      expect(action.payload).toEqual(mockCreateInput);
    });

    it('ADD_TODO 액션의 payload는 CreateTodoInput 타입이어야 한다', () => {
      const action: TodoAction = {
        type: 'ADD_TODO',
        payload: {
          title: '새로운 Todo',
          priority: 'low',
        },
      };

      expect(action.payload.title).toBe('새로운 Todo');
      expect(action.payload.priority).toBe('low');
    });
  });

  describe('UPDATE_TODO 액션', () => {
    it('올바른 UPDATE_TODO 액션을 생성해야 한다', () => {
      const action: TodoAction = {
        type: 'UPDATE_TODO',
        payload: mockTodo,
      };

      expect(action.type).toBe('UPDATE_TODO');
      expect(action.payload).toEqual(mockTodo);
    });

    it('UPDATE_TODO 액션의 payload는 Todo 타입이어야 한다', () => {
      const action: TodoAction = {
        type: 'UPDATE_TODO',
        payload: {
          ...mockTodo,
          title: '업데이트된 제목',
        },
      };

      expect(action.payload.id).toBe(mockTodo.id);
      expect(action.payload.title).toBe('업데이트된 제목');
    });
  });

  describe('DELETE_TODO 액션', () => {
    it('올바른 DELETE_TODO 액션을 생성해야 한다', () => {
      const action: TodoAction = {
        type: 'DELETE_TODO',
        payload: 'todo-id-123',
      };

      expect(action.type).toBe('DELETE_TODO');
      expect(action.payload).toBe('todo-id-123');
    });

    it('DELETE_TODO 액션의 payload는 string 타입이어야 한다', () => {
      const todoId = 'unique-todo-id';
      const action: TodoAction = {
        type: 'DELETE_TODO',
        payload: todoId,
      };

      expect(typeof action.payload).toBe('string');
      expect(action.payload).toBe(todoId);
    });
  });

  describe('TOGGLE_TODO 액션', () => {
    it('올바른 TOGGLE_TODO 액션을 생성해야 한다', () => {
      const action: TodoAction = {
        type: 'TOGGLE_TODO',
        payload: 'todo-id-456',
      };

      expect(action.type).toBe('TOGGLE_TODO');
      expect(action.payload).toBe('todo-id-456');
    });

    it('TOGGLE_TODO 액션의 payload는 string 타입이어야 한다', () => {
      const todoId = 'toggle-todo-id';
      const action: TodoAction = {
        type: 'TOGGLE_TODO',
        payload: todoId,
      };

      expect(typeof action.payload).toBe('string');
      expect(action.payload).toBe(todoId);
    });
  });

  describe('SET_TODOS 액션', () => {
    it('올바른 SET_TODOS 액션을 생성해야 한다', () => {
      const todos: Todo[] = [mockTodo];
      const action: TodoAction = {
        type: 'SET_TODOS',
        payload: todos,
      };

      expect(action.type).toBe('SET_TODOS');
      expect(action.payload).toEqual(todos);
    });

    it('SET_TODOS 액션의 payload는 Todo 배열이어야 한다', () => {
      const todos: Todo[] = [
        mockTodo,
        {
          ...mockTodo,
          id: '2',
          title: '두 번째 Todo',
        },
      ];

      const action: TodoAction = {
        type: 'SET_TODOS',
        payload: todos,
      };

      expect(Array.isArray(action.payload)).toBe(true);
      expect(action.payload).toHaveLength(2);
      expect(action.payload[0]).toEqual(mockTodo);
    });

    it('빈 배열도 SET_TODOS 액션의 payload가 될 수 있다', () => {
      const action: TodoAction = {
        type: 'SET_TODOS',
        payload: [],
      };

      expect(action.type).toBe('SET_TODOS');
      expect(action.payload).toEqual([]);
      expect(action.payload).toHaveLength(0);
    });
  });

  describe('액션 타입 유니온', () => {
    it('모든 액션 타입이 올바르게 정의되어야 한다', () => {
      const actionTypes: TodoAction['type'][] = [
        'ADD_TODO',
        'UPDATE_TODO',
        'DELETE_TODO',
        'TOGGLE_TODO',
        'SET_TODOS',
      ];

      expect(actionTypes).toContain('ADD_TODO');
      expect(actionTypes).toContain('UPDATE_TODO');
      expect(actionTypes).toContain('DELETE_TODO');
      expect(actionTypes).toContain('TOGGLE_TODO');
      expect(actionTypes).toContain('SET_TODOS');
    });

    it('액션 타입은 리터럴 타입이어야 한다', () => {
      const addAction: TodoAction = {
        type: 'ADD_TODO',
        payload: mockCreateInput,
      };

      // 타입 체크: 'ADD_TODO'는 리터럴 타입이어야 함
      expect(addAction.type).toBe('ADD_TODO');

      // 다른 액션 타입으로 변경하면 타입 에러가 발생해야 함
      // (이는 TypeScript 컴파일러가 검증)
    });
  });
});
