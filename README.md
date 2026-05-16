# madd_loadingscreen 🐎

A highly optimized, premium Red Dead Redemption 2 / RedM loading screen. Built with **Vue 3**, **Vite**, and designed with a stunning aesthetic.

![Loading Screen Preview](https://cdn.discordapp.com/attachments/1404618353162846422/1505085347502096536/image.png?ex=6a095775&is=6a0805f5&hm=3a0666cf4c0df542cbcf7cf2c2d2c78ec6b07e03205e10cd3aec3a0620f7cf15&)

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

- **🎨 Premium Aesthetic**: Immersive glassmorphism styling, backdrop blurs, custom collegiate/western typography, and dynamic RGB theme colors.
- **📑 Custom Popup Menus**: Server owners can easily add custom sidebar buttons (e.g., **Rules**, **Lore**, **Staff List**) with beautiful modal dropdowns right from the config.
- **📰 Smart Announcement Feed**: Live Discord Sync with full Markdown parsing (headers, lists, bold text) OR a clean text-only manual fallback.
- **⌨️ Realistic Keybinds Viewer**: Hover over bound keys on an authentic 75% mechanical keyboard layout to see sleek matching tooltips.
- **🎵 Advanced Music Player**: Built-in multi-track background music system with volume sliders, mute toggle, and randomized playlist support.
- **💡 Dynamic Tips & Socials**: Rotating server tips and clickable community links (Discord, Website, YouTube) to keep players engaged while they load.

---

## 🛠️ Full Installation Guide

### Prerequisites
Before you begin, you **must** have [Node.js](https://nodejs.org/) installed on your computer if you plan to modify the Vue source code.

### Step 1: Resource Setup
1. Download or clone the `madd_loadingscreen` folder.
2. Place the folder into your RedM server's `resources` directory (e.g., `resources/[ui]/madd_loadingscreen`).
3. Open your `server.cfg` and add the following line near your other UI resources:
   ```cfg
   ensure madd_loadingscreen
   ```

### Step 2: Audio Setup
1. Place your desired background music files (e.g., `.mp3` or `.ogg`) into the `ui/public/assets/music/` folder.
2. Open `ui/public/config.js` (or `html/config.js`) and add your tracks to the `config.music.list` array.

### Step 3: Configuration
1. Open `ui/public/config.js` (or `html/config.js`) in a text editor (like VS Code).
2. Edit your server name, custom menus, keybinds, music, tips, and other settings.
3. Save the file and restart the resource in your server. **No rebuild is required for config changes!**

---

## ⚙️ Configuration Reference (`ui/public/config.js`)

The configuration uses a categorized global `window.config` object for maximum modularity and ease of maintenance.

```javascript
window.config = {
    // 1. GENERAL & HEADER
    header: {
        serverName: "Madd's Stuff",
        logo: "./assets/img/logo.png",
        welcomeText: "Welcome, %s", // %s replaced with player name
        loadingText: "Loading Server..."
    },

    // 2. APPEARANCE & STYLING
    appearance: {
        colors: {
            primary: "#B12A2A", // Hex color (converts to RGB automatically)
            text: "#FFFFFF",
            background: "#000000",
            overlay: "rgba(0, 0, 0, 0.1)"
        }
    },

    // 3. BACKGROUND MEDIA
    background: {
        type: "slideshow", // "video", "youtube", "image", "slideshow"
        video: { path: "./assets/video/background-video.mp4" },
        image: { path: "./assets/img/background_1.png" },
        slideshow: {
            enabled: true,
            duration: 5000, // ms per slide
            images: [
                "./assets/img/background_1.png",
                "./assets/img/background_2.png"
            ]
        }
    },

    // 4. MUSIC PLAYER
    music: {
        enabled: true,
        defaultVolume: 0.1, // 0.0 to 1.0
        randomize: true,
        list: [
            { name: "Track 1", path: "./assets/music/music1.mp3" },
            { name: "Track 2", path: "./assets/music/music2.mp3" }
        ]
    },

    // 5. ROTATING TIPS
    tips: {
        interval: 5000,
        list: [
            "Visit our Discord for help and updates.",
            "Horses are your most loyal companions in the Wild West."
        ]
    },

    // 6. SOCIAL LINKS
    socials: {
        discord: "https://discord.gg/yourinvite",
        website: "https://yourwebsite.com",
        youtube: "https://youtube.com/yourchannel"
    },

    // 7. SERVER KEYBINDS
    keybinds: [
        { label: "Inventory", key: "I" },
        { label: "Interaction", key: "G" }
    ],

    // 8. SERVER NEWS & ANNOUNCEMENTS
    news: {
        useDiscord: true,
        discordEndpoint: "https://discord-news.maddstuffs.com/proxy.php",
        items: [
            { date: "07-05-2026", content: "Manual fallback news item..." }
        ]
    },

    // 9. CUSTOM POPUP MENUS & BUTTONS
    customMenus: [
        {
            id: "rules",
            buttonLabel: "Server Rules",
            buttonIcon: "fa-solid fa-scroll",
            title: "📜 County Rules & Laws",
            description: "Please read and adhere to our community guidelines.",
            content: [
                { title: "1. Respect & Courtesy", text: "Treat all players with respect..." }
            ]
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