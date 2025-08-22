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
        const container = this.shadow.querySelector('#content-container');
        const balloon = this.shadow.querySelector('#balloon')
        container.innerText = this.aiMessage.content;
        if(this.aiMessage.loading){
            container.appendChild(document.createTextNode('...'))
        }
        if(this.aiMessage.complete){
            const button = document.createElement('ai-button');
            button.setAttribute('text', 'improveAnswerWithAi');
            balloon.appendChild(button);
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