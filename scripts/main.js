import { translate } from './translations.js'
import './message-list.js';
import './received-ai-message.js'
import './sent-message.js'

translate();
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send-button');
const magicInput = document.getElementById('magic-input')
sendButton.addEventListener('click', () => {
    const messageText = magicInput.value;
    messageList.addSentMessage(messageText);
    magicInput.value = '';
    messageList.addReceivedAiMessage()
})