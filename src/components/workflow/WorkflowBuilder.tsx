"use client"
import React, { JSX, useState, useCallback, useRef } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  OnConnect,
  useReactFlow,
  BuiltInNode
} from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import { CustomNode } from "@/components/CustomNode";
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
  const [vanishCanvas, setVanishCanvas] = useState(false);

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

  // const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const inputQuery = e.target.value;
  //   setQuery(inputQuery);

  //   if (inputQuery.includes("LinkedIn") && inputQuery.includes("enterprise")) {
  //     const newNodes = [
  //       { name: "LinkedIn Data", description: "Fetch data from LinkedIn" },
  //       { name: "Enterprise Filter", description: "Filter for enterprise customers" },
  //       { name: "Performance Analysis", description: "Analyze performance metrics" },
  //     ];
  //     setAnimationStart(true);
  //     setTimeout(() => {

  //       setNodes(newNodes);
  //       createFlowNodes(newNodes);

  //       console.log("nodes:", nodes);
  //       console.log("flow nodes:", flowNodes)
  //     }, 1000);
  //   }
  // };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputQuery = e.target.value;
    setQuery(inputQuery);

    // Define an array of keywords and corresponding descriptions
    const keywordNodes = [
      { keyword: "data", description: "Fetch data from LinkedIn" },
      { keyword: "filter", description: "Filter for enterprise customers" },
      { keyword: "metrics", description: "Analyze performance metrics" },
    ];

    // Initialize an array to hold the newly created nodes
    const newNodes: { name: string; description: string }[] = [];

    // Loop through each keyword and find the word before it
    keywordNodes.forEach(({ keyword, description }) => {
      // Split the query into words
      const words = inputQuery.split(" ");

      // Find the index of the keyword in the words array
      const keywordIndex = words.findIndex(word => word.toLowerCase() === keyword);

      if (keywordIndex > 0) {
        // If the keyword is found and there's a word before it, use that word as the node name
        const precedingWord = words[keywordIndex - 1];
        const nodeName = `${precedingWord} ${keyword.charAt(0) + keyword.slice(1)}`; // "Facebook Data" for example

        newNodes.push({
          name: nodeName,
          description,
        });
      }
    });

    // If we have new nodes to create, trigger animation and update state
    if (newNodes.length > 0) {
      setAnimationStart(true);
      setTimeout(() => {
        setNodes(newNodes);
        createFlowNodes(newNodes);

        // Debugging outputs
        console.log("nodes:", newNodes);
        console.log("flow nodes:", flowNodes);
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

  const handleNodeUpdate = (updatedData: any) => {
    // Log the selected node before updating
    console.log(selectedNode);
    let text = " "

    // Update the flow node with the new data
    setFlowNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          text = node.data.label;
          // If the node ID matches the selected node, update the label and description
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

    console.log("text", text)
    console.log("updatedData", updatedData.name)
    console.log("query", query)

    // Update the query with the new label
    // setQuery((prevQuery) => {
    //   if (selectedNode) {
    //     // Replace the old label with the new label in the query
    //     const updatedQuery = prevQuery.replace(text, updatedData.name);
    //     return updatedQuery;
    //   }
    //   return prevQuery;
    // });
    const updatedQuery = query.replace(text, updatedData.name);
    console.log("updatedQuery", updatedQuery);
    setQuery(updatedQuery);

    // Log the updated flow nodes (for debugging purposes)
    console.log(flowNodes);

    // Clear the selected node after the update
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
    setVanishCanvas(true);
    setTimeout(() => {
      setShowDashboard(true);

    }, 1000);
    // setIsQuerying(true);
    setPreviewData(generateChartData());
    setStats(generateNewStats());
  };

  const handleNewQuery = (): void => {
    setShowDashboard(false);
    setVanishCanvas(false);
    setQuery("");
    setNodes([]);
    setFlowNodes([]);
    setEdges([]);
  };

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // When a connection is dropped on the pane and it's not valid
      if (!connectionState.isValid) {
        const id = nodeNumber + 100;

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

        // Add new node to flowNodes state
        setFlowNodes((nds) => [...nds, newNode]);

        // Increment nodeNumber for next unique ID
        nodeNumber++;

        // Update edges with new edge between nodes
        setEdges((eds) =>
          [...eds, {
            id: `edge-${edgeNumber + 100}`,
            source: connectionState.fromNode.id,
            target: `node-${id}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#5eead4' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
          }]
        );

        // Increment edgeNumber for next unique edge ID
        edgeNumber++;

        // Append the label of the newly created node to the input query
        setQuery((prevQuery) => prevQuery + ' ' + newNode.data.label);
      }
    },
    [screenToFlowPosition, nodeNumber, edgeNumber, query]
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

          <p className={`text-neutral-400 max-w-lg mx-auto mb-6 text-base md:text-lg text-center relative z-10 leading-relaxed ${start ? 'animate-buttonVanishAnimation' : 'animate-none'
            }`}>
            Use natural language to build workflows that analyze your marketing data.
            Watch as your query translates into actionable insights in real-time.
          </p>

          <button
            onClick={handleStart}
            className={`mt-2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 transition duration-200 ease-in-out shadow-lg
            ${start ? 'animate-buttonVanishAnimation' : 'block'}`}>
            Let's get started!
          </button>

          {(
            <div className={`relative w-full max-w-[45vw] mx-auto ${start ? 'animate-inputToBottomAnimation' : 'hidden'
              } ${vanishCanvas ? 'hidden' : 'block'}`}>
              <input
                type="text"
                placeholder="e.g., Show me LinkedIn performance for enterprise customers"
                value={query}
                onChange={handleQueryChange}
                className={`w-full py-3 px-5 rounded-full border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 transition duration-200 ease-in-out shadow-md ${vanishCanvas ? 'hidden' : 'block'}`}
              />
              <button
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 transition duration-200 ease-in-out shadow-lg"
              >
                {vanishCanvas ? 'New Query' : 'Submit'}
              </button>
            </div>
          )}

          {vanishCanvas && (
            <button onClick={handleNewQuery} className="relative top-[26vh] bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 -z-30">
              New Query
            </button>
          )}

          {showNodes && !showDashboard && (
            <div className={`absolute w-full max-w-4xl mx-auto  ${vanishCanvas ? 'animate-slideLeft' : 'animate-slideIn'}`}>
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
                  <MiniMap onNodeClick={(node) => { console.log(node) }} />
                </ReactFlow>
              </div>


              {/* <button
                onClick={() => setShowAddNodeDialog(true)}
                className="absolute bottom-20 right-4 p-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
                title="Add new node"
              >
                <PlusCircle size={24} />
              </button> */}
            </div>
          )}
        </div>

        {showDashboard && (
          <div className={`flex justify-center items-center w-full top-[20vh] absolute ${vanishCanvas ? 'animate-slideInFromLeft' : 'animate-none'} `}>

            <div className="w-full max-w-4xl top-[20vh]">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 ">
                <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                  <h3 className="text-teal-400 text-sm font-medium">Engagement Rate</h3>
                  <p className="text-2xl font-bold mt-2 text-white">{stats.engagementRate}%</p>
                </Card>
                <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                  <h3 className="text-teal-400 text-sm font-medium">Click-Through Rate</h3>
                  <p className="text-2xl font-bold mt-2 text-white">{stats.clickThroughRate}%</p>
                </Card>
                <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                  <h3 className="text-teal-400 text-sm font-medium">Conversions</h3>
                  <p className="text-2xl font-bold mt-2 text-white">{stats.conversions}</p>
                </Card>
                <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
                  <h3 className="text-teal-400 text-sm font-medium">Growth</h3>
                  <p className="text-2xl font-bold mt-2 text-white">+{stats.growth}%</p>
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