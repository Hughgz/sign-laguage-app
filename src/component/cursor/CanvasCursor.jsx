'use client';

import useCanvasCursor from "./useCanvasCursor";

const CanvasCursor = () => {
  useCanvasCursor();
  return (
    <canvas
      id="canvas"
    ></canvas>
  );
};

export default CanvasCursor;
