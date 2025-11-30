// Bot Configuration
const BOT_CONFIG = {
    // Basic Settings
    ai_avatar: "assets/images/bot-avatar.svg",
    user_avatar: "assets/images/user-avatar.svg",
    aiheader: "Anirudh's AI Assistant",
    aityping: "AI Assistant is typing...",
    api_url: "/api/chat",
    
    // Theme Colors (Professional Portfolio Theme)
    theme: {
        basetheme_color: "#2b3c4c",      // Dark slate - professional
        header_bg: "#2b3c4c",            // Header background
        link_color: "#108ae6",           // Bright blue for links
        menu_bg: "#1f2937",              // Dark gray menu
        menu_text: "#ffffff",            // White text
        primary_btn: "#108ae6",          // Bright blue button
        secondary_btn: "#2b3c4c",        // Dark slate secondary
        font_family: "Public Sans",      // Font family
        font_size: "14px",               // Base font size
        font_color: "#333333"            // Base font color
    },
    
    // Bot Behavior Settings
    settings: {
        floating_bot_icon: true,         // Enable floating bot icon
        show_welcome_bubble: true,       // Show "How can I help you?" bubble
        bubble_delay: 1000,              // Delay before showing bubble (ms)
        enable_fullscreen: true,         // Enable fullscreen mode
        enable_voice_input: true,        // Enable voice/speech input
        show_typing_indicator: true,     // Show typing animation
        auto_open_widget: false          // Auto-open widget on page load
    },
    
    // API Configuration
    api_config: {
        ai_bot_url: "",
        ai_bot_auth_token: "",
        ai_bot_intent_token: "",
        save_intent_url: "",
        query_intent_url: ""
    },
    
    // Fullscreen mode suggested questions (shown on fullscreen landing page)
    fullscreen_questions: [
        "Tell me about Anirudh's experience",
        "What are his technical skills?",
        "Show me his projects",
        "How can I contact him?"
    ],
    
    // Quick action buttons configuration
    quick_actions: [
        {
            label: "About Anirudh",
            icon: "fas fa-user",
            description: "Learn about Anirudh's background and expertise",
            class: "bg-peach",
            actions: [
                { label: "Tell me about Anirudh", query: "Tell me about Anirudh" },
                { label: "What are his achievements?", query: "What awards has he won?" },
                { label: "What makes him unique?", query: "What is Anirudh's expertise?" }
            ]
        },
        {
            label: "Skills & Expertise",
            icon: "fas fa-code",
            description: "Explore technical skills and technologies",
            class: "bg-sky",
            actions: [
                { label: "View All Skills", query: "What are Anirudh's skills?" },
                { label: "Frontend Technologies", query: "What frontend skills does he have?" },
                { label: "Backend Technologies", query: "What backend technologies does he use?" },
                { label: "AI & Machine Learning", query: "What AI skills does he have?" }
            ]
        },
        {
            label: "Projects",
            icon: "fas fa-folder-open",
            description: "View portfolio projects and work",
            class: "bg-lavender",
            actions: [
                { label: "All Projects", query: "Show me his projects" },
                { label: "AI Chatbot", query: "Tell me about the AI chatbot project" },
                { label: "Speech-to-Text Module", query: "What is the speech-to-text project?" },
                { label: "OCR & Form Generator", query: "Tell me about OCR and form projects" }
            ]
        },
        {
            label: "Experience",
            icon: "fas fa-briefcase",
            description: "Professional experience and achievements",
            class: "bg-lightyellow",
            actions: [
                { label: "Work Experience", query: "What is his work experience?" },
                { label: "Awards & Recognition", query: "What awards has he won?" },
                { label: "Key Responsibilities", query: "What are his key responsibilities?" },
                { label: "Career Highlights", query: "What are his career highlights?" }
            ]
        },
        {
            label: "Contact",
            icon: "fas fa-envelope",
            description: "Get contact information and social links",
            class: "bg-mint",
            actions: [
                { label: "Contact Information", query: "How can I contact Anirudh?" },
                { label: "View Resume", query: "Show me his resume" },
                { label: "Social Media Links", query: "What are his social media profiles?" },
                { label: "Email Address", query: "What is his email?" }
            ]
        }
    ],
    
    // Top suggested questions
    top_questions: [
        { text: "Tell me about Anirudh" },
        { text: "What technologies does he work with?" },
        { text: "Show me his best projects" },
        { text: "What awards has he won?" }
    ]
};

// Load saved settings from localStorage and merge with defaults
(function loadSavedSettings() {
    const saved = localStorage.getItem('chatbot_config');
    if (saved) {
        try {
            const savedConfig = JSON.parse(saved);
            
            // Merge basic settings
            if (savedConfig.aiheader) BOT_CONFIG.aiheader = savedConfig.aiheader;
            if (savedConfig.aityping) BOT_CONFIG.aityping = savedConfig.aityping;
            
            // Merge theme settings
            if (savedConfig.theme) {
                Object.assign(BOT_CONFIG.theme, savedConfig.theme);
            }
            
            // Merge behavior settings
            if (savedConfig.settings) {
                Object.assign(BOT_CONFIG.settings, savedConfig.settings);
            }
            
            // Merge API config
            if (savedConfig.api_config) {
                Object.assign(BOT_CONFIG.api_config, savedConfig.api_config);
            }
            
            // Merge questions
            if (savedConfig.fullscreen_questions) {
                BOT_CONFIG.fullscreen_questions = savedConfig.fullscreen_questions;
            }
            if (savedConfig.top_questions) {
                BOT_CONFIG.top_questions = savedConfig.top_questions;
            }
            
            console.log('✅ Settings loaded from localStorage');
        } catch (e) {
            console.error('Failed to load saved settings:', e);
        }
    }
})();
