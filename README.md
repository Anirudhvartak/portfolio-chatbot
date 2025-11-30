# 🤖 Portfolio Chatbot - Anirudh Vartak

An intelligent, embeddable chatbot assistant for my portfolio. Built with pure HTML, CSS, and JavaScript - no build tools, no dependencies (except jQuery).

## ✨ Features

- 💬 **Interactive Chat Interface** - Minimized widget + fullscreen mode
- 🎤 **Speech-to-Text** - Voice input powered by Web Speech API (via CDN)
- 🎨 **Customizable Themes** - Easy color and branding configuration
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔧 **Settings Panel** - User-friendly configuration UI with localStorage persistence
- 🎯 **Accordion Quick Actions** - 5 categories with nested sub-questions
- 🚀 **Zero Build Process** - Just open `index.html` and go!

## 🚀 Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Anirudhvartak/portfolio-chatbot.git
cd portfolio-chatbot
```

2. **Open in browser:**
```bash
# Just double-click public/index.html or
start public/index.html  # Windows
open public/index.html   # Mac
xdg-open public/index.html  # Linux
```

3. **Customize settings:**
   - Open `public/settings.html` in your browser
   - Configure bot name, colors, questions
   - Changes save to localStorage automatically

That's it! No npm install, no build step, no server required.

## 📁 Project Structure

```
portfolio-chatbot/
├── .gitignore
├── LICENSE (MIT)
├── README.md (this file)
├── PROJECT-DOCUMENTATION.md  # Complete technical documentation
└── public/
    ├── index.html           # Main demo page
    ├── settings.html        # Configuration UI
    └── assets/
        ├── css/
        │   ├── chatbot.css     # Core chatbot styles
        │   ├── theme.css       # Color themes
        │   └── styles.css      # Demo page styles
        ├── js/
        │   ├── chatbot.js      # Main widget logic
        │   ├── chatbotinit.js  # Initialization
        │   ├── config.js       # Bot configuration
        │   ├── mock-api.js     # Portfolio responses
        │   ├── theme.js        # Theme management
        │   └── utils.js        # Helper functions
        └── images/
            ├── bot-avatar.svg  # Bot icon
            └── chatbot.svg     # Launcher icon
```

## 🎯 Core Modules

- **config.js** - Bot configuration + localStorage integration
- **mock-api.js** - Portfolio response templates (9 categories)
- **chatbot.js** - Main widget logic (handles both minimized & fullscreen)
- **chatbotinit.js** - Initialization and launcher
- **theme.js** - Dynamic theme management
- **utils.js** - Helper functions

## 🔧 Customization

### Change Bot Identity
Edit `public/assets/js/config.js`:
```javascript
BOT_CONFIG = {
    aiheader: "Your Bot Name",
    aityping: "Your Bot is typing...",
    theme: {
        basetheme_color: "#YOUR_COLOR"
    }
}
```

### Add New Responses
Edit `public/assets/js/mock-api.js`:
```javascript
function getYourResponse() {
    return `
        <div class="chatbot-response">
            <p>Your custom content here</p>
        </div>
    `;
}
```

### Modify Quick Actions
Edit `config.js` → `quick_actions` array to add/remove accordion categories.

## 🌐 Integration into Your Website

Copy the `public/assets/` folder to your project and add to your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/chatbot.css">
<link rel="stylesheet" href="assets/css/theme.css">

<!-- Chat Widget Container -->
<div id="chatbot-container" class="chatbot-widget"></div>

<!-- Chat Icon (Floating Button) -->
<div class="chatbot-OpenIcon" id="chatIcon">
    <img src="assets/images/chatbot.svg" alt="Chat Icon">
</div>

<!-- JS (load in this order) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/mock-api.js"></script>
<script src="assets/js/theme.js"></script>
<script src="assets/js/chatbot.js"></script>
<script src="assets/js/chatbotinit.js"></script>

<!-- Optional: Speech-to-Text Plugin -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.css">
<script src="https://cdn.jsdelivr.net/gh/Anirudhvartak/speech-to-text-plugin@main/speechtotext.js"></script>
```

## 📚 Documentation

See [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md) for:
- Complete architecture overview
- File-by-file breakdown
- Troubleshooting guide
- Future enhancement ideas
- Developer notes for AI assistants

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), jQuery
- **Styling**: Custom CSS with CSS variables
- **Storage**: localStorage
- **Speech Recognition**: Web Speech API (via jsDelivr CDN)
- **API**: Mock responses (easily replaceable with real AI)

## 🎨 Features Showcase

### Accordion Quick Actions
- 👤 **About Anirudh** (3 sub-questions)
- 💻 **Skills & Expertise** (4 sub-questions)
- 🚀 **Projects** (4 sub-questions)
- 🏢 **Experience** (4 sub-questions)
- 📧 **Contact** (4 sub-questions)

### Portfolio Data
- **Experience**: 2.7+ years at uKnowva HRMS
- **Projects**: 40+ completed projects
- **Awards**: Star of the Year 2023 & 2024
- **Skills**: React, Next.js, PHP, Node.js, AI/ML, OCR
- **Contact**: anirudhvartak33@gmail.com
- **Location**: Mumbai, India

## 🚀 Future Enhancements

- [ ] Real AI integration (OpenAI/Gemini API)
- [ ] Multi-language support (i18n)
- [ ] Voice output (text-to-speech)
- [ ] Analytics tracking
- [ ] File upload capability
- [ ] Meeting booking integration
- [ ] Context memory across sessions

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

**Proprietary License** - This software is NOT free to use.

- ❌ You may NOT use this code in your projects without permission
- ❌ You may NOT use this commercially
- ✅ You may view the code for educational purposes
- ✅ Contact for licensing: anirudhvartak33@gmail.com

See [LICENSE](LICENSE) file for full details.

## 👨‍💻 Author

**Anirudh Vartak**
- Portfolio: [https://anirudh-portfolio-react-wheat.vercel.app/](https://anirudh-portfolio-react-wheat.vercel.app/)
- Email: anirudhvartak33@gmail.com
- GitHub: [@Anirudhvartak](https://github.com/Anirudhvartak)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/anirudh-vartak)

## ⭐ Star This Repo

If you find this project helpful, please give it a star! ⭐

---

**Built with ❤️ by Anirudh Vartak**
