<template>
    <div id="social-links-container">
        <a v-if="config.socials?.discord" :href="config.socials.discord" target="_blank" class="social-icon">
            <i class="fa-brands fa-discord"></i>
        </a>
        <a v-if="config.socials?.website" :href="config.socials.website" target="_blank" class="social-icon">
            <i class="fa-solid fa-globe"></i>
        </a>
        <a v-if="config.socials?.youtube" :href="config.socials.youtube" target="_blank" class="social-icon">
            <i class="fa-brands fa-youtube"></i>
        </a>
    </div>
</template>

<script setup>
const config = window.config;
</script>

<style scoped>
#social-links-container {
    display: flex;
    gap: 15px;
    margin-top: 20px;
    animation: slideUp 1.2s ease forwards;
    opacity: 0;
    transform: translateY(20px);
    animation-delay: 1s;
    pointer-events: auto;
}

@keyframes slideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.social-icon:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-3px) scale(1.05);
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 6px 15px rgba(177, 42, 42, 0.4);
}
</style>
