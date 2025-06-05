// src/components/TaskList.js
import React from "react";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        No tasks yet. Add one!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden shadow-sm">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-700 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <TaskItem
              task={task}
              onToggle={() => onToggle(task.id, task.completed)}
              onDelete={() => onDelete(task.id)}
              onEdit={(newText) => onEdit(task.id, newText)}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
