export function kekis(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.log("Not context in canvas");
    return;
  }

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
  ctx.fillRect(30, 30, 50, 50);
}

export const loadImg = function (img: HTMLImageElement, url: string) {
  return new Promise((resolve, reject) => {
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
  });
};

export const downloadCanvas = function (
  canvas: HTMLCanvasElement,
  defaultDownloadName = "spritesheet"
) {
  let canvasUrl = canvas.toDataURL();

  const createEl = document.createElement("a");
  createEl.href = canvasUrl;

  createEl.download = defaultDownloadName;

  createEl.click();
  createEl.remove();
};
