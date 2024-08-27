window.onload = () => {
    document.body.style.visibility = "visible";
    const currentTheme = getThemeModePreference();
    document.firstElementChild.setAttribute('data-theme', currentTheme);
    showSwitchStatus(currentTheme);
    showLoader();
}

document.addEventListener('readystatechange', () => {
    const loaderDiv = document.getElementById("loader");
    const currentTheme = getThemeModePreference();

    loaderDiv.setAttribute('data-theme', currentTheme);

    if (document.readyState !== 'complete') {
        showLoader(true);
    } else {
        showLoader();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    listAvailableLanguages();
    const textInput = document.getElementById("encrypTxtBox");
    const encryptBtn = document.getElementById("encryptBtn");
    const decryptBtn = document.getElementById("decryptBtn");
    const secretBox = document.getElementById("secretDiv");
    const clearMsgBtn = document.getElementById("clearMsgBtn");
    const copyMsgBtn = document.getElementById("copyMsgBtn");
    const secretDiv = secretBox.cloneNode(true);
    const darkModeBtn = document.getElementById("darkSwitch");
    const langSwitcher = document.getElementById("langBar");
    const theme = {
        name: getThemeName(),
        themeMode: getThemeModePreference()
    }
    
    showLoader(true);
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    encryptBtn.classList.add("disabled");
    decryptBtn.classList.add("disabled");
    clearMsgBtn.style = "display: none";
    copyMsgBtn.style = "display: none";
    textInput.value = "";
    document.getElementById("footer").style.visibility = "hidden";
    
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

    encryptBtn.addEventListener('click', async() => {
        let textToEncrypt = textInput.value;
        let validText = detectForbidChars(textToEncrypt);
        if (validText) {
            const userResponse = await showModal();
           
           // If user accepts we must substitute chars, if declines we leave the chars and convert msg, if aborts we exit conversion
           switch(userResponse) {
                case 'decline':
                    break;
                case 'accept':
                        let text2Convert = String(textToEncrypt);
                        text2Convert = text2Convert.toLocaleLowerCase();
                        textToEncrypt = convertForbidChars(text2Convert);
                    break;
                case 'abort':
                default:
                        return;
                    break;
            }
        } 
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
        let preferedLang = getPreference('lang') ?? 'es';
        textInput.value = "";
        secretBox.replaceWith(secretDiv.cloneNode(true));
        clearMsgBtn.style = "display: none";
        copyMsgBtn.style = "display: none";
        encryptBtn.disabled = true;
        decryptBtn.disabled = true;
        encryptBtn.classList.add("disabled");
        decryptBtn.classList.add("disabled");
        loadLanguage(preferedLang);
        location.reload();
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
        newTheme === 'dark' ? document.getElementsByClassName('slider')[0].setAttribute("title", translateString('lightModeSwitch', "Cambiar a modo claro")) : document.getElementsByClassName('slider')[0].setAttribute("title", translateString('darkModeSwitch', "Cambiar a modo oscuro"));
    });

    langSwitcher.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        setPreference('lang', selectedLang);
        loadLanguage(selectedLang);
        location.reload();
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollMaxPosition = document.body.scrollHeight - windowHeight;
        const animationPoint = scrollMaxPosition * 0.8;
        const footer = document.getElementById('footer');
        const footerLinks = document.getElementsByClassName('authorLinks')[0];

        if (scrollPosition > animationPoint) {
            footer.style.opacity = "1";
            footerLinks.style.display = "flex";
            footer.style.visibility = "visible";
        } else {
            footer.style.opacity = "0";
            footerLinks.style.display = "none";
            footer.style.visibility = "hidden";
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
        alertMsgDiv.innerText = translateString('copySuccess', "Texto copiado con éxito!");
    } catch (err) {
        console.error('Failed to copy text to the clipboard. Error: ', err);
        alertMsgDiv.classList.add = "alertBox error";
        alertMsgDiv.innerText = translateString('copyFailed', "Error en la copia del texto al portapapeles!");
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

const showSwitchStatus = (currentTheme) => {
    const switchBtn = document.getElementById("darkSwitch");
    let strSwitch = "";

    if(currentTheme === 'dark') {
        switchBtn.checked = true;
        strSwitch = translateString('lightModeSwitch',"Cambiar a modo claro");
    } else {
        strSwitch = translateString('darkModeSwitch', "Cambiar a modo oscuro");
        switchBtn.checked = false;
    } 
    document.getElementsByClassName('slider')[0].setAttribute("title", strSwitch);
    return true;
}

const listAvailableLanguages = () => {
    const languages = [
        {name: "English", code: "en"},
        {name: "Spanish", code: "es"}
    ];

    const preferedLang = getPreference('lang') ?? 'es';
    const langOptionSelect = Array.from(document.getElementById("langBar").options).map(option => option.value);

    languages.map((language) => {
        if(langOptionSelect.includes(language.code)) return;

        const option = document.createElement("option");
        option.value = language.code;
        option.text = language.name;
        option.selected = language.code === preferedLang;
        document.getElementById("langBar").options.add(option);
    });

    loadLanguage(preferedLang);
    return;
}

const loadLanguage = (lang) => {
    document.readyState = 'loading';
    showLoader(true);
    fetchLanguage(lang).then(translations => {
        const elementsToTranslate = document.querySelectorAll('[data-i18n-handler]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n-handler');
            translatElement(element, translations[key]);
        });
    }).catch(err => {
        console.error('Error loading language file:', err);
    });
    document.readyState = 'complete';
    showLoader();
}

const showLoader = (show = false) => {
    const loaderDiv = document.getElementById("loader");
    const workArea = document.getElementById("alura-encoder");

    if(show) {
        workArea.style = "display: none";
        document.body.style = "overflow: hidden";
        loaderDiv.style = "display: flex";
    } else {
        workArea.style = "display: flex";
        document.body.style = "overflow: auto";
        loaderDiv.style = "display: none";
    }
    return;
}

const fetchLanguage = async (lang) => {
    const response = await fetch(`./languages/${lang}.json`);
    const data = await response.json();
    setPreference(`language_${lang}`, JSON.stringify(data));     // We will cache the fetched file for dynamic messages used in translateString
    return data;
}

const translatElement = (element, text) => {
    if (!element || text === undefined) return;

    // Create a temporary div to hold the new content and evaluate text safely
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    // Update only the text nodes without affecting other child elements
    if(element.childNodes.length > 0) {
        let textIndex = 0;
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (tempDiv.childNodes[textIndex]) {
                    if(node.nodeValue !== ''){
                        node.nodeValue = tempDiv.childNodes[textIndex].nodeValue;
                        textIndex++;
                    }  
                } 
            } 
        });
    } else {
        element.setAttribute('placeholder', text);
    }
        
    if(element.style.display !== 'none') {
        // Repaint the element to reapply styles
        element.style.display = 'none';
        element.offsetHeight; // Trigger a reflow
        element.style.display = '';
    } else {
        element.style.display = '';
        element.style.display = 'none';
    }
}

const translateString = (key, defaultMessage) => {
    const stringDictionary = JSON.parse(getPreference(`language_${getPreference('lang')}`));
    return stringDictionary[key] || defaultMessage;
}

const showModal = () => {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal');
        const acceptModal = document.getElementById('modalAccept');
        const cancelModal = document.getElementById('modalDecline');
        const closeModal = document.getElementById('modalClose');
        const span = document.getElementById('modalCloseBtn');

        modal.style.display = "inline";
        document.body.style.overflow = "hidden";
        span.innerHTML = "&times;";
        span.setAttribute("title", translateString('modalCloseBtn', "Cerrar"));

        span.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            resolve('abort');
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            resolve('abort');
        });

        acceptModal.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            resolve('accept');
        });

        cancelModal.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            resolve('decline');
        });
    });
}