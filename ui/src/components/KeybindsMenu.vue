<template>
  <div id="keybinds-control-container">
      <button 
        id="keybinds-toggle" 
        :class="{ 'active': activeMenu === 'keybinds' }" 
        @click="toggleMenu"
      >
          <i class="fas fa-keyboard"></i>
      </button>
      
      <div id="keybinds-menu" :class="{ 'visible': activeMenu === 'keybinds' }">
          <div class="settings-header">Server Keybinds</div>
          
          <div class="keyboard">
              <div class="keyboard-row" v-for="(row, rIndex) in keyboardRows" :key="rIndex">
                  <template v-for="(keyChar, index) in row" :key="`${rIndex}-${index}`">
                      <div v-if="keyChar === 'spacer'" class="k-spacer"></div>
                      <div 
                          v-else
                          class="k-key"
                          :class="[
                              getKeybind(keyChar) ? 'is-bound' : '',
                              getKeyClass(keyChar)
                          ]"
                      >
                          <span class="k-char">{{ keyChar === 'SPACE' ? '' : keyChar }}</span>
                          
                          <!-- Hover Tooltip -->
                          <div v-if="getKeybind(keyChar)" class="k-tooltip">
                              {{ getKeybind(keyChar).label }}
                          </div>
                      </div>
                  </template>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const config = window.config;

const activeMenu = inject('activeMenu');
const toggleMenu = () => {
    activeMenu.value = activeMenu.value === 'keybinds' ? null : 'keybinds';
};

const keyboardRows = [
    ['ESC', 'spacer', 'F1', 'F2', 'F3', 'F4', 'spacer', 'F5', 'F6', 'F7', 'F8', 'spacer', 'F9', 'F10', 'F11', 'F12'],
    ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'],
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
    ['CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'WIN', 'CTRL']
];

const getKeybind = (keyChar) => {
    return config.keybinds.find(b => b.key.toUpperCase() === keyChar.toUpperCase());
};

const getKeyClass = (keyChar) => {
    if (keyChar.startsWith('F')) return 'k-fkey';
    switch(keyChar) {
        case 'ESC': return 'k-esc';
        case 'BACKSPACE': return 'k-backspace';
        case 'TAB': return 'k-tab';
        case '\\': return 'k-backslash';
        case 'CAPS': return 'k-caps';
        case 'ENTER': return 'k-enter';
        case 'SHIFT': return 'k-shift';
        case 'CTRL': return 'k-ctrl';
        case 'WIN': return 'k-win';
        case 'ALT': return 'k-alt';
        case 'SPACE': return 'k-space';
        default: return '';
    }
};
</script>

<style scoped>
#keybinds-control-container {
    position: relative;
    z-index: 20;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: flex-end;
}

#keybinds-toggle {
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

#keybinds-toggle:hover, 
#keybinds-toggle.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

#keybinds-toggle.active {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
}

#keybinds-menu {
    background-color: rgba(15, 15, 15, 0.75);
    border-radius: 12px;
    padding: 20px;
    width: 660px; /* Wider to fit full layout */
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

#keybinds-menu.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.settings-header {
    font-family: var(--font-heading);
    color: var(--primary-color);
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 12px;
}

/* Keyboard Layout Styles */
.keyboard {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
}

.keyboard-row {
    display: flex;
    gap: 6px;
    justify-content: center;
    width: 100%;
}

.k-spacer {
    width: 20px; /* Spacer for F-key blocks */
}

.k-key {
    background: rgba(30, 30, 30, 0.8);
    color: #666;
    width: 36px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    box-shadow: 
        0 4px 0 #111,
        0 5px 10px rgba(0,0,0,0.3);
    border: 1px solid #333;
    position: relative;
    transition: all 0.2s ease;
    user-select: none;
}

.k-char {
    font-weight: 700;
    font-size: 0.9rem;
    line-height: 1;
}

/* Modifier Keys Sizing */
.k-esc { font-size: 0.75rem; }
.k-fkey { font-size: 0.8rem; }
.k-backspace { width: 72px; font-size: 0.65rem; }
.k-tab { width: 54px; font-size: 0.65rem; }
.k-backslash { width: 54px; font-size: 0.65rem; }
.k-caps { width: 68px; font-size: 0.65rem; }
.k-enter { width: 80px; font-size: 0.65rem; }
.k-shift { width: 90px; font-size: 0.65rem; }
.k-ctrl, .k-win, .k-alt { width: 48px; font-size: 0.65rem; }
.k-space { width: 230px; }

/* Bound Key Highlighting */
.k-key.is-bound {
    background: var(--primary-color);
    color: white;
    box-shadow: 
        0 4px 0 rgba(0,0,0,0.6),
        0 5px 15px rgba(var(--primary-color-rgb), 0.4);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    cursor: pointer;
}

.k-key.is-bound .k-char {
    color: white;
}

/* Tooltip */
.k-tooltip {
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(10, 10, 10, 0.9);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-family: var(--font-heading);
    font-weight: 700;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 20px rgba(0,0,0,0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid var(--primary-color);
    backdrop-filter: blur(10px);
    z-index: 30;
    letter-spacing: 0.5px;
}

.k-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: var(--primary-color) transparent transparent transparent;
}

.k-key.is-bound:hover .k-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}
</style>
