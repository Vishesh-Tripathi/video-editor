import { Group, Button, Text } from '@mantine/core';
import './Topbar.css';

export default function TopBar() {
  return (
    <div className="top-bar">
      <Text>Project Name</Text>
      <Group spacing="xs">
        <Button variant="subtle" color="gray">
          Log in to save progress
        </Button>
        <Button color="orange">Upgrade</Button>
        <Button color="dark">Done</Button>
      </Group>
    </div>
  );
}