import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import { downloadCanvas, loadImg as loadImgToCanvas } from "./utils";
import "./App.css";

function App(): ReactElement {
  const img = new Image();
  let stage: Stage | null = null;
  const layers: Konva.Layer[] = [];
  const imageLayer = new Konva.Layer();
  const sheetsLayer = new Konva.Layer();

  function loadImage(imageData: string) {
    img.src = imageData;
  }

  function saveImage() {}

  function renderLayers() {
    if (!stage) return;

    sheetsLayer.draw();
    imageLayer.draw();
  }

  useEffect(() => {
    stage = new Konva.Stage({
      container: "image-preview-container",
      width: 1280,
      height: 720,
    });
    stage.add(imageLayer);
    stage.add(sheetsLayer);

    img.onload = function () {
      if (!stage) return;
      console.log("img: ", img.width, img.height);
      console.log("stage: ", stage.getSize());
      const loadedImg = new Konva.Image({
        x: 0,
        y: 0,
        image: img,
        width: img.width,
        height: img.height,
      });
      stage.height(img.height);
      stage.width(img.width);
      console.log("img: ", img.width, img.height);
      console.log("stage: ", stage.getSize());
      imageLayer.add(loadedImg);
      imageLayer.draw();
    };
    renderLayers();
    // imageLayer.draw();
    // sheetsLayer.draw();
  }, []);

  function onInputFileChange(e: FormEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;

    const f = new FileReader();
    f.readAsDataURL(files[0]);
    f.onloadend = function (event) {
      if (!event.target || !event.target.result) {
        console.log("Error reading file");
        return;
      }

      const imageData = event.target.result.toString();
      loadImage(imageData);
    };
  }

  return (
    <div className="App">
      <h1>Good cropping sheetlord!</h1>
      <div id="controller-container">
        <button onClick={saveImage}>Save image</button>
        <button onClick={renderLayers}>draw</button>
      </div>
      <input onChange={onInputFileChange} type="file" id="file_input"></input>
      <div id="image-preview-container"></div>
    </div>
  );
}

export default App;
