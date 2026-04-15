<h1 align="center">📹 Video Download Bot</h1>

<p align="center">
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<p align="center"><b>A WhatsApp Bot for Downloading Full Quality Videos</b></p>

---

<h2>✨ Features</h2>

<table>
<tr>
<td>

- 🔍 **Search Videos** from xvideos.com
- 📋 **List Results** with P1, P2, P3... format
- 📥 **Download Videos** by sending p1, p2, etc.
- 🎬 **Full Quality** - Videos sent as documents (no compression)
- ⚡ **Fast Cache** - 5-minute auto-cleaning cache
- 🔌 **Plugin Support** - Extend with custom plugins
- 🔄 **Auto Retry** - Multiple video extraction methods

</td>
</tr>
</table>

---

<h2>📋 Commands</h2>

<table>
<thead>
<tr>
<th>Command</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>.search &lt;query&gt;</code></td>
<td>Search for videos</td>
<td><code>.search keyword</code></td>
</tr>
<tr>
<td><code>p1</code>, <code>p2</code>, etc.</td>
<td>Download video from list</td>
<td><code>p1</code> (downloads 1st video)</td>
</tr>
</tbody>
</table>

---

<h2>🚀 Installation</h2>

<h3>Prerequisites</h3>
<ul>
<li>Node.js v16+</li>
<li>npm or yarn</li>
</ul>

<h3>Setup</h3>

<pre>
<code>
# Clone the repository
git clone https://github.com/yourusername/video-bot.git

# Navigate to directory
cd video-bot

# Install dependencies
npm install

# Start the bot
node main.js
</code>
</pre>

---

<h2>📁 Project Structure</h2>

<pre>
video-bot/
├── 📄 main.js          # Main bot logic
├── 📁 plugins/         # Plugin directory
│   └── *.js           # Custom plugins
├── 📄 package.json     # Dependencies
└── 📄 README.md        # This file
</pre>

---

<h2>🔧 Configuration</h2>

<p>Edit <code>main.js</code> to customize:</p>

<table>
<tr>
<th>Setting</th>
<th>Location</th>
<th>Description</th>
</tr>
<tr>
<td>Prefix</td>
<td>Line 18</td>
<td>Command prefix (default: <code>.</code>)</td>
</tr>
<tr>
<td>Timeout</td>
<td>Line 25</td>
<td>Request timeout (default: 60s)</td>
</tr>
<tr>
<td>Cache Duration</td>
<td>Line 11</td>
<td>Cache cleanup time (default: 5 min)</td>
</tr>
<tr>
<td>List Image</td>
<td>Line 97</td>
<td>Image URL for search results</td>
</tr>
</table>

---

<h2>🔌 Creating Plugins</h2>

<p>Create a <code>.js</code> file in the <code>plugins/</code> folder:</p>

<pre>
<code language="javascript">
module.exports = {
    command: ['menu', 'help'],
    execute: async (conn, from, msg) => {
        await conn.sendMessage(from, { 
            text: 'Your message here' 
        });
    }
};
</code>
</pre>

---

<h2>⚙️ How It Works</h2>

<ol>
<li>User sends <code>.search keyword</code></li>
<li>Bot searches xvideos.com</li>
<li>Bot sends list: P1, P2, P3...</li>
<li>User replies with <code>p1</code></li>
<li>Bot extracts video URL using 4 methods:
   <ul>
   <li>Video tag source</li>
   <li>Meta tags (og:video)</li>
   <li>Script tag analysis</li>
   <li>Link scanning</li>
   </ul>
</li>
<li>Bot downloads and sends as document (full quality)</li>
</ol>

---

<h2>🛡️ Disclaimer</h2>

<blockquote>
<p>This bot is for educational purposes only. Users are responsible for complying with applicable laws and website Terms of Service. The developers assume no liability for misuse.</p>
</blockquote>

---

<h2>📜 License</h2>

<p>MIT License - Feel free to use and modify.</p>

---

<p align="center">
<b>Made with ❤️ for video enthusiasts and upload x-video web site😋 </b>
</p>

<p align="center">
  <a href="#">Report Bug</a> •
  <a href="#">Request Feature</a> •
  <a href="#">Documentation</a>
</p>
