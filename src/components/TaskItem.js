// src/components/TaskItem.js
import React, { useState } from "react";
import {
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(trimmed);
    setIsEditing(false);
  };

  // Process due date if present
  let dueDateDisplay = null;
  let isOverdue = false;
  if (task.dueDate) {
    const jsDate = task.dueDate.toDate(); // Firestore Timestamp → JS Date
    dueDateDisplay = jsDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const today = new Date();
    // Normalize today to midnight for accurate comparison
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (!task.completed && jsDate < todayMidnight) {
      isOverdue = true;
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top row: text + toggle + edit/delete */}
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex items-center space-x-2 w-full">
          {/* Toggle Completion */}
          <button onClick={onToggle} className="outline-none">
            {task.completed ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            ) : (
              <CheckCircleIcon className="w-6 h-6 text-gray-300 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition" />
            )}
          </button>

          {isEditing ? (
            <input
              className="
                flex-grow px-2 py-1 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-purple-500
                bg-white dark:bg-gray-600 dark:border-gray-500
                text-gray-800 dark:text-gray-100
              "
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <span
              className={`
                flex-grow
                ${task.completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-800 dark:text-gray-100"}
              `}
            >
              {task.text}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <PencilIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}

          <button
            onClick={onDelete}
            className="hover:text-red-600 dark:hover:text-red-400 transition"
          >
            <TrashIcon className="w-5 h-5 text-red-400 dark:text-red-500" />
          </button>
        </div>
      </div>

      {/* Bottom row: due date + overdue indicator */}
      {dueDateDisplay && (
        <div className="flex items-center space-x-1 ml-8">
          {isOverdue && (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          )}
          <span
            className={`
              text-sm
              ${isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-300"}
            `}
          >
            Due: {dueDateDisplay}
          </span>
        </div>
      )}
    </div>
  );
}
