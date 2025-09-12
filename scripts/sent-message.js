import { getAi } from './ai.js'

class SentMessage extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
        this.aiMessage = undefined;
        this.aiMessageContentUpdatedListener = () => this.setMessageContent();
    }
    connectedCallback(){
        const template = document.getElementById('sent-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        const message = this.getAttribute('content');
        const messageListMessage = shadow.querySelector('message-list-message');
        messageListMessage.setAttribute('text', message);
        messageListMessage.addEventListener('aibuttonclick', () => this.improveWithAi());
    }

    async improveWithAi(){
        const message = await (await getAi(e => this.dispatchEvent(e))).getMessage();
        if(this.aiMessage){
            this.aiMessage.removeEventListener('contentupdated', this.aiMessageContentUpdatedListener);
        }
        this.aiMessage = message;
        message.addEventListener('contentupdated', this.aiMessageContentUpdatedListener)
    }

    setMessageContent(){
        if(!this.aiMessage){
            return;
        }
        const messageListMessage = this.shadow.querySelector('message-list-message');
        let text = this.aiMessage.content;
        if(this.aiMessage.loading){
            text = `${text}...`;
        }
        messageListMessage.setAttribute('text', text);
    }
}

customElements.define('sent-message', SentMessage)