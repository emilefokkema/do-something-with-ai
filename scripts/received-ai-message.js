class ReceivedAiMessage extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
        this.aiMessage = undefined;
    }
    connectedCallback(){
        const template = document.getElementById('received-ai-message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        this.setMessageContent();
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

    /**
     * 
     * @param {import('./ai-message.js').AiMessage} aiMessage 
     */
    setMessage(aiMessage){
        this.aiMessage = aiMessage;
        aiMessage.addEventListener('contentupdated', () => {
            this.setMessageContent();
        })
    }
}

customElements.define('received-ai-message', ReceivedAiMessage)