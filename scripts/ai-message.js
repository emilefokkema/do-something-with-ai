function waitMs(ms){
    return new Promise(res => setTimeout(res, ms));
}

/**
 * 
 * @param {string} content 
 * @returns {AsyncIterable<string>}
 */
async function *readOutContent(content){
    let result = '';
    let startIndex = 0;
    let endIndex = 0;
    await waitMs(200 + Math.floor(Math.random() * 2000));
    do{
        yield result;
        await waitMs(10 + Math.floor(Math.random() * 200));
        startIndex = endIndex;
        endIndex += 2 + Math.floor(Math.random() * 7);
        result += content.substring(startIndex, endIndex);
    }while(startIndex < content.length)
}

export class AiMessage {
    constructor(finalContent){
        this.finalContent = finalContent;
        this.content = '';
        this.loading = false;
        this.complete = false;
        this.emitter = new EventTarget();
    }

    async start(){
        await waitMs(0);
        this.loading = true;
        this.emitContentUpdated();
        for await(const content of readOutContent(this.finalContent)){
            this.content = content;
            this.emitContentUpdated();
        }
        this.loading = false;
        this.complete = true;
        this.emitContentUpdated();
    }

    emitContentUpdated(){
        const event = new CustomEvent('contentupdated');
        this.emitter.dispatchEvent(event);
    }

    addEventListener(type, listener){
        this.emitter.addEventListener(type, listener);
    }

    removeEventListener(type, listener){
        this.emitter.removeEventListener(type, listener);
    }
}