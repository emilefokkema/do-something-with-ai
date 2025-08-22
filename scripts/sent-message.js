class SentMessage extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('sent-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        const message = this.getAttribute('content');
        const container = shadow.querySelector('#container');
        const contentContainer = shadow.querySelector('#content-container');
        contentContainer.innerText = message;
        const button = document.createElement('ai-button');
        button.setAttribute('text', 'improvePromptWithAi');
        container.appendChild(button);
    }
}

customElements.define('sent-message', SentMessage)