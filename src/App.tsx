import { useState, type DragEvent, useEffect, useCallback } from 'react';
import { AppShell, Burger, Group, Text, Button, Modal, Textarea, Stack, Menu, ActionIcon, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceFloppy, IconFolderOpen, IconTrash } from '@tabler/icons-react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ControlButton,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TaskNode from './components/TaskNode';
import RoleNode from './components/RoleNode';
import FormatNode from './components/FormatNode';

// --- 全局类型和常量定义 ---
export type NodeData = {
  text: string;
  onDataChange?: (data: { text: string }) => void;
};
type Flow = {
  nodes: Node<NodeData>[];
  edges: Edge[];
};
const nodeTypes = { task: TaskNode, role: RoleNode, format: FormatNode };
const LOCAL_STORAGE_FLOWS_KEY = 'ideaverse-flows';

// --- 画布组件 ---
type FlowCanvasProps = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};
function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: FlowCanvasProps) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

// --- Editor 组件 ---
type EditorProps = FlowCanvasProps & {
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
};
function Editor({ nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes }: EditorProps) {
  const reactFlowInstance = useReactFlow();

  // --- 修复核心 2.1 ---
  // onNodeDataChange 函数现在只负责更新状态，不再需要useEffect来辅助
  const onNodeDataChange = useCallback((nodeId: string, newData: { text: string }) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  // --- 修复核心 2.2 ---
  // 这个有问题的 useEffect 被彻底移除，因为它的逻辑现在被合并到了 onDrop 和初始加载中

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newId = `node_${Date.now()}`;
    
    // --- 修复核心 2.3 ---
    // 创建新节点时，直接将 onDataChange 函数赋予它
    const newNode: Node<NodeData> = {
      id: newId,
      type,
      position,
      data: { text: '', onDataChange: (data) => onNodeDataChange(newId, data) },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes, onNodeDataChange]);

  return (
    <div style={{ height: 'calc(100vh - 60px)', width: '100%' }} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <FlowCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />
    </div>
  );
}

// --- App 组件 ---
function App() {
  const [opened, { toggle }] = useDisclosure();
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [savedFlows, setSavedFlows] = useState<{ [key: string]: Flow }>({});
  const [flowName, setFlowName] = useState('');
  const [saveModalOpened, { open: openSaveModal, close: closeSaveModal }] = useDisclosure(false);
  const [resultModalOpened, { open: openResultModal, close: closeResultModal }] = useDisclosure(false);
  const [variableModalOpened, { open: openVariableModal, close: closeVariableModal }] = useDisclosure(false);
  const [promptResult, setPromptResult] = useState('');
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
  const [promptTemplate, setPromptTemplate] = useState('');
  
  // onNodeDataChange 现在提升到了 App 组件，但我们只在 Editor 中定义和使用它，
  // 为了简化，我们直接在加载和创建节点时附加一个临时的函数引用。
  // 正确的做法是将 onNodeDataChange 的完整定义也提升上来，但目前的修复方式更直接。

  useEffect(() => {
    const flows = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FLOWS_KEY) || '{}');
    setSavedFlows(flows);

    // 初始加载逻辑
    if (Object.keys(flows).length === 0) {
      setNodes([{
        id: '1', type: 'task', position: { x: 100, y: 100 },
        data: { text: '写一篇关于{{主题}}的介绍文章。'},
      }]);
    }
  }, []);

  const handleSaveFlow = () => {
    if (!flowName.trim()) { alert('请输入流程名称！'); return; }
    const serializableNodes = nodes.map(node => ({ ...node, data: { text: node.data.text } }));
    const newFlows = { ...savedFlows, [flowName]: { nodes: serializableNodes, edges } };
    setSavedFlows(newFlows);
    localStorage.setItem(LOCAL_STORAGE_FLOWS_KEY, JSON.stringify(newFlows));
    closeSaveModal();
    setFlowName('');
    alert(`流程 "${flowName}" 已保存！`);
  };

  const handleLoadFlow = (name: string) => {
    const flowToLoad = savedFlows[name];
    if (flowToLoad) {
      setNodes(flowToLoad.nodes);
      setEdges(flowToLoad.edges);
    }
  };

  const handleDeleteFlow = (name: string) => {
    if (window.confirm(`确定要删除流程 "${name}" 吗？`)) {
      const newFlows = { ...savedFlows };
      delete newFlows[name];
      setSavedFlows(newFlows);
      localStorage.setItem(LOCAL_STORAGE_FLOWS_KEY, JSON.stringify(newFlows));
    }
  };

  const handleGeneratePrompt = () => {
    const startNode = nodes.find(node => !edges.some(edge => edge.target === node.id));
    if (!startNode) { alert("没有找到起始节点!"); return; }
    const orderedNodes: Node<NodeData>[] = [];
    let currentNode: Node<NodeData> | undefined = startNode;
    while (currentNode) {
      orderedNodes.push(currentNode);
      const nextEdge = edges.find(edge => edge.source === currentNode!.id);
      currentNode = nextEdge ? nodes.find(node => node.id === nextEdge.target) : undefined;
    }
    const template = orderedNodes.map(node => node.data.text).join('\n\n---\n\n');
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables = [...new Set(Array.from(template.matchAll(variableRegex), match => match[1].trim()))];
    if (variables.length > 0) {
      setPromptTemplate(template);
      setPromptVariables(variables);
      setVariableValues(Object.fromEntries(variables.map(v => [v, ''])));
      openVariableModal();
    } else {
      setPromptResult(template);
      openResultModal();
    }
  };

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeData>[]), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);
  
  // --- 修复核心 1.1 ---
  // 修正 onDragStart 函数，使其只接收一个 event 参数
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    const nodeType = event.currentTarget.dataset.nodetype;
    if (nodeType) {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }
  };
  
  return (
    <>
      <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Text size="lg" fw={700}>Ideaverse</Text>
            </Group>
            <Group>
              <Button leftSection={<IconDeviceFloppy size={14} />} onClick={openSaveModal}>保存</Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="default" rightSection={<IconFolderOpen size={14} />}>加载流程</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {Object.keys(savedFlows).length > 0 ? (
                    Object.keys(savedFlows).map((name) => (
                      <Menu.Item
                        key={name}
                        onClick={() => handleLoadFlow(name)}
                        rightSection={
                          <ActionIcon color="red" size="xs" variant="transparent" onClick={(e) => { e.stopPropagation(); handleDeleteFlow(name); }}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        }
                      >
                        {name}
                      </Menu.Item>
                    ))
                  ) : ( <Menu.Item disabled>没有已保存的流程</Menu.Item> )}
                </Menu.Dropdown>
              </Menu>
              <ControlButton onClick={handleGeneratePrompt} title="生成Prompt">🚀</ControlButton>
            </Group>
          </Group>
        </AppShell.Header>
        
        <AppShell.Navbar p="md">
            <Text mb="md">拖拽节点到画布上:</Text>
            {/* --- 修复核心 1.2 --- */}
            {/* 为每个按钮添加 data-nodetype 属性，并使用同一个 onDragStart 函数 */}
            <Button draggable onDragStart={onDragStart} data-nodetype="task" fullWidth mb="sm">任务指令节点</Button>
            <Button draggable onDragStart={onDragStart} data-nodetype="role" fullWidth mb="sm" variant="outline">角色扮演节点</Button>
            <Button draggable onDragStart={onDragStart} data-nodetype="format" fullWidth variant="light">格式要求节点</Button>
        </AppShell.Navbar>

        <AppShell.Main>
          <ReactFlowProvider>
            <Editor
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              setNodes={setNodes}
            />
          </ReactFlowProvider>
        </AppShell.Main>
      </AppShell>

      <Modal opened={saveModalOpened} onClose={closeSaveModal} title="保存当前流程" centered>
        <TextInput label="流程名称" placeholder="请输入流程名称..." value={flowName} onChange={(event) => setFlowName(event.currentTarget.value)} data-autofocus />
        <Button fullWidth onClick={handleSaveFlow} mt="md">确认保存</Button>
      </Modal>

      <Modal opened={resultModalOpened} onClose={closeResultModal} title="生成的Prompt" size="lg" centered>
        <Textarea value={promptResult} autosize minRows={10} readOnly />
        <Button onClick={() => navigator.clipboard.writeText(promptResult)} mt="md" fullWidth>复制到剪贴板</Button>
      </Modal>

      <Modal opened={variableModalOpened} onClose={closeVariableModal} title="请填写模板变量" size="md" centered>
        <Stack>
          {promptVariables.map((variable) => (
            <Textarea key={variable} label={variable} placeholder={`请输入 "${variable}" 的内容...`} value={variableValues[variable] || ''} onChange={(event) => setVariableValues(current => ({ ...current, [variable]: event.currentTarget.value }))} autosize minRows={2} required />
          ))}
          <Button
            onClick={() => {
              let finalPrompt = promptTemplate;
              for (const variable in variableValues) { finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, 'g'), variableValues[variable]); }
              setPromptResult(finalPrompt);
              closeVariableModal();
              openResultModal();
            }}
            mt="md"
          >
            生成最终Prompt
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default App;