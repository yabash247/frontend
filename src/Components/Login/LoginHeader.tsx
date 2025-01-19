import React from "react";

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};

export default LoginHeader;
