import React, { useEffect, useState } from "react";
import TapTop from "../Shared/TapTop";
import Header from "./Header/Header";
import { useAppDispatch, useAppSelector } from "../../ReduxToolkit/Hooks";
import { fetchWeatherAndSetDarkMode } from "../../Utils/darkModeUtils";
import "../../assets/styles/darkmode.scss";
import Sidebar from "./Sidebar/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useAppSelector((state) => state.darkMode);

  // State to manage sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);

  // Always fetch weather-based dark mode on initial load
  useEffect(() => {
    fetchWeatherAndSetDarkMode(dispatch, true); // Auto-switch always enabled
  }, [dispatch]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebar((prev) => !prev);
    } else {
      setIsSidebarVisible((prev) => !prev);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark-mode bg-black" : ""}`}>
      <Header toggleSidebar={toggleSidebar} />

      <TapTop />

      {/* Layout Section */}
      <div className="relative flex">
        {/* Sidebar */}
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          isMobileSidebar={isMobileSidebar}
          closeMobileSidebar={() => setIsMobileSidebar(false)}
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarVisible && !isMobileSidebar ? "md:ml-1" : "md:ml-1"
          }`}
        >
          <main className="p-4 bg-orange-500">
            <h1 className="text-2xl dark:text-white">Layout Page</h1>
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center dark:bg-black text-sm">
        <p className="dark:text-gray-300">&copy; 2024 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
