import React from "react";

interface TaskModalProps {
  task: any;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const parsedDetails = task.completeDetails
    .split("[")
    .filter((detail: string) => detail.trim() !== "")
    .map((detail: string) => detail.replace("]", "").trim());

  const handleApprove = () => {
    // Implement approval logic (e.g., dispatch an action)
    console.log("Approved Task:", task.id);
    onClose();
  };

  const handleReject = () => {
    // Implement rejection logic
    console.log("Rejected Task:", task.id);
    onClose();
  };

  const handleComment = () => {
    // Implement comment logic
    console.log("Commented on Task:", task.id);
    onClose();
  };

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-2/3 max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{task.title}</h2>
        <p className="mb-4">{task.description}</p>
        <h3 className="font-semibold">Completed Details:</h3>
        <ul className="list-disc ml-6 mb-4">
          {parsedDetails.map((detail: string, index: number) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
        <div className="modal-actions flex justify-end space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleComment}
          >
            Comment
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
