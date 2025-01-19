import React from "react";
import { dynamicImage } from "../../service";

interface LogoProps {
  isDarkMode: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDarkMode }) => {
  return (
    <>
      {isDarkMode ? (
        <img className="for-dark" src={dynamicImage("logo/yabash_dark_logo.png")} alt="dark mode logo" />
      ) : (
        <img className="for-light" src={dynamicImage("logo/yabash_logo.png")} alt="light mode logo" />
      )}
    </>
  );
};

export default Logo;
