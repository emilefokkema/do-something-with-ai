import { getAi } from './ai.js'

class ReceivedAiMessage extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
        this.aiMessage = undefined;
        this.aiMessageContentUpdatedListener = () => this.setMessageContent();
    }
    async connectedCallback(){
        const template = document.getElementById('received-ai-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        await this.setAiMessage();
        const messageElement = this.shadow.querySelector('message-list-message');
        messageElement.addEventListener('aibuttonclick', () => this.setAiMessage());
    }

    async setAiMessage(){
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
        const messageElement = this.shadow.querySelector('message-list-message');
        let text = this.aiMessage.content;
        if(this.aiMessage.loading){
            text = `${text}...`;
        }
        messageElement.setAttribute('text', text);
        if(this.aiMessage.complete){
            messageElement.setAttribute('ai-button-text', 'improveAnswerWithAi')
        }
    }
}

customElements.define('received-ai-message', ReceivedAiMessage)