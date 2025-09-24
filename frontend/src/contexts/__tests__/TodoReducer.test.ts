import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Todo } from '../../types';
import type { TodoAction } from '../TodoAction';
import { todoReducer } from '../TodoReducer';
import {
  createAddTodoAction,
  createUpdateTodoAction,
  createDeleteTodoAction,
  createToggleTodoAction,
  createSetTodosAction,
} from '../TodoAction';

describe('TodoReducer', () => {
  let mockDate: Date;
  let mockTodos: Todo[];

  beforeEach(() => {
    mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    mockTodos = [
      {
        id: '1',
        title: '첫 번째 Todo',
        priority: 'high',
        status: 'pending',
        createdAt: new Date('2024-01-01T08:00:00.000Z'),
        updatedAt: new Date('2024-01-01T08:00:00.000Z'),
      },
      {
        id: '2',
        title: '두 번째 Todo',
        priority: 'medium',
        status: 'completed',
        createdAt: new Date('2024-01-01T09:00:00.000Z'),
        updatedAt: new Date('2024-01-01T10:00:00.000Z'),
      },
    ];
  });

  describe('ADD_TODO 액션', () => {
    it('새로운 Todo를 추가해야 한다', () => {
      const action = createAddTodoAction({
        title: '새로운 Todo',
        priority: 'low',
      });

      const newState = todoReducer(mockTodos, action);

      expect(newState).toHaveLength(3);
      expect(newState[2]).toMatchObject({
        title: '새로운 Todo',
        priority: 'low',
        status: 'pending',
      });
      expect(newState[2].id).toBeDefined();
      expect(newState[2].createdAt).toEqual(mockDate);
      expect(newState[2].updatedAt).toEqual(mockDate);
    });

    it('우선순위가 없으면 기본값 medium을 사용해야 한다', () => {
      const action = createAddTodoAction({
        title: '우선순위 없는 Todo',
      });

      const newState = todoReducer(mockTodos, action);

      expect(newState[2].priority).toBe('medium');
    });

    it('기존 Todo 목록을 변경하지 않아야 한다', () => {
      const originalTodos = [...mockTodos];
      const action = createAddTodoAction({
        title: '새로운 Todo',
        priority: 'high',
      });

      todoReducer(mockTodos, action);

      expect(mockTodos).toEqual(originalTodos);
    });
  });

  describe('UPDATE_TODO 액션', () => {
    it('기존 Todo를 업데이트해야 한다', () => {
      const updatedTodo: Todo = {
        ...mockTodos[0],
        title: '업데이트된 제목',
        priority: 'low',
        updatedAt: mockDate,
      };

      const action = createUpdateTodoAction(updatedTodo);
      const newState = todoReducer(mockTodos, action);

      expect(newState[0]).toEqual(updatedTodo);
      expect(newState[1]).toEqual(mockTodos[1]); // 다른 Todo는 변경되지 않음
    });

    it('존재하지 않는 Todo ID로 업데이트하면 변경되지 않아야 한다', () => {
      const nonExistentTodo: Todo = {
        id: 'non-existent',
        title: '존재하지 않는 Todo',
        priority: 'high',
        status: 'pending',
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const action = createUpdateTodoAction(nonExistentTodo);
      const newState = todoReducer(mockTodos, action);

      expect(newState).toEqual(mockTodos);
    });
  });

  describe('DELETE_TODO 액션', () => {
    it('지정된 ID의 Todo를 삭제해야 한다', () => {
      const action = createDeleteTodoAction('1');
      const newState = todoReducer(mockTodos, action);

      expect(newState).toHaveLength(1);
      expect(newState[0].id).toBe('2');
    });

    it('존재하지 않는 ID로 삭제하면 변경되지 않아야 한다', () => {
      const action = createDeleteTodoAction('non-existent');
      const newState = todoReducer(mockTodos, action);

      expect(newState).toEqual(mockTodos);
    });

    it('마지막 Todo를 삭제하면 빈 배열이 되어야 한다', () => {
      const singleTodo = [mockTodos[0]];
      const action = createDeleteTodoAction('1');
      const newState = todoReducer(singleTodo, action);

      expect(newState).toEqual([]);
    });
  });

  describe('TOGGLE_TODO 액션', () => {
    it('pending 상태를 completed로 토글해야 한다', () => {
      const action = createToggleTodoAction('1');
      const newState = todoReducer(mockTodos, action);

      expect(newState[0].status).toBe('completed');
      expect(newState[0].updatedAt).toEqual(mockDate);
      expect(newState[0].id).toBe('1');
      expect(newState[0].title).toBe('첫 번째 Todo');
      expect(newState[0].priority).toBe('high');
    });

    it('completed 상태를 pending으로 토글해야 한다', () => {
      const action = createToggleTodoAction('2');
      const newState = todoReducer(mockTodos, action);

      expect(newState[1].status).toBe('pending');
      expect(newState[1].updatedAt).toEqual(mockDate);
    });

    it('존재하지 않는 ID로 토글하면 변경되지 않아야 한다', () => {
      const action = createToggleTodoAction('non-existent');
      const newState = todoReducer(mockTodos, action);

      expect(newState).toEqual(mockTodos);
    });
  });

  describe('SET_TODOS 액션', () => {
    it('Todo 목록을 완전히 교체해야 한다', () => {
      const newTodos: Todo[] = [
        {
          id: '3',
          title: '새로운 목록의 Todo',
          priority: 'high',
          status: 'pending',
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const action = createSetTodosAction(newTodos);
      const newState = todoReducer(mockTodos, action);

      expect(newState).toEqual(newTodos);
      expect(newState).toHaveLength(1);
    });

    it('빈 배열로 설정할 수 있어야 한다', () => {
      const action = createSetTodosAction([]);
      const newState = todoReducer(mockTodos, action);

      expect(newState).toEqual([]);
    });

    it('기존 Todo 목록을 변경하지 않아야 한다', () => {
      const originalTodos = [...mockTodos];
      const newTodos: Todo[] = [
        {
          id: '3',
          title: '새로운 Todo',
          priority: 'medium',
          status: 'pending',
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const action = createSetTodosAction(newTodos);
      todoReducer(mockTodos, action);

      expect(mockTodos).toEqual(originalTodos);
    });
  });

  describe('알 수 없는 액션', () => {
    it('알 수 없는 액션 타입에 대해 기존 상태를 반환해야 한다', () => {
      const unknownAction = {
        type: 'UNKNOWN_ACTION',
        payload: 'test',
      } as unknown as TodoAction;

      const newState = todoReducer(mockTodos, unknownAction);

      expect(newState).toEqual(mockTodos);
    });
  });

  describe('빈 초기 상태', () => {
    it('빈 배열에서 시작하여 Todo를 추가할 수 있어야 한다', () => {
      const action = createAddTodoAction({
        title: '첫 번째 Todo',
        priority: 'high',
      });

      const newState = todoReducer([], action);

      expect(newState).toHaveLength(1);
      expect(newState[0].title).toBe('첫 번째 Todo');
    });
  });

  describe('불변성', () => {
    it('상태를 직접 변경하지 않고 새로운 배열을 반환해야 한다', () => {
      const action = createAddTodoAction({
        title: '새로운 Todo',
        priority: 'medium',
      });

      const newState = todoReducer(mockTodos, action);

      expect(newState).not.toBe(mockTodos);
      expect(newState[0]).toBe(mockTodos[0]); // 기존 객체는 재사용 가능
      expect(newState[1]).toBe(mockTodos[1]); // 기존 객체는 재사용 가능
      expect(newState[2]).not.toBe(mockTodos[0]); // 새로운 객체
    });

    it('업데이트 시 해당 Todo 객체만 새로 생성해야 한다', () => {
      const updatedTodo: Todo = {
        ...mockTodos[0],
        title: '업데이트된 제목',
        updatedAt: mockDate,
      };

      const action = createUpdateTodoAction(updatedTodo);
      const newState = todoReducer(mockTodos, action);

      expect(newState).not.toBe(mockTodos);
      expect(newState[0]).not.toBe(mockTodos[0]); // 업데이트된 객체는 새로 생성
      expect(newState[1]).toBe(mockTodos[1]); // 변경되지 않은 객체는 재사용
    });
  });
});
