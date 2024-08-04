const encodeText = (text) => {
    const substitutions = {
        'e': 'enter',
        'i': 'aimes',
        'a': 'ai',
        'o': 'ober',
        'u': 'ufat'
    };

    let substitutedText = '';

    // We are going to walk the text as an array and the letters in substitution will be changed to the equivalent value
    for (let char of text) {
        // if char exists in array will substitute, otherwise it will just skip to the next char
        if (substitutions[char]) {
            substitutedText += substitutions[char];
        } else {
            substitutedText += char;    
        }
    }

    return substitutedText;
}

const decodeText = (text) => {
    // we will create an array of objects that later will be walked using forEach
    const substitutions = [
        {sub: 'enter', letter: 'e'},
        {sub: 'aimes', letter: 'i'},
        {sub: 'ai', letter: 'a'},
        {sub: 'ober', letter: 'o'},
        {sub: 'ufat', letter: 'u'}
    ];

    let decryptedText = text;

    substitutions.forEach(({sub, letter}) => {
        let regex = new RegExp(sub, 'g');       // construct regular expression to found all chars
        decryptedText = decryptedText.replace(regex, letter);   // Using replace and providing regex expression
    });

    return decryptedText;
}