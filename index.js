const Baileys = require("@whiskeysockets/baileys");
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = Baileys;
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { handleMessages } = require('./main.js');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_session');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ["x-video", "Chrome", "1.0.0"]
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log("QR එක ස්කෑන් කරන්න:");
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log("please fuck mee ✅");
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        if (chatUpdate.type === 'notify') {
            await handleMessages(conn, chatUpdate);
        }
    });
}

startBot().catch(err => console.log(err));
