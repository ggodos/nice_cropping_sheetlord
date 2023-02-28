import { ReactElement, useEffect, useRef } from "react";
import "./App.css";
import { kekis } from "./makeCool";

function App(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    canvasRef.current = document.getElementById(
      "image-preview"
    ) as HTMLCanvasElement;
  }, []);

  function draw() {
    if (canvasRef.current) kekis(canvasRef.current);
  }

  return (
    <div className="App">
      <button onClick={draw}>Prikol</button>
      <canvas id="image-preview" height={720} width={1280}></canvas>
    </div>
  );
}

export default App;
