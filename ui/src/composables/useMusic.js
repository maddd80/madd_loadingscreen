import { ref, onMounted, watch } from 'vue';
const config = window.config;

export function useMusic(isShuttingDownRef) {
    const isPlaying = ref(false);
    const volume = ref(config.music.defaultVolume * 100);
    const isMuted = ref(false);
    const currentTrackIndex = ref(0);
    const currentTrackName = ref('Loading...');
    
    let audio = null;
    let preMuteVolume = 50;

    const initAudio = () => {
        if (!config.music.enabled || !config.music.list.length) return;
        
        audio = new Audio();
        audio.volume = config.music.defaultVolume;
        
        if (config.music.randomize) {
            currentTrackIndex.value = Math.floor(Math.random() * config.music.list.length);
        }
        
        audio.addEventListener('ended', nextTrack);
        
        loadTrack(currentTrackIndex.value);
        play();
    };

    const loadTrack = (index) => {
        if (!audio || !config.music.list[index]) return;
        const track = config.music.list[index];
        audio.src = track.path;
        currentTrackName.value = track.name;
        
        audio.onerror = () => {
            console.error("Error loading track:", track.path);
            nextTrack(); // skip to next if error
        };
    };

    const play = () => {
        if (!audio) return;
        audio.play().then(() => {
            isPlaying.value = true;
        }).catch(e => {
            console.error("Audio play failed:", e);
            isPlaying.value = false;
        });
    };

    const pause = () => {
        if (!audio) return;
        audio.pause();
        isPlaying.value = false;
    };

    const togglePlay = () => {
        isPlaying.value ? pause() : play();
    };

    const nextTrack = () => {
        currentTrackIndex.value = (currentTrackIndex.value + 1) % config.music.list.length;
        loadTrack(currentTrackIndex.value);
        play();
    };

    const prevTrack = () => {
        currentTrackIndex.value = (currentTrackIndex.value - 1 + config.music.list.length) % config.music.list.length;
        loadTrack(currentTrackIndex.value);
        play();
    };

    const updateVolume = (val) => {
        volume.value = val;
        if (audio) {
            audio.volume = val / 100;
        }
        isMuted.value = val === 0;
    };

    const toggleMute = () => {
        if (isMuted.value || volume.value === 0) {
            updateVolume(preMuteVolume || 50);
        } else {
            preMuteVolume = volume.value;
            updateVolume(0);
        }
    };

    watch(isShuttingDownRef, (shuttingDown) => {
        if (shuttingDown && audio && !audio.paused) {
            // Fade out over 2 seconds (40 steps * 50ms)
            const originalVol = audio.volume;
            let currentVol = originalVol;
            const steps = 40;
            const interval = setInterval(() => {
                if (currentVol > 0.02) {
                    currentVol -= originalVol / steps;
                    if (audio) audio.volume = Math.max(0, currentVol);
                } else {
                    clearInterval(interval);
                    pause();
                }
            }, 50);
        }
    });

    onMounted(() => {
        initAudio();
    });

    return {
        isPlaying,
        currentTrackName,
        volume,
        isMuted,
        togglePlay,
        nextTrack,
        prevTrack,
        updateVolume,
        toggleMute
    };
}
