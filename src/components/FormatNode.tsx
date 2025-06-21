import { Card, Group, Text, Textarea } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

// 定义 data 类型，并添加索引签名
type FormatNodeData = {
  text: string;
  //  `&&` 写法，onDataChange 可能不存在
  onDataChange?: (data: { text: string }) => void;
} & Record<string, unknown>;

// 定义完整的节点类型
type TFormatNode = Node<FormatNodeData>;

// 在 NodeProps 中应用完整的节点类型
function FormatNode({ data }: NodeProps<TFormatNode>) {
  const { text, onDataChange } = data;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 250, background: '#f0fdf4' }}>
      <Handle type="target" position={Position.Left} />

      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <IconFileText size={16} />
          <Text fw={500}>格式要求</Text>
        </Group>
      </Card.Section>

      <Textarea
        className="nodrag nowheel"
        mt="md"
        placeholder="请规定输出的具体格式，例如：使用Markdown的表格，或输出JSON对象..."
        autosize
        minRows={3}
        value={text}
        onChange={(event) => onDataChange && onDataChange({ text: event.currentTarget.value })}
      />

      <Handle type="source" position={Position.Right} />
    </Card>
  );
}

export default FormatNode;