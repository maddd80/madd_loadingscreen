<template>
  <div class="custom-menus-wrapper">
      <div class="custom-menu-container" v-for="menu in customMenus" :key="menu.id">
          <!-- Toggle Button -->
          <button 
              class="custom-menu-toggle" 
              :class="{ 'active': activeMenu === menu.id }" 
              @click="toggleMenu(menu.id)"
              :title="menu.buttonLabel"
          >
              <i :class="menu.buttonIcon"></i>
          </button>
          
          <!-- Dropdown Modal -->
          <div class="custom-menu-dropdown" :class="{ 'visible': activeMenu === menu.id }">
              <div class="custom-menu-header">{{ menu.title }}</div>
              <div v-if="menu.description" class="custom-menu-description">{{ menu.description }}</div>
              
              <div class="custom-menu-content-list">
                  <div class="custom-menu-item" v-for="(item, idx) in menu.content" :key="idx">
                      <div class="custom-item-title">{{ item.title }}</div>
                      <div class="custom-item-text">{{ item.text }}</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
const config = window.config;

const activeMenu = inject('activeMenu');

const customMenus = computed(() => {
    return config.customMenus || [];
});

const toggleMenu = (menuId) => {
    activeMenu.value = activeMenu.value === menuId ? null : menuId;
};
</script>

<style scoped>
.custom-menus-wrapper {
    display: flex;
    gap: 15px;
}

.custom-menu-container {
    position: relative;
    z-index: 20;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
}

.custom-menu-toggle {
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
}

.custom-menu-toggle:hover, 
.custom-menu-toggle.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.custom-menu-toggle.active {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.custom-menu-dropdown {
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 12px;
    padding: 20px;
    width: 360px;
    max-height: 480px;
    overflow-y: auto;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top: 3px solid var(--primary-color);
    opacity: 0;
    transform: translateY(15px) scale(0.95);
    pointer-events: none;
    backdrop-filter: blur(15px);
    position: absolute;
    top: 65px;
    right: 0;
    display: flex;
    flex-direction: column;
}

.custom-menu-dropdown.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.custom-menu-header {
    font-family: var(--font-heading);
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 8px;
    font-size: 1.3rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.custom-menu-description {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 15px;
    text-align: center;
    line-height: 1.4;
}

.custom-menu-content-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.custom-menu-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    transition: border-color 0.2s ease;
}

.custom-menu-item:hover {
    border-color: rgba(var(--primary-color-rgb), 0.3);
}

.custom-item-title {
    font-family: var(--font-heading);
    font-size: 1.05rem;
    color: var(--primary-color);
    margin-bottom: 6px;
}

.custom-item-text {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
}

/* Custom Scrollbar */
.custom-menu-dropdown::-webkit-scrollbar {
    width: 6px;
}

.custom-menu-dropdown::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.custom-menu-dropdown::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 3px;
}
</style>
