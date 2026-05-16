window.config = {
    // ==========================================
    // 1. GENERAL & HEADER SETTINGS
    // ==========================================
    header: {
        serverName: "Madd's Stuff",
        logo: "./assets/img/logo.png",
        welcomeText: "Welcome, %s", // %s will be replaced with the player's name
        loadingText: "Loading Server..."
    },

    // ==========================================
    // 2. APPEARANCE & STYLING
    // ==========================================
    appearance: {
        colors: {
            primary: "#B12A2A",
            text: "#FFFFFF",
            background: "#000000",
            overlay: "rgba(0, 0, 0, 0.1)"
        }
    },

    // ==========================================
    // 3. BACKGROUND MEDIA
    // ==========================================
    background: {
        type: "slideshow", // Options: "video", "youtube", "image", "slideshow"

        // Single video file configuration (used if type is 'video')
        video: {
            path: "./assets/video/background-video.mp4"
        },

        // Single static image configuration (used if type is 'image')
        image: {
            path: "./assets/img/background_1.png"
        },

        // Slideshow configuration (used if type is 'slideshow')
        slideshow: {
            enabled: true,
            duration: 5000, // Duration per slide in milliseconds (5 seconds)
            images: [
                "./assets/img/background_1.png",
                "./assets/img/background_2.jpg",
                "./assets/img/background_3.jpg",
                "./assets/img/background_4.jpg",
                "./assets/img/background_5.jpg",
                "./assets/img/background_6.jpg",
                // Add more images here
            ]
        },

        // YouTube configuration (used if type is 'youtube')
        youtube: {
            id: "u5IuKGp2LWY",
            startTime: 0,
            volume: 0, // 0-100
            loop: true
        }
    },

    // ==========================================
    // 4. BACKGROUND MUSIC
    // ==========================================
    music: {
        enabled: true,
        defaultVolume: 0.1, // Volume from 0.0 to 1.0
        randomize: true,
        list: [
            { name: "Option 1", path: "./assets/music/music1.mp3" },
            { name: "Option 2", path: "./assets/music/music2.mp3" },
            { name: "Option 3", path: "./assets/music/music3.mp3" },
        ]
    },

    // ==========================================
    // 5. HELPFUL TIPS / LORE
    // ==========================================
    tips: {
        interval: 4000, // Time between tips in milliseconds
        list: [
            "Press I to open your inventory.",
            "Use T to open the chat.",
            "Visit our Discord for help and updates.",
            "Respect other players and follow server rules.",
            "Find work in towns to earn money.",
            "Explore the world and discover hidden secrets.",
            "Horses are your most loyal companions in the Wild West."
        ]
    },

    // ==========================================
    // 6. SOCIAL MEDIA LINKS
    // ==========================================
    socials: {
        discord: "https://discord.gg/yourserver",
        website: "https://yourwebsite.com",
        youtube: "https://youtube.com/yourchannel"
    },

    // ==========================================
    // 7. SERVER KEYBINDS
    // ==========================================
    keybinds: [
        { label: "Inventory", key: "I" },
        { label: "Interaction", key: "G" },
        { label: "Chat", key: "T" }
    ],

    // ==========================================
    // 8. SERVER NEWS & ANNOUNCEMENTS
    // ==========================================
    news: {
        // If true, fetches live announcements from Discord via your endpoint
        useDiscord: false,
        discordEndpoint: "https://discord-news.maddstuffs.com/discord-news.php",
        discordHeaders: {},

        // Fallback/Static news used if useDiscord is false or endpoint fails
        items: [
            {
                date: "07-05-2026",
                content: "We've just pushed a new update to the horse system. You can now customize your saddles at any stable! 🐎"
            },
            {
                date: "06-05-2026",
                content: "The poker tournament has been moved to this Sunday at 8 PM. Make sure to sign up at the saloon! ♠️"
            }
        ]
    }
};
