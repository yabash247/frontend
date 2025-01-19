import React, { useState, useEffect } from "react";

const TapTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Monitor scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true); // Show button if scrolled past 100px
    } else {
      setIsVisible(false); // Hide button otherwise
    }
  };

  // Scroll back to the top of the page smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add event listener on component mount
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300 z-50"
          aria-label="Scroll to Top"
        >
          ▲
        </button>
      )}
    </>
  );
};

export default TapTop;
