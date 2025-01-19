import React from "react";

const LoginButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
      >
        Login
      </button>
      <button
        type="button"
        className="w-full border-2 border-green-600 text-green-600 py-3 rounded-md hover:bg-green-100 transition"
      >
        Create Account
      </button>
    </div>
  );
};

export default LoginButtons;
