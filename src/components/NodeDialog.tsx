import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface NodeDialogProps {
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  initialData?: {
    name: string;
    description: string;
  };
  mode?: 'create' | 'edit';
}

export function NodeDialog({ onClose, onSubmit, initialData, mode = 'create' }: NodeDialogProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-neutral-900 p-6 rounded-lg shadow-lg text-white w-96 border-neutral-700">
        <h3 className="text-teal-400 font-semibold text-lg mb-4">
          {mode === 'create' ? 'Add New Node' : 'Edit Node'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Node Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-neutral-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-neutral-700"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                {mode === 'create' ? 'Add Node' : 'Update Node'}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}