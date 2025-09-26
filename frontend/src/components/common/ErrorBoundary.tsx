import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group,
  useMantineColorScheme 
} from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 에러 바운더리 컴포넌트
 * - React 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착
 * - 에러 발생 시 대체 UI를 표시
 * - 에러 정보를 로깅하고 사용자에게 친화적인 메시지 제공
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 정보를 상태에 저장
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅 (실제 프로덕션에서는 에러 리포팅 서비스 사용)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

/**
 * 에러 발생 시 표시되는 폴백 UI 컴포넌트
 */
function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Container size="sm" py="xl">
      <Paper
        p="xl"
        radius="md"
        withBorder
        style={{
          backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
        }}
      >
        <Group justify="center" mb="md">
          <IconAlertTriangle 
            size={48} 
            color={colorScheme === 'dark' ? '#fa5252' : '#e03131'} 
          />
        </Group>

        <Title order={2} ta="center" mb="md" c="red">
          오류가 발생했습니다
        </Title>

        <Text ta="center" c="dimmed" mb="lg">
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
        </Text>

        {import.meta.env.DEV && error && (
          <Paper
            p="md"
            radius="sm"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : '#f8f9fa',
            }}
            mb="lg"
          >
            <Text size="sm" fw={500} mb="xs">
              개발 모드 - 에러 정보:
            </Text>
            <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
              {error.message}
            </Text>
            {error.stack && (
              <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }} mt="xs">
                {error.stack}
              </Text>
            )}
          </Paper>
        )}

        <Group justify="center">
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={onReset}
            variant="filled"
            color="blue"
          >
            다시 시도
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            color="gray"
          >
            페이지 새로고침
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
