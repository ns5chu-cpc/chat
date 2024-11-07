let localConnection;
let sendChannel;
let receiveChannel;

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages-container');

const offerSdp = document.getElementById('offer-sdp');
const sendOfferButton = document.getElementById('send-offer');
const answerSdp = document.getElementById('answer-sdp');
const sendAnswerButton = document.getElementById('send-answer');
const iceCandidates = document.getElementById('ice-candidates');
const sendIceButton = document.getElementById('send-ice');

// WebRTCの接続開始
function startConnection() {
    localConnection = new RTCPeerConnection();

    // 送信チャネル作成
    sendChannel = localConnection.createDataChannel('sendDataChannel');
    
    // 受信チャネルを設定
    localConnection.ondatachannel = receiveChannelCallback;

    // ICE候補の交換
    localConnection.onicecandidate = event => {
        if (event.candidate) {
            iceCandidates.value += JSON.stringify(event.candidate) + '\n';
        }
    };
}

// メッセージ送信
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        sendChannel.send(message);
        displayMessage('You', message);
        messageInput.value = '';
    }
});

// メッセージ表示
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
}

// 受信チャネルの設定
function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = event => {
        displayMessage('Peer', event.data);
    };
}

// Offerを送信
sendOfferButton.addEventListener('click', () => {
    localConnection.createOffer()
        .then(offer => {
            return localConnection.setLocalDescription(offer);
        })
        .then(() => {
            offerSdp.value = JSON.stringify(localConnection.localDescription);
        })
        .catch(err => console.error('Offer creation failed:', err));
});

// Answerを送信
sendAnswerButton.addEventListener('click', () => {
    const answer = JSON.parse(answerSdp.value);
    localConnection.setRemoteDescription(answer)
        .then(() => {
            return localConnection.createAnswer();
        })
        .then(answer => {
            return localConnection.setLocalDescription(answer);
        })
        .catch(err => console.error('Answer setting failed:', err));
});

// ICE候補を送信
sendIceButton.addEventListener('click', () => {
    const candidates = iceCandidates.value.split('\n').map(c => JSON.parse(c)).filter(Boolean);
    candidates.forEach(candidate => {
        localConnection.addIceCandidate(candidate)
            .catch(err => console.error('ICE candidate error:', err));
    });
});

// ページロード時に接続を開始
window.onload = startConnection;
