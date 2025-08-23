const translationAttributeName = 'data-translation-text';

function getTranslation(translations, key){
    if(!/^[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)*$/.test(key)){
        return key
    }
    let match = undefined;
    let value = translations;
    const regex = /[a-zA-Z][a-zA-Z0-9_-]*/g
    while((match = regex.exec(key)) !== null){
        value = value[match[0]]
    }
    return value;
}

async function getTranslations(){
    const response = await fetch('/translations.json');
    const obj = await response.json();
    return obj[getLanguage()];
}

/**
 * @param {HTMLElement} element 
 */
function insertTranslations(element, translations){
    const elementsWithTranslation = element.querySelectorAll(`[${translationAttributeName}]`);
    for(const elementWithTranslation of elementsWithTranslation){
        const attibuteValue = elementWithTranslation.getAttribute(translationAttributeName);
        elementWithTranslation.removeAttribute(translationAttributeName);
        const newText = attibuteValue.replace(/\{\{([^\}]+)\}\}/g, (match, group) => getTranslation(translations, group))
        elementWithTranslation.innerHTML = newText;
    }
}

/**
 * @returns {string}
 */
function getLanguage(){
    const navigatorLanguage = navigator.language;
    if(/^en(?:\W|$)/.test(navigatorLanguage)){
        return 'en';
    }
    if(/^nl(?:\W|$)/.test(navigatorLanguage)){
        return 'nl';
    }
    return 'en';
}

export async function translate(){
    const translations = await getTranslations();
    insertTranslations(document.body, translations)
}
