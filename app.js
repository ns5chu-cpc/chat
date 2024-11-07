let localConnection;
let sendChannel;
let receiveChannel;

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages-container');

// メッセージの送信
sendButton.addEventListener('click', sendMessage);

// WebRTCの接続作成
function startConnection() {
    localConnection = new RTCPeerConnection();
    sendChannel = localConnection.createDataChannel('sendDataChannel');
    
    // 受信チャンネル
    localConnection.ondatachannel = receiveChannelCallback;

    // WebRTCのofferを生成
    localConnection.createOffer()
        .then(offer => {
            return localConnection.setLocalDescription(offer);
        })
        .then(() => {
            // OfferのSDPを受け取って、相手に送信
            // (ここでは単にコンソールに表示して、後で実際のシグナリングを追加する)
            console.log(localConnection.localDescription);
        })
        .catch(err => {
            console.error('Error creating offer:', err);
        });
}

// メッセージ送信
function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        sendChannel.send(message);
        displayMessage('You', message);
        messageInput.value = '';
    }
}

// メッセージ表示
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
}

// 受信チャンネルのコールバック
function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event) {
        displayMessage('Peer', event.data);
    };
}

// ページロード時に接続を開始
window.onload = startConnection;
