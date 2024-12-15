import GenericModal from "./GenericModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFarm } from "../services/api";
import { Leaf, Undo2Icon, TrashIcon } from "lucide-react";

interface DeleteFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteFarmModal: React.FC<DeleteFarmModalProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const queryClient = useQueryClient();

  const deleteFarmMutation = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      onClose();
    },
  });

  const handleDelete = () => {
    deleteFarmMutation.mutate(id);
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Delete Confirm?">
      <div>
        <p>This action cannot be undone!</p>
        <div className="flex flex-row justify-between w-full mt-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-transparent bg-indigo-100 text-indigo-950 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Undo2Icon className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default DeleteFarmModal;
