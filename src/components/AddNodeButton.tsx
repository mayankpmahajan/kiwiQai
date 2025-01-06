import { PlusCircle } from 'lucide-react';

interface AddNodeButtonProps {
  onClick: () => void;
}

export function AddNodeButton({ onClick }: AddNodeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 right-4 p-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
      title="Add new node"
    >
      <PlusCircle size={24} />
    </button>
  );
}