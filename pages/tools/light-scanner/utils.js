/**
 * @param {string} header
 * @param {string} subheader
 * @param {string} contentTagName
 * @param {HTMLElement} parentElement
 * @returns {Promise<HTMLElement>}
 */
export async function createScannerModal({
  header,
  subheader,
  contentTagName,
  parentElement,
}) {
  const modalElement = document.createElement("scanner-modal");
  modalElement.setAttribute("header", header);
  modalElement.setAttribute("subheader", subheader);
  parentElement.append(modalElement);

  await modalElement.componentOnReady();

  const optionsElement = document.createElement(contentTagName);
  modalElement.append(optionsElement);
  const closeButton = modalElement.shadowRoot.querySelector("header > button");
  closeButton.onclick = () => modalElement.remove();

  await optionsElement.componentOnReady();

  return modalElement;
}

/**
 * @param {string} data
 * @param {HTMLElement} parentElement
 * @param {string | number} [badge]
 * @param {function} [onRemove]
 * @return {Promise<any>}
 */
export async function createScannerTooltip({
  data,
  parentElement,
  badge,
  onRemove,
}) {
  const tooltipElement = document.createElement("scanner-tooltip");

  tooltipElement.badge = badge;
  tooltipElement.data = data;

  const pskCode = document.createElement("psk-code");
  pskCode.language = "JSON";
  pskCode.append(data);

  tooltipElement.append(pskCode);
  parentElement.append(tooltipElement);

  tooltipElement.style.opacity = 0;

  await pskCode.componentOnReady();

  tooltipElement.style.opacity = 1;

  setTimeout(async () => {
    await timeout(500);
    tooltipElement.classList.add("out");
    await timeout(700);
    tooltipElement.remove();
    onRemove && (await onRemove());
  });

  return tooltipElement;
}

/**
 * @param {ImageData} imageData
 * @returns {CanvasRenderingContext2D}
 */
export function createCanvasContextFromImageData(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = canvas.getContext("2d");
  context.putImageData(imageData, 0, 0);

  return context;
}

/**
 * @param {string} src
 * @returns {CanvasRenderingContext2D}
 */
export async function cerateCanvasContextWithImageElement(src) {
  const imageElement = await createImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  const context = canvas.getContext("2d");
  context.drawImage(
    imageElement,
    0,
    0,
    imageElement.width,
    imageElement.height
  );

  return context;
}

/**
 * @param {string} src
 * @param {number} [width]
 * @param {number} [height]
 * @returns {Promise<HTMLImageElement>}
 */
export async function createImage(src, width, height) {
  return new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.addEventListener("error", (e) => {
      reject(`Error while loading image with source "${src}"`);
    });
    image.src = src;
  });
}

/**
 *
 * @param {string} data
 * @param {string} fileName
 * @param {string="png"} format
 */
export function downloadImage(data, fileName, format = "png") {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", data);
  anchor.setAttribute("download", `${fileName}.${format}`);
  anchor.click();
}

/**
 * @param data
 * @param {string} fileName
 */
export function downloadJSON(data, fileName) {
  const json =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data, null, 2));
  const anchor = document.createElement("a");
  anchor.setAttribute("href", json);
  anchor.setAttribute("download", `${fileName}.json`);
  anchor.click();
}

/**
 * @param {number} time
 * @returns {Promise<void>}
 */
export async function timeout(time) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      clearTimeout(timeout);
    }, time);
  });
}

/**
 * @param {string} prefix
 * @return {string}
 */
export function getFileNamePrefix(prefix) {
  return [
    prefix,
    new Date()
      .toISOString()
      .split(".")[0]
      .replace("T", ".")
      .split(":")
      .join("-"),
  ].join(".");
}

/**
 * @param {number} frequency
 * @param {OscillatorType} type
 * @param {number} volume
 * @param {number} duration
 */
export function beep({ frequency, type, volume, duration }) {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audio.createOscillator();
  const gainNode = audio.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audio.destination);

  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = type;

  oscillator.start();
  setTimeout(() => oscillator.stop(), duration);
}
