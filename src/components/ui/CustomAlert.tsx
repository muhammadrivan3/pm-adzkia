'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import React from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface CustomAlertProps {
  type: AlertType;
  message: string;
  show: boolean;
  onClose?: () => void;
}

const iconMap = {
  success: <CheckCircle className="text-green-600" />,
  error: <AlertCircle className="text-red-600" />,
  info: <Info className="text-blue-600" />,
  warning: <AlertTriangle className="text-yellow-600" />,
};

const bgMap = {
  success: 'bg-green-50 border-green-600',
  error: 'bg-red-50 border-red-600',
  info: 'bg-blue-50 border-blue-600',
  warning: 'bg-yellow-50 border-yellow-600',
};

export default function CustomAlert({ type, message, show, onClose }: CustomAlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 right-6 z-50 max-w-xs w-full rounded-lg border-l-4 p-4 shadow-lg ${bgMap[type]}`}
        >
          <div className="flex items-start space-x-3">
            <div className="mt-1">{iconMap[type]}</div>
            <div className="flex-1 text-sm text-gray-800">{message}</div>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
