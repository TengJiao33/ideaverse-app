import { Card, Group, Text, Textarea } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

// 定义 data 类型，并添加索引签名
type RoleNodeData = {
  text: string;
  // 根据 `&&` ，onDataChange 可能不存在，定义为可选属性 `?`
  onDataChange?: (data: { text: string }) => void;
} & Record<string, unknown>;

// 步骤2：定义完整的节点类型
type TRoleNode = Node<RoleNodeData>;

// 步骤3：在 NodeProps 中应用完整的节点类型
function RoleNode({ data }: NodeProps<TRoleNode>) {
  const { text, onDataChange } = data;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 250, background: '#e7f5ff' }}>
      <Handle type="target" position={Position.Left} />

      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <IconUserCircle size={16} />
          <Text fw={500}>角色扮演</Text>
        </Group>
      </Card.Section>

      <Textarea
        className="nodrag nowheel"
        mt="md"
        placeholder="请输入角色的详细设定，例如：你是一位资深的软件架构师..."
        autosize
        minRows={3}
        value={text}
        onChange={(event) => onDataChange && onDataChange({ text: event.currentTarget.value })}
      />

      <Handle type="source" position={Position.Right} />
    </Card>
  );
}

export default RoleNode;