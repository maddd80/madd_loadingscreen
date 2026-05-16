<template>
  <div id="loading-container">
      <div id="loading-status-container" :style="{ opacity: isFinished ? 0 : 1 }">
          <div class="status-header">
              <span id="loading-action">{{ loadingAction || 'Loading content...' }}</span>
              <span id="loading-percentage">{{ Math.round(progress) }}%</span>
          </div>
      </div>
      
      <div id="finishing-container" :style="{ opacity: isFinished ? 1 : 0 }">
          <div id="finishing-message">Ready to ride...</div>
      </div>

      <div id="progress-container">
          <div id="progress-bar-container">
              <div id="progress-bar" :style="{ width: progress + '%' }">
                  <div class="progress-glow"></div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const loadingEvents = inject('loadingEvents');
const { progress, loadingAction, isFinished } = loadingEvents;
</script>

<style scoped>
#loading-container {
    width: 100%;
    text-align: right;
    opacity: 0;
    transition: opacity 0.5s ease;
    animation: slideInRight 1s ease forwards;
    animation-delay: 0.6s;
    position: relative;
}

@keyframes slideInRight {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* Status Text */
#loading-status-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 12px;
    transition: opacity 0.3s ease;
}

.status-header {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 15px;
    width: 100%;
}

#loading-action {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
    letter-spacing: 1px;
}

#loading-percentage {
    font-family: var(--font-body);
    font-size: 1.5rem;
    color: var(--primary-color);
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

/* Progress Bar */
#progress-container {
    width: 100%;
}

#progress-bar-container {
    width: 100%;
    height: 8px; /* Increased from 4px to 8px so it's more visible */
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

#progress-bar {
    position: absolute; /* Fixed double position property */
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px var(--primary-color);
}

.progress-glow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: sweep 1.5s infinite;
}

@keyframes sweep {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
}

/* Finishing State */
#finishing-container {
    opacity: 0;
    transition: opacity 0.5s ease;
    position: absolute;
    top: -5px;
    right: 0;
    text-align: right;
}

#finishing-message {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 12px;
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}
</style>
