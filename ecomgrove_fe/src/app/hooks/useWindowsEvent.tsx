import { useState, useEffect } from "react";
import { throttle } from "lodash";

export const useWindowEvents = () => {
  const [isScrolledY, setIsScrolledY] = useState(false);
  const [isScrolledX, setIsScrolledX] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolledY(window.scrollY > 0);
      setIsScrolledX(window.scrollX > 0);
    }, 200);

    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth < 1024);
    }, 200);

    // Initial run
    handleScroll();
    handleResize();

    // Listen
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isScrolledY,
    isScrolledX,
    isMobile,
  };
};
