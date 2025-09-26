import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group,
  useMantineColorScheme 
} from '@mantine/core';
import { IconHome, IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found 페이지 컴포넌트
 * - 존재하지 않는 경로에 접근했을 때 표시
 * - 홈으로 돌아가기, 이전 페이지로 돌아가기 기능 제공
 * - 사용자 친화적인 에러 메시지와 네비게이션 옵션
 */
export function NotFoundPage() {
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
          <IconSearch 
            size={64} 
            color={colorScheme === 'dark' ? '#868e96' : '#adb5bd'} 
          />
        </Group>

        <Title order={1} ta="center" mb="md" c="dimmed">
          404
        </Title>

        <Title order={2} ta="center" mb="md">
          페이지를 찾을 수 없습니다
        </Title>

        <Text ta="center" c="dimmed" mb="xl" size="lg">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 확인하시거나 아래 버튼을 이용해 이동해주세요.
        </Text>

        <Group justify="center" gap="md">
          <Button
            leftSection={<IconHome size={16} />}
            onClick={handleGoHome}
            variant="filled"
            color="blue"
            size="md"
          >
            홈으로 이동
          </Button>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            variant="outline"
            color="gray"
            size="md"
          >
            이전 페이지
          </Button>
        </Group>

        <Text ta="center" c="dimmed" size="sm" mt="xl">
          문제가 지속되면 관리자에게 문의해주세요.
        </Text>
      </Paper>
    </Container>
  );
}


