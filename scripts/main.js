import './translations.js'
import { getTranslator } from './translations.js'
import { AiMessage } from './ai-message.js';
import './message-list.js';
import './received-ai-message.js'
import './sent-message.js'
import './ai-button.js'
import './message-list-message.js'

const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send-button');
const magicInput = document.getElementById('magic-input');
const header = document.getElementById('header');
let aiAnswerCount = 0;

sendButton.addEventListener('click', () => {
    const messageText = magicInput.value;
    if(!messageText){
        return;
    }
    if(messageText === '+'){
        addAiButton();
    }else{
        messageList.addSentMessage(messageText);
        letAiAnswer();
    }
    magicInput.value = '';
});

addEventListener('aibuttonclick', () => {
    letAiAnswer();
})

function addAiButton(){
    const button = document.createElement('ai-button');
    button.setAttribute('text', 'anotherAiButton');
    header.appendChild(button);
}

async function letAiAnswer(){
    const answer = aiAnswerCount === 0 ? '{{iCannotHelpYou}}' : '{{seeEarlierAnswer}}';
    aiAnswerCount++;
    getTranslator(dispatchEvent, async (translator) => {
        const aiMessage = new AiMessage(await translator.translateText(answer));
        messageList.addReceivedAiMessage(aiMessage);
        aiMessage.start();
        window.scrollTo(0, document.body.scrollHeight);
    })

}