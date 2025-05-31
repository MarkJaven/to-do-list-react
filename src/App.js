import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const handleAddTask = () => {
    if (input.trim() !== "") {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>

        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l-md focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              onClick={() => toggleComplete(index)}
              className={`p-2 cursor-pointer border-b ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
