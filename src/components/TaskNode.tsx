import { Card, Group, Text, Textarea } from '@mantine/core';
import { IconAbc } from '@tabler/icons-react';
// ★★★ 核心修改1：只引入最基础的 NodeProps ★★★
import { Handle, Position, type NodeProps } from '@xyflow/react';

// ★★★ 核心修改2：函数签名大大简化，不再使用复杂的泛型 ★★★
function TaskNode({ data }: NodeProps) {
  // 因为 App.tsx 会保证传入的 data 是正确的，所以这里可以安全地使用
  const { text, onDataChange } = data;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 250 }}>
      <Handle type="target" position={Position.Left} />

      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <IconAbc size={16} />
          <Text fw={500}>任务指令</Text>
        </Group>
      </Card.Section>

      <Textarea
        className="nodrag nowheel"
        mt="md"
        placeholder="请输入具体的任务指令..."
        autosize
        minRows={3}
        value={text}
        onChange={(event) => onDataChange({ text: event.currentTarget.value })}
      />

      <Handle type="source" position={Position.Right} />
    </Card>
  );
}

export default TaskNode;