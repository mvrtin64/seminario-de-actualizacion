const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const crypto = require('crypto').webcrypto;

const secretKey = 'a_secret_key_1234'; // Same key used in client.js

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

// Create HTTP server to serve HTML files
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url.split('?')[0]; // Ignore query parameters
    if (filePath === './') {
        filePath = './public/login.html';
    } else if (filePath === './chat.html') {
        filePath = './public/chat.html';
    } else {
        filePath = './public' + req.url.split('?')[0]; // Serve files from public directory
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 - File Not Found', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('500 - Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create WebSocket server on top of HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        const encryptedArray = new Uint8Array(data.encrypted);
        const iv = new Uint8Array(data.iv);
        const sender = data.sender;

        // Decrypt the received message
        const decryptedMessage = await decryptMessage(encryptedArray.buffer, iv, secretKey);
        console.log('Received message:', decryptedMessage);

    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach(async (client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            const { encrypted, iv: responseIv } = await encryptMessage(decryptedMessage, secretKey);
            client.send(JSON.stringify({
                encrypted: Array.from(new Uint8Array(encrypted)),
                iv: Array.from(responseIv)
            }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTP server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
