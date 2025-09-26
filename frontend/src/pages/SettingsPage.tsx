import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Switch, 
  Group,
  Stack,
  Divider,
  useMantineColorScheme 
} from '@mantine/core';
import { IconSettings, IconBell, IconPalette, IconDatabase } from '@tabler/icons-react';

/**
 * 설정 페이지 컴포넌트
 * - 앱 설정 관리
 * - 테마, 알림, 데이터 관리 등의 설정 옵션 제공
 * - 사용자 경험 개선을 위한 다양한 설정
 */
export function SettingsPage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Container size="md" py="md">
      <Stack gap="lg">
        {/* 페이지 제목 */}
        <Title 
          order={1} 
          c={colorScheme === 'dark' ? 'white' : 'dark'}
          ta="center"
        >
          설정
        </Title>

        {/* 테마 설정 */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
          }}
        >
          <Group mb="md">
            <IconPalette size={24} color="#4a90e2" />
            <Title order={3}>테마 설정</Title>
          </Group>
          
          <Group justify="space-between" align="center">
            <div>
              <Text fw={500}>다크 모드</Text>
              <Text size="sm" c="dimmed">
                어두운 테마로 전환합니다
              </Text>
            </div>
            <Switch
              checked={colorScheme === 'dark'}
              onChange={toggleColorScheme}
              size="md"
            />
          </Group>
        </Paper>

        {/* 알림 설정 */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
          }}
        >
          <Group mb="md">
            <IconBell size={24} color="#fab005" />
            <Title order={3}>알림 설정</Title>
          </Group>
          
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={500}>할일 완료 알림</Text>
                <Text size="sm" c="dimmed">
                  할일을 완료했을 때 알림을 받습니다
                </Text>
              </div>
              <Switch size="md" defaultChecked />
            </Group>
            
            <Divider />
            
            <Group justify="space-between" align="center">
              <div>
                <Text fw={500}>일일 리마인더</Text>
                <Text size="sm" c="dimmed">
                  매일 할일 목록을 확인하도록 알림합니다
                </Text>
              </div>
              <Switch size="md" />
            </Group>
          </Stack>
        </Paper>

        {/* 데이터 관리 */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
          }}
        >
          <Group mb="md">
            <IconDatabase size={24} color="#40c057" />
            <Title order={3}>데이터 관리</Title>
          </Group>
          
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={500}>자동 저장</Text>
                <Text size="sm" c="dimmed">
                  변경사항을 자동으로 저장합니다
                </Text>
              </div>
              <Switch size="md" defaultChecked />
            </Group>
            
            <Divider />
            
            <Group justify="space-between" align="center">
              <div>
                <Text fw={500}>데이터 백업</Text>
                <Text size="sm" c="dimmed">
                  정기적으로 데이터를 백업합니다
                </Text>
              </div>
              <Switch size="md" defaultChecked />
            </Group>
          </Stack>
        </Paper>

        {/* 앱 정보 */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2c2e33' : '#fff',
          }}
        >
          <Group mb="md">
            <IconSettings size={24} color="#868e96" />
            <Title order={3}>앱 정보</Title>
          </Group>
          
          <Stack gap="xs">
            <Group justify="space-between">
              <Text c="dimmed">버전</Text>
              <Text fw={500}>1.0.0</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">빌드</Text>
              <Text fw={500}>2024.01.15</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">개발자</Text>
              <Text fw={500}>TODO App Team</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}


