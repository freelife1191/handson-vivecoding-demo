import { useState } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { TodoPage } from './TodoPage';
import { SettingsPage } from './SettingsPage';
import { NotFoundPage } from './NotFoundPage';

/**
 * 테스트용 페이지 컴포넌트
 * - 다양한 페이지들을 테스트할 수 있도록 페이지 전환 기능 제공
 * - 개발/테스트 목적으로만 사용
 */
export function TestPage() {
  const [currentPage, setCurrentPage] = useState<'todo' | 'settings' | '404'>('todo');

  // 개발 모드에서만 표시
  if (!import.meta.env.DEV) {
    return <TodoPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'todo':
        return <TodoPage />;
      case 'settings':
        return <SettingsPage />;
      case '404':
        return <NotFoundPage />;
      default:
        return <TodoPage />;
    }
  };

  return (
    <Stack gap="md">
      {/* 페이지 전환 버튼들 */}
      <Group justify="center" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Button
          variant={currentPage === 'todo' ? 'filled' : 'outline'}
          onClick={() => setCurrentPage('todo')}
          size="sm"
        >
          Todo 페이지
        </Button>
        <Button
          variant={currentPage === 'settings' ? 'filled' : 'outline'}
          onClick={() => setCurrentPage('settings')}
          size="sm"
        >
          설정 페이지
        </Button>
        <Button
          variant={currentPage === '404' ? 'filled' : 'outline'}
          onClick={() => setCurrentPage('404')}
          size="sm"
        >
          404 페이지
        </Button>
      </Group>

      {/* 현재 페이지 렌더링 */}
      {renderCurrentPage()}
    </Stack>
  );
}


