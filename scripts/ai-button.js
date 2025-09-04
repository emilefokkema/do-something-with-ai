import { getTranslator } from "./translations.js";

export class AiButton extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('ai-button-template');
        const content = template.content.cloneNode(true);
        content.querySelector('button').addEventListener('click', () => {
            const event = new CustomEvent('aibuttonclick', {bubbles: true, composed: true});
            this.dispatchEvent(event);
        })
        
        const text = this.getAttribute('text');
        const buttonText = content.querySelector('#button-text');

        buttonText.setAttribute('data-translation-text', `✨ {{${text}}}`);
        getTranslator((e) => this.dispatchEvent(e), async (translator) => {
            // since 'translateElement' uses xPaths, this has to be evaluated now, before
            // content becomes part of the shadow DOM. See https://issues.chromium.org/issues/440874372
            await translator.translateElement(buttonText);
            const shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(content);
        })
    }
}

customElements.define('ai-button', AiButton)