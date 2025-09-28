import { Box, Stack } from '@mantine/core';
import { useTodoState, useTodoActions, useTodoFilter } from '../hooks';
import { TodoProvider } from '../contexts';
import {
  TodoForm,
  TodoFilter as TodoFilterComponent,
  TodoList,
  TodoStats,
} from '../components/todo';
// import { ErrorTestButton, ErrorTestComponent } from '../components/common';
import type { CreateTodoInput, TodoFilter as TodoFilterType } from '../types';

/**
 * 메인 Todo 페이지 컴포넌트
 * - Todo CRUD 기능 통합
 * - 필터링 및 정렬 기능
 * - 반응형 레이아웃
 */
function TodoPageContent() {
  const { stats } = useTodoState();
  const { addTodo, deleteTodo, toggleTodo } = useTodoActions();
  const { filteredTodos, filter, setFilter } = useTodoFilter();

  const handleAddTodo = (data: CreateTodoInput) => {
    addTodo(data);
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
  };

  const handleEditTodo = (id: string) => {
    // TODO: 편집 모달 구현
    console.log('Edit todo:', id);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const handleFilterChange = (newFilter: TodoFilterType) => {
    setFilter(newFilter);
  };

  return (
    <Box
      style={{
        width: '100%',
        maxWidth: 'none',
        padding: '0',
      }}
    >
      <Stack gap="lg">
        {/* 통계 정보 */}
        <TodoStats stats={stats} />

        {/* 새 할일 추가 폼 */}
        <TodoForm onSubmit={handleAddTodo} />

        {/* 필터 및 검색 */}
        <TodoFilterComponent
          filter={filter}
          onFilterChange={handleFilterChange}
        />

        {/* 할일 목록 */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onEdit={handleEditTodo}
          onDelete={handleDeleteTodo}
        />

        {/* 개발용 에러 테스트 버튼들 - 필요시 주석 해제 */}
        {/* <ErrorTestButton />
        <ErrorTestComponent /> */}
      </Stack>
    </Box>
  );
}

/**
 * Todo 페이지 (Provider 포함)
 */
export function TodoPage() {
  return (
    <TodoProvider>
      <TodoPageContent />
    </TodoProvider>
  );
}
