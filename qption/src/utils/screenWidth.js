import  { useState, useEffect } from "react";

const useWindowDimensions = () => {

  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' && window.innerWidth,
    height: typeof window !== 'undefined' &&  window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: typeof window !== 'undefined' && window.innerWidth,
        height: typeof window !== 'undefined' && window.innerHeight,
      });
    };
    typeof window !== 'undefined' && window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;