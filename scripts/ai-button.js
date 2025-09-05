import { getTranslator } from "./translations.js";

export class AiButton extends HTMLElement {
    static observedAttributes = ['text']

    constructor(){
        super();
        this.shadow = undefined;
        this.text = undefined;
    }
    connectedCallback(){
        this.createAndAttachShadow();
    }

    async createAndAttachShadow(){
        const template = document.getElementById('ai-button-template');
        const content = template.content.cloneNode(true);
        await new Promise((resolve) => {
            getTranslator((e) => this.dispatchEvent(e), async (translator) => {
                const buttonText = content.querySelector('#button-text');
                const text = this.getAttribute('text');
                buttonText.setAttribute('data-translation-text', `✨ {{${text}}}`);
                // since 'translateNode' uses xPaths, this has to be evaluated now, before
                // content becomes part of the shadow DOM. See https://issues.chromium.org/issues/440874372
                await translator.translateNode(content);
                resolve();
            })
        })
        if(this.shadow){
            this.shadow.innerHTML = ''
        }else{
            this.shadow = this.attachShadow({mode: 'open'});
        }
        this.shadow.appendChild(content);
        this.shadow.querySelector('button').addEventListener('click', () => {
            const event = new CustomEvent('aibuttonclick', {bubbles: true, composed: true});
            this.dispatchEvent(event);
        })
    }

    attributeChangedCallback(){
        this.createAndAttachShadow();
    }


}

customElements.define('ai-button', AiButton)