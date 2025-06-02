// src/components/ToDoPage.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Heroicons
import {
  UserCircleIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Framer Motion
import { motion } from "framer-motion";

import AddTaskForm from "./AddTaskForm";
import FilterButtons from "./FilterButtons";
import TaskList from "./TaskList";
import { useAuth } from "./AuthProvider";

export default function ToDoPage() {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const displayName = currentUser.displayName || currentUser.email;
  const email = currentUser.email;

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  // Subscribe to Firestore "tasks" collection for this user
  useEffect(() => {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("uid", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTasks(loaded);
    });
    return unsubscribe;
  }, [userId]);

  // CRUD operations
  const handleAdd = async (text) => {
    await addDoc(collection(db, "tasks"), {
      uid: userId,
      text,
      completed: false,
      createdAt: new Date(),
    });
  };

  const handleToggle = async (id, completed) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: !completed });
  };

  const handleEdit = async (id, newText) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { text: newText });
  };

  const handleDelete = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  // Apply filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  // Sign out
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Placeholder for “Edit Profile”
  const handleEditProfile = () => {
    alert("Edit Profile clicked! (Not implemented yet.)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ─── Sidebar (collapses to 16 w‑units, expands to 64) ─── */}
      <div className="group relative h-full">
        <aside
          className="
            w-16
            group-hover:w-64
            transition-all
            duration-300
            ease-in-out
            bg-white
            shadow-md
            p-6
            overflow-hidden
          "
        >
          {/* Avatar always visible */}
          <div className="flex flex-col items-center">
            <UserCircleIcon className="w-24 h-24 text-gray-300" />
          </div>

          {/* Fade in on hover */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-xl font-semibold text-center text-gray-800">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-center text-gray-500">{email}</p>

            <button
              onClick={handleEditProfile}
              className="mt-6 w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <PencilIcon className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>

            <div className="my-6 border-t border-gray-200"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ─── Main To‑Do Section ─── */}
      <main className="flex-grow p-8">
        <motion.div
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6">
            Your Tasks
          </h1>

          <AddTaskForm onAdd={handleAdd} />

          <FilterButtons currentFilter={filter} onChange={setFilter} />

          <TaskList
            tasks={filteredTasks}
            onToggle={(id, completed) => handleToggle(id, completed)}
            onDelete={(id) => handleDelete(id)}
            onEdit={(id, newText) => handleEdit(id, newText)}
          />
        </motion.div>
      </main>
    </div>
  );
}
