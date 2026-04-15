const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const commands = new Map();
const pluginsPath = path.join(__dirname, 'plugins');
let userCache = {}; 
function cleanCache() {
    const now = Date.now();
    for (const key in userCache) {
        if (now - userCache[key].timestamp > 300000) { 
            delete userCache[key];
        }
    }
}
cleanCache();
const prefix = '.'; 

const axiosConfig = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.xvideos.com/'
    },
    timeout: 60000 
}; 
if (fs.existsSync(pluginsPath)) {
    const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
    for (const file of pluginFiles) {
        try {
            const plugin = require(`./plugins/${file}`);
            if (plugin && plugin.command) {
                if (Array.isArray(plugin.command)) {
                    plugin.command.forEach(cmd => commands.set(String(cmd).toLowerCase(), plugin));
                } else {
                    commands.set(String(plugin.command).toLowerCase(), plugin);
                }
            }
        } catch (err) {
            console.log(`Error Loading Plugin: ${err.message}`);
        }
    }
}

async function handleMessages(conn, chatUpdate) {
    try {
        if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;

        const msg = chatUpdate.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = (msg.message.conversation || 
                      msg.message.extendedTextMessage?.text || "").toLowerCase().trim();

        if (text.startsWith('p') && userCache[from]) {
            const num = text.replace('p', ''); // 'p1' -> '1'
            if (!isNaN(num)) {
                const index = parseInt(num) - 1;
                const item = userCache[from].results[index];

                if (item) {
                    await conn.sendMessage(from, { react: { text: "⏳", key: msg.key } });
                    let status = await conn.sendMessage(from, { text: `⏳ *${item.name}* finding server data...` });

                    try {
                        const { data: pageData } = await axios.get(item.link, axiosConfig);
                        const $ = cheerio.load(pageData);
                        let videoLink = '';
                        
                        videoLink = $('video source').attr('src') || $('video').attr('src') || '';
                        
                        if (!videoLink) {
                            videoLink = $('meta[property="og:video"]').attr('content') || 
                                       $('meta[property="og:video:url"]').attr('content') || '';
                        }
                        
                        if (!videoLink) {
                            const scripts = $('script').map((i, el) => $(el).html()).get().join(' ');
                            const mp4Match = scripts.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
                            if (mp4Match) videoLink = mp4Match[0];
                        }
                        if (!videoLink) {
                            $('a').each((i, el) => {
                                const href = $(el).attr('href');
                                if (href && (href.includes('.mp4') || href.includes('download') || href.includes('video'))) {
                                    videoLink = href; 
                                    return false; 
                                }
                            });
                        }

                        if (videoLink) {
                            await conn.sendMessage(from, { edit: status.key, text: `📥 Full Quality Video uploading (It may take a few minutes)` });
                            const videoRes = await axios({ ...axiosConfig, url: videoLink, method: 'get', responseType: 'arraybuffer' });
                            
                            await conn.sendMessage(from, { edit: status.key, text: `🔁downloading *${item.name}* video Done...` });
                            await conn.sendMessage(from, { 
                                document: Buffer.from(videoRes.data), 
                                mimetype: 'video/mp4', 
                                fileName: `${item.name}.mp4`,
                                caption: `*📥 ${item.name}*\n\n*😋really fucking day...*` 
                            });
                            await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                        } else {
                            await conn.sendMessage(from, { edit: status.key, text: `⚠️ Video එකක් හමු නොවීය.` });
                        }
                    } catch (e) {
                        await conn.sendMessage(from, { edit: status.key, text: '❌ දෝෂයකි.' });
                    }
                }
                return;
            }
        }
        const LIST_IMAGE_URL = 'https://www.image2url.com/r2/default/images/1776215275432-00c601d4-3972-4b6f-8dbd-78398f4b5e08.png'; 
        if (text.startsWith(`${prefix}xv`)) {
            const query = text.replace(`${prefix}search`, '').trim();
            if (!query) return conn.sendMessage(from, { text: `need key (ex: Mia Khalifa)` });

            await conn.sendMessage(from, { react: { text: "🔍", key: msg.key } });
            let sentMsg = await conn.sendMessage(from, { text: `🔍 "${query}"finding x-video database` });

            try {
                const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;
                const { data } = await axios.get(searchUrl, axiosConfig);
                const $ = cheerio.load(data);
                let results = [];


                $('a').each((i, el) => {
                    const name = $(el).text().trim();
                    const href = $(el).attr('href');
                    const link = href && href.startsWith('http') ? href : 'https://www.xvideos.com' + href;
                    if (link && link.includes('xvideos.com/video') && name.length > 10) {
                        if (!results.some(r => r.link === link)) {
                            results.push({ name, link });
                        }
                    }
                });

                if (results.length > 0) {
                    const limitedResults = results.slice(0, 30);
                    userCache[from] = {
                        results: limitedResults,
                        timestamp: Date.now()
                    };

                    await conn.sendMessage(from, { edit: sentMsg.key, text: `✅ "${query}" found ${limitedResults.length} \n And list uploading...` });
                    let listMsg = `🔁 *Video search results:*\n\n`;
                    limitedResults.forEach((p, i) => { 
                        listMsg += `*P${i + 1}.* ${p.name}\n`; 
                    });
                    listMsg += `\n📌Note:\ntag message and type (ex: *p1*)\n\n*🍑X-Video Download System...*`;
                    await conn.sendMessage(from, { 
                        image: { url: LIST_IMAGE_URL },
                        caption: listMsg,
                        contextInfo: {
                            isForwarded: true, 
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363232743393228@newsletter', 
                                newsletterName: 'Only Fans offcial',
                                serverMessageId: 1
                            }
                        }
                    });
                    
                    await conn.sendMessage(from, { react: { text: "📂", key: msg.key } });

                } else {
                    await conn.sendMessage(from, { edit: sentMsg.key, text: `❌ කිසිවක් හමු නොවීය.` });
                }
            } catch (err) {
                console.error(err);
                await conn.sendMessage(from, { edit: sentMsg.key, text: '⚠️ සර්වර් දෝෂයකි.' });
            }
            return;
        }
        const plugin = commands.get(text);
        if (plugin) {
            await conn.sendMessage(from, { react: { text: "💎", key: msg.key } });
            await plugin.execute(conn, from, msg);
        }

    } catch (e) {
        console.log("Main Error: " + e);
    }
}

module.exports = { handleMessages };
