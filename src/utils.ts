import { Stage } from "konva/lib/Stage";
import { Vector2d } from "./types";

export const loadImg = function (img: HTMLImageElement, url: string) {
  return new Promise((resolve, reject) => {
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
  });
};

export const downloadURI = function (uri: string, name: string) {
  const createEl = document.createElement("a");
  createEl.href = uri;

  createEl.download = name;

  createEl.click();
  createEl.remove();
};

export function getRelativePointerPosition(node: Stage): Vector2d {
  // the function will return pointer position relative to the passed node
  var transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  var pos = node.getStage().getPointerPosition() as Vector2d;

  // now we find a relative point
  return transform.point(pos);
}
