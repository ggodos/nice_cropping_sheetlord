// export const loadImg: any = function (img: HTMLImageElement, url: string) {
//   return new Promise((resolve, reject) => {
//     img.src = url;
//     img.onload = () => resolve(img);
//     img.onerror = () => reject(img);
//   });
// };

export const downloadURI = function (uri: string, name: string) {
  const createEl = document.createElement("a");
  createEl.href = uri;

  createEl.download = name;

  createEl.click();
  createEl.remove();
};
