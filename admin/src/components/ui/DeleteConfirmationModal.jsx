import React from "react";
import { X, AlertTriangle } from "lucide-react";
import Button from "./Button";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="bg-ni-pink p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertTriangle size={32} className="text-black" />
          </div>

          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Delete {itemName}?
          </h2>

          <p className="text-gray-600 font-medium text-lg">
            Are you sure you want to delete this? This action cannot be undone.
          </p>

          <div className="flex gap-4 w-full pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-black hover:bg-gray-100"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  hover:-translate-y-0.5 transition-all"
            >
              YES, DELETE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
