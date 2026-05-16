<template>
  <div id="news-container">
      <div 
        id="news-tab" 
        :class="{ 'active': activeMenu === 'news' }"
        @click="toggleMenu"
      >
          <i class="fas fa-bullhorn"></i>
          <span>LATEST UPDATES</span>
          <div class="tab-indicator"></div>
      </div>
      
      <div id="news-popup" :class="{ 'visible': activeMenu === 'news' }">
          <div class="news-header"># Announcements</div>
          <div class="news-list">
              <div v-if="isLoading" class="news-loading">Loading announcements...</div>
              <div v-else v-for="news in displayNews" :key="news.id" class="news-item" :class="{ 'no-avatar': !news.avatar }">
                  <div v-if="news.avatar" class="news-avatar">
                      <img :src="news.avatar" alt="avatar" />
                  </div>
                  <div class="news-main">
                      <!-- Reply Context -->
                      <div v-if="news.reply" class="news-reply-context">
                          <img v-if="news.reply.avatar" :src="news.reply.avatar" class="reply-avatar" />
                          <span class="reply-author">{{ news.reply.author }}</span>
                          <span class="reply-content" v-html="news.reply.content"></span>
                      </div>

                      <div class="news-info">
                          <span v-if="news.author" class="news-author">{{ news.author }}</span>
                          <span v-if="news.isBot" class="bot-tag">APP</span>
                          <span class="news-timestamp">{{ news.date }}</span>
                      </div>
                      
                      <!-- Main Content -->
                      <div 
                        v-if="news.rawContent" 
                        class="news-content-raw" 
                        v-html="news.rawContent"
                      ></div>

                      <!-- Embed Block -->
                      <div v-if="news.embed" class="news-embed" :style="{ borderLeftColor: news.embed.color || 'var(--primary-color)' }">
                          <div v-if="news.embed.authorName" class="embed-author">
                              <img v-if="news.embed.authorIcon" :src="news.embed.authorIcon" class="embed-author-icon" />
                              <span class="embed-author-name">{{ news.embed.authorName }}</span>
                          </div>
                          
                          <div v-if="news.embed.title" class="embed-title">{{ news.embed.title }}</div>
                          <div v-if="news.embed.description" class="embed-description" v-html="news.embed.description"></div>
                          
                          <!-- Embed Image -->
                          <div v-if="news.embed.image" class="embed-image-container">
                              <img :src="news.embed.image" class="embed-image" />
                          </div>

                          <div v-if="news.embed.footer" class="embed-footer">{{ news.embed.footer }}</div>
                      </div>

                      <!-- Regular Attachment -->
                      <div v-if="news.attachment" class="news-attachment">
                          <div v-if="news.attachment.isImage" class="attachment-image-container">
                              <img :src="news.attachment.url" class="attachment-image" />
                          </div>
                          <div v-else-if="news.attachment.isVideo" class="attachment-video-container">
                              <i class="fas fa-play-circle"></i>
                              <span>Video Attachment ({{ news.attachment.name }})</span>
                          </div>
                          <div v-else class="attachment-file-container">
                              <i class="fas fa-file-archive"></i>
                              <span>{{ news.attachment.name }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
const config = window.config;

const activeMenu = inject('activeMenu');
const toggleMenu = () => {
    activeMenu.value = activeMenu.value === 'news' ? null : 'news';
};

const displayNews = ref(config.news.items);
const isLoading = ref(false);

const CACHE_KEY = 'madd_discord_news_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Optimized Helper Functions ---
const formatMarkdown = (text, isEmbed = false) => {
    if (!text) return "";
    let formatted = text
        .replace(/<@&?\d+>/g, '') 
        .replace(/@everyone/g, '')
        .replace(/@here/g, '')
        .replace(/^### (.*)/gm, isEmbed ? '<h3 class="md-h3">$1</h3>' : '$1')
        .replace(/^## (.*)/gm, isEmbed ? '<h2 class="md-h2">$1</h2>' : '$1')
        .replace(/^# (.*)/gm, isEmbed ? '<h1 class="md-h1">$1</h1>' : '$1')
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<s>$1</s>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>')
        .replace(/```(?:css|js|lua|json)?\n?([\s\S]*?)```/gs, '<div class="md-code-block">$1</div>')
        .replace(/`(.*?)`/g, '<code class="md-code-inline">$1</code>')
        .replace(/^- (.*)/gm, '<div class="md-bullet">• $1</div>');

    return formatted.replace(/\n/g, '<br>');
};

const getAvatar = (user) => {
    if (!user) return "";
    return user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || user.id) % 5}.png`;
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};
// --------------------------------

const useFallbackNews = () => {
    if (config.news.items && config.news.items.length > 0) {
        displayNews.value = config.news.items.map((news, index) => ({
            id: `fallback-${index}`,
            author: news.author || null,
            avatar: news.avatar || null,
            date: news.date,
            rawContent: news.content.replace(/\n/g, '<br>'),
            embed: news.image ? {
                image: news.image,
                color: news.roleColor || 'var(--primary-color)'
            } : null
        }));
    }
};

const fetchDiscordNews = async () => {
    if (!config.news.useDiscord || !config.news.discordEndpoint) {
        useFallbackNews();
        return;
    }

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsedCache = JSON.parse(cached);
            if (Date.now() - parsedCache.timestamp < CACHE_TTL) {
                displayNews.value = parsedCache.data;
                return;
            }
        }
    } catch (e) {
        console.warn("Could not read from localStorage", e);
    }

    isLoading.value = true;
    try {
        const response = await fetch(config.news.discordEndpoint, {
            headers: config.news.discordHeaders || {}
        });
        if (response.ok) {
            const messages = await response.json();
            if (Array.isArray(messages)) {
                // Map Discord API response to our UI format using pre-compiled helpers
                const parsedNews = messages.map(msg => {
                    const embed = msg.embeds && msg.embeds.length > 0 ? msg.embeds[0] : null;
                    const refMsg = msg.referenced_message;

                    return {
                        id: msg.id,
                        author: msg.author.global_name || msg.author.username,
                        isBot: msg.author.bot,
                        avatar: getAvatar(msg.author),
                        date: formatDate(msg.timestamp),
                        rawContent: formatMarkdown(msg.content, false),
                        
                        reply: refMsg ? {
                            author: refMsg.author.global_name || refMsg.author.username,
                            avatar: getAvatar(refMsg.author),
                            content: refMsg.content.substring(0, 50) + (refMsg.content.length > 50 ? "..." : "")
                        } : null,

                        attachment: msg.attachments && msg.attachments.length > 0 ? {
                            url: msg.attachments[0].url,
                            name: msg.attachments[0].filename,
                            type: msg.attachments[0].content_type,
                            isVideo: msg.attachments[0].content_type?.includes('video'),
                            isImage: msg.attachments[0].content_type?.includes('image')
                        } : null,

                        embed: embed ? {
                            title: embed.title,
                            description: formatMarkdown(embed.description, true),
                            color: embed.color ? `#${embed.color.toString(16).padStart(6, '0')}` : 'var(--primary-color)',
                            authorName: embed.author ? embed.author.name : null,
                            authorIcon: embed.author ? embed.author.icon_url : null,
                            footer: embed.timestamp ? formatDate(embed.timestamp) : null,
                            image: embed.image ? embed.image.url : null
                        } : null
                    };
                });
                
                displayNews.value = parsedNews;
                
                // Cache the successful fetch
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        timestamp: Date.now(),
                        data: parsedNews
                    }));
                } catch (e) {
                    console.warn("Could not write to localStorage", e);
                }
            } else {
                useFallbackNews();
            }
        } else {
            useFallbackNews();
        }
    } catch (error) {
        console.error("Failed to fetch Discord news:", error);
        useFallbackNews();
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (config.news.discordEndpoint) {
        fetchDiscordNews();
    }
});
</script>

<style scoped>
#news-container {
    position: absolute;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 25;
}

#news-tab {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 25px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    color: white;
    font-family: var(--font-heading);
    letter-spacing: 1px;
    font-size: 0.9rem;
    position: relative;
    pointer-events: auto;
}

#news-tab i {
    font-size: 1.1rem;
    color: var(--primary-color);
}

#news-tab span {
    font-weight: 700;
}

#news-tab:hover, #news-tab.active {
    background: rgba(0, 0, 0, 0.6);
    border-color: var(--primary-color);
}

.tab-indicator {
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.4s ease;
}

#news-tab.active .tab-indicator {
    width: 40px;
}

#news-popup {
    background-color: rgba(15, 15, 15, 0.7);
    backdrop-filter: blur(25px);
    border-radius: 12px;
    padding: 0;
    width: 58vh;
    max-height: 40vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 4px solid var(--primary-color);
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    pointer-events: none;
    margin-top: 15px;
}

#news-popup.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.news-header {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px 20px;
    font-family: var(--font-heading);
    color: var(--primary-color);
    font-size: 1.1rem;
    font-weight: 700;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    letter-spacing: 1px;
}

.news-list {
    padding: 20px 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse; /* Bottom to up flow */
}

/* Custom Scrollbar */
.news-list::-webkit-scrollbar {
    width: 6px;
}
.news-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}
.news-list::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 3px;
}

.news-item {
    display: flex;
    padding: 12px 20px;
    gap: 15px;
    transition: background 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.news-item.no-avatar {
    padding-left: 30px;
}

.news-item:hover {
    background: rgba(255, 255, 255, 0.03);
}

.news-avatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
}

.news-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.news-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.news-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.news-author {
    font-weight: 700;
    font-size: 1rem;
    color: var(--primary-color);
    font-family: var(--font-heading);
}

.bot-tag {
    background-color: #5865F2;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    margin-right: 4px;
}

.news-timestamp {
    font-size: 0.75rem;
    color: #949BA4;
}

.news-content-raw {
    font-size: 0.95rem;
    color: #e0e0e0;
    line-height: 1.5;
    margin-bottom: 8px;
}

.news-embed {
    background: rgba(255, 255, 255, 0.03);
    border-left: 4px solid var(--primary-color);
    border-radius: 4px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 4px solid var(--primary-color);
    max-width: 95%;
}

.embed-author {
    display: flex;
    align-items: center;
    gap: 8px;
}

.embed-author-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.embed-author-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
}

.embed-title {
    font-weight: 700;
    font-size: 1rem;
    color: white;
}

.embed-description {
    font-size: 0.95rem;
    color: #DBDEE1;
    line-height: 1.4;
}

:deep(strong) { color: white; font-weight: 700; }
:deep(em) { font-style: italic; }
:deep(u) { text-decoration: underline; }
:deep(s) { text-decoration: line-through; opacity: 0.6; }

:deep(.md-code-inline) {
    background: #2E2F35;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85rem;
    color: #E3E5E8;
}

:deep(.md-code-block) {
    background: #2E2F35;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85rem;
    color: #E3E5E8;
    margin: 8px 0;
    border: 1px solid rgba(0,0,0,0.1);
    white-space: pre-wrap;
}

:deep(.md-h1), :deep(.md-h2), :deep(.md-h3) {
    margin-top: 16px;
    margin-bottom: 8px;
    color: white;
    font-family: var(--font-body);
}

:deep(.md-h1) { font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
:deep(.md-h2) { font-size: 1.25rem; }
:deep(.md-h3) { font-size: 1.1rem; }

:deep(.md-bullet) {
    margin-left: 8px;
    color: #DBDEE1;
    margin-bottom: 2px;
}

:deep(.md-link) {
    color: var(--primary-color);
    font-weight: 700;
    text-decoration: none;
}

:deep(.md-link:hover) {
    text-decoration: underline;
}

.embed-image-container {
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.2);
}

.embed-image {
    max-width: 100%;
    display: block;
}

.embed-footer {
    font-size: 0.75rem;
    color: #949BA4;
    margin-top: 4px;
}

.news-reply-context {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    opacity: 0.6;
    font-size: 0.85rem;
    position: relative;
}

.news-reply-context::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -24px;
    width: 20px;
    height: 12px;
    border-left: 2px solid #4E5058;
    border-top: 2px solid #4E5058;
    border-top-left-radius: 6px;
}

.reply-avatar {
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.reply-author {
    font-weight: 600;
    color: white;
}

.reply-content {
    color: #DBDEE1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
}

.attachment-image-container {
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
    max-width: 400px;
    border: 1px solid rgba(0,0,0,0.2);
}

.attachment-image {
    max-width: 100%;
    display: block;
}

.attachment-video-container, .attachment-file-container {
    background: #2B2D31;
    border: 1px solid #1E1F22;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    color: #DBDEE1;
}

.attachment-video-container i, .attachment-file-container i {
    font-size: 1.5rem;
    color: #B5BAC1;
}

@media (max-width: 1024px) {
    #news-popup { width: 400px; }
}
</style>
