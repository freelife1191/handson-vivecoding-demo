import { describe, it, expect } from 'vitest';
import type { Todo } from '../../types';
import {
  sortTodosByPriority,
  sortTodosByCreatedAt,
  sortTodosByUpdatedAt,
  sortTodosByTitle,
} from '../Todo';

describe('Todo 정렬 함수들', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Apple Todo',
      priority: 'low',
      status: 'pending',
      createdAt: new Date('2024-01-01T10:00:00.000Z'),
      updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    },
    {
      id: '2',
      title: 'Banana Todo',
      priority: 'high',
      status: 'completed',
      createdAt: new Date('2024-01-01T08:00:00.000Z'),
      updatedAt: new Date('2024-01-01T12:00:00.000Z'),
    },
    {
      id: '3',
      title: 'Cherry Todo',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2024-01-01T12:00:00.000Z'),
      updatedAt: new Date('2024-01-01T09:00:00.000Z'),
    },
  ];

  describe('sortTodosByPriority', () => {
    it('우선순위별로 내림차순 정렬해야 한다 (기본값)', () => {
      const sorted = sortTodosByPriority(mockTodos);

      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });

    it('우선순위별로 오름차순 정렬해야 한다', () => {
      const sorted = sortTodosByPriority(mockTodos, 'asc');

      expect(sorted[0].priority).toBe('low');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('high');
    });

    it('원본 배열을 변경하지 않아야 한다', () => {
      const original = [...mockTodos];
      sortTodosByPriority(mockTodos);

      expect(mockTodos).toEqual(original);
    });
  });

  describe('sortTodosByCreatedAt', () => {
    it('생성일시별로 내림차순 정렬해야 한다 (기본값)', () => {
      const sorted = sortTodosByCreatedAt(mockTodos);

      expect(sorted[0].id).toBe('3'); // 12:00
      expect(sorted[1].id).toBe('1'); // 10:00
      expect(sorted[2].id).toBe('2'); // 08:00
    });

    it('생성일시별로 오름차순 정렬해야 한다', () => {
      const sorted = sortTodosByCreatedAt(mockTodos, 'asc');

      expect(sorted[0].id).toBe('2'); // 08:00
      expect(sorted[1].id).toBe('1'); // 10:00
      expect(sorted[2].id).toBe('3'); // 12:00
    });
  });

  describe('sortTodosByUpdatedAt', () => {
    it('수정일시별로 내림차순 정렬해야 한다 (기본값)', () => {
      const sorted = sortTodosByUpdatedAt(mockTodos);

      expect(sorted[0].id).toBe('2'); // 12:00
      expect(sorted[1].id).toBe('1'); // 10:00
      expect(sorted[2].id).toBe('3'); // 09:00
    });

    it('수정일시별로 오름차순 정렬해야 한다', () => {
      const sorted = sortTodosByUpdatedAt(mockTodos, 'asc');

      expect(sorted[0].id).toBe('3'); // 09:00
      expect(sorted[1].id).toBe('1'); // 10:00
      expect(sorted[2].id).toBe('2'); // 12:00
    });
  });

  describe('sortTodosByTitle', () => {
    it('제목별로 오름차순 정렬해야 한다 (기본값)', () => {
      const sorted = sortTodosByTitle(mockTodos);

      expect(sorted[0].title).toBe('Apple Todo');
      expect(sorted[1].title).toBe('Banana Todo');
      expect(sorted[2].title).toBe('Cherry Todo');
    });

    it('제목별로 내림차순 정렬해야 한다', () => {
      const sorted = sortTodosByTitle(mockTodos, 'desc');

      expect(sorted[0].title).toBe('Cherry Todo');
      expect(sorted[1].title).toBe('Banana Todo');
      expect(sorted[2].title).toBe('Apple Todo');
    });

    it('대소문자를 구분하지 않고 정렬해야 한다', () => {
      const todosWithMixedCase: Todo[] = [
        {
          id: '1',
          title: 'apple todo',
          priority: 'low',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'BANANA TODO',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          title: 'Cherry Todo',
          priority: 'high',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const sorted = sortTodosByTitle(todosWithMixedCase);

      expect(sorted[0].title).toBe('apple todo');
      expect(sorted[1].title).toBe('BANANA TODO');
      expect(sorted[2].title).toBe('Cherry Todo');
    });
  });
});
