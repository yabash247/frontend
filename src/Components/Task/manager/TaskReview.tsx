import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, selectTasks } from "../../../ReduxToolkit/Reducers/taskSlice"; // Adjust path to taskSlice
import { AppDispatch } from "../../../ReduxToolkit/Store"; // Adjust path to your store
import TaskModal from "./TaskModal";


const TaskReview: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks); // Select tasks from Redux state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTasks({ manager: true }));
  }, [dispatch]);

  const handleReviewClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="task-review">
      <h1 className="text-2xl font-bold mb-4">Tasks Needing Review</h1>
      <div className="task-list">
        {tasks.map((task: any) => (
          <div
            key={task.id}
            className="task-item border p-4 mb-2 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => handleReviewClick(task)}
            >
              Review
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && selectedTask && (
        <TaskModal task={selectedTask} onClose={closeModal} />
      )}
    </div>
  );
};

export default TaskReview;
