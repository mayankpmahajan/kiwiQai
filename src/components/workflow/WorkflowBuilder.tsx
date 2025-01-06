"use client"
import React, { JSX, useState, useCallback, useRef } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  OnConnect,
  useReactFlow,
  ReactFlowProvider,
  BuiltInNode
} from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import { CustomNode } from "@/components/CustomNode";
import { AddNodeButton } from "@/components/AddNodeButton";
import { NodeDialog } from "@/components/NodeDialog";
import { PlusCircle } from "lucide-react";

interface WorkflowNode {
  name: string;
  description: string;
}

interface DashboardStats {
  engagementRate: number;
  clickThroughRate: number;
  conversions: number;
  growth: number;
}

const nodeTypes = {
  custom: CustomNode,
};

let edgeNumber = 0;
let nodeNumber = 0;

export default function WorkflowBuilder(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<BuiltInNode | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [animationStart, setAnimationStart] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [showNodes, setShowNodes] = useState<boolean>(false);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);

  // React Flow states
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const [stats, setStats] = useState<DashboardStats>({
    engagementRate: 0,
    clickThroughRate: 0,
    conversions: 0,
    growth: 0,
  });

  const generateChartData = () => {
    return Array.from({ length: 6 }, (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      value: Math.floor(Math.random() * 30) + 60,
    }));
  };

  const [previewData, setPreviewData] = useState(generateChartData());
  const reactFlowWrapper = useRef(null);

  const handleNodeClicked = useCallback((event, node) => {
    setSelectedNode(node);
    // setShowAddNodeDialog(true);
  }, []);

  // const onConnect = useCallback(
  //   (params: Connection) => setEdges((eds) => addEdge({
  //     ...params,
  //     type: 'smoothstep',
  //     animated: true,
  //     style: { stroke: '#5eead4' },
  //     markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
  //   }, eds)),
  //   [setEdges]
  // );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const createFlowNodes = (workflowNodes: WorkflowNode[]) => {
    const flowNodesList = workflowNodes.map((node, index) => ({
      id: `node-${index}`,
      type: 'custom',
      data: {
        label: node.name,
        description: node.description,
        onNodeClick: () => handleNodeClick(`node-${index}`)
      },
      position: { x: index * 250, y: 100 },
    }));

    setFlowNodes(flowNodesList);
    nodeNumber++;

    const flowEdges = workflowNodes.slice(0, -1).map((_, index) => ({
      id: `edge-${index}`,
      source: `node-${index}`,
      target: `node-${index + 1}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#5eead4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
    }));

    setEdges(flowEdges);
    edgeNumber++;
  };

  const nodeOrigin = [0.5, 0];
  const x = 10
  const handleAddNode = (name: string, description: string) => {
    if (selectedNode) {
      // Update existing node
      const updatedFlowNodes = flowNodes.map((node) => {
        if (node.data.label === selectedNode.name) {
          return {
            ...node,
            data: {
              ...node.data,
              label: name,
              description: description
            }
          };
        }
        return node;
      });
      setFlowNodes(updatedFlowNodes);
      nodeNumber++;
      setSelectedNode(null);
      edgeNumber++;
    } else {
      // Add new node
      const newNode: WorkflowNode = { name, description };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);

      const lastNodeIndex = flowNodes.length;
      const newFlowNode = {
        id: `node-${lastNodeIndex}`,
        type: 'custom',
        data: {
          label: name,
          description,
          onNodeClick: () => handleNodeClick(`node-${lastNodeIndex}`)
        },
        position: { x: lastNodeIndex * 250, y: 100 },
      };

      setFlowNodes((prev) => [...prev, newFlowNode]);
      nodeNumber++;

      if (lastNodeIndex > 0) {
        const newEdge = {
          id: `edge-${lastNodeIndex - 1}`,
          source: `node-${lastNodeIndex - 1}`,
          target: `node-${lastNodeIndex}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#5eead4' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
        };
        setEdges((prev) => [...prev, newEdge]);
        edgeNumber++;
      }
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputQuery = e.target.value;
    setQuery(inputQuery);

    if (inputQuery.includes("LinkedIn") && inputQuery.includes("enterprise")) {
      const newNodes = [
        { name: "LinkedIn Data", description: "Fetch data from LinkedIn" },
        { name: "Enterprise Filter", description: "Filter for enterprise customers" },
        { name: "Performance Analysis", description: "Analyze performance metrics" },
      ];
      setAnimationStart(true);
      setTimeout(() => {

        setNodes(newNodes);
        createFlowNodes(newNodes);

        console.log("nodes:", nodes);
        console.log("flow nodes:", flowNodes)
      }, 1000);
    }
  };

  const handleNodeModify = (index: string): void => {
    setSelectedNode(nodes[index]);
  };

  const handleNodeClick = (nodeId: string) => {
    console.log("click");
    const node = flowNodes.find((n) => n.id === nodeId);
    if (node) {
      setShowAddNodeDialog(true);
      // handleNodeModify(node)
      setSelectedNode(node);
    }
  };

  const handleNodeUpdate = (updatedData:any) => {
    console.log(selectedNode);
    setFlowNodes((nds) =>
      nds.map((node) => {
        console.log("node.id:", node.id)
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: updatedData.name,
              description: updatedData.description,
            },
          };
        }
        return node;
      })
    );
    console.log(flowNodes);
    setSelectedNode(null);
  };

  const generateNewStats = () => {
    return {
      engagementRate: Math.floor(Math.random() * 30) + 60,
      clickThroughRate: Math.floor(Math.random() * 15) + 15,
      conversions: Math.floor(Math.random() * 500) + 500,
      growth: Math.floor(Math.random() * 20) + 10,
    };
  };

  const handleStart = (): void => {
    setStart(!start);
    setTimeout(() => {
      setShowNodes(!showNodes);
    }, 1000);
  };

  const handleSubmit = (): void => {
    setShowDashboard(true);
    setIsQuerying(true);
    setPreviewData(generateChartData());
    setStats(generateNewStats());
  };

  const handleNewQuery = (): void => {
    setIsQuerying(false);
    setShowDashboard(false);
    setTimeout(() => {
      setQuery("");
      setNodes([]);
    }, 300);
  };

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = nodeNumber + 100;


        console.log(edgeNumber);
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id: `node-${id}`,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `node-${id}` },
        };

        setFlowNodes((nds) => [...nds, newNode]);
        nodeNumber++;
        setEdges((eds) =>
          [...eds, { id: `edge-${edgeNumber + 100}`, source: connectionState.fromNode.id, target: `node-${id}`, type: 'smoothstep', animated: true, style: { stroke: '#5eead4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' }, }]
        );
        edgeNumber++;

      }
    },
    [screenToFlowPosition],
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-neutral-950 overflow-hidden">
      <div className="absolute inset-0 z-10">
        <BackgroundBeams className="w-full h-full" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col text-white">
        <div className={`transition-all duration-700 ease-in-out transform ${animationStart ? "min-h-screen flex flex-col items-center justify-center px-4" :
          "min-h-screen flex flex-col items-center justify-center px-4"
          }`}>
          <div className="absolute top-0 left-0 text-3xl font-bold text-teal-400 font-mono bg-contain h-32 w-32 ">
            <img src="./kiwiQ.ai__1_-removebg-preview.png" alt="Logo" className="h-full w-full" />
          </div>

          <div className="absolute top-0 right-0 h-32 w-32">
            <img src="./avatar-removebg-preview.png" alt="@shadcn" />
          </div>

          <h1 className={`mt-10 text-5xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 font-sans font-bold tracking-tight text-center mb-2 transition-all duration-700  
          ${start ? 'animate-titleToTopAnimation' : 'animate-none'}`}>
            Dual Workflow Builder
          </h1>

          {!showDashboard && (
            <p className={`text-neutral-400 max-w-lg mx-auto mb-6 text-base md:text-lg text-center relative z-10 leading-relaxed ${start ? 'animate-buttonVanishAnimation' : 'animate-none'
              }`}>
              Use natural language to build workflows that analyze your marketing data.
              Watch as your query translates into actionable insights in real-time.
            </p>
          )}

          <button
            onClick={handleStart}
            className={`mt-2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 transition duration-200 ease-in-out shadow-lg
            ${start ? 'animate-buttonVanishAnimation' : 'block'}`}>
            Let's get started!
          </button>

          {!showDashboard && (
            <div className={`relative w-full max-w-md mx-auto ${start ? 'animate-inputToBottomAnimation' : 'animate-none hidden'
              }`}>
              <input
                type="text"
                placeholder="e.g., Show me LinkedIn performance for enterprise customers"
                value={query}
                onChange={handleQueryChange}
                className="w-full py-3 px-5 rounded-full border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 transition duration-200 ease-in-out shadow-md"
              />
              <button
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 transition duration-200 ease-in-out shadow-lg"
              >
                Submit
              </button>
            </div>
          )}

          {showNodes && (
            <div className="absolute w-full max-w-4xl mx-auto opacity-0 animate-slideIn">
              <div className="h-[400px] bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700 wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={flowNodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onConnectEnd={onConnectEnd}
                  fitView
                  colorMode="dark"
                  nodeOrigin={[0.5, 0]}
                  onNodeClick={handleNodeClicked}
                >
                  <Background />
                  <MiniMap onNodeClick={(node) => {console.log(node)}} />
                </ReactFlow>
              </div>


              <button
                onClick={() => setShowAddNodeDialog(true)}
                className="absolute bottom-20 right-4 p-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
                title="Add new node"
              >
                <PlusCircle size={24} />
              </button>
            </div>
          )}
        </div>

        {showDashboard && (
          <div className="max-w-4xl mx-auto w-full px-4 transition-all duration-1000 ease-in-out transform translate-y-0 opacity-100">
            <div className="h-[400px] mb-8 bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700">
              <ReactFlow
                nodes={flowNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background color="#5eead4" variant="dots" />
                <Controls className="bg-neutral-800 text-white border-neutral-700" />
                <MiniMap
                  nodeColor="#5eead4"
                  maskColor="rgba(0, 0, 0, 0.7)"
                  className="bg-neutral-800/50"
                />
                <AddNodeButton onClick={() => setShowAddNodeDialog(true)} />
              </ReactFlow>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                <h3 className="text-teal-400 text-sm font-medium">Engagement Rate</h3>
                <p className="text-2xl font-bold mt-2">{stats.engagementRate}%</p>
              </Card>
              <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                <h3 className="text-teal-400 text-sm font-medium">Click-Through Rate</h3>
                <p className="text-2xl font-bold mt-2">{stats.clickThroughRate}%</p>
              </Card>
              <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                <h3 className="text-teal-400 text-sm font-medium">Conversions</h3>
                <p className="text-2xl font-bold mt-2">{stats.conversions}</p>
              </Card>
              <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                <h3 className="text-teal-400 text-sm font-medium">Growth</h3>
                <p className="text-2xl font-bold mt-2">+{stats.growth}%</p>
              </Card>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
              <h2 className="text-lg font-semibold text-teal-400 mb-4">Performance Trends</h2>
              <div className="h-64 w-full">
                <LineChart width={800} height={240} data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#5eead4"
                    strokeWidth={2}
                    dot={{ fill: "#5eead4" }}
                    strokeLinecap="round"
                  />
                </LineChart>
              </div>
            </div>
          </div>
        )}

        <div className={`fixed bottom-0 left-0 right-0 p-4 bg-neutral-900 border-t border-neutral-800 transform transition-transform duration-500 ease-in-out ${isQuerying ? "translate-y-0" : "translate-y-full"
          }`}>
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Ask a follow-up question..."
              value={query}
              onChange={handleQueryChange}
              className="flex-grow py-3 px-5 rounded-full border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-6 py-2 transition duration-200"
            >
              Send
            </button>
          </div>
        </div>

        {showAddNodeDialog && (
          <NodeDialog
            onClose={() => {
              setShowAddNodeDialog(false);
              setSelectedNode(null);
            }}
            onSubmit={handleAddNode}
            initialData={selectedNode}
            mode={selectedNode ? 'edit' : 'create'}
          />
        )}

{selectedNode && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-neutral-900 p-6 rounded-lg shadow-lg text-white w-96 border-neutral-700">
            <h3 className="text-teal-400 font-semibold text-lg">Modify Node</h3>
            <div className="mt-4">
              <label className="text-neutral-400 text-sm">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-neutral-700"
                defaultValue={selectedNode.data.name}
                onChange={(e) =>
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, name: e.target.value }
                  })
                }
              />
            </div>
            <div className="mt-4">
              <label className="text-neutral-400 text-sm">Description</label>
              <textarea
                className="w-full mt-1 p-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-neutral-700"
                defaultValue={selectedNode.data.description}
                onChange={(e) =>
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, description: e.target.value }
                  })
                }
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleNodeUpdate(selectedNode.data)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Update
              </button>
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}