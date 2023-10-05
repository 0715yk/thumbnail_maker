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
