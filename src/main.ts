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
  const wrapper = document.querySelector("#wrapper") as HTMLDivElement;
  const blurWrapper = document.querySelector("#blurWrapper") as HTMLDivElement;
  const url = await canvas.toDataURL("image/png");
  previewDiv.style.backgroundImage = `url(${url})`;
  wrapper.style.background = `url(${url}) no-repeat`;
  wrapper.style.backgroundSize = `cover`;
  blurWrapper.style.height = `${wrapper.clientHeight}px`;
}

const backroundPickBtns = document.querySelectorAll(".select");
backroundPickBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const target = e.target as HTMLLabelElement;
    const targetId = target.htmlFor;
    const previewDiv = document.querySelector(
      "#thumbnail-preview"
    ) as HTMLDivElement;
    const lists = document.querySelectorAll(".render");
    const renderList = document.querySelector(
      ".render-list"
    ) as HTMLUListElement;
    const wrapper = document.querySelector("#wrapper") as HTMLDivElement;

    switch (targetId) {
      case "gradient":
        const color = getGradient();
        wrapper.style.background = color;
        previewDiv.style.background = color;
        break;
      case "solid-color":
        const hex = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        wrapper.style.background = hex;
        previewDiv.style.background = hex;
        break;
      case "image-url":
        const url = prompt("이미지 URL을 입력해주세요") as string;
        const RegExp =
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (RegExp.test(url)) {
          void importImage(url);
        } else {
          alert("정상적인 URL 포맷이 아닙니다.");
        }
        break;
      case "title-subtitle-contents":
        lists.forEach((list) => {
          if (list.classList.contains("subtitle")) {
            const listElement = list as HTMLLIElement;
            listElement.style.display = "inline-block";
          } else {
            const listElement = list as HTMLLIElement;
            listElement.style.display = "block";
          }
        });
        break;
      case "title-subtitle":
        lists.forEach((list) => {
          const listElement = list as HTMLLIElement;
          if (list.classList.contains("contents")) {
            listElement.style.display = "none";
          } else if (list.classList.contains("subtitle")) {
            listElement.style.display = "inline-block";
          } else {
            listElement.style.display = "block";
          }
        });
        break;
      case "only-title":
        lists.forEach((list) => {
          const listElement = list as HTMLLIElement;
          if (list.classList.contains("title")) {
            listElement.style.display = "block";
          } else {
            listElement.style.display = "none";
          }
        });
        break;
      case "text-shadow":
        const textShadowInput = document.querySelector(
          "#text-shadow"
        ) as HTMLInputElement;
        if (textShadowInput.checked) {
          previewDiv.style.textShadow = "none";
        } else {
          previewDiv.style.textShadow = "rgba(0, 0, 0, 0.4) 2px 2px 4px";
        }
        break;
      case "text-color-reversal":
        const textColorReversalInput = document.querySelector(
          "#text-color-reversal"
        ) as HTMLInputElement;
        const subTitle = document.querySelector(
          ".subtitle"
        ) as HTMLInputElement;

        if (textColorReversalInput.checked) {
          renderList.style.color = "#ffffff";
          subTitle.style.borderTop = "1px solid #ffffff";
        } else {
          renderList.style.color = "black";
          subTitle.style.borderTop = "1px solid black";
        }
        break;
      case "title-size-smaller":
        const textSizeSmaller = document.querySelector(
          "#title-size-smaller"
        ) as HTMLInputElement;

        if (textSizeSmaller.checked) {
          lists.forEach((list) => {
            const render = list as HTMLLIElement;
            if (render.classList.contains("title")) {
              render.style.fontSize = "54px";
            } else {
              render.style.fontSize = "24px";
            }
          });
        } else {
          lists.forEach((list) => {
            const render = list as HTMLLIElement;
            if (render.classList.contains("title")) {
              render.style.fontSize = "46px";
            } else {
              render.style.fontSize = "22px";
            }
          });
        }
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

if (/Android|iPhone/i.test(navigator.userAgent)) {
  document.body.innerHTML =
    "<div>이 서비스는 모바일에서는 동작하지 않습니다.</div>";
}
