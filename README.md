# Racing Game UI

A complete UI layer for a 3D car racing game built with vanilla HTML, CSS, and JavaScript.

## Features

### Screens
- **Main Menu**: Play, Multiplayer, Settings, Exit
- **Multiplayer Menu**: Create/Join rooms with room ID system
- **Settings**: Volume control, graphics quality, key bindings display
- **In-Game HUD**: Speed, gear, lap timer, connection status
- **Pause Menu**: Resume, restart, leave match

## Usage

### Basic Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <script src="ui.js"></script>
</body>
</html>
```

### Event Integration

The UI exposes events through both custom DOM events and callback handlers.

#### Using Custom Events

```javascript
document.addEventListener('racing-ui:play', (e) => {
    console.log('Play button clicked');
});

document.addEventListener('racing-ui:create-room', (e) => {
    const roomId = generateRoomId();
    racingUI.showRoomId(roomId);
});

document.addEventListener('racing-ui:join-room', (e) => {
    const { roomId } = e.detail;
    console.log('Joining room:', roomId);
});

document.addEventListener('racing-ui:pause', (e) => {
    console.log('Game paused');
});

document.addEventListener('racing-ui:volume-change', (e) => {
    const { volume } = e.detail;
    console.log('Volume changed to:', volume);
});

document.addEventListener('racing-ui:graphics-quality-change', (e) => {
    const { quality } = e.detail;
    console.log('Graphics quality changed to:', quality);
});
```

#### Using Callback Handlers

```javascript
racingUI.on('play', (data) => {
    console.log('Starting game');
});

racingUI.on('restart', (data) => {
    console.log('Restarting game');
});

racingUI.on('leave-match', (data) => {
    console.log('Leaving match');
});
```

### HUD Updates

```javascript
racingUI.updateSpeed(120);

racingUI.updateGear('3');

racingUI.updateTimer(45230);

racingUI.updateLap(2, 3);

racingUI.setConnectionStatus(true);
```

### Screen Management

```javascript
racingUI.showScreen('in-game-hud');

racingUI.hideScreen('pause-menu');

const currentScreen = racingUI.getCurrentScreen();
```

### Settings

```javascript
racingUI.setVolume(75);

racingUI.setGraphicsQuality('high');
```

### Room Management

```javascript
racingUI.showRoomId('ABC12345');

racingUI.hideRoomId();
```

## Available Events

- `racing-ui:play` - Player started single player
- `racing-ui:create-room` - Player requested room creation
- `racing-ui:join-room` - Player attempted to join a room (includes `roomId`)
- `racing-ui:room-id-copied` - Room ID copied to clipboard
- `racing-ui:pause` - Game paused
- `racing-ui:resume` - Game resumed
- `racing-ui:restart` - Player requested restart
- `racing-ui:leave-match` - Player left the match
- `racing-ui:exit` - Player exited the game
- `racing-ui:volume-change` - Volume setting changed (includes `volume`)
- `racing-ui:graphics-quality-change` - Graphics quality changed (includes `quality`)
- `racing-ui:screen-change` - Screen changed (includes `screen`)

## API Reference

### Methods

#### Navigation
- `showScreen(screenId, overlay)` - Show a screen
- `hideScreen(screenId)` - Hide a screen
- `getCurrentScreen()` - Get current screen ID
- `isHudVisible()` - Check if HUD is visible
- `isPauseMenuVisible()` - Check if pause menu is visible

#### HUD Updates
- `updateSpeed(speed)` - Update speed display (number)
- `updateGear(gear)` - Update gear display (string)
- `updateTimer(milliseconds)` - Update lap timer (number)
- `updateLap(current, total)` - Update lap counter (numbers)
- `setConnectionStatus(connected)` - Set connection indicator (boolean)

#### Settings
- `setVolume(volume)` - Set volume (0-100)
- `setGraphicsQuality(quality)` - Set graphics quality ('low', 'medium', 'high', 'ultra')

#### Multiplayer
- `showRoomId(roomId)` - Display room ID
- `hideRoomId()` - Hide room ID display

#### Events
- `on(event, handler)` - Register event handler
- `off(event, handler)` - Unregister event handler
- `emit(event, data)` - Emit custom event

## Responsive Design

The UI is fully responsive with breakpoints at:
- Desktop: > 768px
- Tablet: 480px - 768px  
- Mobile: < 480px

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 60+
- Firefox 60+
- Safari 12+
