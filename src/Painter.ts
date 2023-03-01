import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { FormEvent } from "react";
import { PainterLayers } from "./types";
import { downloadURI } from "./utils";

export default class Painter {
  stage!: Konva.Stage;
  layers: PainterLayers = {
    imageLayer: new Konva.Layer(),
    zonesLayer: new Konva.Layer(),
  };
  htmlImage: HTMLImageElement = new Image();
  canvasImage = new Konva.Image({
    x: 0,
    y: 0,
    image: this.htmlImage,
  });

  init() {
    this.stage = new Konva.Stage({
      container: "image-preview-container",
      width: 500,
      height: 300,
    });
    const { imageLayer, zonesLayer } = this.layers;

    imageLayer.add(this.canvasImage);

    this.stage.add(imageLayer);
    this.stage.add(zonesLayer);

    this.htmlImage = new Image();
    this.htmlImage.onload = () => this.renderImage();
    this.stage.on("wheel", (e) => this.onZoom(e));

    this.render();
  }

  readImage(e: FormEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;

    const f = new FileReader();
    f.readAsDataURL(files[0]);
    f.onloadend = (event) => {
      if (!event.target || !event.target.result) {
        console.log("Error reading file");
        return;
      }

      const imageData = event.target.result.toString();
      this.htmlImage.src = imageData;
    };
  }

  renderImage() {
    this.canvasImage.image(this.htmlImage);
    this.stage.height(this.htmlImage.height);
    this.stage.width(this.htmlImage.width);

    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.render();
  }

  render() {
    this.layers.imageLayer.draw();
    this.layers.zonesLayer.draw();
  }

  onZoom(e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    var oldScale = this.stage.scaleX();
    var pointer = this.stage.getPointerPosition();
    if (!pointer) return;

    // e.evt.deltaY is
    // negative - zoom in
    // positive - zoom out
    const isZoomIn = e.evt.deltaY < 0;

    const scaleBy = 1.05;
    var newScale = isZoomIn ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale > 10) {
      newScale = 10;
    }
    if (newScale < 1) {
      this.stage.scale({ x: 1, y: 1 });
      this.stage.position({ x: 0, y: 0 });
      return;
    }

    function scaleOffset(start: number, offset: number): number {
      return ((offset - start) / oldScale) * newScale;
    }

    let newPos = {
      x: pointer.x - scaleOffset(this.stage.x(), pointer.x),
      y: pointer.y - scaleOffset(this.stage.y(), pointer.y),
    };

    const scaledWidth = this.htmlImage.width / newScale;
    const scaledHeight = this.htmlImage.height / newScale;

    const stageRight = newPos.x / newScale - scaledWidth;
    const stageBottom = newPos.y / newScale - scaledHeight;

    const beyondRight = -this.htmlImage.width - stageRight;
    const beyondBottom = -this.htmlImage.height - stageBottom;

    // console.log(newScale, beyondRight, beyondBottom);
    console.log(newScale);
    console.log(newPos);
    if (beyondRight > 0) newPos.x = newPos.x + beyondRight * newScale;
    if (beyondBottom > 0) newPos.y = newPos.y + beyondBottom * newScale;
    console.log(newPos);
    console.log("------------------");

    if (newPos.x > 0) newPos.x = 0;
    if (newPos.y > 0) newPos.y = 0;
    this.stage.position(newPos);
    this.stage.scale({ x: newScale, y: newScale });
  }

  saveImage() {
    const dataURL = this.stage.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, "stage.png");
  }
}
