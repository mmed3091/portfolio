// function toggleMenu() {
//     const menu = document.querySelector(".menu-links");
//     const icon = document.querySelector(".hamburger-icon");
//     menu.classList.toggle("open");
//     icon.classList.toggle("open");
// }

/**
 * Function that types out text from a certain element giving the typewriter effect
 */
function typeWriterEffect() {


    const elements = document.querySelectorAll(".typewriter");
    const speed = 100;


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

/** FUNCTION CALLS */

document.addEventListener("DOMContentLoaded", typeWriterEffect);


