import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../ReduxToolkit/Store";
import {
  createStageEnd,
  fetchPondUseDetails,
  selectPondsAvailable,
} from "../../../../ReduxToolkit/Reducers/bsf/pondSlice";

interface StageEndProps {
  activity: "Incubation" | "Nursery" | "GrowOut" | "PrePuppa" | "Puppa";
  taskId: number;
  taskTitle: string;
  appName: string;
  modelName: string;
  batch: string;
  company: string;
  branch: string;
  modelID: string;
}

const StageEnd: React.FC<StageEndProps> = ({
  activity,
  taskId,
  taskTitle,
  appName,
  modelName,
  batch,
  company,
  branch,
  modelID,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const pondsAvailable = useSelector(selectPondsAvailable);

  const [stageEnds, setStageEnds] = useState([
    {
      pond: "",
      id: "",
      endDate: "",
      harvestWeight: "",
      media: [{ title: "", file: null as File | null, comments: "" }],
    },
  ]);

  useEffect(() => {
    dispatch(
      fetchPondUseDetails({
        company,
        branch,
        batch,
        id:modelID,
        status: "Ongoing",
      })
    );
    if (pondsAvailable && (pondsAvailable as any)["pondusestats"]) {
      const updated = [...stageEnds];
      updated[0].id = (pondsAvailable as any)["pondusestats"]["id"];
      updated[0].pond = (pondsAvailable as any)["pondusestats"]["pond"];
      setStageEnds(updated);
    }
    //console.log("Pond Use Details:", (pondsAvailable as any));
    //console.log("Pond Use Details:", (pondsAvailable as any)["pondusestats"]);
    
  }, [dispatch, company, branch, batch, modelID]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      stage: "End",
      taskId,
      taskTitle,
      appName,
      modelName,
      modelID,
      activity,
      batch,
      branch,
      company,
      stageEnds,
    };
    dispatch(createStageEnd(formData));
  };

  return (
    <div
      className="p-6 bg-white border rounded shadow-lg"
    >
      <h1 className="text-2xl font-bold mb-4">{activity} End Form</h1>

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
        {stageEnds.map((stageEnd, stageIndex) => (
          <div key={stageIndex} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">{activity} End #{stageIndex + 1}</h2>
            <div className="mb-4">
              <label className="block mb-1">Pond</label>
              <input
              type="text"
              value={(pondsAvailable as any)["pondusestats"]?.["pond_name"] || "pond_name"}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={stageEnd.endDate}
                onChange={(e) => {
                  const updated = [...stageEnds];
                  updated[stageIndex].endDate = e.target.value;
                  setStageEnds(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Harvest Weight (kg)</label>
              <input
                type="number"
                value={stageEnd.harvestWeight}
                onChange={(e) => {
                  const updated = [...stageEnds];
                  updated[stageIndex].harvestWeight = e.target.value;
                  setStageEnds(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Media</h3>
              {stageEnd.media.map((media, mediaIndex) => (
                <div key={mediaIndex} className="mb-4 border p-2 rounded bg-gray-100">
                  <label className="block mb-1">Media Title</label>
                  <input
                    type="text"
                    value={media.title}
                    onChange={(e) => {
                      const updated = [...stageEnds];
                      updated[stageIndex].media[mediaIndex].title = e.target.value;
                      setStageEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media File</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const updated = [...stageEnds];
                      updated[stageIndex].media[mediaIndex].file = e.target.files?.[0] || null;
                      setStageEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media Comments</label>
                  <textarea
                    value={media.comments}
                    onChange={(e) => {
                      const updated = [...stageEnds];
                      updated[stageIndex].media[mediaIndex].comments = e.target.value;
                      setStageEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2"
                  ></textarea>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...stageEnds];
                      updated[stageIndex].media = updated[stageIndex].media.filter((_, i) => i !== mediaIndex);
                      setStageEnds(updated);
                    }}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Remove Media
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [...stageEnds];
                  updated[stageIndex].media.push({ title: "", file: null, comments: "" });
                  setStageEnds(updated);
                }}
                className="text-blue-500 hover:underline"
              >
                + Add Media
              </button>
            </div>

            {stageIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  const updated = [...stageEnds];
                  updated.splice(stageIndex, 1);
                  setStageEnds(updated);
                }}
                className="text-red-500 hover:underline"
              >
                Remove {activity} End
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const updated = [...stageEnds];
            updated.push({ pond: "", id:"", endDate: "", harvestWeight: "", media: [{ title: "", file: null, comments: "" }] });
            setStageEnds(updated);
          }}
          className="text-blue-500 hover:underline mb-6"
        >
          + Add {activity} End
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

export default StageEnd;
