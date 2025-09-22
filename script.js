const typeWriterController = {}

/**
 * Function that types out text using the typewriter effect
 */
async function typeWriterEffect(file, container) {

    const element = document.querySelector(container); // retrieve container that will have text typed in
    if(!element) {
      console.error("Container not found: ", container);
      return;
    }

    if(typeWriterController[container]) {
      clearTimeout(typeWriterController[container].timeoutId); // cancel timeout of the previous function execution
      typeWriterController[container].cancelled = true;
    }

    const controller = { // controller of the current typewriting execution 
      cancelled: false,
      timeoutId: null
    };

    typeWriterController[container] = controller;

    element.textContent = "";
    try{
      const response = await fetch(file); // retrieve provided file

      if(!response.ok) {
        throw new Error("Failed to load text from file: " + file);
      }

      const text = await response.text(); // retrieve text from file
      const parser = new DOMParser();
      const docFile = parser.parseFromString(text, 'text/html');
      const fullText = docFile.body.textContent;

      
      const speed = 5;
      let i = 0;
      function typeWriter() {
        if(controller.cancelled) { // if execution is cancelled
          return;
        }
        if (i < fullText.length) {
          element.textContent += fullText.charAt(i); // fill the container with text one character at a time
          i++;
          controller.timeoutId = setTimeout(typeWriter, speed);
        }
      }

      typeWriter();
    }
    catch (error){
      element.textContent = error.message;

    }  
}




/** Load html from a file and place it inside a container */
function loadText(file, container) {
  
  fetch(file) 
  .then(response => {
    if(!response.ok) {
      throw new Error("Failed to load file: " + response.status);
    }
    return response.text(); // html text from the file
  })
  .then(html => {
    const element = document.getElementById(container);
    if (!element) {
      console.error("Container not found: ", container);
      return;
    }
    element.innerHTML = html;
  })
  .catch(error => {
    console.error("Error loading html file: ", error);
  });


}


/**
 * Stop typewriting effect when other buttons are clicked
 */
document.querySelectorAll('#education-button', '#projects-button').forEach( button =>{
  button.addEventListener('click', () => {
    Object.values(typeWriterController).forEach(controller => {
      controller.cancelled = true;
      if(controller.timeoutId) {
        clearTimeout(controller.timeoutId);
      }
    })
    
  })
})


/** 
 * On-load function
 */

document.addEventListener(
  "DOMContentLoaded", () => {
    typeWriterEffect("about.html", "#main-content");
  }

);


