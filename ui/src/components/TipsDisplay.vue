<template>
  <div v-if="config.tips.list && config.tips.list.length > 0" id="tips-container">
      <div class="tip-header">
          <i class="fa-solid fa-lightbulb"></i>
          <span>Helpful Tip</span>
      </div>
      <div class="tip-content">
          <p id="tip-text">{{ currentText }}<span class="cursor" v-if="isTyping"></span></p>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const config = window.config;

const currentTipIndex = ref(0);
const currentText = ref('');
const isTyping = ref(false);
let tipInterval = null;
let typingInterval = null;

const showTip = () => {
    if (typingInterval) clearInterval(typingInterval);
    
    const tip = config.tips.list[currentTipIndex.value];
    if (!tip) return;
    
    currentText.value = '';
    let charIndex = 0;
    isTyping.value = true;
    
    typingInterval = setInterval(() => {
        if (charIndex < tip.length) {
            currentText.value += tip.charAt(charIndex);
            charIndex++;
        } else {
            isTyping.value = false;
            clearInterval(typingInterval);
        }
    }, 50); // Speed of typing effect
};

onMounted(() => {
    if (config.tips.list && config.tips.list.length > 0) {
        showTip();
        tipInterval = setInterval(() => {
            currentTipIndex.value = (currentTipIndex.value + 1) % config.tips.list.length;
            showTip();
        }, config.tips.interval);
    }
});

onUnmounted(() => {
    if (tipInterval) clearInterval(tipInterval);
    if (typingInterval) clearInterval(typingInterval);
});
</script>

<style scoped>
#tips-container {
    animation: slideInLeft 1s ease forwards;
    animation-delay: 0.8s;
    opacity: 0;
    width: 100%;
}

@keyframes slideInLeft {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.tip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-family: var(--font-heading);
    color: var(--primary-color);
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.tip-content {
    min-height: 48px;
}

#tip-text {
    font-family: var(--font-body);
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.5;
    margin: 0;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 1.1rem;
    background-color: var(--primary-color);
    margin-left: 4px;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
    box-shadow: 0 0 5px var(--primary-color);
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

@media (max-width: 768px) {
    #tip-text {
        font-size: 1rem;
    }
}
</style>
