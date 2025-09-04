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
function *findTranslatableElements(element){
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
    const response = await fetch('translations.json');
    const obj = await response.json();
    return obj[getLanguage()];
}

/**
 * @param {HTMLElement} element 
 * @param {object} translations
 */
function insertTranslationsIntoTranslatableElement(element, translations){
    for(const attrName of element.getAttributeNames()){
        const match = attrName.match(/^data-translation-(.*)$/);
        if(!match){
            continue;
        }
        const translationProperty = match[1];
        const valueToTranslate = element.getAttribute(attrName);
        const translated = translateText(valueToTranslate, translations);
        element.removeAttribute(attrName);
        if(translationProperty === 'text'){
            element.innerHTML = translated;
        }else{
            element.setAttribute(translationProperty, translated)
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

class Translator {
    constructor(){
        this.translations = undefined;
    }

    /**
     * @param {HTMLElement} element 
     */
    async translateElement(element){
        const translations = await this.getTranslations();
        for(const elementWithTranslation of findTranslatableElements(element)){
            insertTranslationsIntoTranslatableElement(elementWithTranslation, translations);
        }
    }


    async translateTranslatableElements(...elements){
        const translations = await this.getTranslations();
        for(const elementWithTranslation of elements){
            insertTranslationsIntoTranslatableElement(elementWithTranslation, translations);
        }
    }
    /**
     * 
     * @param {string} text 
     */
    async translateText(text){
        const translations = await this.getTranslations();
        return translateText(text, translations);
    }

    async getTranslations(){
        return this.translations = this.translations || await getTranslations();
    }
}

const translator = new Translator();

async function translateTitle(){
    document.title = await translator.translateText(document.title);
}

addEventListener('translatorrequested', ({detail: {callback}}) => {
    callback(translator);
});

translator.translateElement(document.body);
translateTitle();

export function getTranslator(dispatchEvent, callback){
    const event = new CustomEvent('translatorrequested', {
        detail: {
            callback
        },
        bubbles: true,
        composed: true
    });
    dispatchEvent(event);
}
