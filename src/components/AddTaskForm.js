// src/components/AddTaskForm.js
import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(""); // stores “YYYY-MM-DD”

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    // Pass both text and dueDate to the parent
    onAdd(trimmed, dueDate);
    setText("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {/* Task Text & Add Button */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="
            flex-grow px-4 py-2 border border-gray-300 rounded-l-full
            focus:outline-none focus:ring-2 focus:ring-purple-500
            bg-white dark:bg-gray-700 dark:border-gray-600
            text-gray-800 dark:text-gray-100
          "
        />
        <button
          type="submit"
          className="
            flex items-center space-x-1 bg-purple-600 hover:bg-purple-700
            text-white px-4 py-2 rounded-r-full transition shadow-md
            dark:bg-purple-500 dark:hover:bg-purple-600
          "
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>

      {/* Due Date Picker */}
      <div className="flex justify-end">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="
            px-3 py-2 border border-gray-300 rounded-full
            focus:outline-none focus:ring-2 focus:ring-purple-500
            bg-white dark:bg-gray-700 dark:border-gray-600
            text-gray-800 dark:text-gray-100
            w-auto
          "
        />
      </div>
    </form>
  );
}
