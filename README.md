# 🍫 M&M Chocolate Match Game

A delightful match-3 puzzle game featuring M&M chocolate candies! Swap colorful M&M candies to create matches of 3 or more and score points in this engaging promotional campaign game.

## 🎮 Game Features

### **Core Gameplay**
- **8x8 Game Board** - Classic match-3 grid layout
- **8 M&M Colors** - Red, Yellow, Green, Blue, Orange, Purple, Brown, and White
- **30-Second Timer** - Fast-paced gameplay with time pressure
- **1000 Point Target** - Win by reaching the target score
- **Move Counter** - Track your efficiency and strategy

### **Enhanced Match Detection Algorithm**

#### **🎯 3+ Match Detection**
The game uses a sophisticated algorithm to detect matches of 3 or more candies:

```javascript
// Minimum threshold validation
return match.length >= 3 ? match : [];

// Horizontal scanning with bidirectional search
for (let i = 1; col + i < this.boardSize; i++) {
    const nextCandy = this.board[row][col + i];
    if (nextCandy && nextCandy.type.emoji === candyType) {
        match.push(nextCandy);
    } else {
        break;
    }
}
```

#### **📐 Special Pattern Recognition**
Advanced pattern detection for complex matches:

**L-Shapes (3 candies):**
- ┌ shape: Horizontal right + Vertical down
- ┐ shape: Horizontal left + Vertical down  
- └ shape: Horizontal right + Vertical up
- ┘ shape: Horizontal left + Vertical up

**T-Shapes (4 candies):**
- ┳ shape: Horizontal line with vertical down
- ┣ shape: Horizontal line with vertical up
- ┻ shape: Vertical line with horizontal right
- ┫ shape: Vertical line with horizontal left

**Plus-Shapes (5 candies):**
- ✚ shape: Cross pattern in all 4 directions

#### **🔄 Cascade Effect System**
- **Automatic Processing** - New matches trigger automatically
- **Chain Reactions** - Multiple matches process in sequence
- **Score Accumulation** - Points stack for combo effects
- **Visual Feedback** - Smooth animations for each match

### **🎵 Audio System**
- **Background Music** - `background_music.mp3` with loop support
- **Move Sound Effects** - `moves_sound.mp3` for successful matches
- **Volume Control** - Adjustable music and sound volumes
- **Error Handling** - Graceful fallback when audio files missing

### **🎨 Visual Enhancements**
- **M&M Branding** - Authentic chocolate candy colors
- **Smooth Animations** - CSS transitions and keyframes
- **Hardware Acceleration** - Optimized for performance
- **Responsive Design** - Works on desktop and mobile

### **🎯 Enhanced Input System**
- **Mouse Controls** - Click and drag functionality
- **Touch Controls** - Swipe gestures for mobile
- **Visual Feedback** - Selection indicators and previews
- **Swipe Detection** - Precise gesture recognition

## 🎮 How to Play

### **Basic Rules**
1. **Click or Drag** candies to swap adjacent pieces
2. **Create Matches** of 3 or more same-color candies
3. **Score Points** - 10 points per candy matched
4. **Beat the Timer** - 30 seconds to reach 1000 points
5. **Watch for Combos** - Chain reactions multiply your score

### **Match Types**

#### **Horizontal Matches**
```
🔴 🔴 🔴  →  Match of 3 red candies
```

#### **Vertical Matches**
```
🔴
🔴  →  Match of 3 red candies  
🔴
```

#### **L-Shape Matches**
```
🔴 🔴
🔴    →  L-shaped match of 3 red candies
```

#### **T-Shape Matches**
```
🔴 🔴 🔴
   🔴   →  T-shaped match of 4 red candies
```

#### **Plus-Shape Matches**
```
   🔴
🔴 🔴 🔴  →  Plus-shaped match of 5 red candies
   🔴
```

### **Scoring System**
- **Base Score** - 10 points per candy matched
- **Combo Multiplier** - Cascade effects stack points
- **Efficiency Bonus** - Higher score per move ratio
- **Time Bonus** - Faster completion = better efficiency

## 🍫 M&M Chocolate Colors

The game features authentic M&M candy colors:

| Color | Emoji | Name | Description |
|-------|-------|------|-------------|
| 🔴 | Red | Red M&M | Classic red chocolate candy |
| 🟡 | Yellow | Yellow M&M | Bright yellow chocolate candy |
| 🟢 | Green | Green M&M | Fresh green chocolate candy |
| 🔵 | Blue | Blue M&M | Cool blue chocolate candy |
| 🟠 | Orange | Orange M&M | Vibrant orange chocolate candy |
| 🟣 | Purple | Purple M&M | Rich purple chocolate candy |
| 🟤 | Brown | Brown M&M | Deep brown chocolate candy |
| ⚪ | White | White M&M | Pure white chocolate candy |

## 🛠️ Technical Implementation

### **Algorithm Architecture**

#### **Match Detection Engine**
```javascript
findMatches() {
    const matches = [];
    const processedCandies = new Set();
    
    // Step 1: Horizontal matches
    // Step 2: Vertical matches  
    // Step 3: Special patterns
    
    return matches;
}
```

#### **Pattern Recognition**
- **Bidirectional Scanning** - Checks both directions from center
- **Boundary Validation** - Ensures positions are within board
- **Type Matching** - Exact emoji comparison
- **Duplicate Prevention** - Set-based tracking

#### **Processing Pipeline**
1. **Match Detection** - Find all valid matches
2. **Animation** - Visual feedback for matches
3. **Score Calculation** - Points per candy
4. **Candy Removal** - Clear matched pieces
5. **Gravity Effect** - Drop remaining candies
6. **Board Refill** - Generate new candies
7. **Cascade Check** - Look for new matches

### **Performance Optimizations**
- **Hardware Acceleration** - CSS transforms and backface-visibility
- **Efficient Scanning** - Single-pass algorithms
- **Memory Management** - Proper cleanup and garbage collection
- **Event Optimization** - Debounced input handling

### **Error Handling**
- **Audio Fallbacks** - Graceful degradation when files missing
- **Processing Timeouts** - Prevents infinite loops
- **State Validation** - Ensures game consistency
- **User Feedback** - Clear error messages

## 🎯 Promotional Campaign Features

### **Brand Integration**
- **M&M Branding** - Authentic chocolate candy theme
- **Color Accuracy** - Real M&M candy colors
- **Visual Identity** - Consistent brand experience
- **Engagement** - Addictive gameplay mechanics

### **Social Features**
- **Score Sharing** - Share achievements on social media
- **Challenge Friends** - "Can you beat my score?"
- **Viral Potential** - Easy to share and play
- **Brand Awareness** - M&M presence throughout

### **Analytics Ready**
- **Score Tracking** - Monitor player performance
- **Engagement Metrics** - Time spent, moves made
- **Pattern Analysis** - Popular match strategies
- **User Behavior** - Interaction patterns

## 🚀 Getting Started

### **Setup Instructions**
1. **Download Files** - All game files included
2. **Add Audio** - Place `background_music.mp3` and `moves_sound.mp3` in folder
3. **Open `index.html`** - Launch in any modern browser
4. **Start Playing** - Click candies to begin!

### **Audio Setup**
See `MUSIC_SETUP.md` for detailed audio configuration instructions.

### **Browser Compatibility**
- **Chrome** - Full support with hardware acceleration
- **Firefox** - Complete functionality
- **Safari** - Mobile and desktop support
- **Edge** - Modern browser compatibility

## 🎮 Game Controls

### **Desktop Controls**
- **Click** - Select and swap candies
- **Drag** - Swipe candies in any direction
- **Space** - Quick restart (when available)

### **Mobile Controls**
- **Tap** - Select candies
- **Swipe** - Drag candies to swap
- **Multi-touch** - Responsive gesture support

### **Keyboard Shortcuts**
- **Ctrl+D** - Debug mode (developer use)
- **Music Button** - Toggle background music

## 🏆 Winning Strategy

### **Tips for High Scores**
1. **Look for Combos** - Chain reactions multiply points
2. **Plan Ahead** - Think 2-3 moves ahead
3. **Use Special Patterns** - L, T, and plus shapes give bonus points
4. **Stay Calm** - Don't rush, accuracy over speed
5. **Watch the Timer** - Manage time efficiently

### **Advanced Techniques**
- **Cascade Planning** - Set up multiple match opportunities
- **Pattern Recognition** - Identify special shapes quickly
- **Board Analysis** - Scan for potential matches
- **Efficiency Focus** - Maximize points per move

## 🔧 Development Features

### **Debug Tools**
- **Console Logging** - Detailed match information
- **Board Visualization** - ASCII board representation
- **State Monitoring** - Game state tracking
- **Performance Metrics** - Timing and efficiency data

### **Code Quality**
- **Modular Design** - Clean, maintainable code
- **Error Handling** - Robust error management
- **Performance Optimized** - Efficient algorithms
- **Cross-platform** - Works on all devices

## 📈 Future Enhancements

### **Potential Features**
- **Power-ups** - Special candy effects
- **Level System** - Progressive difficulty
- **Multiplayer** - Competitive play
- **Leaderboards** - Global score tracking
- **Achievements** - Unlockable rewards

### **Technical Improvements**
- **WebGL Rendering** - Enhanced graphics
- **AI Opponent** - Computer player
- **Cloud Saves** - Progress persistence
- **Analytics Integration** - Player insights

---

**🍫 Enjoy the sweet taste of victory in M&M Chocolate Match! 🍫**

*Created for M&M Chocolate promotional campaign - bringing the joy of chocolate to digital gaming!*