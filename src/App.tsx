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

  function stageInit() {
    stage = new Konva.Stage({
      container: "image-preview-container",
      width: 500,
      height: 300,
    });
    stage.add(imageLayer);
    stage.add(sheetsLayer);

    img.onload = function () {
      console.log("img: ", img.width, img.height);
      const loadedImg = new Konva.Image({
        x: 0,
        y: 0,
        image: img,
        width: img.width,
        height: img.height,
      });
      stage.height(img.height);
      stage.width(img.width);

      sheetsLayer.add(
        new Konva.Rect({
          x: img.width / 2,
          y: img.height / 2,
          fill: "red",
          stroke: "black",
          width: 10,
          height: 10,
        })
      );
      imageLayer.add(loadedImg);
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      renderLayers();
    };

    renderLayers();

    const scaleBy = 1.05;
    stage.on("wheel", (e) => {
      e.evt.preventDefault();

      var oldScale = stage.scaleX();
      var pointer = stage.getPointerPosition();
      if (!pointer) return;

      // e.evt.deltaY is
      // negative - zoom in
      // positive - zoom out
      const isZoomIn = e.evt.deltaY < 0;

      var newScale = isZoomIn ? oldScale * scaleBy : oldScale / scaleBy;
      if (newScale > 10)
        if (newScale < 1) {
          stage.scale({ x: 1, y: 1 });
          stage.position({ x: 0, y: 0 });
          return;
        }

      function scaleOffset(start: number, offset: number): number {
        return ((offset - start) / oldScale) * newScale;
      }

      let newPos = {
        x: pointer.x - scaleOffset(stage.x(), pointer.x),
        y: pointer.y - scaleOffset(stage.y(), pointer.y),
      };

      const scaledWidth = img.width / newScale;
      const scaledHeight = img.height / newScale;

      const stageRight = newPos.x / newScale - scaledWidth;
      const stageBottom = newPos.y / newScale - scaledHeight;

      const beyondRight = -img.width - stageRight;
      const beyondBottom = -img.height - stageBottom;

      if (beyondRight > 0) newPos.x = newPos.x + beyondRight * newScale;
      if (beyondBottom > 0) newPos.y = newPos.y + beyondBottom * newScale;

      if (newPos.x > 0) newPos.x = 0;
      if (newPos.y > 0) newPos.y = 0;
      stage.position(newPos);
      stage.scale({ x: newScale, y: newScale });
    });
  }

  useEffect(stageInit, []);

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

  function teste() {
    var x = stage.x();
    console.log(x);
    stage.x(x + 10);
    x = stage.x();
    console.log(x);
    renderLayers();
  }

  return (
    <div className="App">
      <h2>Good cropping sheetlord!</h2>
      <div id="controller-container">
        <button onClick={saveImage}>Save image</button>
        <button onClick={teste}>draw</button>
      </div>
      <input onChange={onInputFileChange} type="file" id="file_input"></input>
      <div id="image-preview-container"></div>
    </div>
  );
}

export default App;
