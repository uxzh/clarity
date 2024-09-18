import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export const FloatingCard = ({ imgSrc, creditCardName }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const ref = useRef(null); // Removed the HTMLDivElement type annotation
  const [lastY, setLastY] = useState(0);

  const handleMouse = (e) => {
    // Removed the React.MouseEvent<HTMLDivElement> type annotation
    if (!ref.current) return;

    const div = ref.current;
    const rect = div.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -14;
    const rotationY = (offsetX / (rect.width / 2)) * 14;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  };

  function handleMouseEnter() {
    scale.set(1.1);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);

    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      id="floatingCard"
      ref={ref}
      className="relative flex xs:h-[250px] md:h-[220px] w-full flex-col items-center justify-center overflow-hidden sm:w-[100%] mt-2"
      style={{
        perspective: "800px",
        overflow: "visible",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <div className="absolute top-4 text-center text-sm sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div> */}
      <motion.img
        draggable={false}
        src={imgSrc}
        alt={creditCardName}
        style={{
          rotateX,
          rotateY,
          scale,
          borderRadius: "16px",
        }}
        className="xs:w-[100%] md:w-[90%] z-20 max-w-[360px] min-w-[260px] object-cover will-change-transform"
      />
    </figure>
  );
};
