import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../ReduxToolkit/Hooks";

const PrivateRoute = () => {
  const userData = useAppSelector((state) => state.auth.access);
  return userData? (
    <Outlet />
    ) : (
    <Navigate to={`/login`} replace/>
  );
};

export default PrivateRoute;
