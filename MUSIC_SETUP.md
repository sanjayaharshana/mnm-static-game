# Adding Audio to M&M Game

## 🎵 How to Add Audio Files

### Option 1: Add Your Own Audio Files
1. **Get your music file** (MP3 format recommended)
2. **Rename it** to `background_music.mp3`
3. **Get your sound effect file** (MP3 format recommended)
4. **Rename it** to `moves_sound.mp3`
5. **Place both files** in the same folder as your game files:
   ```
   your-game-folder/
   ├── index.html
   ├── script.js
   ├── style.css
   ├── background_music.mp3  ← Add your music file here
   ├── moves_sound.mp3       ← Add your move sound here
   └── README.md
   ```

### Option 2: Download Free Music
You can find free background music from:
- **Free Music Archive** (freemusicarchive.org)
- **Incompetech** (incompetech.com) - Kevin MacLeod's music
- **Bensound** (bensound.com)
- **YouTube Audio Library** (youtube.com/audiolibrary)

### Option 3: Create Audio Folder Structure
If you prefer to organize your files:
```
your-game-folder/
├── index.html
├── script.js
├── style.css
├── audio/
│   ├── background_music.mp3  ← Place music here
│   └── moves_sound.mp3        ← Place sound effect here
└── README.md
```

Then update the audio paths in `script.js`:
```javascript
// Line ~905 for background music
this.backgroundMusic = new Audio('audio/background_music.mp3');

// Line ~970 for move sound
this.moveSound = new Audio('audio/moves_sound.mp3');
```

## 🎮 Game Features
- **Automatic music start** when you make your first move
- **Move sound effects** play when you successfully match M&Ms
- **Music controls** - Click the 🔊 Music button to toggle
- **Visual feedback** - Button shows music status
- **Error handling** - Game works even without audio files

## 🎯 Recommended Audio Types

### Background Music
- **Upbeat, cheerful** - Matches M&M's fun brand
- **Loop-friendly** - Should sound good when repeated
- **Not too loud** - Should be background music, not overpowering
- **30-60 seconds** - Short loops work best for games

### Move Sound Effects
- **Short and crisp** - 0.5-2 seconds duration
- **Satisfying feedback** - Should feel rewarding
- **Not jarring** - Pleasant sound that enhances gameplay
- **Quick response** - Should play immediately when move is made

## 🔧 Troubleshooting
- **404 Error**: Make sure files are named exactly `background_music.mp3` and `moves_sound.mp3`
- **No Sound**: Check your browser's audio settings
- **File Not Found**: Ensure files are in the correct folder
- **Browser Issues**: Try refreshing the page after adding the files
- **Move Sound Not Playing**: Ensure `moves_sound.mp3` is in the same folder as your game files

The game will work perfectly without audio files, but adding background music and sound effects will enhance the player experience! 🍫🎵
