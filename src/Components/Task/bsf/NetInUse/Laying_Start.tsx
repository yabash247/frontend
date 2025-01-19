import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../ReduxToolkit/Store";
import {
  getNetAvailable,
  selectNetsAvailable,
  createLayStart,
} from "../../../../ReduxToolkit/Reducers/bsf/netSlice";

interface LayingStartProps {
  taskId: number;
  taskTitle: string;
  createdDate: string;
  appName: string;
  modelName: string;
  activity: string;
  batch: string;
  farm: string;
  company: string;
  branch: string;
}

const Laying_Start: React.FC<LayingStartProps> = ({
  taskId,
  taskTitle,
  createdDate,
  appName,
  modelName,
  activity,
  farm,
  batch,
  company,
  branch,
}) => {
  console.log(farm);
  const dispatch = useDispatch<AppDispatch>();
  const netsAvailable = useSelector(selectNetsAvailable);

  console.log(batch);
  

  const [layStarts, setLayStarts] = useState([
    {
      net: "",
      startDate: "",
      media: [{ title: "", file: null as File | null, comments: "" }],
    },
  ]);

  useEffect(() => {
    dispatch(getNetAvailable({ company, branch }));
    //console.log(netsAvailable);
  }, [dispatch, company, farm]);

  const handleAddLayStart = () => {
    setLayStarts([
      ...layStarts,
      { net: "", startDate: "", media: [{ title: "", file: null, comments: "" }] },
    ]);
  };

  const handleRemoveLayStart = (index: number) => {
    setLayStarts(layStarts.filter((_, i) => i !== index));
  };

  const handleAddMedia = (layIndex: number) => {
    const updated = [...layStarts];
    updated[layIndex].media.push({ title: "", file: null, comments: "" });
    setLayStarts(updated);
  };

  const handleRemoveMedia = (layIndex: number, mediaIndex: number) => {
    const updated = [...layStarts];
    updated[layIndex].media = updated[layIndex].media.filter((_, i) => i !== mediaIndex);
    setLayStarts(updated);
  };

  const handleNetChange = (layIndex: number, value: string) => {
    const updated = [...layStarts];
    updated[layIndex].net = value;
    setLayStarts(updated);
  };

  const getFilteredNets = (currentIndex: number) => {
    const selectedNets = layStarts
      .map((layStart, index) => (index !== currentIndex ? layStart.net : null))
      .filter(Boolean);
    return netsAvailable.filter((net) => !selectedNets.includes(net.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      taskId,
      taskTitle,
      createdDate,
      appName,
      modelName,
      activity,
      batch,
      branch,
      company,
      layStarts,
    };

    console.log(formData);
    dispatch(createLayStart(formData));
  };

  return (
    <div
      className="p-6 overflow-y-auto max-h-[90vh] w-[90%] max-w-4xl mx-auto bg-white border border-gray-300 rounded shadow-lg"
    >
      <h1 className="text-2xl font-bold mb-4">Laying Start Form</h1>
      
     

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
        {layStarts.map((layStart, layIndex) => (
          <div key={layIndex} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Lay Start #{layIndex + 1}</h2>
            <div className="mb-4">
              <label className="block mb-1">Net Number</label>
                <select
                value={layStart.net}
                onChange={(e) => handleNetChange(layIndex, e.target.value)}
                className="w-full border rounded px-3 py-2"
                >
                <option value="">Select a net</option>
                {getFilteredNets(layIndex).map((net) => (
                  <option key={net.id} value={net.id}>
                  {net.name}
                  </option>
                ))}
                </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={layStart.startDate}
                onChange={(e) => {
                  const updated = [...layStarts];
                  updated[layIndex].startDate = e.target.value;
                  setLayStarts(updated);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Media</h3>
              {layStart.media.map((media, mediaIndex) => (
                <div key={mediaIndex} className="mb-4 border p-2 rounded bg-gray-100">
                  <label className="block mb-1">Media Title</label>
                  <input
                    type="text"
                    value={media.title}
                    onChange={(e) => {
                      const updated = [...layStarts];
                      updated[layIndex].media[mediaIndex].title = e.target.value;
                      setLayStarts(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media File</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const updated = [...layStarts];
                      updated[layIndex].media[mediaIndex].file = e.target.files?.[0] || null;
                      setLayStarts(updated);
                    }}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />

                  <label className="block mb-1">Media Comments</label>
                  <textarea
                    value={media.comments}
                    onChange={(e) => {
                      const updated = [...layStarts];
                      updated[layIndex].media[mediaIndex].comments = e.target.value;
                      setLayStarts(updated);
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
                onClick={() => handleRemoveLayStart(layIndex)}
                className="text-red-500 hover:underline"
              >
                Remove Lay Start
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddLayStart}
          className="text-blue-500 hover:underline mb-6"
        >
          + Add Lay Start
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

export default Laying_Start;
