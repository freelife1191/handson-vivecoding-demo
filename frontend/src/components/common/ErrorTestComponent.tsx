import { useState } from 'react';
import { Button, Group } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';

/**
 * 에러 바운더리 테스트를 위한 컴포넌트
 * - 렌더링 중에 에러를 발생시켜 ErrorBoundary가 포착할 수 있도록 함
 * - 개발/테스트 목적으로만 사용
 */
export function ErrorTestComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // 개발 모드에서만 표시
  if (!import.meta.env.DEV) {
    return null;
  }

  // 렌더링 중에 에러 발생
  if (shouldThrow) {
    throw new Error(
      '테스트용 에러입니다! 에러 바운더리가 정상적으로 작동하고 있습니다.'
    );
  }

  return (
    <Group justify="center" mt="md">
      <Button
        leftSection={<IconBug size={16} />}
        onClick={() => setShouldThrow(true)}
        variant="outline"
        color="red"
        size="sm"
      >
        에러 바운더리 테스트 (렌더링 에러)
      </Button>
    </Group>
  );
}
