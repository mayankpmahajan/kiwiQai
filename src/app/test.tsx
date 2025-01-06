// "use client";

// import React, { JSX, useState, useCallback } from "react";
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import { Card } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import ReactFlow, {
//   Node,
//   Edge,
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Connection,
//   MarkerType,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// interface WorkflowNode {
//   name: string;
//   description: string;
// }

// interface DashboardStats {
//   engagementRate: number;
//   clickThroughRate: number;
//   conversions: number;
//   growth: number;
// }

// const nodeDefaults = {
//   sourcePosition: 'right',
//   targetPosition: 'left',
//   className: 'bg-neutral-800 text-white border-2 border-teal-500 rounded-lg p-4',
// };

// export default function WorkflowBuilder(): JSX.Element {
//   const [query, setQuery] = useState<string>("");
//   const [nodes, setNodes] = useState<WorkflowNode[]>([]);
//   const [showDashboard, setShowDashboard] = useState<boolean>(false);
//   const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
//   const [isQuerying, setIsQuerying] = useState<boolean>(false);
//   const [animationStart, setAnimationStart] = useState<boolean>(false);
  
//   // React Flow states
//   const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
//   const [stats, setStats] = useState<DashboardStats>({
//     engagementRate: 0,
//     clickThroughRate: 0,
//     conversions: 0,
//     growth: 0,
//   });

//   const generateChartData = () => {
//     return Array.from({ length: 6 }, (_, i) => ({
//       name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
//       value: Math.floor(Math.random() * 30) + 60,
//     }));
//   };

//   const [previewData, setPreviewData] = useState(generateChartData());

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge({
//       ...params,
//       type: 'smoothstep',
//       animated: true,
//       style: { stroke: '#5eead4' },
//       markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
//     }, eds)),
//     [setEdges]
//   );

//   const createFlowNodes = (workflowNodes: WorkflowNode[]) => {
//     const flowNodesList = workflowNodes.map((node, index) => ({
//       id: `node-${index}`,
//       data: { label: node.name },
//       position: { x: index * 250, y: 100 },
//       ...nodeDefaults,
//     }));

//     setFlowNodes(flowNodesList);

//     const flowEdges = workflowNodes.slice(0, -1).map((_, index) => ({
//       id: `edge-${index}`,
//       source: `node-${index}`,
//       target: `node-${index + 1}`,
//       type: 'smoothstep',
//       animated: true,
//       style: { stroke: '#5eead4' },
//       markerEnd: { type: MarkerType.ArrowClosed, color: '#5eead4' },
//     }));

//     setEdges(flowEdges);
//   };

//   const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const inputQuery = e.target.value;
//     setQuery(inputQuery);

//     if (inputQuery.includes("LinkedIn") && inputQuery.includes("enterprise")) {
//       const newNodes = [
//         { name: "LinkedIn Data", description: "Fetch data from LinkedIn" },
//         { name: "Enterprise Filter", description: "Filter for enterprise customers" },
//         { name: "Performance Analysis", description: "Analyze performance metrics" },
//       ];
//       setAnimationStart(true);
//       setTimeout(()=>{
//         setNodes(newNodes);
//         createFlowNodes(newNodes);
//       }, 1000)
      
//     } else {
//       setNodes([]);
//       setFlowNodes([]);
//       setEdges([]);
//     }
//   };

//   const handleNodeModify = (index: number): void => {
//     setSelectedNode(nodes[index]);
//   };

//   const handleNodeUpdate = (updatedNode: WorkflowNode): void => {
//     const updatedNodes = nodes.map((node) =>
//       node.name === updatedNode.name ? updatedNode : node
//     );
//     setNodes(updatedNodes);
//     setSelectedNode(null);
//   };

//   const generateNewStats = () => {
//     return {
//       engagementRate: Math.floor(Math.random() * 30) + 60,
//       clickThroughRate: Math.floor(Math.random() * 15) + 15,
//       conversions: Math.floor(Math.random() * 500) + 500,
//       growth: Math.floor(Math.random() * 20) + 10,
//     };
//   };

//   const handleSubmit = (): void => {
//     setShowDashboard(true);
//     setIsQuerying(true);
//     setPreviewData(generateChartData());
//     setStats(generateNewStats());
//   };

//   const handleNewQuery = (): void => {
//     setIsQuerying(false);
//     setShowDashboard(false);
//     setTimeout(() => {
//       setQuery("");
//       setNodes([]);
//     }, 300);
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col bg-neutral-950 overflow-hidden">
//       <div className="absolute inset-0 z-10">
//         <BackgroundBeams className="w-full h-full" />
//       </div>

//       <div className="relative z-10 flex-grow flex flex-col text-white">
//         <div className={`transition-all duration-700 ease-in-out transform ${
//           animationStart ? "translate-y-10 animate-in  duration-1000" : "min-h-screen flex flex-col items-center justify-center px-4"
//         }`}>
//           {/* Text-based logo in the top left */}
//           <div className="absolute top-0 left-0 text-3xl font-bold text-teal-400 font-mono bg-contain h-32 w-32 ">
//             <img src="./kiwiQ.ai__1_-removebg-preview.png" alt="Logo" className="h-full w-full" />
//           </div>

//           <div className="absolute top-0 right-0 h-32 w-32">
//             <img src="./avatar-removebg-preview.png" alt="@shadcn" />
//           </div>

//           <h1 className={`mt-10 text-5xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 font-sans font-bold tracking-tight text-center mb-6 transition-all duration-700  
//           `}>
//             Dual Workflow Builder
//           </h1>

//           {!showDashboard && !nodes.length && (
//             <p className="text-neutral-400 max-w-lg mx-auto mb-8 text-base md:text-lg text-center relative z-10 leading-relaxed">
//               Use natural language to build workflows that analyze your marketing data.
//               Watch as your query translates into actionable insights in real-time.
//             </p>
//           )}

//           {!showDashboard && (
//             <div className="relative w-full max-w-md mx-auto">
//               <input
//                 type="text"
//                 placeholder="e.g., Show me LinkedIn performance for enterprise customers"
//                 value={query}
//                 onChange={handleQueryChange}
//                 className="w-full py-3 px-5 rounded-full border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 transition duration-200 ease-in-out shadow-md"
//               />
//               <button
//                 onClick={handleSubmit}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-4 py-2 transition duration-200 ease-in-out shadow-lg"
//               >
//                 Submit
//               </button>
//             </div>
//           )}

//           {!showDashboard && nodes.length > 0 && (
//             <div className="w-full max-w-4xl mx-auto mt-8 transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
//               <div className="h-[400px] mb-8 bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700">
//                 <ReactFlow
//                   nodes={flowNodes}
//                   edges={edges}
//                   onNodesChange={onNodesChange}
//                   onEdgesChange={onEdgesChange}
//                   onConnect={onConnect}
//                   fitView
//                 >
//                   <Background color="#5eead4" variant="dots" />
//                   <Controls className="bg-neutral-800 text-white border-neutral-700" />
//                   <MiniMap 
//                     nodeColor="#5eead4"
//                     maskColor="rgba(0, 0, 0, 0.7)"
//                     className="bg-neutral-800/50"
//                   />
//                 </ReactFlow>
//               </div>

//               <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
//                 <h2 className="text-lg font-semibold text-teal-400 mb-4">Performance Preview</h2>
//                 <div className="h-64 w-full">
//                   <LineChart width={800} height={240} data={previewData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                     <XAxis dataKey="name" stroke="#888" />
//                     <YAxis stroke="#888" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1f2937",
//                         border: "1px solid #374151",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="value"
//                       stroke="#5eead4"
//                       strokeWidth={2}
//                       dot={{ fill: "#5eead4" }}
//                       strokeLinecap="round"
//                     />
//                   </LineChart>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {showDashboard && (
//           <div className="max-w-4xl mx-auto w-full px-4 transition-all duration-1000 ease-in-out transform translate-y-0 opacity-100">
//             <div className="h-[400px] mb-8 bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700">
//               <ReactFlow
//                 nodes={flowNodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 fitView
//               >
//                 <Background color="#5eead4" variant="dots" />
//                 <Controls className="bg-neutral-800 text-white border-neutral-700" />
//                 <MiniMap 
//                   nodeColor="#5eead4"
//                   maskColor="rgba(0, 0, 0, 0.7)"
//                   className="bg-neutral-800/50"
//                 />
//               </ReactFlow>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//               <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
//                 <h3 className="text-teal-400 text-sm font-medium">Engagement Rate</h3>
//                 <p className="text-2xl font-bold mt-2">{stats.engagementRate}%</p>
//               </Card>
//               <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
//                 <h3 className="text-teal-400 text-sm font-medium">Click-Through Rate</h3>
//                 <p className="text-2xl font-bold mt-2">{stats.clickThroughRate}%</p>
//               </Card>
//               <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
//                 <h3 className="text-teal-400 text-sm font-medium">Conversions</h3>
//                 <p className="text-2xl font-bold mt-2">{stats.conversions}</p>
//               </Card>
//               <Card className="p-4 bg-neutral-800/50 backdrop-blur-sm border-neutral-700">
//                 <h3 className="text-teal-400 text-sm font-medium">Growth</h3>
//                 <p className="text-2xl font-bold mt-2">+{stats.growth}%</p>
//               </Card>
//             </div>

//             <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-700">
//               <h2 className="text-lg font-semibold text-teal-400 mb-4">Performance Trends</h2>
//               <div className="h-64 w-full">
//                 <LineChart width={800} height={240} data={previewData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                   <XAxis dataKey="name" stroke="#888" />
//                   <YAxis stroke="#888" />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#1f2937",
//                       border: "1px solid #374151",
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#5eead4"
//                     strokeWidth={2}
//                     dot={{ fill: "#5eead4" }}
//                     strokeLinecap="round"
//                   />
//                 </LineChart>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className={`fixed bottom-0 left-0 right-0 p-4 bg-neutral-900 border-t border-neutral-800 transform transition-transform duration-500 ease-in-out ${
//           isQuerying ? "translate-y-0" : "translate-y-full"
//         }`}>
//           <div className="max-w-4xl mx-auto flex gap-2">
//             <input
//               type="text"
//               placeholder="Ask a follow-up question..."
//               value={query}
//               onChange={handleQueryChange}
//               className="flex-grow py-3 px-5 rounded-full border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
//             />
//             <button
//               onClick={handleSubmit}
//               className="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-6 py-2 transition duration-200"
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         {selectedNode && (
//           <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
//             <Card className="bg-neutral-900 p-6 rounded-lg shadow-lg text-white w-96 border-neutral-700">
//               <h3 className="text-teal-400 font-semibold text-lg">Modify Node</h3>
//               <p className="text-neutral-400 text-sm mt-2">{selectedNode.description}</p>
//               <textarea
//                 className="w-full mt-4 p-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-neutral-700"
//                 defaultValue={selectedNode.description}
//                 onChange={(e) =>
//                   setSelectedNode({ ...selectedNode, description: e.target.value })
//                 }
//               />
//               <div className="mt-4 flex justify-end space-x-2">
//                 <button
//                   onClick={() => setSelectedNode(null)}
//                   className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => selectedNode && handleNodeUpdate(selectedNode)}
//                   className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
//                 >
//                   Update
//                 </button>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
