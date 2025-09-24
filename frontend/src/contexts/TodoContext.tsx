import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { Todo, CreateTodoInput } from '../types';
import { todoReducer } from './TodoReducer';
import { createTodo } from '../models/Todo.js';
import { STORAGE_KEYS } from '../types';

/**
 * Todo Context의 상태 타입
 */
interface TodoContextState {
  /** Todo 목록 */
  todos: Todo[];
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * Todo Context의 액션 함수들
 */
interface TodoContextActions {
  /** 새로운 Todo 추가 */
  addTodo: (input: CreateTodoInput) => void;
  /** 기존 Todo 업데이트 */
  updateTodo: (todo: Todo) => void;
  /** Todo 삭제 */
  deleteTodo: (id: string) => void;
  /** Todo 완료 상태 토글 */
  toggleTodo: (id: string) => void;
  /** Todo 목록 설정 */
  setTodos: (todos: Todo[]) => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * Todo Context 타입
 */
type TodoContextType = TodoContextState & TodoContextActions;

/**
 * Todo Context 생성
 */
const TodoContext = createContext<TodoContextType | undefined>(undefined);

/**
 * Todo Provider Props
 */
interface TodoProviderProps {
  children: ReactNode;
  /** 초기 Todo 목록 */
  initialTodos?: Todo[];
  /** 스토리지 키 (기본값: STORAGE_KEYS.TODOS) */
  storageKey?: string;
}

/**
 * Todo Provider 컴포넌트
 */
export function TodoProvider({
  children,
  initialTodos = [],
  storageKey = STORAGE_KEYS.TODOS,
}: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * 에러 처리 헬퍼 함수
   */
  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
    setError(errorMessage);
    console.error('Todo Context Error:', error);
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 새로운 Todo 추가
   */
  const addTodo = useCallback(
    (input: CreateTodoInput) => {
      try {
        setError(null);
        createTodo(input); // 유효성 검사를 위해 호출
        dispatch({ type: 'ADD_TODO', payload: input });
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  /**
   * 기존 Todo 업데이트
   */
  const updateTodoAction = useCallback(
    (todo: Todo) => {
      try {
        setError(null);
        dispatch({ type: 'UPDATE_TODO', payload: todo });
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  /**
   * Todo 삭제
   */
  const deleteTodo = useCallback(
    (id: string) => {
      try {
        setError(null);
        dispatch({ type: 'DELETE_TODO', payload: id });
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  /**
   * Todo 완료 상태 토글
   */
  const toggleTodo = useCallback(
    (id: string) => {
      try {
        setError(null);
        dispatch({ type: 'TOGGLE_TODO', payload: id });
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  /**
   * Todo 목록 설정
   */
  const setTodos = useCallback(
    (todos: Todo[]) => {
      try {
        setError(null);
        dispatch({ type: 'SET_TODOS', payload: todos });
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  /**
   * 로컬 스토리지에서 Todo 목록 로드
   */
  const loadTodosFromStorage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const todos = JSON.parse(storedData);
        // 날짜 문자열을 Date 객체로 변환
        const parsedTodos = todos.map((todo: Record<string, unknown>) => ({
          ...todo,
          createdAt: new Date(todo.createdAt as string),
          updatedAt: new Date(todo.updatedAt as string),
        }));
        dispatch({ type: 'SET_TODOS', payload: parsedTodos });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [storageKey, handleError]);

  /**
   * Todo 목록을 로컬 스토리지에 저장
   */
  const saveTodosToStorage = useCallback(
    async (todos: Todo[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(todos));
      } catch (error) {
        handleError(error);
      }
    },
    [storageKey, handleError]
  );

  /**
   * 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
   */
  useEffect(() => {
    if (initialTodos.length === 0) {
      loadTodosFromStorage();
    }
  }, [loadTodosFromStorage, initialTodos.length]);

  /**
   * Todo 상태 변경 시 로컬 스토리지에 저장
   */
  useEffect(() => {
    if (state.length > 0 || initialTodos.length === 0) {
      saveTodosToStorage(state);
    }
  }, [state, saveTodosToStorage, initialTodos.length]);

  /**
   * Context 값
   */
  const contextValue: TodoContextType = {
    todos: state,
    loading,
    error,
    addTodo,
    updateTodo: updateTodoAction,
    deleteTodo,
    toggleTodo,
    setTodos,
    clearError,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}

/**
 * Todo Context를 사용하는 커스텀 훅
 */
export function useTodoContext(): TodoContextType {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
}

/**
 * Todo Context의 특정 부분만 사용하는 커스텀 훅들
 */

/**
 * Todo 목록과 관련된 상태만 반환
 */
export function useTodoState() {
  const { todos, loading, error } = useTodoContext();
  return { todos, loading, error };
}

/**
 * Todo 액션 함수들만 반환
 */
export function useTodoActions() {
  const { addTodo, updateTodo, deleteTodo, toggleTodo, setTodos, clearError } =
    useTodoContext();
  return { addTodo, updateTodo, deleteTodo, toggleTodo, setTodos, clearError };
}

/**
 * 특정 ID의 Todo를 찾는 헬퍼 훅
 */
export function useTodo(id: string) {
  const { todos } = useTodoContext();
  return todos.find((todo) => todo.id === id);
}

/**
 * Todo 통계를 계산하는 헬퍼 훅
 */
export function useTodoStats() {
  const { todos } = useTodoContext();

  const stats = React.useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(
      (todo) => todo.status === 'completed'
    ).length;
    const pending = total - completed;

    const priorityCount = {
      low: todos.filter((todo) => todo.priority === 'low').length,
      medium: todos.filter((todo) => todo.priority === 'medium').length,
      high: todos.filter((todo) => todo.priority === 'high').length,
    };

    return {
      total,
      completed,
      pending,
      priorityCount,
    };
  }, [todos]);

  return stats;
}
