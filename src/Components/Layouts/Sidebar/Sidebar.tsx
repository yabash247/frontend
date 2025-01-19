import React from "react";

interface SidebarProps {
  isSidebarVisible: boolean;
  isMobileSidebar: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarVisible,
  isMobileSidebar,
  closeMobileSidebar,
}) => {
  return (
    <div
      className={`fixed left-0 h-full bg-green-500 text-white z-40 transition-transform duration-300 ease-in-out md:relative ${
        isMobileSidebar
          ? "w-64 transform translate-x-0"
          : "w-64 md:translate-x-0 -translate-x-full"
      } ${!isSidebarVisible && "md:w-20"}`}
    >
      <div className="p-4">
        {isMobileSidebar && (
          <button
            className="md:hidden block text-white mb-4"
            onClick={closeMobileSidebar}
          >
            Close Sidebar
          </button>
        )}
        <ul className="space-y-4">
          <li className="flex items-center space-x-4 p-2 hover:bg-green-700 rounded-md">
            <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-green-500">
              H
            </span>
            {isSidebarVisible && <span>Home</span>}
          </li>
          {/* Add more sidebar items as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
