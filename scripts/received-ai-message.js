class ReceivedAiMessage extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('received-ai-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
    }
}

customElements.define('received-ai-message', ReceivedAiMessage)