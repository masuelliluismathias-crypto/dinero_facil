const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Tus credenciales reales configuradas
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Ruta de verificación del Webhook (GET)
app.get('/webhook', (req, res) => {
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

// Ruta para recibir los mensajes de WhatsApp (POST)
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from; 
                const msgBody = message.text ? message.text.body : '';

                console.log("Mensaje recibido de " + from + ": " + msgBody);

                // Respuesta automática del bot
                await axios.post(
                    'https://graph.facebook.com/v17.0/' + PHONE_NUMBER_ID + '/messages',
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: '¡Hola! Gracias por comunicarte con Dinero Facil. Hemos recibido tu mensaje. Te responderemos a la brevedad.' },
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + WHATSAPP_TOKEN,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error al procesar el webhook:', error.response?.data || error.message);
        res.sendStatus(500);
    }
});

// Puerto de escucha para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Bot de Dinero Facil corriendo en el puerto ' + PORT);
});