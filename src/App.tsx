import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import { downloadURI, loadImg as loadImgToCanvas } from "./utils";
import "./App.css";

function App(): ReactElement {
  const img = new Image();
  let stage!: Stage;
  const layers: Konva.Layer[] = [];
  const imageLayer = new Konva.Layer();
  const sheetsLayer = new Konva.Layer();

  function loadImage(imageData: string) {
    img.src = imageData;
  }

  function saveImage() {
    const dataURL = stage.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, "stage.png");
  }

  function renderLayers() {
    sheetsLayer.draw();
    imageLayer.draw();
  }

  useEffect(() => {
    stage = new Konva.Stage({
      container: "image-preview-container",
      width: 500,
      height: 300,
    });
    stage.add(imageLayer);
    stage.add(sheetsLayer);

    img.onload = function () {
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
      stage.clear();
      imageLayer.add(loadedImg);
      imageLayer.draw();
    };
    renderLayers();
    const scaleBy = 1.05;
    stage.on("wheel", (e) => {
      // stop default scrolling
      e.evt.preventDefault();

      var oldScale = stage.scaleX();
      var pointer = stage.getPointerPosition();
      if (!pointer) return;

      var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? -1 : 1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        direction = -direction;
      }

      var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    });
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
      <h2>Good cropping sheetlord!</h2>
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
