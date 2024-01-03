// ==UserScript==
// @name         Add buttons to Rai Play Sound
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  Adds feed button and copy button to Rai Play Sound using https://timendum.github.io/raiplaysound/
// @author       You
// @match        https://www.raiplaysound.it/programmi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raiplaysound.it
// @grant        none
// ==/UserScript==

const serviceURL = "https://timendum.github.io/raiplaysound";

(function () {
  "use strict";

  const addStyles = () => {
    const styleElement = document.createElement("style");

    const cssRules = `
      .rps_custom_button {
        cursor: pointer;

        color: #fff;
        background: #b1b7bb;

        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        height: 2.75rem;
        width: 2.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;

        margin-left: 1.5rem;
      }

      .rps_custom_button:hover {
        color: #fff;
        background: rgba(0, 22, 35, 0.55);
      }

      .rps_custom_toast {
        visibility: hidden;
  
        background-color: #b1b7bb;
        color: #fff;
        text-align: center;
        border-radius: 5%;
        padding: 1rem;
        position: fixed;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        top: 2rem;
      }

      .rps_custom_toast.show {
        visibility: visible;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
      }

      @-webkit-keyframes fadein {
        from {top: 0; opacity: 0;}
        to {top: 2rem; opacity: 1;}
      }

      @keyframes fadein {
        from {top: 0; opacity: 0;}
        to {top: 2rem; opacity: 1;}
      }

      @-webkit-keyframes fadeout {
        from {top: 2rem; opacity: 1;}
        to {top: 0; opacity: 0;}
      }

      @keyframes fadeout {
        from {top: 2rem; opacity: 1;}
        to {top: 0; opacity: 0;}
      }

    `;

    styleElement.textContent = cssRules;
    document.head.appendChild(styleElement);
  };

  const addToast = () => {
    const toast = document.createElement("div");
    toast.classList = "rps_custom_toast";

    const message = document.createElement("span");
    toast.appendChild(message);

    document.querySelector("body").appendChild(toast);
  };

  const showToast = (text) => {
    const toast = document.querySelector(".rps_custom_toast");
    toast.querySelector("span").innerText = text;
    toast.classList.add("show");

    setTimeout(function () {
      toast.classList.remove("show");
      toast.innerText = "";
    }, 3000);
  };

  const createSvg = path => {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", "16");
    svgElement.setAttribute("height", "14");
    svgElement.setAttribute("viewBox", "0 0 448 512");
    svgElement.setAttribute("fill", "#fff");

    svgElement.appendChild(path);
    return svgElement;
  }

  const createFeedIcon = () => {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", "16");
    svgElement.setAttribute("height", "14");
    svgElement.setAttribute("viewBox", "0 0 448 512");

    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElement.setAttribute(
      "d",
      "M0 64C0 46.3 14.3 32 32 32c229.8 0 416 186.2 416 416c0 17.7-14.3 32-32 32s-32-14.3-32-32C384 253.6 226.4 96 32 96C14.3 96 0 81.7 0 64zM0 416a64 64 0 1 1 128 0A64 64 0 1 1 0 416zM32 160c159.1 0 288 128.9 288 288c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-123.7-100.3-224-224-224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
    );
    svgElement.setAttribute("fill", "#fff");

    svgElement.appendChild(pathElement);
    return svgElement;
  };

  const createClipboardIcon = () => {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", "16");
    svgElement.setAttribute("height", "12");
    svgElement.setAttribute("viewBox", "0 0 384 512");

    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElement.setAttribute(
      "d",
      "M384 112v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h80c0-35.3 28.7-64 64-64s64 28.7 64 64h80c26.5 0 48 21.5 48 48zM192 40c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24m96 114v-20a6 6 0 0 0 -6-6H102a6 6 0 0 0 -6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z"
    );
    svgElement.setAttribute("fill", "#fff");

    svgElement.appendChild(pathElement);
    return svgElement;
  };

  const createButton = (tag, child) => {
    const wrapper = document.createElement(tag);
    wrapper.classList = "rps_custom_button";
    const button = document.createElement("button");
    button.appendChild(child);
    wrapper.appendChild(button);
    return wrapper;
  };

  addStyles();
  addToast("Copiato");

  const pathname = window.location.pathname;
  const podcastName = pathname.split("/").pop();
  const feedUrl = `${serviceURL}/${podcastName}.xml`;

  const feedIcon = createFeedIcon();
  const feedButton = createButton("a", feedIcon);
  feedButton.setAttribute("href", feedUrl);

  const clipboardIcon = createClipboardIcon();
  const copyFeedButton = createButton("button", clipboardIcon);

  copyFeedButton.addEventListener("click", () => {
    navigator.clipboard.writeText(feedUrl);
    showToast("Copiato");
  });

  const buttonsWrapper = document.querySelector(".banner-buttons");
  buttonsWrapper.appendChild(feedButton);
  buttonsWrapper.appendChild(copyFeedButton);
})();
