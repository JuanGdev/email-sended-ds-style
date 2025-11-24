//  CREATING THE HTML ELEMENTS

const baseDiv = document.createElement('div');
baseDiv.style.position = 'fixed';
baseDiv.style.background = 'rgba(0, 0, 0, 0.77)';
baseDiv.style.top = '0';
baseDiv.style.left = '0';
baseDiv.style.zIndex = '2147483646'
baseDiv.style.display = 'flex';
baseDiv.style.justifyContent = 'center';
baseDiv.style.alignItems = 'center';
baseDiv.style.height = '100vh';
baseDiv.style.width = '100vw';

const messageDiv = document.createElement('div');
messageDiv.style.backgroundImage = 'radial-gradient(circle at center, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)';
messageDiv.style.position = 'fixed';
messageDiv.style.top = '43vh';
messageDiv.style.left = '0';

// 3. Dale un z-index muy alto para que se muestre por encima de todo.
messageDiv.style.zIndex = '2147483647'; // El z-index más alto posible

messageDiv.style.backgroundOrigin = 'border-box';
messageDiv.style.backgroundClip = 'padding-box';
messageDiv.style.color = '#ffff6b';
messageDiv.style.display = 'flex';
messageDiv.style.justifyContent = 'center';
messageDiv.style.alignItems = 'center';
messageDiv.style.textAlign = 'center';
messageDiv.style.height = '15vh';
messageDiv.style.width = '100vw';
messageDiv.style.fontSize = '100px';
messageDiv.style.fontFamily = 'adobe-garamound-pro';
messageDiv.textContent = "EMAIL SENDED";

const audioEmail = new Audio(chrome.runtime.getURL('images/audio_effect.mp3')); 
audioEmail.playbackRate = 1.0;

const emailSendedFade = [
  { opacity: "0" },
  { opacity: "1" },
  { opacity: "0" },
];

const fadeTiming = {
  duration: 6000,
  iterations: 1,
};

//  reading input from popup


//  Obtiene el elemento desde el doom (pero el boton enviar aparece hasta después)
var sendButton = document.querySelector("[aria-label='Enviar']")

// Select the node that will be observed for mutations
const targetNode = document.body
var btnFounded = false

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

//  read string from messageTextbox if empty, use a default value

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  if(btnFounded) return;
  // 1. Declaramos una variable para guardar lo que encontremos.
  let found = null;
  //  Revisar cada cambio que se registre en la página
    for (const mutation of mutationList) {
      //  para revisar que los tipos de mutation se refiere a que se agregó o quitó algo (childList)
      if (mutation.type === "childList") {
        for (const oneNode of mutation.addedNodes){
          //  Comprobando que sea un elemento HTML antes de continuar
          if(oneNode.nodeType === Node.ELEMENT_NODE)
          {
          found = oneNode.querySelector("[aria-label='Enviar']");
          }
            //  just if we found a button
            if (found)
              {
                sendButton = found;
                btnFounded = true;
                break;
              }
          }
        }
      }
  if(sendButton)
  {
    //  create the callback function one time and link it with the click listener for the sendButton
    const handler = (e) => {
        console.log("Enviar presionado");
        document.body.appendChild(audioEmail);

        document.body.appendChild(baseDiv);
        baseDiv.animate(emailSendedFade, fadeTiming);  

        document.body.appendChild(messageDiv);
        messageDiv.animate(emailSendedFade, fadeTiming);

        audioEmail.currentTime = 0;
        audioEmail.play();        
                // Lo quita después de 3 segundos
        setTimeout(() => {
                if (messageDiv.parentNode) {
                  messageDiv.parentNode.removeChild(messageDiv);
                }
                if(baseDiv.parentNode)
                {
                  baseDiv.parentNode.removeChild(baseDiv);
                }
        }, 6000);
      };
      sendButton.addEventListener("click", handler, {once: false});
  };
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);