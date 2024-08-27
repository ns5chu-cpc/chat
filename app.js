// app.js

const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendButton = document.getElementById('sendButton');

// ローカルストレージからメッセージを読み込み
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chat.appendChild(messageElement);
    });
    chat.scrollTop = chat.scrollHeight;
}

// メッセージをローカルストレージに保存
function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}

// メッセージ送信
sendButton.addEventListener('click', function() {
    const message = input.value;
    if (message.trim() !== '') {
        saveMessage(message);
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
        input.value = '';
    }
});

// Enterキーでメッセージを送信
input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// 初期メッセージを読み込む
loadMessages();
