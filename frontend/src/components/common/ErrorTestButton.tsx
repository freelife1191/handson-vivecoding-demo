import { Button } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';

/**
 * 에러 바운더리 테스트를 위한 컴포넌트
 * - 개발/테스트 목적으로만 사용
 * - 버튼 클릭 시 의도적으로 에러를 발생시킴
 */
export function ErrorTestButton() {
  const throwError = () => {
    throw new Error(
      '테스트용 에러입니다! 에러 바운더리가 정상적으로 작동하고 있습니다.'
    );
  };

  // 개발 모드에서만 표시
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Button
      leftSection={<IconBug size={16} />}
      onClick={throwError}
      variant="outline"
      color="red"
      size="sm"
    >
      에러 바운더리 테스트
    </Button>
  );
}
