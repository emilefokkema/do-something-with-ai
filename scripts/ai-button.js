import { findTranslatableElements } from './translations.js'

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
        // since 'findTranslatableElements' uses xPaths, this has to be evaluated now, before
        // content becomes part of the shadow DOM. See https://issues.chromium.org/issues/440874372
        const translatable = [...findTranslatableElements(buttonText)];
        setTimeout(() => {
            const event = new CustomEvent('translationrequested', {detail: {translatableElements: translatable}, bubbles: true, composed: true});
            this.dispatchEvent(event);
        }, 0)
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
    }
}

customElements.define('ai-button', AiButton)