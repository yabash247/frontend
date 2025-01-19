import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserDetails,
  updateUserDetails,
  uploadProfileImage,
} from "../../ReduxToolkit/Reducers/userSlice";
import { AppDispatch } from "../../ReduxToolkit/Store";

interface UserDetailViewProps {
  userId: string;
}

  const UserDetailView: React.FC<UserDetailViewProps> = ({ userId }) => {
    const dispatch: AppDispatch = useDispatch();
  const { user, loading, error } = useSelector((state: { user: { user: any; loading: boolean; error: string } }) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  const handleChange = (field: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };


  

  const handleImageUpload = async () => {
    if (profileImage) {
      dispatch(uploadProfileImage({ userId, image: profileImage }));
    }
  };

  const handleSubmit = async () => {
    dispatch(updateUserDetails({ userId, updatedFields: editedFields }));
    setIsEditing(false);
    setEditedFields({});
    handleImageUpload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="space-y-4">
        {/* Profile Image */}
        <div>
          <label className="block font-semibold">Profile Image</label>
          <div className="flex items-center space-x-4">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfileImage(e.target.files[0]);
                  }
                }}
                className="border rounded p-2"
              />
            )}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label className="block font-semibold">Name</label>
          {isEditing ? (
            <input
              type="text"
              defaultValue={user.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded p-2"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-50">{user.name}</p>
          )}
        </div>

        {/* Position Field */}
        <div>
          <label className="block font-semibold">Position</label>
          {isEditing ? (
            <select
              defaultValue={user.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="worker">Worker</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
              <option value="managing_director">Managing Director</option>
            </select>
          ) : (
            <p className="p-2 border rounded bg-gray-50">{user.position}</p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label className="block font-semibold">Status</label>
          {isEditing ? (
            <select
              defaultValue={user.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <p className="p-2 border rounded bg-gray-50">{user.status}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedFields({});
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDetailView;
