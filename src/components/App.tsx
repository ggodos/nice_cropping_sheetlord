import { ReactElement, useEffect } from "react";
import Painter from "../Painter";
import "./App.css";

function App(): ReactElement {
  const painter = new Painter();

  useEffect(() => {
    painter.init();
  }, []);

  return (
    <div className="App">
      <h2>Good cropping sheetlord!</h2>
      <div id="controller-container">
        <button onClick={() => painter.saveImage()}>Save image</button>
        <button onClick={() => console.log("draw")}>draw</button>
      </div>
      <input
        onChange={(e) => painter.readImage(e)}
        type="file"
        id="file_input"
      ></input>
      <div id="image-preview-container"></div>
    </div>
  );
}

export default App;
