document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("encrypTxtBox");
    const encryptBtn = document.getElementById("encryptBtn");
    const decryptBtn = document.getElementById("decryptBtn");
    const secretBox = document.getElementById("secretDiv");
    const clearMsgBtn = document.getElementById("clearMsgBtn");
    const copyMsgBtn = document.getElementById("copyMsgBtn");
    const secretDivDefault = document.getElementById("secretDiv").innerHTML;
    
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    encryptBtn.classList.add("disabled");
    decryptBtn.classList.add("disabled");
    clearMsgBtn.style = "display: none";
    copyMsgBtn.style = "display: none";
    textInput.value = "";
    
    textInput.addEventListener("input", () => {
        if (textInput.value.trim() === "") {
            encryptBtn.disabled = true;
            decryptBtn.disabled = true;
            encryptBtn.classList.add("disabled");
            decryptBtn.classList.add("disabled");
            clearMsgBtn.style = "display: none";
        } else {
            encryptBtn.disabled = false;
            decryptBtn.disabled = false;
            encryptBtn.classList.remove("disabled");
            decryptBtn.classList.remove("disabled");
        }
    });

    encryptBtn.addEventListener('click', () => {
        const textToEncrypt = textInput.value;
        const encryptedText = encodeText(textToEncrypt);
        clearMsgBtn.style = "display: block";
        copyMsgBtn.style = "display: block";
        secretBox.innerText = encryptedText;
    });

    decryptBtn.addEventListener('click', () => {
        const textToDecrypt = textInput.value;
        const decryptedText = decodeText(textToDecrypt);
        clearMsgBtn.style = "display: block";
        copyMsgBtn.style = "display: block";
        secretBox.innerText = decryptedText;
    });

    clearMsgBtn.addEventListener('click', () => {
        textInput.value = "";
        secretDiv.innerHTML = secretDivDefault;
        clearMsgBtn.style = "display: none";
        copyMsgBtn.style = "display: none";
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollMaxPosition = document.body.scrollHeight - windowHeight;
        const animationPoint = scrollMaxPosition * 0.8;
        const footer = document.getElementById('footer');

        if (scrollPosition > animationPoint) {
            footer.style.opacity = "1";
        } else {
            footer.style.opacity = "0";
        }
    });
});