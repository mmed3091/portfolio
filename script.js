/**
 * Function that types out text from a certain element giving the typewriter effect
 */
function typeWriterEffect() {


    const elements = document.querySelectorAll(".typewriter");
    const speed = 50;


    elements.forEach((element) => {
        const text = element.textContent;
        element.textContent = "";

        let i = 0;
        function typeWriter() {
          if (i < text.length) {
            element.textContent += text.charAt(i); // fill the element with teext one characte at a time
            i++;
            setTimeout(typeWriter, speed);
          }
        }

        typeWriter();

    })
    
}

function loadText(file) {

  fetch(file).then(response => {
    if(!response.ok) {
      throw new Error("Failed to load text from: " + file);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById("main-content").innerHTML = data;
  })
  .catch(error => {
    document.getElementById("main-content").textContent = error.message;
  })
}



/** FUNCTION CALLS */

document.addEventListener("DOMContentLoaded", typeWriterEffect);


