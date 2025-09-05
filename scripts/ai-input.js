import { getTranslator } from "./translations.js";

class AiInput extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
    }
    async connectedCallback(){
        const template = document.getElementById('ai-input-template');
        const content = template.content.cloneNode(true);
        await new Promise((resolve) => {
            getTranslator((e) => this.dispatchEvent(e), async (translator) => {
                await translator.translateNode(content);
                resolve();
            })
        })
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        const textArea = shadow.querySelector('textarea');
        const sendButton = shadow.querySelector('button');
        addEventListener('keydown', (e) => {
            if(shadow.activeElement !== textArea || e.key !== 'Enter' || e.shiftKey){
                return;
            }
            this.sendValue();
            e.preventDefault();

        }, {capture: true});
        sendButton.addEventListener('click', () => this.sendValue())
    }

    sendValue(){
        if(!this.shadow){
            return;
        }
        const textArea = this.shadow.querySelector('textarea');
        const value = textArea.value;
        if(!value){
            return;
        }
        textArea.value = '';
        this.dispatchEvent(new CustomEvent(
            'aiinputsent',
            {
                detail: { value },
                bubbles: true,
                composed: true
            }
        ))
    }
}

customElements.define('ai-input', AiInput)