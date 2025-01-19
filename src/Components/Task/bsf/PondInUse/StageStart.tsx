import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../ReduxToolkit/Store";
import {
  getAvailablePonds,
  createStageStart,
  selectPondsAvailable,
} from "../../../../ReduxToolkit/Reducers/bsf/pondSlice";

interface StageStartProps {
  stage: "Incubation" | "Nursery" | "GrowOut" | "PrePuppa" | "Puppa";
  taskId: number;
  taskTitle: string;
  appName: string;
  modelName: string;
  activity: string;
  batch: string;
  company: string;
  branch: string;
}

const StageStart: React.FC<StageStartProps> = ({
  stage,
  taskId,
  taskTitle,
  appName,
  modelName,
  activity,
  batch,
  company,
  branch,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const pondsAvailable = useSelector(selectPondsAvailable);

  const [stageStarts, setStageStarts] = useState([
    {
      pond: "",
      startDate: "",
      startWeight: "",
      media: [{ title: "", file: null as File | null, comments: "" }],
    },
  ]);

  useEffect(() => {
    dispatch(getAvailablePonds({ company, branch }));
  }, [dispatch, company, branch]);

  const handleAddStageStart = () => {
    setStageStarts([
      ...stageStarts,
      { pond: "", startDate: "", startWeight: "", media: [{ title: "", file: null, comments: "" }] },
    ]);
  };

  const handleRemoveStageStart = (index: number) => {
    setStageStarts(stageStarts.filter((_, i) => i !== index));
  };

  const handleAddMedia = (stageIndex: number) => {
    const updated = [...stageStarts];
    updated[stageIndex].media.push({ title: "", file: null, comments: "" });
    setStageStarts(updated);
  };

  const handleRemoveMedia = (stageIndex: number, mediaIndex: number) => {
    const updated = [...stageStarts];
    updated[stageIndex].media = updated[stageIndex].media.filter((_, i) => i !== mediaIndex);
    setStageStarts(updated);
  };

  const handlePondChange = (stageIndex: number, value: string) => {
    const updated = [...stageStarts];
    updated[stageIndex].pond = value;
    setStageStarts(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      stage: 'Start',
      taskId,
      taskTitle,
      appName,
      modelName,
      activity,
      batch,
      branch,
      company,
      stageStarts,
    };

    console.log(formData);
    dispatch(createStageStart(formData));
  };

  return (
    <div
      className="p-6 overflow-y-auto max-h-[90vh] w-[90%] max-w-4xl mx-auto bg-white border border-gray-300 rounded shadow-lg"
    >
      <h1 className="text-2xl font-bold mb-4">{stage} Start Form</h1>

      <div className="mb-4">
        <p>
          <strong>Task Title:</strong> {taskTitle}
        </p>
        <p>
          <strong>Activity:</strong> {activity}
        </p>
        <p>
          <strong>Batch:</strong> {batch}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {stageStarts.map((stageStart, stageIndex) => (
          <div key={stageIndex} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">{stage} Start #{stageIndex + 1}</h2>
            <div className="mb-4">
              <label className="block mb-1">Pond</label>
              <select
                value={stageStart.pond}
                onChange={(e) => handlePondChange(stageIndex, e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a pond</option>
                {pondsAvailable.map((pond) => (
                  <option key={pond.pond.id} value={pond.pond.id}>
                    {pond.pond.pond_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={stageStart.startDate}
                onChange={(e) => {
                  const updated = [...stageStarts];
                  updated[stageIndex].startDate = e.target.value;
                  setStageStarts(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Start Weight (kg)</label>
              <input
                type="number"
                value={stageStart.startWeight}
                onChange={(e) => {
                  const updated = [...stageStarts];
                  updated[stageIndex].startWeight = e.target.value;
                  setStageStarts(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Media</h3>
              {stageStart.media.map((media, mediaIndex) => (
                <div key={mediaIndex} className="mb-4 border p-2 rounded bg-gray-100">
                  <label className="block mb-1">Media Title</label>
                  <input
                    type="text"
                    value={media.title}
                    onChange={(e) => {
                      const updated = [...stageStarts];
                      updated[stageIndex].media[mediaIndex].title = e.target.value;
                      setStageStarts(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media File</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const updated = [...stageStarts];
                      updated[stageIndex].media[mediaIndex].file = e.target.files?.[0] || null;
                      setStageStarts(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media Comments</label>
                  <textarea
                    value={media.comments}
                    onChange={(e) => {
                      const updated = [...stageStarts];
                      updated[stageIndex].media[mediaIndex].comments = e.target.value;
                      setStageStarts(updated);
                    }}
                    className="w-full border rounded px-3 py-2"
                  ></textarea>

                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(stageIndex, mediaIndex)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Remove Media
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddMedia(stageIndex)}
                className="text-blue-500 hover:underline"
              >
                + Add Media
              </button>
            </div>

            {stageIndex > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveStageStart(stageIndex)}
                className="text-red-500 hover:underline"
              >
                Remove {stage} Start
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddStageStart}
          className="text-blue-500 hover:underline mb-6"
        >
          + Add {stage} Start
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StageStart;
