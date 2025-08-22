export class AiButton extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('ai-button-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        const text = this.getAttribute('text');
        const buttonText = shadow.querySelector('#button-text');
        shadow.querySelector('button').addEventListener('click', () => {
            const event = new CustomEvent('aibuttonclick', {bubbles: true, composed: true});
            this.dispatchEvent(event);
        })
        buttonText.setAttribute('data-translation-text', `✨ {{${text}}}`);
        setTimeout(() => {
            const event = new CustomEvent('translationrequested', {detail: buttonText, bubbles: true, composed: true});
            this.dispatchEvent(event);
        }, 0)

    }
}

customElements.define('ai-button', AiButton)