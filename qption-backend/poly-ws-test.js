import { websocketClient } from "@massive.com/client-js";

// create a websocket client using the massive client-js library
const ws = websocketClient('pvqQCG8azOv7q7x4z5YXnxgVyhvsPlfk', 'wss://socket.massive.com').crypto();

// register a handler to log errors
ws.onerror = (err) => console.log('Failed to connect', err);

// register a handler to log info if websocket closes
ws.onclose = (code, reason) => console.log('Connection closed', code, reason);

// register a handler when messages are received
ws.onmessage = (msg) => {
    // parse the data from the message
    const parsedMessage = JSON.parse(msg.data);

    // wait until the message saying authentication was successful, then subscribe to a channel
    if (parsedMessage[0].ev === 'status' && parsedMessage[0].status === 'auth_success') {
        console.log('Subscribing to the second aggregates channel for ticker *');
        ws.send(JSON.stringify({ "action": "subscribe", "params": "XAS.BTC-USD" }));
    }

    console.log('Message received:', parsedMessage);
}