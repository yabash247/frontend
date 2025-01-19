import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../ReduxToolkit/Store";
import {
  fetchNetUseDetails,
  selectNets,
  createLayStart,
} from "../../../../ReduxToolkit/Reducers/bsf/netSlice";

interface LayingEndProps {
  taskId: number;
  taskTitle: string;
  appName: string;
  modelName: string;
  activity: string;
  batch: string;
  farm: string;
  company: string;
  branch: string;
  modelID: string;
}

const Laying_End: React.FC<LayingEndProps> = ({
  taskId,
  taskTitle,
  appName,
  modelName,
  activity,
  batch,
  farm,
  company,
  branch,
  modelID,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const nets = useSelector(selectNets);

  const [layEnds, setLayEnds] = useState([
    {
      net: "",
      endDate: "",
      harvestWeight: "",
      media: [{ title: "", file: null as File | null, comments: "" }],
    },
  ]);

  useEffect(() => {
    dispatch(
      fetchNetUseDetails({
        company,
        branch,
        batch,
        modelID,
        stats: "ongoing",
      })
    ).then((result) => {
      //console.log(result);
    });
  }, [dispatch, company, farm, batch]);

  const handleAddLayEnd = () => {
    setLayEnds([
      ...layEnds,
      { net: "", endDate: "", harvestWeight: "", media: [{ title: "", file: null, comments: "" }] },
    ]);
  };

  const handleRemoveLayEnd = (index: number) => {
    setLayEnds(layEnds.filter((_, i) => i !== index));
  };

  const handleAddMedia = (layIndex: number) => {
    const updated = [...layEnds];
    updated[layIndex].media.push({ title: "", file: null, comments: "" });
    setLayEnds(updated);
  };

  const handleRemoveMedia = (layIndex: number, mediaIndex: number) => {
    const updated = [...layEnds];
    updated[layIndex].media = updated[layIndex].media.filter((_, i) => i !== mediaIndex);
    setLayEnds(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      taskId,
      taskTitle,
      appName,
      modelName,
      modelID,
      activity,
      batch,
      branch,
      company,
      layEnds,
    };

    console.log("Form Data:",  formData);
    dispatch(createLayStart(formData));
  };

  //console.log(layEnds);
  

  return (
    <div
      className="p-6 overflow-y-auto max-h-[90vh] w-[90%] max-w-4xl mx-auto bg-white border border-gray-300 rounded shadow-lg"
    >
      <h1 className="text-2xl font-bold mb-4">Laying End Form</h1>

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
        {layEnds.map((layEnd, layIndex) => (
          <div key={layIndex} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Lay End #{layIndex + 1}</h2>
            <div className="mb-4">
              <label className="block mb-1">Net Number</label>
              <input
                type="text"
                value={nets[layIndex]?.net || ""}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={layEnd.endDate}
                onChange={(e) => {
                  const updated = [...layEnds];
                  updated[layIndex].endDate = e.target.value;
                  setLayEnds(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Harvest Weight (kg)</label>
              <input
                type="number"
                value={layEnd.harvestWeight}
                onChange={(e) => {
                  const updated = [...layEnds];
                  updated[layIndex].harvestWeight = e.target.value;
                  setLayEnds(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Media</h3>
              {layEnd.media.map((media, mediaIndex) => (
                <div key={mediaIndex} className="mb-4 border p-2 rounded bg-gray-100">
                  <label className="block mb-1">Media Title</label>
                  <input
                    type="text"
                    value={media.title}
                    onChange={(e) => {
                      const updated = [...layEnds];
                      updated[layIndex].media[mediaIndex].title = e.target.value;
                      setLayEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media File</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const updated = [...layEnds];
                      updated[layIndex].media[mediaIndex].file = e.target.files?.[0] || null;
                      setLayEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media Comments</label>
                  <textarea
                    value={media.comments}
                    onChange={(e) => {
                      const updated = [...layEnds];
                      updated[layIndex].media[mediaIndex].comments = e.target.value;
                      setLayEnds(updated);
                    }}
                    className="w-full border rounded px-3 py-2"
                  ></textarea>

                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(layIndex, mediaIndex)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Remove Media
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddMedia(layIndex)}
                className="text-blue-500 hover:underline"
              >
                + Add Media
              </button>
            </div>

            {layIndex > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveLayEnd(layIndex)}
                className="text-red-500 hover:underline"
              >
                Remove Lay End
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddLayEnd}
          className="text-blue-500 hover:underline mb-6"
        >
          + Add Lay End
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

export default Laying_End;
