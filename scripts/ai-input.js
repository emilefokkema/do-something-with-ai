import { getTranslator } from "./translations.js";
import { getAi } from './ai.js'

class AiInput extends HTMLElement {
    constructor(){
        super();
        this.shadow = undefined;
        this.aiMessage = undefined;
        this.aiMessageContentUpdatedListener = () => this.setTextAreaValue();
    }
    async connectedCallback(){
        const template = document.getElementById('ai-input-template');
        const content = template.content.cloneNode(true);
        await new Promise((resolve) => {
            getTranslator((e) => this.dispatchEvent(e), async (translator) => {
                await translator.translateNode(content);
                resolve();
            })
        })
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(content);
        this.shadow = shadow;
        const textArea = shadow.querySelector('textarea');
        const sendButton = shadow.querySelector('button');
        addEventListener('keydown', (e) => {
            if(shadow.activeElement !== textArea || e.key !== 'Enter' || e.shiftKey){
                return;
            }
            this.sendValue();
            e.preventDefault();

        }, {capture: true});
        sendButton.addEventListener('click', () => this.sendValue())
    }

    async useAiSuggestion(){
        const message = await (await getAi(e => this.dispatchEvent(e))).getMessage();
        if(this.aiMessage){
            this.aiMessage.removeEventListener('contentupdated', this.aiMessageContentUpdatedListener);
        }
        this.aiMessage = message;
        message.addEventListener('contentupdated', this.aiMessageContentUpdatedListener)
    }

    setTextAreaValue(){
        if(!this.aiMessage){
            return;
        }
        const textArea = this.shadow.querySelector('textarea');
        let text = this.aiMessage.content;
        if(this.aiMessage.loading){
            text = `${text}...`;
        }
        textArea.value = text;
    }

    sendValue(){
        if(!this.shadow){
            return;
        }
        const textArea = this.shadow.querySelector('textarea');
        const value = textArea.value;
        if(!value){
            return;
        }
        textArea.value = '';
        this.dispatchEvent(new CustomEvent(
            'aiinputsent',
            {
                detail: { value },
                bubbles: true,
                composed: true
            }
        ))
    }
}

customElements.define('ai-input', AiInput)