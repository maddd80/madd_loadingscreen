import { ref, onMounted, onUnmounted } from 'vue';

export function useLoadingEvents() {
    const progress = ref(0);
    const loadingText = ref('Loading Server...');
    const loadingStatus = ref('');
    const loadingAction = ref('');
    const isFinished = ref(false);
    const isShuttingDown = ref(false);
    const playerName = ref('Player');
    let dataFileCount = 0;
    let currentDataFile = 0;

    const handlers = {
        prepareShutdown() {
            console.log('Preparing to shut down loading screen');
            isShuttingDown.value = true;
        },
        loadProgress(data) {
            const loadFraction = data.loadFraction;
            progress.value = loadFraction * 100;

            if (loadFraction === 1) {
                loadingAction.value = '';
                isFinished.value = true;
                notifyLoadingComplete();
            } else {
                isFinished.value = false;
            }
        },
        onLogLine(data) {
            loadingStatus.value = data.message;
        },
        startDataFileEntries(data) {
            dataFileCount = data.count;
            currentDataFile = 0;
            loadingText.value = 'Loading data files...';
            loadingAction.value = `0/${dataFileCount}`;
        },
        onDataFileEntry(data) {
            currentDataFile++;
            loadingAction.value = `${currentDataFile}/${dataFileCount}: ${data.name}`;
            loadingStatus.value = `Loading: ${data.name}`;
        },
        endDataFileEntries() {
            loadingAction.value = '';
            loadingStatus.value = 'Data files loaded';
        },
        startInitFunction(data) {
            loadingText.value = `Initializing: ${data.type}`;
        },
        startInitFunctionOrder(data) {
            loadingText.value = `Initializing: ${data.type}`;
            loadingAction.value = `Sequence ${data.order}`;
        },
        initFunctionInvoking(data) {
            loadingStatus.value = data.name;
            loadingAction.value = `Function ${data.idx}`;
        }
    };

    const handleMessage = (event) => {
        const data = event.data;
        if (data && data.eventName && handlers[data.eventName]) {
            handlers[data.eventName](data);
        }
    };

    const setupPlayerName = () => {
        if (window.nuiHandoverData?.vars?.playerName) {
            playerName.value = window.nuiHandoverData.vars.playerName;
        }
    };

    const notifyLoadingComplete = () => {
        if (window.invokeNative) {
            fetch(`https://${window.location.hostname}/loadingComplete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            }).catch(() => {});
        }
    };

    let simulateInterval;
    const simulateLoading = () => {
        // Used to simulate progress if native events aren't firing (e.g., in browser)
        if (!window.invokeNative) {
            simulateInterval = setInterval(() => {
                if (progress.value < 100) {
                    progress.value = Math.min(100, progress.value + Math.random() * 5);
                }
                if (progress.value >= 100) {
                    isFinished.value = true;
                    clearInterval(simulateInterval);
                }
            }, 500);
        }
    };

    onMounted(() => {
        window.addEventListener('message', handleMessage);
        setupPlayerName();
        simulateLoading();
    });

    onUnmounted(() => {
        window.removeEventListener('message', handleMessage);
        if (simulateInterval) clearInterval(simulateInterval);
    });

    return {
        progress,
        loadingText,
        loadingStatus,
        loadingAction,
        isFinished,
        isShuttingDown,
        playerName
    };
}
