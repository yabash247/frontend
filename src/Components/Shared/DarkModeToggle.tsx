import React from "react";
import { useAppDispatch, useAppSelector } from "../../ReduxToolkit/Hooks";
import { toggleDarkMode, /*enableAutoSwitch */} from "../../ReduxToolkit/Reducers/darkModeSlice";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

const DarkModeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode, /*autoSwitchEnabled*/ } = useAppSelector((state) => state.darkMode);

  return (
    <div className="flex gap-4 items-center">
      {/* Toggle Dark Mode */}
      <button
      onClick={() => dispatch(toggleDarkMode())}
      className="p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700"
      aria-label="Toggle Dark Mode"
      >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
      </button>

      {/* Enable/Disable Auto Dark Mode */}
     {/* <button
        onClick={() => dispatch(enableAutoSwitch(!autoSwitchEnabled))}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
      >
        {autoSwitchEnabled ? "Disable Auto Dark Mode" : "Enable Auto Dark Mode"}
      </button>*/}
    </div>
  );
};

export default DarkModeToggle;
