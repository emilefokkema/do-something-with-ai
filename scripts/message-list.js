class MessageList extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
        this.empty = true;
        this.container = undefined;
    }

    connectedCallback(){
        const template = document.getElementById('message-list-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        this.container = shadow.querySelector('#container');
    }

    addMessage(messageElement){
        this.container.appendChild(messageElement);
        if(!this.empty){
            return;
        }
        this.container.classList.add('nonempty');
        this.empty = false;
    }

    addReceivedAiMessage(){
        const messageElement = document.createElement('received-ai-message');
        this.addMessage(messageElement)
    }

    addSentMessage(message){
        const messageElement = document.createElement('sent-message');
        messageElement.setAttribute('content', message);
        this.addMessage(messageElement)
    }
}

customElements.define('message-list', MessageList)