import { useState, useEffect } from "react";
import { throttle } from "lodash";

export const useWindowEvents = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 0);
    }, 200);

    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth < 1024);
    }, 200);

    // Initial checks
    handleScroll();
    handleResize();

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isScrolled, isMobile };
};
