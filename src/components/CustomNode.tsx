import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
  data: {
    label: string;
    description?: string;
    onNodeClick?: () => void;
  };
}

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <div 
      className="px-4 py-2 shadow-md rounded-md bg-neutral-800 border-2 border-teal-500 min-w-[150px] cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
      onClick={data.onNodeClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-teal-500" />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-white">{data.label}</div>
        {data.description && (
          <div className="text-sm text-neutral-400">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-teal-500" />
    </div>
  );
}