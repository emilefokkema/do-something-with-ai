class MessageListMessage extends HTMLElement {
    static observedAttributes = ['text', 'ai-button-text']
    constructor(){
        super();
        this.shadow = undefined;
    }
    connectedCallback(){
        const template = document.getElementById('message-template');
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        this.shadow = shadow;
        shadow.appendChild(content);
        this.setState();
    }

    attributeChangedCallback(){
        this.setState();
    }

    setState(){
        if(!this.shadow){
            return;
        }
        const container = this.shadow.querySelector('.container');
        const text = this.getAttribute('text');
        const contentContainer = this.shadow.querySelector('p');
        contentContainer.innerText = text;

        const variant = this.getAttribute('variant');
        if(variant === 'answer'){
            container.classList.add('answer');
        }
        
        const aiButtonText = this.getAttribute('ai-button-text');
        if(!aiButtonText){
            return;
        }
        const aiButton = this.shadow.querySelector('ai-button');
        
        container.classList.add('has-button');
        aiButton.setAttribute('text', aiButtonText);
    }
}

customElements.define('message-list-message', MessageListMessage)