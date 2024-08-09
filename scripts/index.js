window.onload = () => {
    const currentTheme = getPreference('mode');
    document.firstElementChild.setAttribute('data-theme', currentTheme);
    currentTheme === 'dark' ? document.getElementsByClassName('slider')[0].setAttribute("title", "Cambiar a modo claro") : document.getElementsByClassName('slider')[0].setAttribute("title", "Cambiar a modo oscuro");
}

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("encrypTxtBox");
    const encryptBtn = document.getElementById("encryptBtn");
    const decryptBtn = document.getElementById("decryptBtn");
    const secretBox = document.getElementById("secretDiv");
    const clearMsgBtn = document.getElementById("clearMsgBtn");
    const copyMsgBtn = document.getElementById("copyMsgBtn");
    const secretDivDefault = document.getElementById("secretDiv").innerHTML;
    const darkModeBtn = document.getElementById("darkSwitch");
    const theme = {
        name: getThemeName(),
        themeMode: getThemeModePreference()
    }
    
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

    copyMsgBtn.addEventListener('click', () => {
        const textToCopy = secretBox.innerText;
        copyMsgToClipboard(textToCopy);
    });

    darkModeBtn.addEventListener('click', () => {
        const currentTheme = getPreference('mode');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setPreference('mode', newTheme);
        document.firstElementChild.setAttribute('data-theme', newTheme);
        theme.themeMode = newTheme;
        newTheme === 'dark' ? document.getElementsByClassName('slider')[0].setAttribute("title", "Cambiar a modo claro") : document.getElementsByClassName('slider')[0].setAttribute("title", "Cambiar a modo oscuro");
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

const copyMsgToClipboard = async (message) => {
    const textToCopy = message;
    alertMsgDiv = document.createElement('div');
    alertMsgDiv.setAttribute("id", "alertMessageDiv");
    try {
        await navigator.clipboard.writeText(textToCopy);
        alertMsgDiv.setAttribute("class", "alertBox success");
        alertMsgDiv.innerText = "Texto copiado con exito!";
    } catch (err) {
        console.error('Failed to copy text to the clipboard. Error: ', err);
        alertMsgDiv.classList.add = "alertBox error";
        alertMsgDiv.innerText = "Error en la copia del texto al portapapeles!";
    }
    document.body.prepend(alertMsgDiv);
    setTimeout(() => {
        alertMsgDiv.remove();
    }, 3000);
}

const setPreference = (prop_name, prop_value) => {
    localStorage.setItem(prop_name, prop_value);
    return true;
}

const getPreference = (prop_name) => {
    return localStorage.getItem(prop_name);
}

const getThemeModePreference = () => {
    let themeMode = getPreference('mode');

    if(themeMode === null) {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode ? setPreference('mode', 'dark') : setPreference('mode', 'light');
        return isDarkMode ? 'dark' : 'light';
    } else {
        return themeMode;
    }
}

const getThemeName = () => {
    const themeSelected = getPreference('theme') ?? 'default';
    setPreference('theme', themeSelected);
    return themeSelected;
}