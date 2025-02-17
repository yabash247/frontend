import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../ReduxToolkit/Store";
import {
  getTasks,
  selectTasks,
  selectTaskStatus,
  selectTask,
  clearSelectedTask
} from "../../ReduxToolkit/Reducers/taskSlice";

// Preload dynamic modules using glob patterns.
// Adjust the glob pattern and extensions as needed.
const pondStartModules = import.meta.glob('./*/PondInUse/StageStart.tsx');
const pondEndModules = import.meta.glob('./*/PondInUse/StageEnd.tsx');
// For the fallback case: assuming the path is: "./{appName}/{modelName}/{activity}.tsx"
const otherModules = import.meta.glob('./*/**/*.tsx');

type Task = {
  id: number;
  title: string;
  created_at: string;
  appName: string;
  modelName: string;
  activity: string;
  batch: string;
  company: string;
  description: string;
  branch: string;
};

const TaskTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  const taskStatus = useSelector(selectTaskStatus);
  const selectedTask = useSelector((state: any) => state.tasks.selectedTask as Task | null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  type DynamicComponentProps = {
    taskId: number;
    taskTitle: string;
    createdDate: string;
    appName: string;
    modelName: string;
    activity: string;
    batch: string;
    description: string;
    company: string;
    branch: string;
    modelID: string;
  };
  
  const [DynamicComponent, setDynamicComponent] = useState<React.FC<DynamicComponentProps> | null>(null);

  useEffect(() => {
    dispatch(getTasks({}));
  }, [dispatch]);

  const handleEdit = async (task: Task) => {
    dispatch(selectTask(task));
    setIsModalOpen(true);

    try {
      // If modelName is "PondUseStats", decide which component to load based on the status in the description
      if (task.modelName === "PondUseStats") {
        const statusMatch = task.description.match(/- Stats: (\w+)/);
        if (statusMatch && statusMatch[1] === "ongoing") {
          // Construct the key for the module
          const key = `./${task.appName}/PondInUse/StageStart.tsx`;
          if (pondStartModules[key]) {
            const module = await pondStartModules[key]();
            setDynamicComponent(() => (module as { default: React.FC<DynamicComponentProps> }).default);
          } else {
            console.error("Module not found for key:", key);
          }
        } else if (statusMatch && statusMatch[1] === "completed") {
          const key = `./${task.appName}/PondInUse/StageEnd.tsx`;
          if (pondEndModules[key]) {
            const module = await pondEndModules[key]();
            setDynamicComponent(() => (module as { default: React.FC<DynamicComponentProps> }).default);
          } else {
            console.error("Module not found for key:", key);
          }
        }
      } else {
        // Fallback: try to load a component from the path: ./{appName}/{modelName}/{activity}.tsx
        const key = `./${task.appName}/${task.modelName}/${task.activity}.tsx`;
        if (otherModules[key]) {
          const module = await otherModules[key]();
          setDynamicComponent(() => (module as { default: React.FC<DynamicComponentProps> }).default);
        } else {
          console.error("Module not found for key:", key);
        }
      }
    } catch (error) {
      console.error("Error loading component:", error);
      setDynamicComponent(() => () => <p>Error loading component</p>);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDynamicComponent(null);
    dispatch(clearSelectedTask());
  };

  const extractBatch = (description: string): string => {
    const match = description.match(/- Batch: (\w+)/);
    return match ? match[1] : "N/A";
  };

  const extractModelid = (description: string): string => {
    const match = description.match(/- model_id : (\w+)/);
    return match ? match[1] : "N/A";
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {taskStatus === "loading" && <p>Loading tasks...</p>}
      {taskStatus === "failed" && <p>Failed to load tasks.</p>}
      {taskStatus === "succeeded" && tasks.length === 0 && <p>No tasks found.</p>}
      {taskStatus === "succeeded" && tasks.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Task Title</th>
              <th className="border border-gray-300 px-4 py-2">Batch</th>
              <th className="border border-gray-300 px-4 py-2">Activity</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task) => (
              <tr key={task.id?.toString() || Math.random()} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{task.id?.toString() || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{task.title || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{extractBatch(task.description) || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{task.activity || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && selectedTask && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-3/4 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                ✕
              </button>
              {DynamicComponent && (
                <Suspense fallback={<p>Loading component...</p>}>
                  <DynamicComponent
                    taskId={selectedTask?.id || 0}
                    taskTitle={selectedTask?.title || ""}
                    createdDate={selectedTask?.created_at || ""}
                    appName={selectedTask?.appName || ""}
                    modelName={selectedTask?.modelName || ""}
                    modelID={extractModelid(selectedTask?.description) || ""}
                    activity={selectedTask?.activity || ""}
                    batch={extractBatch(selectedTask?.description) || ""}
                    company={selectedTask?.company || ""}
                    description={selectedTask?.description || ""}
                    branch={selectedTask?.branch || ""}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskTable;

