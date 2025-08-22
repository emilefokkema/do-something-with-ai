import { translator } from './translations.js'
import { AiMessage } from './ai-message.js';
import './message-list.js';
import './received-ai-message.js'
import './sent-message.js'

translator.translateElement(document.body);
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send-button');
const helpQuestionButton = document.getElementById('help-question-button');
const magicInput = document.getElementById('magic-input');
let aiAnswerCount = 0;

sendButton.addEventListener('click', () => {
    const messageText = magicInput.value;
    messageList.addSentMessage(messageText);
    magicInput.value = '';
    letAiAnswer();
});

helpQuestionButton.addEventListener('click', () => {
    letAiAnswer();
})

async function letAiAnswer(){
    const answer = aiAnswerCount === 0 ? '{{iCannotHelpYou}}' : '{{seeEarlierAnswer}}';
    aiAnswerCount++;
    const aiMessage = new AiMessage(await translator.translateText(answer));
    messageList.addReceivedAiMessage(aiMessage);
    aiMessage.start();
}