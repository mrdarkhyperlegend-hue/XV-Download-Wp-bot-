const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'menu', 
    execute: async (conn, from, msg) => {
        const mediaPath = path.join(__dirname, '../media', 'dance.mp4');
        
        
        const pushname = msg.pushName || 'User';
        const sender = msg.key.participant || msg.key.remoteJid;


const hour = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Colombo",
    hour12: false,
    hour: "numeric"
});

let wish = "Good Morning ☀️";
if (hour >= 12 && hour < 17) wish = "Good Afternoon 🌤️";
else if (hour >= 17 && hour < 21) wish = "Good Evening 🌆";
else if (hour >= 21 || hour < 5) wish = "Good Night 🌙";

        const menuText = `👋 Hello @${sender.split('@')[0]}, ${wish}!\n\n` +
            `*Welcome to fucking world...*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📂 *.xv [key word]* - search x-video\n`+
            `📄 \n`+
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💡 *How to reply:* Please reply with the *Number* of your choice.\n\n` +
            `*Have a sexy Day!* 🍑`;

        if (fs.existsSync(mediaPath)) {
            const videoBuffer = fs.readFileSync(mediaPath);

            await conn.sendMessage(from, {
                video: videoBuffer,
                caption: menuText,
                gifPlayback: true,
                mentions: [sender], // User 
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363144040995100@newsletter',
                        newsletterName: 'x-video Offcial 📢'
                    }
                }
            }, { quoted: msg });

        } else {
            await conn.sendMessage(from, { 
                text: menuText, 
                mentions: [sender] 
            }, { quoted: msg });
        }
    }
};
