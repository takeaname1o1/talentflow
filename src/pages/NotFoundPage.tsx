import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NotFoundGif from "../assets/404.gif";
import error from "../assets/error.gif";

const NotFoundPage = () => {
  const containerRef = useRef(null);
  const IMAGE_SIZE = 100;

  useEffect(() => {
    const getClampedPosition = () => {
      const x = Math.random() * (window.innerWidth - IMAGE_SIZE);
      const y = Math.random() * (window.innerHeight - IMAGE_SIZE);
      return { x, y };
    };

    const spawnFloatingError = () => {
      const img = document.createElement("img");
      img.src = error;
      img.alt = "Floating Error";
      img.style.position = "fixed";
      img.style.width = `${IMAGE_SIZE}px`;
      img.style.zIndex = "9999";
      img.style.pointerEvents = "none";
      img.style.transition = "transform 1s ease-in-out";
      img.style.top = "5";
      img.style.left = "5";

      const centerX = (window.innerWidth - IMAGE_SIZE) / 2;
      const centerY = (window.innerHeight - IMAGE_SIZE) / 2;
      img.style.transform = `translate(${centerX}px, ${centerY}px)`;
const containerRef = useRef<HTMLDivElement | null>(null);

      if (containerRef.current) {
        containerRef.current.appendChild(img);
      }

      const moveInterval = setInterval(() => {
        const { x, y } = getClampedPosition();
        img.style.transform = `translate(${x}px, ${y}px)`;
      }, 1500);

      setTimeout(() => {
        clearInterval(moveInterval);
        img.remove();
      }, 20000);
    };

    const interval = setInterval(spawnFloatingError, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", // ensures it spans the viewport
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
        zIndex: 1, // keeps it behind floating errors
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link to="/">
        <img
          src={NotFoundGif}
          alt="404 Not Found"
          style={{
            width: "320px",
            maxWidth: "80%",
            cursor: "pointer",
          }}
        />
      </Link>
    </div>




  );
};

export default NotFoundPage;






