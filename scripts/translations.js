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

/**
 * @param {HTMLElement} element 
 * @returns {Iterable<Element>}
 */
function *findElementsWithTranslations(element){
    const xpe = new XPathEvaluator();
    const nsResolver = element.ownerDocument?.documentElement || element.documentElement;
    const iterator = xpe.evaluate('//*[./@*[starts-with(name(),"data-translation-")]]', element, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
    const length = iterator.snapshotLength;
    for(let i = 0; i < length; i++){
        yield iterator.snapshotItem(i);
    }
}

/**
 * 
 * @param {string} value 
 * @param {object} translations
 * @returns {string}
 */
function translateText(value, translations){
    return value.replace(/\{\{([^\}]+)\}\}/g, (match, group) => getTranslation(translations, group))
}

async function getTranslations(){
    const response = await fetch('/translations.json');
    const obj = await response.json();
    return obj[getLanguage()];
}

/**
 * @param {HTMLElement} element 
 * @param {object} translations
 */
function insertTranslations(element, translations){
    for(const elementWithTranslation of findElementsWithTranslations(element)){
        for(const attrName of elementWithTranslation.getAttributeNames()){
            const match = attrName.match(/^data-translation-(.*)$/);
            if(!match){
                continue;
            }
            const translationProperty = match[1];
            const valueToTranslate = elementWithTranslation.getAttribute(attrName);
            const translated = translateText(valueToTranslate, translations);
            elementWithTranslation.removeAttribute(attrName);
            if(translationProperty === 'text'){
                elementWithTranslation.innerHTML = translated;
            }else{
                elementWithTranslation.setAttribute(translationProperty, translated)
            }
        }
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
    insertTranslations(document.body, translations);
}
