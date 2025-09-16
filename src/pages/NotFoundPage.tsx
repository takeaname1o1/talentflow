import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotFoundGif from "../assets/404.gif";
import error from "../assets/error.gif";

const NotFoundPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const errorImagesRef = useRef<HTMLImageElement[]>([]);
  const IMAGE_SIZE = 100;
  const navigate = useNavigate();

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
      img.style.height = `${IMAGE_SIZE}px`;
      img.style.zIndex = "9999";
      img.style.pointerEvents = "none";
      img.style.transition = "transform 1s ease-in-out";

      const centerX = (window.innerWidth - IMAGE_SIZE) / 2;
      const centerY = (window.innerHeight - IMAGE_SIZE) / 2;
      img.style.transform = `translate(${centerX}px, ${centerY}px)`;

      document.body.appendChild(img);
      errorImagesRef.current.push(img);

      const moveInterval = setInterval(() => {
        const { x, y } = getClampedPosition();
        img.style.transform = `translate(${x}px, ${y}px)`;
      }, 1500);

      setTimeout(() => {
        clearInterval(moveInterval);
        img.remove();
        errorImagesRef.current = errorImagesRef.current.filter((el) => el !== img);
      }, 20000);
    };

    const interval = setInterval(spawnFloatingError, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    errorImagesRef.current.forEach((img) => img.remove());
    errorImagesRef.current = [];
    navigate("/");
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#87AFC1",
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={NotFoundGif}
        alt="404 Not Found"
        onClick={handleClick}
        style={{
          width: "320px",
          maxWidth: "80%",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default NotFoundPage;
