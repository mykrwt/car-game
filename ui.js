class RacingUI {
    constructor() {
        this.currentScreen = 'main-menu';
        this.previousScreen = null;
        this.eventHandlers = {};
        
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            multiplayerMenu: document.getElementById('multiplayer-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            inGameHud: document.getElementById('in-game-hud'),
            pauseMenu: document.getElementById('pause-menu')
        };

        this.elements = {
            roomIdInput: document.getElementById('room-id-input'),
            roomIdDisplay: document.getElementById('room-id-display'),
            roomIdValue: document.getElementById('room-id-value'),
            volumeSlider: document.getElementById('volume-slider'),
            volumeValue: document.getElementById('volume-value'),
            graphicsQuality: document.getElementById('graphics-quality'),
            speedValue: document.getElementById('speed-value'),
            gearValue: document.getElementById('gear-value'),
            timerValue: document.getElementById('timer-value'),
            lapValue: document.getElementById('lap-value'),
            connectionIndicator: document.getElementById('connection-indicator'),
            connectionText: document.getElementById('connection-text')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('main-menu');
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            this.handleAction(action);
        });

        this.elements.volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.elements.volumeValue.textContent = `${value}%`;
            this.emit('volume-change', { volume: parseInt(value) });
        });

        this.elements.graphicsQuality.addEventListener('change', (e) => {
            const quality = e.target.value;
            this.emit('graphics-quality-change', { quality });
        });

        this.elements.roomIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAction('join-room');
            }
        });
    }

    handleAction(action) {
        const actionMap = {
            'play': () => this.handlePlay(),
            'multiplayer': () => this.handleMultiplayer(),
            'settings': () => this.handleSettings(),
            'exit': () => this.handleExit(),
            'create-room': () => this.handleCreateRoom(),
            'join-room': () => this.handleJoinRoom(),
            'copy-room-id': () => this.handleCopyRoomId(),
            'back-to-main': () => this.handleBackToMain(),
            'back-from-settings': () => this.handleBackFromSettings(),
            'pause': () => this.handlePause(),
            'resume': () => this.handleResume(),
            'restart': () => this.handleRestart(),
            'leave-match': () => this.handleLeaveMatch()
        };

        const handler = actionMap[action];
        if (handler) {
            handler();
        }
    }

    handlePlay() {
        this.emit('play', {});
        this.showScreen('in-game-hud');
    }

    handleMultiplayer() {
        this.previousScreen = 'main-menu';
        this.showScreen('multiplayer-menu');
    }

    handleSettings() {
        this.previousScreen = this.currentScreen;
        this.showScreen('settings-menu');
    }

    handleExit() {
        this.emit('exit', {});
    }

    handleCreateRoom() {
        this.emit('create-room', {});
    }

    handleJoinRoom() {
        const roomId = this.elements.roomIdInput.value.trim();
        if (roomId) {
            this.emit('join-room', { roomId });
            this.elements.roomIdInput.value = '';
        }
    }

    handleCopyRoomId() {
        const roomId = this.elements.roomIdValue.textContent;
        if (roomId && roomId !== '--------') {
            navigator.clipboard.writeText(roomId).then(() => {
                this.emit('room-id-copied', { roomId });
            }).catch(() => {
                this.emit('room-id-copy-failed', { roomId });
            });
        }
    }

    handleBackToMain() {
        this.showScreen('main-menu');
        this.hideRoomId();
    }

    handleBackFromSettings() {
        if (this.previousScreen) {
            this.showScreen(this.previousScreen);
        } else {
            this.showScreen('main-menu');
        }
    }

    handlePause() {
        this.emit('pause', {});
        this.showScreen('pause-menu', true);
    }

    handleResume() {
        this.emit('resume', {});
        this.hideScreen('pause-menu');
    }

    handleRestart() {
        this.emit('restart', {});
        this.hideScreen('pause-menu');
    }

    handleLeaveMatch() {
        this.emit('leave-match', {});
        this.hideScreen('pause-menu');
        this.hideScreen('in-game-hud');
        this.showScreen('main-menu');
    }

    showScreen(screenId, overlay = false) {
        if (!overlay) {
            Object.values(this.screens).forEach(screen => {
                screen.classList.remove('active');
            });
        }

        const screenMap = {
            'main-menu': this.screens.mainMenu,
            'multiplayer-menu': this.screens.multiplayerMenu,
            'settings-menu': this.screens.settingsMenu,
            'in-game-hud': this.screens.inGameHud,
            'pause-menu': this.screens.pauseMenu
        };

        const screen = screenMap[screenId];
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
            this.emit('screen-change', { screen: screenId });
        }
    }

    hideScreen(screenId) {
        const screenMap = {
            'main-menu': this.screens.mainMenu,
            'multiplayer-menu': this.screens.multiplayerMenu,
            'settings-menu': this.screens.settingsMenu,
            'in-game-hud': this.screens.inGameHud,
            'pause-menu': this.screens.pauseMenu
        };

        const screen = screenMap[screenId];
        if (screen) {
            screen.classList.remove('active');
        }
    }

    showRoomId(roomId) {
        this.elements.roomIdValue.textContent = roomId;
        this.elements.roomIdDisplay.classList.remove('hidden');
    }

    hideRoomId() {
        this.elements.roomIdValue.textContent = '--------';
        this.elements.roomIdDisplay.classList.add('hidden');
    }

    updateSpeed(speed) {
        this.elements.speedValue.textContent = Math.round(speed);
    }

    updateGear(gear) {
        this.elements.gearValue.textContent = gear;
    }

    updateTimer(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = milliseconds % 1000;
        
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
        this.elements.timerValue.textContent = formatted;
    }

    updateLap(current, total) {
        this.elements.lapValue.textContent = `${current} / ${total}`;
    }

    setConnectionStatus(connected) {
        if (connected) {
            this.elements.connectionIndicator.classList.add('connected');
            this.elements.connectionIndicator.classList.remove('disconnected');
            this.elements.connectionText.textContent = 'Connected';
        } else {
            this.elements.connectionIndicator.classList.remove('connected');
            this.elements.connectionIndicator.classList.add('disconnected');
            this.elements.connectionText.textContent = 'Disconnected';
        }
    }

    setVolume(volume) {
        this.elements.volumeSlider.value = volume;
        this.elements.volumeValue.textContent = `${volume}%`;
    }

    setGraphicsQuality(quality) {
        this.elements.graphicsQuality.value = quality;
    }

    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    off(event, handler) {
        if (!this.eventHandlers[event]) return;
        
        const index = this.eventHandlers[event].indexOf(handler);
        if (index > -1) {
            this.eventHandlers[event].splice(index, 1);
        }
    }

    emit(event, data) {
        const customEvent = new CustomEvent(`racing-ui:${event}`, {
            detail: data
        });
        document.dispatchEvent(customEvent);

        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => {
                handler(data);
            });
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    isHudVisible() {
        return this.screens.inGameHud.classList.contains('active');
    }

    isPauseMenuVisible() {
        return this.screens.pauseMenu.classList.contains('active');
    }
}

const racingUI = new RacingUI();

if (typeof window !== 'undefined') {
    window.RacingUI = RacingUI;
    window.racingUI = racingUI;
}
