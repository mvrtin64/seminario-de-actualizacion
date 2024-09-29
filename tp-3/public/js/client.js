const socket = new WebSocket('ws://localhost:8080');
const secretKey = 'a_secret_key_1234'; // 16 characters (128 bits)

// Extract the username from the URL
const params = new URLSearchParams(window.location.search);
const username = params.get('username');

if (!username) {
    alert('Username not found. Redirecting to login page.');
    window.location.href = 'login.html';
}

// Generate a unique client ID
const clientId = Date.now() + Math.random().toString(36).substring(2);

// Function to derive a valid crypto key
async function getCryptoKey(key) {
    const keyBuffer = new TextEncoder().encode(key);
    const hash = await crypto.subtle.digest('SHA-256', keyBuffer);
    return new Uint8Array(hash).slice(0, 32);
}

async function encryptMessage(message, key) {
    const encoded = new TextEncoder().encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        await getCryptoKey(key),
        "AES-CBC",
        false,
        ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        cryptoKey,
        encoded
    );

    return { encrypted, iv };
}

async function decryptMessage(encryptedMessage, iv, key) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        await getCryptoKey(key),
        "AES-CBC",
        false,
        ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        cryptoKey,
        encryptedMessage
    );

    return new TextDecoder().decode(decrypted);
}

// Sending encrypted message to the server
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        const fullMessage = `${username}: ${message}`;
        const { encrypted, iv } = await encryptMessage(fullMessage, secretKey);
        socket.send(JSON.stringify({
            encrypted: Array.from(new Uint8Array(encrypted)),
            iv: Array.from(iv),
            sender: username
        }));
        displayMessage('You: ' + message, 'sent-message');
        messageInput.value = '';
    }
}

document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage(); 
    }
});

// Handling incoming encrypted messages
socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    // Ignore messages sent by this client
    if (data.clientId === clientId) {
        return;
    }
    const encryptedArray = new Uint8Array(data.encrypted);
    const iv = new Uint8Array(data.iv);

    try { 
        const decryptedMessage = await decryptMessage(encryptedArray, iv, secretKey);
        displayMessage(decryptedMessage, 'received-message');
    } catch (error) {
        console.error('Error decrypting message:', error);
    }
};

// Displaying messages in the chat box
function displayMessage(message, className) {
    const chatBox = document.getElementById('chatMessages');
    if (!chatBox) {
        console.error('Chat box element not found');
        return;
    }

    const messageElem = document.createElement('div');
    messageElem.classList.add('message', className);
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

socket.onopen = () => {
    console.log('Connected to the server');
};

socket.onclose = () => {
    console.log('Disconnected from the server');
};
