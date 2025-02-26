import { useState, useEffect } from "react";

const UserPage = () => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDeviceType("mobile");
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {deviceType === "mobile" && (
        <div className="mobile-container">
          <h1>Ini tampilan mobile</h1>
        </div>
      )}
      {deviceType === "tablet" && (
        <div className="tablet-container">
          <h1>Ini tampilan tablet</h1>
        </div>
      )}
      {deviceType === "desktop" && (
        <div className="desktop-container">
          <h1>Ini tampilan desktop</h1>
        </div>
      )}
    </>
  );
};

export default UserPage;