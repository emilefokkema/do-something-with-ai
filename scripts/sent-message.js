class SentMessage extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('sent-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        const message = this.getAttribute('content');
        const container = shadow.querySelector('#container');
        container.innerText = message;
    }
}

customElements.define('sent-message', SentMessage)