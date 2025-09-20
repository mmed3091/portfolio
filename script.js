/**
 * Function that types out text from a certain element giving the typewriter effect
 */
async function typeWriterEffect(file, container) {

    const element = document.querySelector(container); // retrieve container that will have text typed in
    if(!element) {
      console.error("Container not found: ", container);
      return;
    }

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
        if (i < fullText.length) {
          element.textContent += fullText.charAt(i); // fill the container with text one character at a time
          i++;
          setTimeout(typeWriter, speed);
        }
      }

      typeWriter();
    }
    catch (error){
      element.textContent = error.message;

    }  
}



/** FUNCTION CALLS */

// document.addEventListener("DOMContentLoaded", typeWriterEffect);


