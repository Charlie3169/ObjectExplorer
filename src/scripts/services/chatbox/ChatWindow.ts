export default class ChatWindow {
    private chatContainer: HTMLDivElement;
    private chatLog: HTMLDivElement;
    private inputField: HTMLInputElement;
    private maxMessages: number = 100;
    private userName: string = 'Server';
    private isOpen: boolean = false;

    // Relative sizing variables for chat window elements
    private chatWidthPercent: number = 35;
    private chatHeightPercent: number = 30;
    private chatboxPaddingPercent: number = 1;
    private inputFieldPaddingPercent: number = 3;
    private inputFieldHeightPercent: number = 1;
    private inputFieldBottomPercent: number = 1;
    private fontSizePercent: number = 0.8;
    private cornerPaddingWidth: number = 0.5;
    private cornerPaddingHeight: number = 1;

    constructor() {
        // Main chat container styling
        this.chatContainer = document.createElement('div');
        this.chatContainer.style.position = 'absolute';        
        this.chatContainer.style.left = `${this.cornerPaddingWidth}%`;
        this.chatContainer.style.bottom = `${this.cornerPaddingHeight}%`;
        this.chatContainer.style.width = `${this.chatWidthPercent}vw`;
        this.chatContainer.style.height = `${this.chatHeightPercent}vh`;
        this.chatContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        this.chatContainer.style.color = 'white';
        this.chatContainer.style.padding = `${this.chatboxPaddingPercent}%`;
        this.chatContainer.style.display = 'none';
        this.chatContainer.style.overflow = 'hidden';
        this.chatContainer.style.borderRadius = '8px';
        this.chatContainer.style.fontFamily = 'Arial, sans-serif';
        this.chatContainer.style.fontSize = `${this.fontSizePercent}vw`;

        // Chat log styling
        this.chatLog = document.createElement('div');
        this.chatLog.style.height = '80%';
        this.chatLog.style.overflowY = 'auto';
        this.chatLog.style.marginBottom = '1%';
        this.chatLog.style.paddingRight = '1%';

        // Chat input styling
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.style.width = '100%';
        this.inputField.style.height = `${this.inputFieldHeightPercent}%`;
        //this.inputField.style.bottom = `${this.inputFieldBottomPercent}%`;
        this.inputField.style.border = 'none';
        this.inputField.style.borderRadius = '8px';
        this.inputField.style.outline = 'none';
        this.inputField.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        this.inputField.style.color = 'white';
        this.inputField.style.padding = `${this.inputFieldPaddingPercent}%`;
        this.inputField.style.boxSizing = 'border-box';

        // Append elements to container
        this.chatContainer.appendChild(this.chatLog);
        this.chatContainer.appendChild(this.inputField);
        document.body.appendChild(this.chatContainer);

        // Add scrollbar styles via CSS injection
        const style = document.createElement('style');
        style.textContent = `
            .chat-log::-webkit-scrollbar {
                width: 8px;
            }
            .chat-log::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.5);
                border-radius: 4px;
            }
            .chat-log::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.7);
            }
            .chat-log::-webkit-scrollbar-track {
                background: transparent;
            }
        `;
        document.head.appendChild(style);

        // Apply custom class to the chat log for styling
        this.chatLog.classList.add('chat-log');

        // Event listener for 'Enter' key
        this.inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { //Make config based
                const message = this.inputField.value.trim();
                if (message) {
                    this.addMessage(`<${this.userName}> ${message}`);
                    this.inputField.value = '';
                    // Here, you could handle the message (send to server, etc.)
                }
            }
        });
    }

    open() {
        this.chatContainer.style.display = 'block';
        this.inputField.focus();        
        this.isOpen = true;
    }

    close() {
        this.chatContainer.style.display = 'none';
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    // Method to check if the chat window is open
    isOpenWindow(): boolean {
        return this.isOpen;
    }

    // Method to check if there's text in the input field
    hasInputText(): boolean {
        return this.inputField.value.trim() !== '';
    }

    // Public getter and setter for input field content
    get inputText(): string {
        return this.inputField.value;
    }

    set inputText(value: string) {
        this.inputField.value = value;
    }

    addMessage(message: string) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.overflowWrap = 'break-word';
        messageElement.style.width = '100%';
        messageElement.style.fontSize = `${this.fontSizePercent}vw`;

        this.chatLog.appendChild(messageElement);

        if (this.chatLog.childElementCount > this.maxMessages) {
            this.chatLog.removeChild(this.chatLog.firstChild!);
        }

        this.chatLog.scrollTop = this.chatLog.scrollHeight;
    }
}
