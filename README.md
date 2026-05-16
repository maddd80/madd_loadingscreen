# madd_loadingscreen 🐎

A highly optimized, premium Red Dead Redemption 2 / RedM loading screen. Built with **Vue 3**, **Vite**, and designed with a stunning "Deep Emerald & Glassmorphism" aesthetic.

---

## 📖 Full Explanation & Architecture

`madd_loadingscreen` is not just a standard static HTML page. It is a fully compiled Single Page Application (SPA) built on Vue 3. This means it offers incredibly smooth animations, state management, and optimized rendering that won't lag the player's client while RedM loads heavy server assets in the background.

### Core Systems Explained:

1. **The UI Structure (`/ui` folder)**: 
   The entire visual interface is written in Vue. Before it can be displayed in RedM, it must be compiled into standard HTML/JS/CSS. This is why you must run `npm run build` after changing the config or source code.
2. **Discord Proxy System**:
   Unlike simple webhooks, this loading screen fetches *live* messages from a Discord channel to act as a news feed. Because of browser security (CORS), the NUI cannot talk to the Discord API directly. You must host a simple PHP or Node.js proxy script on a web server that fetches the Discord channel data, and the loading screen pulls the data from your proxy.
3. **Advanced Caching**:
   To prevent your proxy or Discord API from getting rate-limited during a server restart (when 50+ players connect at once), the loading screen caches the news feed in the player's `localStorage` for 5 minutes.
4. **Interactive Keyboard Engine**:
   The keybinds menu isn't a simple list; it dynamically generates an authentic 75% mechanical keyboard layout using CSS flexbox, matching keybinds to physical visual keys with hover tooltips.

---

## ✨ Features

- **🎨 Premium Aesthetic**: Immersive glassmorphism styling, backdrop blurs, and dynamic Emerald green accents.
- **📰 Smart Announcement Feed**: Live Discord Sync with full Markdown parsing (headers, lists, bold text) OR a clean text-only manual fallback.
- **⌨️ Realistic Keybinds Viewer**: Hover over bound keys to see sleek, matching tooltips.
- **🎵 Music Player**: Built-in background music system with volume controls.
- **💡 Dynamic Tips**: Rotating server tips to keep players informed while they load.

---

## 🛠️ Full Installation Guide

### Prerequisites
Before you begin, you **must** have [Node.js](https://nodejs.org/) installed on your computer to build the UI configuration.

### Step 1: Resource Setup
1. Download or clone the `madd_loadingscreen` folder.
2. Place the folder into your RedM server's `resources` directory (e.g., `resources/[ui]/madd_loadingscreen`).
3. Open your `server.cfg` and add the following line near your other UI resources:
   ```cfg
   ensure madd_loadingscreen
   ```

### Step 2: Audio Setup
1. Place your desired background music file (e.g., `.ogg` or `.mp3`) into the `ui/public/assets/audio/` folder.
2. We recommend naming it `loading_music.ogg` for consistency.

### Step 3: Configuration
1. Open `html/config.js` in a text editor (like VS Code).
2. Edit your server name, keybinds, tips, and other settings.
3. Save the file and restart the resource in your server. **No rebuild is required for config changes!**

---

## ⚙️ Configuration Reference (`html/config.js`)

The configuration uses a global `window.config` object. Do not remove the `window.config =` line.

```javascript
window.config = {
    serverName: "Your Server Name",
    loadingMusic: "assets/audio/loading_music.ogg", 
    
    // Rotating tips
    tips: [
        "Visit our Discord for help and updates.",
        "Horses are your most loyal companions in the Wild West."
    ],
    tipInterval: 4000,

    // Server keybinds mapping
    keybinds: [
        { label: "Inventory", key: "I" },
        { label: "Interaction", key: "G" }
    ],

    // Discord Integration Toggle
    useDiscordNews: false, 
    discordNewsEndpoint: "https://your-domain.com/discord-news.php",

    // Manual News (Used if Discord is disabled)
    serverNews: [
        {
            date: "07-05-2026",
            content: "We've just pushed a new update to the horse system! 🐎"
        }
    ]
};
```

---

## 📡 Setting Up Discord Live News

Because game browsers cannot directly fetch from the Discord API without getting blocked by CORS (Cross-Origin Resource Sharing) security, you need a **Proxy Script** hosted on a web server. 

We offer **two ways** to set this up: hosting a static proxy script, or creating a secure Link Generator on your own website.

---

### Method 1: Single Server PHP Proxy (`discord-news.php`)

If you are hosting a single server, create a file named `discord-news.php` on your web server (website, forum, or panel) and paste this code:

```php
<?php
// Allows the RedM client to read the data without CORS errors
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

// ⚠️ Insert your Bot Token and Channel ID here
$botToken = 'YOUR_BOT_TOKEN_HERE';
$channelId = 'YOUR_CHANNEL_ID_HERE';

// Simple File-based Caching (Protects bot from rate limits during server restarts)
$cacheFile = '/tmp/madd_news_' . md5($channelId) . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 60) {
    echo file_get_contents($cacheFile);
    exit;
}

$url = "https://discord.com/api/v10/channels/{$channelId}/messages?limit=10";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Authorization: Bot {$botToken}",
    "Content-Type: application/json"
));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    file_put_contents($cacheFile, $response);
    echo $response;
} else {
    http_response_code($httpCode);
    echo $response;
}
?>
```

#### Steps to Link (Method 1):
1. Create a Discord Bot at the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy your **Bot Token** and paste it into the PHP script.
3. Invite the bot to your server and ensure it has permission to "Read Messages" in your announcements channel.
4. Copy the **Channel ID** of your announcements channel and paste it into the PHP script.
5. Upload `discord-news.php` to your web hosting.
6. Open `ui/public/config.js` (or `html/config.js`) and set `config.news.useDiscord = true`.
7. Set `config.news.discordEndpoint` to your uploaded script URL (e.g., `https://yourwebsite.com/discord-news.php`).

---

### Method 2: Official MaddStuffs Link Generator (No Web Hosting Required)

If you do not have your own web server or prefer not to host any PHP scripts, you can use our official secure Link Generator!

#### Steps to Link (Method 2):
1. Visit our official generator at: [https://www.discord-news.maddstuffs.com/](https://www.discord-news.maddstuffs.com/)
2. Enter your Discord Bot Token and Channel ID into the secure form, then click **Generate Endpoint URL**.
3. Copy the generated secure endpoint URL.
4. Open `ui/public/config.js` (or `html/config.js`), set `config.news.useDiscord = true`, and paste the generated URL into `config.news.discordEndpoint`.

---

## 🔌 API & Framework Exports

If you are using custom character selection scripts (like `vorp_character`), you may need to manually shut down the loading screen so it doesn't block the character menu.

### Client Export (Lua)
```lua
exports['madd_loadingscreen']:shutdownLoadingScreen()
```

### Client Event (Lua)
```lua
TriggerEvent('madd_loadingscreen:shutdown')
```

*(Note: If you aren't using a custom character selector, the loading screen will automatically fade out when RedM finishes loading the map).*

---

## 💎 Credits
Created and maintained by **Madd**. Developed specifically for advanced RedM roleplay servers requiring premium UI/UX.