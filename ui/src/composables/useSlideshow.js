import { ref, onMounted, onUnmounted } from 'vue';
const config = window.config;

export function useSlideshow() {
    const currentImage = ref('');
    const nextImage = ref('');
    const opacity = ref(1);
    
    let slideshowInterval = null;
    let currentIndex = 0;

    const startSlideshow = () => {
        if (!config.background.slideshow.enabled || !config.background.slideshow.images.length) return;
        
        currentImage.value = config.background.slideshow.images[0];
        
        slideshowInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % config.background.slideshow.images.length;
            
            // Start fade out
            opacity.value = 0;
            
            setTimeout(() => {
                // Swap image and fade in
                const img = new Image();
                img.onload = () => {
                    currentImage.value = config.background.slideshow.images[currentIndex];
                    requestAnimationFrame(() => {
                        opacity.value = 1;
                    });
                };
                img.src = config.background.slideshow.images[currentIndex];
            }, 750); // Matches the original CSS fade transition loosely
            
        }, config.background.slideshow.duration);
    };

    onMounted(() => {
        if (config.background.type === 'slideshow') {
            startSlideshow();
        } else if (config.background.type === 'image') {
            currentImage.value = config.background.image.path;
        }
    });

    onUnmounted(() => {
        if (slideshowInterval) clearInterval(slideshowInterval);
    });

    return {
        currentImage,
        opacity
    };
}
