import { Card, Group, Text, Textarea } from '@mantine/core';
import { IconAbc } from '@tabler/icons-react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

// 定义 data 对象的样子，并使用交叉类型 `&` 满足索引签名约束
type TaskNodeData = {
  text: string;
  onDataChange: (data: { text: string }) => void;
} & Record<string, unknown>;

// 创建一个完整的、具体的节点类型
type TTaskNode = Node<TaskNodeData>;

// 将完整的节点类型 TTaskNode 传递给 NodeProps
function TaskNode({ data }: NodeProps<TTaskNode>) {
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