import { translator } from './translations.js'
import { AiMessage } from './ai-message.js';
import './message-list.js';
import './received-ai-message.js'
import './sent-message.js'
import './ai-button.js'
import { AiButton } from './ai-button.js'

translator.translateElement(document.body);
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send-button');
const magicInput = document.getElementById('magic-input');
let aiAnswerCount = 0;

sendButton.addEventListener('click', () => {
    const messageText = magicInput.value;
    messageList.addSentMessage(messageText);
    magicInput.value = '';
    letAiAnswer();
});

addEventListener('translationrequested', (e) => {
    translator.translateElement(e.detail)
})

addEventListener('aibuttonclick', e => {
    console.log('ai button click')
    letAiAnswer();
})

async function letAiAnswer(){
    const answer = aiAnswerCount === 0 ? '{{iCannotHelpYou}}' : '{{seeEarlierAnswer}}';
    aiAnswerCount++;
    const aiMessage = new AiMessage(await translator.translateText(answer));
    messageList.addReceivedAiMessage(aiMessage);
    aiMessage.start();
}