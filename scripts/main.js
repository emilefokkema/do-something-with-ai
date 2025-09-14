import './translations.js'
import './message-list.js';
import './received-ai-message.js'
import './sent-message.js'
import './ai-button.js'
import './message-list-message.js'
import './ai-input.js'
import './remaining-message.js'

const messageList = document.getElementById('message-list');
const aiInput = document.querySelector('ai-input');
const questionSuggestionAiButton = document.getElementById('helpWithQuestion');
const improvePageWithAiButton = document.getElementById('improvePageWithAi');
const hero = document.getElementById('hero')

aiInput.addEventListener('aiinputsent', ({detail: { value }}) => {
    messageList.addSentMessage(value);
    messageList.addReceivedAiMessage();
    window.scrollTo(0, document.body.scrollHeight);
});

questionSuggestionAiButton.addEventListener('aibuttonclick', () => {
    aiInput.useAiSuggestion();
});

improvePageWithAiButton.addEventListener('aibuttonclick', () => {
    const otherAiButtons = [];
    const customEvent = new CustomEvent('aibuttoninventoryrequested', {
        detail: {
            reportAiButton: (button) => {
                if(button === improvePageWithAiButton){
                    return;
                }
                otherAiButtons.push(button);
            }
        }
    });
    dispatchEvent(customEvent);
    if(otherAiButtons.length > 0){
        otherAiButtons[Math.floor(Math.random() * otherAiButtons.length)].remove();
        return;
    }
    if(aiInput.isConnected){
        aiInput.remove();
        return;
    }
    if(hero.isConnected){
        hero.remove();
        return;
    }
    improvePageWithAiButton.remove();
    if(messageList.empty){
        document.body.classList.remove('ai')
        document.body.insertBefore(document.createElement('remaining-message'), document.body.firstElementChild)
    }
})
