import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMy_BranchStaffMembers } from "../../ReduxToolkit/Reducers/companySlice"; // Adjust the path based on your slice location
import { RootState, AppDispatch } from "../../ReduxToolkit/Store"; // Adjust the path based on your store location
import { log } from "console";

interface AccessControlProps {
  minLevel?: number;
  allowedPositions?: string[];
  app_Name: string;
  children: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({
  minLevel = 0,
  allowedPositions = ['worker', 'manager', 'director' ],
  app_Name,
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch branch staff members when the component mounts
  useEffect(() => {
    dispatch(getMy_BranchStaffMembers(app_Name));
  }, [dispatch, app_Name]);

  log("AccessControl: app_Name: ", app_Name);

  // Select branch staff member details from the Redux store
  const { branchStaffMembers, loading } = useSelector(
    (state: RootState) => state.company
  );

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  // Assume the current user is the first member in the array (you can customize this logic)
  const currentUser = branchStaffMembers[0];
  const userLevel = currentUser?.level || 0;
  const userPosition = currentUser?.position || "";

  const hasAccess =
    userLevel >= minLevel &&
    (allowedPositions.length === 0 || allowedPositions.includes(userPosition));

  return hasAccess ? <>{children}</> : null;
};

export default AccessControl;
