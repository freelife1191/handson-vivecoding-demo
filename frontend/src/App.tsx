import { Container, Title, Text, Button, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function App() {
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="xl">
        TODO 앱
      </Title>
      
      <Text size="lg" ta="center" c="dimmed" mb="xl">
        React + Vite + TypeScript + Mantine으로 구축된 TODO 애플리케이션
      </Text>

      <Group justify="center">
        <Button leftSection={<IconCheck size={16} />} variant="filled">
          시작하기
        </Button>
      </Group>
    </Container>
  );
}

export default App;
