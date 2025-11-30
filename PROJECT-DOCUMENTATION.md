# Portfolio Chatbot - Complete Project Documentation

## Project Overview
A **standalone, embeddable chatbot plugin** built with pure HTML, CSS, and JavaScript. No build tools, no dependencies, no server required. Designed as a portfolio assistant for **Anirudh Vartak** - Full Stack Product Developer.

## Quick Start
1. Open `public/index.html` in any browser
2. Or integrate into any website by copying the chatbot files
3. Customize via `public/settings.html` (settings persist via localStorage)

---

## Architecture

### Technology Stack
- **Frontend**: Pure JavaScript (ES6+), jQuery
- **Styling**: Custom CSS with theme system
- **Storage**: localStorage (for settings persistence)
- **Speech Recognition**: External plugin via jsDelivr CDN
- **API**: Mock responses (can be replaced with real AI service)

### File Structure
```
standalone-chatbot/
├── .gitignore
├── PROJECT-DOCUMENTATION.md  # This file - complete project guide
├── public/
│   ├── index.html              # Main integration demo page
│   ├── settings.html           # Configuration UI (saves to localStorage)
│   └── assets/
│       ├── css/
│       │   ├── chatbot.css     # Core chatbot styles
│       │   ├── theme.css       # Color themes and variables
│       │   └── styles.css      # Demo page styles
│       ├── js/
│       │   ├── chatbot.js      # Main chatbot logic (widget + fullscreen)
│       │   ├── chatbotinit.js  # Initialization & launcher
│       │   ├── config.js       # Bot configuration + localStorage loader
│       │   ├── mock-api.js     # Portfolio response templates
│       │   ├── theme.js        # Theme management
│       │   └── utils.js        # Helper functions
│       └── images/
│           ├── bot-avatar.svg  # Blue smiley bot icon
│           └── chatbot.svg     # Generic chatbot icon
```

## Core Modules

### 1. **config.js** - Bot Configuration
**Location**: `public/assets/js/config.js`

**Purpose**: Central configuration hub for all bot settings

**Key Settings**:
```javascript
BOT_CONFIG = {
    aiheader: "Anirudh's AI Assistant",
    aityping: "AI Assistant is typing...",
    
    theme: {
        basetheme_color: "#2b3c4c"  // Professional dark slate
    },
    
    quick_actions: [
        // 5 accordion-style cards with nested sub-questions
        // Categories: About, Skills, Projects, Experience, Contact
    ],
    
    fullscreen_questions: [/* Portfolio queries */],
    top_questions: [/* Portfolio queries */]
}
```

**localStorage Integration**:
- At end of file, an IIFE function loads saved settings from `localStorage.getItem('chatbot_config')`
- Merges saved values with defaults (saved settings override defaults)
- Applies: aiheader, aityping, theme, settings, api_config, questions

**How to Customize**:
1. Edit settings via `settings.html` UI (recommended)
2. Or directly edit `BOT_CONFIG` object in this file

---

### 2. **mock-api.js** - Response Engine
**Location**: `public/assets/js/mock-api.js`

**Purpose**: Generates portfolio-specific responses based on user queries

**Response Templates** (9 total):
1. **about**: Biography, awards (Star of Year 2023/2024), expertise
2. **skills**: Frontend (React, Next.js), Backend (PHP, Node.js), AI/ML
3. **projects**: 5 featured projects with descriptions
4. **experience**: uKnowva HRMS career (2.7+ years, 40+ projects)
5. **awards**: Recognition details with impact metrics
6. **education**: Qualifications and certifications
7. **contact**: Email, location, portfolio link, social media, resume
8. **greeting**: Welcome message for recruiters
9. **fallback()**: Smart fallback with suggested questions

**Response Format**:
```javascript
function getAboutResponse() {
    return `
        <div class="chatbot-response">
            <p>Content here...</p>
            <div class="chatbot-subQues">
                <span class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" 
                      data-input="Tell me about your awards">
                    🏆 Awards & Recognition
                </span>
            </div>
        </div>
    `;
}
```

**Button Classes**:
- `chatbot-subPredefinedQ`: Styling class for buttons
- `chatbot-dynamicProssBtn`: Click handler class (sends query to bot)
- `data-input`: The query text to send when clicked

**How to Add Responses**:
1. Create new function following naming pattern
2. Add keyword matching in `MockAPI.processMessage()`
3. Use HTML with proper button classes for interactive elements

---

### 3. **chatbot.js** - Main Logic (Minimized View)
**Location**: `public/assets/js/chatbot.js`

**Purpose**: Core chatbot functionality for minimized widget

**Key Features**:
- Message rendering (user + bot messages)
- Accordion quick actions rendering (lines 365-460)
- Fullscreen toggle
- Chat history management
- Dynamic button click handling

### Critical Code Sections**:

**Fullscreen Landing** (Lines 205-206):
```javascript
'<h1 class="chatbot-fullscreen-title">Hi, I\'m Anirudh Vartak</h1>' +
'<p class="chatbot-fullscreen-subtitle">Full Stack Product Developer | AI Enthusiast | Star of the Year 2023</p>'
```

**Dynamic Button Handler** (Line 478):
```javascript
$(document).on('click', '.chatbot-dynamicProssBtn', function() {
    const query = $(this).data('input');
    if (query) {
        addUserMessage(query);
        processUserInput(query);
    }
});
```

**Why Global Handler**: Ensures buttons work immediately without waiting for first chatbot initialization

**Fullscreen Mode**: Built into same file using `isFullscreenMode` check - renders different UI but uses same core logic

---

### 4. **chatbotinit.js** - Initialization
**Location**: `public/assets/js/chatbotinit.js`

**Purpose**: Bot launcher and widget rendering

**Functionality**:
- Injects chatbot HTML into page
- Handles launcher button (floating button to open bot)
- Initializes theme on load
- Manages open/close animations

---

### 5. **theme.js** - Theme System
**Location**: `public/assets/js/theme.js`

**Purpose**: Dynamic theme application

**Features**:
- Applies `basetheme_color` from config to CSS variables
- Updates on settings change
- Supports custom color schemes

---

### 6. **utils.js** - Helper Functions
**Location**: `public/assets/js/utils.js`

**Purpose**: Shared utility functions

**Common Functions**:
- Date/time formatting
- String manipulation
- DOM helpers
- Validation functions

---

## Settings System

### How Settings Work
1. **Default Settings**: Defined in `config.js` (BOT_CONFIG object)
2. **User Customization**: Via `settings.html` UI
3. **Persistence**: Saved to `localStorage.setItem('chatbot_config', JSON.stringify(config))`
4. **Loading**: IIFE at end of `config.js` loads and merges saved settings
5. **Application**: Merged config used throughout chatbot

### Settings Page (`settings.html`)
**Location**: `public/settings.html`

**Configurable Options**:
- Bot name (aiheader)
- Typing indicator text (aityping)
- Theme color (basetheme_color)
- API endpoint URL
- Fullscreen questions (array)
- Top questions (array)
- Settings toggles (typing indicator, sound, animations)

**How to Use**:
1. Open `settings.html` in browser
2. Modify settings
3. Click "Save Changes"
4. Settings persist to localStorage
5. Reload chatbot to see changes

---

## Speech-to-Text Integration

### External Plugin
**Repository**: https://github.com/Anirudhvartak/speech-to-text-plugin  
**CDN**: jsDelivr (https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/)

**Integration** (in `index.html`):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.css">
<script src="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.js"></script>
```

**Features**:
- 4 layouts: onlyButton, rightSide, leftSide, bottomSide
- Multi-language support
- Auto-submit on speech end
- Browser Web Speech API

**Why CDN**:
- No local plugin files needed
- Free unlimited bandwidth (jsDelivr)
- Global caching and CDN delivery
- Proper CORS headers

---

## Portfolio Data

### Data Source
**Live Portfolio**: https://anirudh-portfolio-react-wheat.vercel.app/

**Key Information**:
- **Name**: Anirudh Vartak
- **Role**: Full Stack Product Developer
- **Experience**: 2.7+ years at uKnowva HRMS
- **Projects**: 40+ completed projects
- **Awards**: Star of the Year 2023, Star of the Year 2024
- **Skills**: React, Next.js, PHP, MySQL, Node.js, AI/ML, OCR
- **Contact**: anirudhvartak33@gmail.com, Mumbai
- **Portfolio**: https://anirudh-portfolio-react-wheat.vercel.app/

### Featured Projects
1. **AI Chatbot & Speech-to-Text Plugin** - Voice-enabled chatbot
2. **Form Generator with AI** - Dynamic form creation
3. **OCR Reimbursement System** - AI-powered expense processing
4. **Flipkart Clone** - E-commerce platform
5. **Supplier Management System** - Business workflow automation

---

## Quick Actions (Accordion Structure)

### Implementation
**Location**: `config.js` → `quick_actions` array

**Structure**:
```javascript
{
    category: "About Anirudh",
    icon: "👤",
    color: "#108ae6",
    questions: [
        "Tell me about Anirudh",
        "What are his key achievements?",
        "What makes him unique?"
    ]
}
```

**5 Categories**:
1. 👤 **About Anirudh** (3 questions)
2. 💻 **Skills & Expertise** (4 questions)
3. 🚀 **Projects** (4 questions)
4. 🏢 **Experience** (4 questions)
5. 📧 **Contact** (4 questions)

**Rendering**: Accordion cards displayed above chat input when bot opens

---

## Event Handling System

### Dynamic Button Clicks
**Problem**: Buttons generated dynamically in bot responses weren't clickable

**Solution**: Global event delegation in both `chatbot.js` and `chat-fullscreen.js`

**Handler** (Line 478 in chatbot.js):
```javascript
$(document).on('click', '.chatbot-dynamicProssBtn', function() {
    const query = $(this).data('input');
    if (query) {
        addUserMessage(query);
        processUserInput(query);
    }
});
```

**Why Global**: Ensures buttons work immediately without waiting for first chatbot initialization

---

## Customization Guide

### Changing Bot Identity
**File**: `config.js` or `settings.html`
```javascript
aiheader: "Your Bot Name",
aityping: "Your Bot is typing...",
```

### Changing Theme Color
**File**: `config.js` or `settings.html`
```javascript
theme: {
    basetheme_color: "#YOUR_COLOR"
}
```

### Adding New Responses
**File**: `mock-api.js`
1. Create response function:
```javascript
function getYourResponse() {
    return `<div class="chatbot-response">Your content</div>`;
}
```
2. Add keyword matching:
```javascript
processMessage(query) {
    if (query.includes('keyword')) return getYourResponse();
}
```

### Adding Quick Actions
**File**: `config.js`
```javascript
quick_actions: [
    {
        category: "Category Name",
        icon: "🔥",
        color: "#ff5733",
        questions: ["Question 1", "Question 2"]
    }
]
```

---

## Integration into Websites

### Basic Integration
```html
<!-- In your HTML <head> -->
<link rel="stylesheet" href="assets/css/chatbot.css">
<link rel="stylesheet" href="assets/css/theme.css">

<!-- Before closing </body> -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/mock-api.js"></script>
<script src="assets/js/theme.js"></script>
<script src="assets/js/chatbot.js"></script>
<script src="assets/js/chat-fullscreen.js"></script>
<script src="assets/js/chatbotinit.js"></script>

<!-- Optional: Speech-to-Text -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.css">
<script src="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.js"></script>
```

### No Build Process Required
- Just copy the `public/assets/` folder to your project
- Include the CSS/JS files in your HTML
- Chatbot auto-initializes on page load

---

## Future Enhancements

### Potential Upgrades
1. **Real AI Integration**: Replace mock-api.js with OpenAI/Gemini API
2. **Analytics**: Track user interactions and popular questions
3. **Multi-language**: Add i18n support for international visitors
4. **Voice Output**: Add text-to-speech for bot responses
5. **File Upload**: Allow resume/portfolio uploads
6. **Calendar Integration**: Book meetings directly from chat
7. **Context Memory**: Remember conversation history across sessions

### API Integration Guide
**To replace mock responses with real AI**:

1. Update `config.js`:
```javascript
api_config: {
    base_url: "https://your-ai-api.com/chat",
    api_key: "YOUR_API_KEY"
}
```

2. Replace `mock-api.js` with:
```javascript
async function processMessage(query) {
    const response = await fetch(BOT_CONFIG.api_config.base_url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${BOT_CONFIG.api_config.api_key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: query })
    });
    return await response.json();
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Buttons in bot responses don't work
- **Fix**: Ensure global event handler exists in chatbot.js (line 478)
- **Check**: Buttons have `chatbot-dynamicProssBtn` class and `data-input` attribute

**Issue**: Settings not applying
- **Fix**: Clear localStorage and re-save settings
- **Check**: IIFE function at end of config.js is present

**Issue**: Speech-to-text not loading
- **Fix**: Check browser console for CDN errors
- **Check**: Ensure CDN links are correct in index.html

**Issue**: Theme color not changing
- **Fix**: Check `theme.js` is loaded after `config.js`
- **Check**: Color value is valid hex code

**Issue**: Fullscreen mode shows old content
- **Fix**: Check chat-fullscreen.js has updated landing content (lines 128-129)

---

## Development Tips

### Best Practices
1. **Always test in browser**: Open index.html after changes
2. **Use settings.html**: Don't hardcode values in config.js
3. **Clear localStorage**: When testing config changes
4. **Check console**: For JavaScript errors
5. **Test dynamic buttons**: Ensure event handlers work

### File Editing Guidelines
- **config.js**: Only edit BOT_CONFIG object, don't touch localStorage loader
- **mock-api.js**: Keep response structure consistent with HTML wrappers
- **chatbot.js**: Don't remove global event handlers
- **theme.js**: Don't modify CSS variable names

### localStorage Structure
```javascript
{
    "aiheader": "Bot Name",
    "aityping": "Typing text",
    "theme": {
        "basetheme_color": "#2b3c4c"
    },
    "settings": {
        "typing_indicator": true,
        "sound_enabled": false
    },
    "api_config": {
        "base_url": ""
    },
    "fullscreen_questions": [],
    "top_questions": []
}
```

---

## Project History

### Key Development Milestones
- ✅ Portfolio data integrated from live website
- ✅ Dynamic button interactions implemented
- ✅ Fullscreen mode with custom branding
- ✅ Speech-to-text plugin externalized to CDN
- ✅ Settings persistence via localStorage
- ✅ Production-ready codebase with clean architecture

---

## Support & Contact

**Developer**: Anirudh Vartak  
**Email**: anirudhvartak33@gmail.com  
**Portfolio**: https://anirudh-portfolio-react-wheat.vercel.app/  
**GitHub**: https://github.com/Anirudhvartak

---

## License
This project is for portfolio demonstration purposes. Speech-to-text plugin is MIT licensed.

---

## For Future AI Assistants

### When Asked to Work on This Project
1. **Read this file first** to understand the complete architecture
2. **Check config.js** for current settings
3. **Review mock-api.js** for response structure
4. **Test changes** by opening public/index.html in browser
5. **Never remove**: localStorage loader, global event handlers, CDN links
6. **Always preserve**: Bot identity (Anirudh Vartak), portfolio data, accordion structure

### Key Files to Remember
- **config.js**: Central configuration + localStorage loader
- **mock-api.js**: All portfolio responses
- **chatbot.js**: Main logic (widget + fullscreen modes) + dynamic button handler (line 478)
- **settings.html**: User-facing configuration UI

### What Makes This Unique
- **No build tools**: Pure HTML/CSS/JS
- **No dependencies**: Except jQuery (from CDN)
- **localStorage-driven**: Settings persist without backend
- **Accordion quick actions**: Not simple buttons
- **Global event handlers**: For dynamic content
- **CDN-based plugin**: Speech-to-text from jsDelivr
- **Single file architecture**: chatbot.js handles both widget and fullscreen modes

### Common Requests
- "Change bot responses" → Edit mock-api.js
- "Change bot name/color" → Edit config.js or use settings.html
- "Add new question category" → Add to quick_actions in config.js
- "Fix buttons not working" → Check global event handler exists

---

**Last Updated**: November 30, 2025  
**Version**: Portfolio Bot v1.0 (Production Ready)
