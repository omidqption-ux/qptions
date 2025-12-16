// test-massive-crypto.js
import { websocketClient } from '@massive.com/client-js';

const apiKey = 'pvqQCG8azOv7q7x4z5YXnxgVyhvsPlfk';

// create a websocket client using the massive client-js library
const ws = websocketClient(apiKey, 'wss://socket.massive.com').crypto();

// log errors
ws.onerror = (err) => console.log('Failed to connect', err);

// log closes
ws.onclose = (code, reason) => console.log('Connection closed', code, reason);

// simple counter to see how often we get data
let msgCount = 0;
let printedSample = 0;


// when messages are received
ws.onmessage = (msg) => {
    msgCount++;

    const parsedMessage = JSON.parse(msg.data);

    // auth success → subscribe to all crypto per-sec aggs
    if (Array.isArray(parsedMessage) &&
        parsedMessage[0]?.ev === 'status' &&
        parsedMessage[0]?.status === 'auth_success') {

        ws.send(JSON.stringify({
            action: 'subscribe',
            params: 'XAS.BTC-USD',
        }));

        console.log('[INFO] Auth success, subscribed to BTC-USD');
    }

    console.log('Message received:', parsedMessage);
};
