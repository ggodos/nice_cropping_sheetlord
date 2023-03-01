export const downloadURI = function (uri: string, name: string) {
  const createEl = document.createElement("a");
  createEl.href = uri;

  createEl.download = name;

  createEl.click();
  createEl.remove();
};
