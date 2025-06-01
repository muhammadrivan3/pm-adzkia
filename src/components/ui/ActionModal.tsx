import React from "react";
import { Button } from "@/components/ui/button";

// Action Modal Component
const ActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-4 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border-gray-300 rounded-md hover:bg-gray-200"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
