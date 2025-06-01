'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  statValue: string | number;
  statLabel: string;
  highlight?: string;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
  green: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
  red: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200',
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  color = 'blue',
  statValue,
  statLabel,
  highlight,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {highlight && (
          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-semibold">
            {highlight}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      <div className="mt-2">
        <p className="text-2xl font-bold">{statValue}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{statLabel}</p>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
