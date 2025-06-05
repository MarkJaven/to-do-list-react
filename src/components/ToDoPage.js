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
  Timestamp,
} from "firebase/firestore";

import {
  UserCircleIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
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

  // Dark mode
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme") === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Firestore tasks
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

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

  // -------------- UPDATED handleAdd --------------
  const handleAdd = async (text, dueDateString) => {
    // Convert dueDateString ("YYYY-MM-DD") to Firestore Timestamp
    let dueTimestamp = null;
    if (dueDateString) {
      // Firestore expects Timestamp
      dueTimestamp = Timestamp.fromDate(new Date(dueDateString + "T23:59:59"));
      // We add "T23:59:59" so that if user picks 2023-06-15, the due date includes the full day
    }

    await addDoc(collection(db, "tasks"), {
      uid: userId,
      text,
      completed: false,
      dueDate: dueTimestamp,       // can be null if no date chosen
      createdAt: Timestamp.now(),  // record creation time
    });
  };
  // ----------------------------------------------

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

  // Filter by “All / Active / Completed”
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleEditProfile = () => {
    alert("Edit Profile clicked! (Not implemented)");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* ─── Navbar ─── */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-200" />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {displayName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {email}
              </span>
            </div>
          </div>

          {/* Right: Dark Toggle, Edit, Logout */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
            >
              <PencilIcon className="w-5 h-5" />
              <span className="text-sm">Edit Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Main To‑Do Content ─── */}
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-center text-purple-600 dark:text-purple-400 mb-6">
            Your Tasks
          </h1>

          {/* Pass both text & date to handleAdd */}
          <AddTaskForm onAdd={handleAdd} />

          <FilterButtons
            currentFilter={filter}
            onChange={setFilter}
          />

          <TaskList
            tasks={filteredTasks}
            onToggle={(id, completed) =>
              handleToggle(id, completed)
            }
            onDelete={(id) => handleDelete(id)}
            onEdit={(id, newText) =>
              handleEdit(id, newText)
            }
          />
        </motion.div>
      </main>
    </div>
  );
}
