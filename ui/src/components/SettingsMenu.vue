<template>
  <div id="settings-control-container">
      <button 
        id="settings-toggle" 
        :class="{ 'active': activeMenu === 'settings' }" 
        @click="toggleMenu"
      >
          <i class="fas fa-cog"></i>
      </button>
      
      <div id="settings-menu" :class="{ 'visible': activeMenu === 'settings' }">
          <div class="settings-header">Theme Color</div>
          <div class="color-options">
              <div 
                  v-for="color in themeColors" 
                  :key="color.name" 
                  class="color-btn" 
                  :class="{ 'active-color': currentPrimary === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="setThemeColor(color.hex)"
                  :title="color.name"
              ></div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
const config = window.config;

const activeMenu = inject('activeMenu');
const toggleMenu = () => {
    activeMenu.value = activeMenu.value === 'settings' ? null : 'settings';
};

const currentPrimary = ref(config.appearance.colors.primary);

const themeColors = [
    { name: 'Red', hex: '#B12A2A' },
    { name: 'Blue', hex: '#2A52B1' },
    { name: 'Green', hex: '#2AB14A' },
    { name: 'Gold', hex: '#B1942A' },
    { name: 'Purple', hex: '#712AB1' },
    { name: 'Orange', hex: '#D35400' }
];

const setThemeColor = (hexCode) => {
    document.documentElement.style.setProperty('--primary-color', hexCode);
    
    const hex = hexCode.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    document.documentElement.style.setProperty('--primary-color-rgb', `${r}, ${g}, ${b}`);

    config.appearance.colors.primary = hexCode; 
    currentPrimary.value = hexCode;
};
</script>

<style scoped>
#settings-control-container {
    position: relative;
    z-index: 20;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: flex-end;
}

#settings-toggle {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.4);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    display: center;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    position: absolute;
    top: 0;
    right: 0;
    display: flex; /* Added display flex for centering */
}

/* Hover matches Active but only border and icon */
#settings-toggle:hover, 
#settings-toggle.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

#settings-toggle.active {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
}

#settings-menu {
    background-color: rgba(0, 0, 0, 0.65);
    border-radius: 8px;
    padding: 15px;
    width: 220px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 3px solid var(--primary-color); /* Theme accent border */
    opacity: 0;
    transform: translateY(15px) scale(0.95);
    pointer-events: none;
    backdrop-filter: blur(15px);
    position: absolute;
    top: 65px;
    right: 0;
}

#settings-menu.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.settings-header {
    font-family: var(--font-heading);
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12px;
    font-size: 1.1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.color-options {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.color-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.color-btn:hover {
    transform: scale(1.2);
    border-color: rgba(255, 255, 255, 0.8);
}

.color-btn.active-color {
    border-color: #FFFFFF;
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
</style>
