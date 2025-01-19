import React from "react";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-gray-600">Remember me</label>
        </div>
        <a href="/forgot-password" className="text-green-600 hover:underline">
          Forgot password?
        </a>
      </div>
    </>
  );
};

export default LoginForm;
