<template>
  <div :class="{ 'fade-out': isShuttingDown }" id="app-wrapper">
    <BackgroundLayer />
    
    <!-- Cinematic Overlays -->
    <div id="theme-overlay"></div>
    <div id="cinematic-overlay"></div>
    <div id="noise-overlay"></div>
    
    <div id="content-layout">
      <!-- Top Left Section -->
      <div id="top-left-section">
        <div id="logo-container" :style="logoStyle">
          <img v-if="config.header.logo" id="logo" :src="config.header.logo" @error="onLogoError" alt="Server Logo" />
          <h1 v-else class="text-logo">{{ config.header.serverName }}</h1>
        </div>
        
        <div id="welcome-container" :style="welcomeStyle">
          <h1 id="welcome-text">{{ welcomeTextReplaced }}</h1>
          <div class="welcome-divider"></div>
        </div>
        
        <SocialLinks />
      </div>
      
      <!-- Top Right Section -->
      <div id="top-right-section">
        <CustomMenus />
        <KeybindsMenu />
        <SettingsMenu />
        <MusicPlayer />
      </div>

      <!-- Top Middle Section -->
      <ServerNews />
      
      <!-- Bottom Left Section -->
      <div id="bottom-left-section">
        <TipsDisplay />
      </div>
      
      <!-- Bottom Right Section -->
      <div id="bottom-right-section">
        <LoadingProgress />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, provide } from 'vue';
const config = window.config;
import { useLoadingEvents } from './composables/useLoadingEvents';

import BackgroundLayer from './components/BackgroundLayer.vue';
import LoadingProgress from './components/LoadingProgress.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import TipsDisplay from './components/TipsDisplay.vue';
import SocialLinks from './components/SocialLinks.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import KeybindsMenu from './components/KeybindsMenu.vue';
import CustomMenus from './components/CustomMenus.vue';
import ServerNews from './components/ServerNews.vue';

const loadingEvents = useLoadingEvents();
provide('loadingEvents', loadingEvents);

const activeMenu = ref(null); // 'music', 'settings', 'keybinds', 'news' or null
provide('activeMenu', activeMenu);

const { playerName, isShuttingDown } = loadingEvents;

const welcomeTextReplaced = computed(() => {
  return config.header.welcomeText.replace('%s', playerName.value);
});

const logoStyle = ref({ opacity: 0, transform: 'scale(0.95)' });
const welcomeStyle = ref({ opacity: 0, transform: 'translateY(10px)' });

const onLogoError = (e) => {
  e.target.style.display = 'none';
  const textLogo = document.createElement('h1');
  textLogo.textContent = config.header.serverName;
  textLogo.className = 'text-logo';
  e.target.parentNode.appendChild(textLogo);
};

onMounted(() => {
  document.title = config.header.serverName;
  document.documentElement.style.setProperty('--primary-color', config.appearance.colors.primary);
  
  // Convert Hex to RGB for dynamic shadows/transparency
  const hex = config.appearance.colors.primary.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  document.documentElement.style.setProperty('--primary-color-rgb', `${r}, ${g}, ${b}`);

  document.documentElement.style.setProperty('--text-color', config.appearance.colors.text);
  document.documentElement.style.setProperty('--background-color', config.appearance.colors.background);
  document.documentElement.style.setProperty('--overlay-color', config.appearance.colors.overlay);
  
  // Staggered cinematic entrance animation
  setTimeout(() => {
    logoStyle.value = { opacity: 1, transform: 'scale(1)' };
    setTimeout(() => {
      welcomeStyle.value = { opacity: 1, transform: 'translateY(0)' };
    }, 400);
  }, 500);
});
</script>

<style>
/* Global Styles */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;600&display=swap');

:root {
    --primary-color: #B12A2A;
    --text-color: #FFFFFF;
    --background-color: #000000;
    --overlay-color: rgba(0, 0, 0, 0.4);
    --transition-speed: 0.3s;
    --font-heading: 'Dark College', serif;
    --font-body: 'Inter', sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    color: var(--text-color);
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    user-select: none;
    background-color: var(--background-color);
    cursor: default;
}

/* Base Wrapper */
#app-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.fade-out {
    opacity: 0 !important;
    transition: opacity 2.0s ease-in-out;
}

/* Cinematic Overlays */
#theme-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--primary-color);
    mix-blend-mode: multiply;
    opacity: 0.4;
    pointer-events: none;
    z-index: 2;
    transition: background-color 0.5s ease;
}

#cinematic-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
    pointer-events: none;
    z-index: 2;
}

#noise-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
    opacity: 0.04;
    pointer-events: none;
    z-index: 3;
}

/* Layout Structure */
#content-layout {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    pointer-events: none;
}

#top-left-section {
    position: absolute;
    top: 4rem;
    left: 4rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    pointer-events: auto;
}

#bottom-left-section {
    position: absolute;
    bottom: 4rem;
    left: 4rem;
    max-width: 450px;
}

#top-right-section {
    position: absolute;
    top: 4rem;
    right: 4rem;
    display: flex;
    gap: 15px;
    align-items: flex-start;
    pointer-events: auto;
}

#bottom-right-section {
    position: absolute;
    bottom: 4rem;
    right: 4rem;
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

#logo-container {
    margin-bottom: 1.5rem;
    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

#logo {
    max-width: 250px;
    height: auto;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
}

.text-logo {
    font-family: var(--font-heading);
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-color);
    text-shadow: 0 4px 10px rgba(0,0,0,0.8);
    letter-spacing: 2px;
}

#welcome-container {
    transition: opacity 1s ease, transform 1s ease;
}

#welcome-text {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 400;
    font-style: italic;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    letter-spacing: 1px;
}

.welcome-divider {
    height: 2px;
    width: 50px;
    background: linear-gradient(90deg, var(--primary-color), transparent);
    margin-top: 8px;
    border-radius: 2px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    #top-left-section { top: 2rem; left: 2rem; }
    #top-right-section { top: 2rem; right: 2rem; }
    #bottom-left-section { bottom: 2rem; left: 2rem; }
    #bottom-right-section { bottom: 2rem; right: 2rem; }
    #welcome-text { font-size: 1.8rem; }
    #logo { max-width: 200px; }
}

@media (max-width: 768px) {
    #bottom-left-section { display: none; /* Hide tips on small screens to save space */ }
    #bottom-right-section {
        width: calc(100% - 4rem);
        right: 2rem;
        left: 2rem;
    }
}
</style>
