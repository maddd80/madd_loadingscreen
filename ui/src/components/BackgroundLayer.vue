<template>
  <div id="background-container">
    
    <!-- Background Video -->
    <video 
        v-if="config.background.type === 'video'" 
        id="background-video" 
        :src="config.background.video.path" 
        autoplay 
        loop 
        muted 
        playsinline
    ></video>
    
    <!-- YouTube Background -->
    <div v-if="config.background.type === 'youtube'" id="youtube-wrapper">
        <div id="youtube-container" ref="youtubeContainer"></div>
        <div id="youtube-overlay"></div>
    </div>
    
    <!-- Slideshow or Single Image Background -->
    <img 
        v-if="config.background.type === 'slideshow' || config.background.type === 'image'"
        id="background-image" 
        :src="currentImage" 
        :style="{ opacity: opacity }"
        alt="Background"
    />
    
    <div id="overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const config = window.config;
import { useSlideshow } from '../composables/useSlideshow';

const { currentImage, opacity } = useSlideshow();
const youtubeContainer = ref(null);
let player = null;

const createYouTubePlayer = () => {
    if (typeof YT !== 'undefined' && YT.Player && youtubeContainer.value) {
        player = new YT.Player(youtubeContainer.value, {
            videoId: config.background.youtube.id,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                autohide: 1,
                showinfo: 0,
                loop: config.background.youtube.loop ? 1 : 0,
                playlist: config.background.youtube.loop ? config.background.youtube.id : '',
                start: config.background.youtube.startTime || 0,
                mute: 1,
                rel: 0,
                iv_load_policy: 3,
                origin: window.location.origin,
                widget_referrer: window.location.origin,
                enablejsapi: 1,
                playsinline: 1,
            },
            events: {
                onReady: (event) => {
                    event.target.setVolume(config.background.youtube.volume || 0);
                    event.target.playVideo();
                }
            }
        });
    }
};

onMounted(() => {
    if (config.background.type === 'youtube') {
        if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
            createYouTubePlayer();
        } else {
            // Give it a moment to load from the iframe API in index.html
            window.onYouTubeIframeAPIReady = createYouTubePlayer;
        }
    }
});
</script>

<style scoped>
#background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

#background-video, #background-image, #youtube-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
}

#background-image {
    transition: opacity 1.5s ease-in-out;
    object-fit: cover;
}

#youtube-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

#youtube-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: transparent;
    pointer-events: none;
}

#youtube-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    pointer-events: none;
}

#youtube-container :deep(iframe) {
    width: 100%;
    height: 100%;
    pointer-events: none;
}

#overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--overlay-color);
    z-index: 9999;
}
</style>
