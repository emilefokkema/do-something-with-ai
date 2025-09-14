import { getAi } from './ai.js'

class RemainingMessage extends HTMLElement{
    constructor(){
        super();
        this.shadow = undefined;
        this.aiMessage = undefined;
        this.aiMessageContentUpdatedListener = () => this.setMessageContent();
    }
    connectedCallback(){
        const template = document.getElementById('remaining-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        this.shadow = shadow;
        shadow.appendChild(content);
        this.setAiMessage();
    }

    async setAiMessage(){
        const message = await (await getAi(e => this.dispatchEvent(e))).getMessage();
        this.aiMessage = message;
        message.addEventListener('contentupdated', this.aiMessageContentUpdatedListener)
    }

    setMessageContent(){
        if(!this.aiMessage){
            return;
        }
        const spanElement = this.shadow.querySelector('span');
        let text = this.aiMessage.content;
        if(this.aiMessage.loading){
            text = `${text}...`;
        }
        spanElement.innerText = text;
    }
}

customElements.define('remaining-message', RemainingMessage)