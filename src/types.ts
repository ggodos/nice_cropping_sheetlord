import Konva from "konva";

export type Vector2d = {
  x: number;
  y: number;
};

export type PainterLayers = {
  imageLayer: Konva.Layer;
  zonesLayer: Konva.Layer;
};
