import html2canvas from "html2canvas";
import "./style.css";

const inputTitle = document.querySelector(".input-title");
const inputSubTitle = document.querySelector(".input-subtitle");
const inputContents = document.querySelector(".input-contents");

const renderTitle = document.querySelector(".render.title");
const renderSubTitle = document.querySelector(".render.subtitle");
const renderContents = document.querySelector(".render.contents");

inputTitle?.addEventListener("input", function (event) {
  const target = event.target as HTMLInputElement;

  if (target && renderTitle !== null) {
    renderTitle.textContent = target.value;
  }
});

inputSubTitle?.addEventListener("input", function (event) {
  const target = event.target as HTMLInputElement;

  if (target && renderSubTitle !== null) {
    renderSubTitle.textContent = target.value;
  }
});

inputContents?.addEventListener("input", function (event) {
  const target = event.target as HTMLInputElement;

  if (target && renderContents !== null) {
    renderContents.textContent = target.value;
  }
});

function createHex() {
  var hexCode1 = "";
  var hexValues1 = "0123456789abcdef";

  for (var i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(
      Math.floor(Math.random() * hexValues1.length)
    );
  }
  return hexCode1;
}

function getGradient() {
  var deg = Math.floor(Math.random() * 360);

  var gradient =
    "linear-gradient(" +
    deg +
    "deg, " +
    "#" +
    createHex() +
    ", " +
    "#" +
    createHex() +
    ")";

  return gradient;
}

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      alert("가져올 수 없는 이미지 입니다.");
      reject(e);
    };
  });
}

async function importImage(src: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const previewDiv = document.querySelector(
    "#thumbnail-preview"
  ) as HTMLDivElement;
  const imageElement = (await loadImage(src)) as HTMLImageElement;
  const { width: imageW, height: imageH } = imageElement;
  const stageW = 768;
  const stageH = 402;

  canvas.width = stageW;
  canvas.height = stageH;

  const stageRatio = stageW / stageH;
  const imageRatio = imageW / imageH;

  let width = stageW;
  let height = stageH;
  let x = 0;
  let y = 0;

  if (stageRatio < imageRatio) {
    width = stageH * imageRatio;
    x = (stageW - width) / 2;
  } else if (stageRatio > imageRatio) {
    height = stageW / imageRatio;
    y = (stageH - height) / 2;
  }

  context?.drawImage(imageElement, x, y, width, height);
  const url = await canvas.toDataURL("image/png");
  previewDiv.style.backgroundImage = `url(${url})`;
  document.body.style.backgroundImage = `url(${url})`;
}

const backroundPickBtns = document.querySelectorAll(".select-background");
backroundPickBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const target = e.target as HTMLLabelElement;
    const targetId = target.htmlFor;
    const previewDiv = document.querySelector(
      "#thumbnail-preview"
    ) as HTMLDivElement;
    switch (targetId) {
      case "gradient":
        const color = getGradient();
        document.body.style.background = color;
        previewDiv.style.background = color;
        break;
      case "solid-color":
        const hex = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        document.body.style.background = hex;
        previewDiv.style.background = hex;
        break;
      case "image-url":
        const url = prompt("이미지 URL을 입력해주세요") as string;
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        void importImage(url);
        break;
    }
  });
});

const exportBtn = document.querySelector("#export-btn");
exportBtn?.addEventListener("click", function () {
  const previewDiv = document.querySelector(
    "#thumbnail-preview"
  ) as HTMLDivElement;

  html2canvas(previewDiv, { allowTaint: true }).then(function (canvas) {
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.download = "html_image.jpg";
    link.href = canvas.toDataURL();
    link.target = "_blank";
    link.click();
    document.body.removeChild(link);
  });
});
