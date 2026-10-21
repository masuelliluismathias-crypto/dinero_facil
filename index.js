const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/webhook', (req, res) => {
const VERIFY_TOKEN = "mi_token_secreto_123";
const mode = req.query['hub.mode'];
const token = req.query['hub.verify_token'];
const challenge = req.query['hub.challenge'];

if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
} else {
    res.sendStatus(400);
}
});

app.post('/webhook', (req, res) => {
const body = req.body;
if (body.object === 'whatsapp_business_account') {
body.entry.forEach(entry => {
entry.changes.forEach(change => {
if (change.value.messages) {
const message = change.value.messages[0];
const from = message.from;
const msgBody = message.text ? message.text.body : '';
console.log("Mensaje recibido de " + from + ": " + msgBody);
}
});
});
res.status(200).send('EVENT_RECEIVED');
} else {
res.sendStatus(404);
}
});

app.listen(PORT, () => {
console.log("Servidor corriendo en el puerto " + PORT);
});