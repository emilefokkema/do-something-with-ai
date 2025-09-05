class SentMessage extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('sent-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        const message = this.getAttribute('content');
        const messageListMessage = shadow.querySelector('message-list-message');
        messageListMessage.setAttribute('text', message);
    }
}

customElements.define('sent-message', SentMessage)