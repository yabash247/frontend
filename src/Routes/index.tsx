import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LayoutRoutes from "./LayoutRoutes";
import Login from "../Pages/Login/Login";
import { authRoutes } from "./authRoutes";
import { AuthProvider } from "../Components/Authentication/AuthContext";
import { useAppSelector } from "../ReduxToolkit/Hooks";

const RouterData = () => {
  const userData = useAppSelector((state) => state.auth.access);

  console.log("User data in RouterData:", userData);

  return (
    <BrowserRouter basename={"/"}>
      <AuthProvider>
        <Routes>
          {userData ? (
            <>
              <Route
                path={`${import.meta.env.PUBLIC_URL || '/'}`}
                element={<Navigate to={`${import.meta.env.PUBLIC_URL || '/dashboard'}`} />}
              />
            </>
          ) : (
            ""
          )}
          <Route path={"/"} element={<PrivateRoute />}>
            <Route path={`/*`} element={<LayoutRoutes />} />
          </Route>
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
          <Route path={`${import.meta.env.PUBLIC_URL || '/login'}`} element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default RouterData;
