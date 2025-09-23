/** -------GLOBAL VARIABLES -------*/
const typeWriterController = {};
let isHackerModeOn = false;


/**
 * Types out text from a file into a container simulating a typewriter effect
 * @param {*} file - A html file name
 * @param {*} container - A DOM element ID name
 * @returns  {<void>}
 */

async function typeWriterEffect(file, container) {
  const element = document.querySelector(container); // retrieve container that will have text typed in
  if (!element) {
    console.error("Container not found: ", container);
    return;
  }

  if (typeWriterController[container]) {
    clearTimeout(typeWriterController[container].timeoutId); // cancel previous timeout when new one is invoked
    typeWriterController[container].cancelled = true;
  }

  const controller = {
    cancelled: false,
    timeoutId: null,
  };
  typeWriterController[container] = controller;

  element.innerHTML = ""; // make the current container empty ready for new text to be typed in

  try {
    const response = await fetch(file); // retrieve given file
    if (!response.ok) {
      throw new Error("Failed to load text from file: " + file);
    }

    const text = await response.text(); // extract text from the file
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html"); // parse the text as a html doc with html elements

    const speed = 1;

    /**
     * Recursively types out text from a html document source node into a target parent html
     * element preserving DOM structure and formatting simulating typewriter effect
     *
     * @param {Node} sourceNode - DOM node from the html document to be typed out
     * @param {HTMLElement} targetParent - DOM element into which the text will be typed out
     * @returns {<void>}
     */
    async function typeNode(sourceNode, targetParent) {
      if (controller.cancelled) return;

      if (sourceNode.nodeType === Node.TEXT_NODE) {
        // if node type is text insert/type out text into the live DOM element

        const text = sourceNode.textContent;
        const span = document.createElement("span");
        targetParent.appendChild(span); // add newly created element to the the target live DOM element

        for (let i = 0; i < text.length; i++) {
          if (controller.cancelled) return;
          span.textContent += text[i]; // add text to the newly created element

          await new Promise((res) => {
            controller.timeoutId = setTimeout(res, speed); // typewriter delay effect
          });
        }
      } else if (sourceNode.nodeType === Node.ELEMENT_NODE) {
        // if node type is an element creates identical element and traverse through its child nodes

        const el = document.createElement(sourceNode.tagName);
        for (let attr of sourceNode.attributes) {
          el.setAttribute(attr.name, attr.value);
        }
        targetParent.appendChild(el);

        for (let child of sourceNode.childNodes) {
          await typeNode(child, el);
        }
      }
    }

    for (let node of doc.body.childNodes) {
      // begin typewriting
      await typeNode(node, element);
    }
  } catch (error) {
    element.textContent = error.message;
  }
}



/** Loads a html file and inserts its contents into a container element
/**
 * 
 * @param {*} file - A html file name
 * @param {*} container - A DOM element ID name
 * @returns {<void>}
 */

function loadText(file, container) {
  fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load file: " + response.status);
      }
      return response.text(); // html text from the file
    })
    .then((html) => {
      const element = document.getElementById(container);
      if (!element) {
        console.error("Container not found: ", container);
        return;
      }
      element.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading html file: ", error);
    });
}


/** Sets different background and text colours on the page
 * 
 * @returns {<void>}
 */
function hackerMode() {

  const background = document.querySelectorAll(".body, nav");
  const text = document.querySelectorAll(
    ".text-colour, a, .menu-button, #desktop-nav"
  );

  let backgroundColour = "black";
  let textColour = "#00FF00";

  if (isHackerModeOn) {
    backgroundColour = "white";
    textColour = "rgb(65, 63, 63)";
    isHackerModeOn = false;
  } else {
    isHackerModeOn = true;
  }

  background.forEach((el) => {
    el.style.backgroundColor = backgroundColour;

  });

  text.forEach((el) => {
    // el.style.color = textColour;
    el.style.setProperty("color", textColour, "important");

  });
}




/**
 * On load event
 */

document.addEventListener("DOMContentLoaded", () => {
  typeWriterEffect("about.html", "#main-content");
});



