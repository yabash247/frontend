import React, { useState } from "react";
import LoginHeader from "../../Components/Login/LoginHeader";
import LoginForm from "../../Components/Login/LoginForm";
import LoginButtons from "../../Components/Login/LoginButtons";
import Logo from "../../Components/Shared/Logo";
import { dynamicImage } from "../../service";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../ReduxToolkit/Hooks";
import { loginUser } from "../../ReduxToolkit/Reducers/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access the location to determine the previous path

  // Determine the previous path or default to "/"
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.email.length > 0) {
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
          goTo: (path) => navigate(path),
        })
      ).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate(redirectTo); // Redirect to the previous page or home
        }
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6 py-8">
        <div className="w-full max-w-md">
          <Logo />
          <LoginHeader title="Welcome Back!" subtitle="Please Log in to your account." />
          <form onSubmit={handleSubmit} className="space-y-6">
            <LoginForm formData={formData} setFormData={setFormData} />
            <LoginButtons />
          </form>
          <p className="mt-6 text-sm text-gray-500 text-center">
            By signing up you agree to our terms and that you have read our data policy.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-green-100 flex justify-center items-center">
        <img className="for-dark" src={dynamicImage("banners/illustration_login.jpg")} alt="logo" />
      </div>
    </div>
  );
}
