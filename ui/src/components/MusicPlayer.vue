<template>
  <div v-if="config.music.enabled" id="music-control-container">
      <button 
        id="music-toggle" 
        :class="{ 'active': activeMenu === 'music' }" 
        @click="toggleMenu"
      >
          <i class="fas fa-music"></i>
      </button>
      
      <div id="music-controls" :class="{ 'visible': activeMenu === 'music' }">
          <div id="music-info">
              <span id="music-title">{{ currentTrackName }}</span>
          </div>
          <div id="music-buttons">
              <button id="music-prev" @click="prevTrack"><i class="fas fa-backward"></i></button>
              <button id="music-play-pause" @click="togglePlay">
                  <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
              </button>
              <button id="music-next" @click="nextTrack"><i class="fas fa-forward"></i></button>
              <div id="volume-container">
                  <i :class="['fas', isMuted ? 'fa-volume-mute' : (volume < 50 ? 'fa-volume-down' : 'fa-volume-up')]" id="volume-icon" @click="toggleMute"></i>
                  <input type="range" id="volume-slider" min="0" max="100" :value="volume" @input="onVolumeChange">
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useMusic } from '../composables/useMusic';
const config = window.config;

const loadingEvents = inject('loadingEvents');
const { isShuttingDown } = loadingEvents;

const activeMenu = inject('activeMenu');
const toggleMenu = () => {
    activeMenu.value = activeMenu.value === 'music' ? null : 'music';
};

const { 
  isPlaying, 
  currentTrackName, 
  volume, 
  isMuted, 
  togglePlay, 
  nextTrack, 
  prevTrack, 
  updateVolume, 
  toggleMute 
} = useMusic(isShuttingDown);

const onVolumeChange = (e) => {
    updateVolume(parseInt(e.target.value));
};
</script>

<style scoped>
#music-control-container {
    position: relative;
    z-index: 20;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: flex-end;
}

#music-toggle {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.4);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    position: absolute;
    top: 0;
    right: 0;
}

/* Hover matches Active but only border and icon */
#music-toggle:hover, 
#music-toggle.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 0 20px rgba(var(--primary-color-rgb), 0.2);
}

#music-toggle.active {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
}

#music-controls {
    background-color: rgba(15, 15, 15, 0.75);
    border-radius: 12px;
    padding: 20px;
    width: 340px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 4px solid var(--primary-color);
    opacity: 0;
    transform: translateY(15px) scale(0.95);
    pointer-events: none;
    backdrop-filter: blur(25px);
    position: absolute;
    top: 65px;
    right: 0;
}

#music-controls.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

#music-info {
    margin-bottom: 18px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 12px;
}

#music-title {
    font-family: var(--font-heading);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    letter-spacing: 0.5px;
}

#music-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

#music-buttons button {
    background-color: rgba(255, 255, 255, 0.03);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    font-size: 1.1rem;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
}

#music-buttons button:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

#music-play-pause {
    background-color: var(--primary-color) !important;
    color: white !important;
    width: 50px !important;
    height: 50px !important;
    font-size: 1.3rem !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.2) !important;
}

#music-play-pause:hover {
    transform: scale(1.1) translateY(-2px) !important;
    box-shadow: 0 0 20px rgba(var(--primary-color-rgb), 0.4) !important;
}

#volume-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
    background: rgba(255, 255, 255, 0.03);
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

#volume-icon {
    margin-right: 10px;
    font-size: 1rem;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
}

#volume-icon:hover {
    color: var(--primary-color);
    transform: scale(1.1);
}

#volume-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 70px;
    height: 4px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    cursor: pointer;
}

#volume-slider::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 4px;
}

#volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    margin-top: -5px; /* Centers thumb on track */
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease;
}

#volume-slider:hover::-webkit-slider-thumb {
    transform: scale(1.2);
}

@media (max-width: 768px) {
    #music-controls {
        width: 300px;
    }
}
</style>
