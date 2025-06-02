// src/components/TaskItem.js
import React, { useState } from "react";
import { CheckCircleIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(trimmed);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 w-full">
        {/* Complete Toggle */}
        <button onClick={onToggle} className="outline-none">
          {task.completed ? (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          ) : (
            <CheckCircleIcon className="w-6 h-6 text-gray-300 hover:text-gray-500 transition" />
          )}
        </button>

        {isEditing ? (
          <input
            className="flex-grow px-2 py-1 border rounded-md"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        ) : (
          <span
            className={`flex-grow ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.text}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="hover:text-gray-600 transition"
          >
            <PencilIcon className="w-5 h-5 text-gray-500" />
          </button>
        )}

        <button
          onClick={onDelete}
          className="hover:text-red-600 transition"
        >
          <TrashIcon className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
