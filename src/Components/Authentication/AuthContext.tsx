import React, { createContext, useState, useEffect, SetStateAction, Dispatch } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import { backendURL } from "../../Utils/Constants";
import { useAppSelector } from "../../ReduxToolkit/Hooks";

export interface IAuth {
  user: JwtPayload | null;
  setUser: Dispatch<SetStateAction<JwtPayload | null>>;
  authTokens: any;
  setAuthTokens: Dispatch<any>;
  registerUser: (email: string, username: string, password: string, password2: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<IAuth>(null!);

export default AuthContext;

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const userAccess = useAppSelector((state) => state.auth.access);

  const [authTokens, setAuthTokens] = useState(() => userAccess ?? null);
  const [user, setUser] = useState(() => (userAccess ? jwtDecode<JwtPayload>(userAccess) : null));
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${backendURL}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        console.log("Logged In");
        setAuthTokens(data);
        setUser(jwtDecode<JwtPayload>(data.access));
        localStorage.setItem("access", data.access); // Store access token
        localStorage.setItem("refresh", data.refresh); // Store refresh token
        navigate("/"); // Redirect to home page
        swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        console.error("Invalid credentials");
        swal.fire({
          title: "Username or password does not exist",
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (e) {
      console.error("Login error:", e);
      swal.fire({
        title: "An Error Occurred",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (email: string, username: string, password: string, password2: string) => {
    try {
      const response = await fetch(`${backendURL}/api/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          password2,
        }),
      });

      if (response.status === 201) {
        navigate("/login");
        swal.fire({
          title: "Registration Successful, Login Now",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        console.error("Registration error:", response.status);
        swal.fire({
          title: `An Error Occurred (${response.status})`,
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (e) {
      console.error("Registration error:", e);
      swal.fire({
        title: "An Error Occurred",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
    swal.fire({
      title: "You have been logged out...",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode<JwtPayload>(authTokens));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
