import React, { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import DarkModeToggle from "../../Shared/DarkModeToggle";
import Logo from "../../Shared/Logo";
import { useAppDispatch, useAppSelector } from "../../../ReduxToolkit/Hooks";
import { logout } from "../../../ReduxToolkit/Reducers/authSlice";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isDarkMode } = useAppSelector((state) => state.darkMode);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className={`flex items-center justify-between p-4 ${
        isDarkMode ? "dark:bg-gray-800" : "bg-white"
      } shadow-md relative z-50`}
    >
      {/* Left Section */}
      <div className="flex items-center">
        <button className="p-2 focus:outline-none" onClick={toggleSidebar}>
          <FaBars className="w-6 h-6 text-gray-600 dark:text-white" />
        </button>
        <Logo isDarkMode={isDarkMode} />
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md w-1/2">
        <FaSearch className="text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none flex-1 ml-2 text-gray-700 dark:text-gray-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative">
        <DarkModeToggle />
        <button className="relative">
          <FaBell className="w-6 h-6 text-gray-600 dark:text-white" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
            3
          </span>
        </button>
        <div className="relative">
          <button
            className="flex items-center space-x-2"
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
          >
            <FaUserCircle className="w-8 h-8 text-gray-600 dark:text-white" />
          </button>
          {isProfileDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md rounded-md`}
            >
              <ul className="text-sm text-gray-700 dark:text-gray-300">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <a href="/profile">Profile</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <a href="/settings">Settings</a>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
