const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Tus credenciales reales configuradas
const WHATSAPP_TOKEN = "EAAYZCqa9o0UYBS2fsRkPt8V8acL5OkVnIHAInAVZAkPkRHTe3UQRXZCDGcZCSU2AuiFJ2uwja5mZCR2VKQuJCfrSQ8z3uYFmQZCZBz0nn02D355oNmNPvwGZAHhwmBG3ZBggkggver3ZAgoyd88az79hQzXtDWkqbt3rMmOJlBwNEBwkRbni76PpsjeZA20wGo8C8gFfwZDZD";
const PHONE_NUMBER_ID = "1384368661425929";
const VERIFY_TOKEN = "dinero_facil_token_seguro"; // El token que usaste para verificar el webhook

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
                const from = message.from; // Número de teléfono del usuario que escribe
                const msgBody = message.text ? message.text.body : '';

                console.log(Mensaje recibido de ${from}: ${msgBody});

                // Respuesta automática del bot
                await axios.post(
                    https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages,
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: ¡Hola! Gracias por comunicarte con Dinero Facil. Hemos recibido tu mensaje: "${msgBody}". Te responderemos a la brevedad. },
                    },
                    {
                        headers: {
                            Authorization: Bearer ${WHATSAPP_TOKEN},
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
    console.log(Bot de Dinero Facil corriendo en el puerto ${PORT});
});