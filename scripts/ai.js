import { getTranslatorOnce } from './translations.js'
import { AiMessage } from './ai-message.js';

class Ai {
    constructor(){
        this.answerCount = 0;
    }

    /**
     * @returns {AiMessage}
     */
    async getMessage(){
        const answer = this.answerCount === 0 ? '{{iCannotHelpYou}}' : '{{seeEarlierAnswer}}';
        this.answerCount++;
        const translator = await getTranslatorOnce(dispatchEvent);
        const message = new AiMessage(await translator.translateText(answer));
        message.start();
        return message;
    }
}

const ai = new Ai();


addEventListener('airequested', ({detail: {callback}}) => {
    callback(ai);
});

/**
 * 
 * @param {(e: CustomEvent) => void} dispatchEvent 
 * @returns {Promise<Ai>}
 */
export function getAi(dispatchEvent){
    return new Promise(res => {
        const event = new CustomEvent('airequested', {
            detail: {
                callback: res
            },
            bubbles: true,
            composed: true
        });
        dispatchEvent(event);
    })
}