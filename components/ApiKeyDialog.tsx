/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {CheckCircleIcon, XCircleIcon} from './icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-w-md w-full p-8 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-8">{message}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg">
            <XCircleIcon className="w-6 h-6" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg">
            <CheckCircleIcon className="w-6 h-6" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
