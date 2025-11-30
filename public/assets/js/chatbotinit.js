/**
 * Chatbot Initialization
 * Main entry point for chatbot setup
 */

(function($) {
    'use strict';

    // Configuration
    const USE_MOCK_API = true; // Set to false when using real backend
    
    /**
     * Initialize chatbot when DOM is ready
     */
    $(document).ready(function() {
        initializeChatbot();
    });

    /**
     * Main initialization function
     */
    function initializeChatbot() {
        const container = $('#chatbot-container');
        
        // Check if fullscreen mode is requested
        const urlParams = new URLSearchParams(window.location.search);
        const isFullscreen = urlParams.get('chatbot') === 'fullscreen';
        
        // Setup fullscreen mode if needed
        if (isFullscreen) {
            setupFullscreenMode(container);
        }
        
        // Override API URL for mock testing
        if (USE_MOCK_API) {
            BOT_CONFIG.api_url = 'MOCK';
        }
        
        // Initialize the bot widget
        const botOptions = {
            ai_avatar: BOT_CONFIG.ai_avatar,
            user_avatar: BOT_CONFIG.user_avatar,
            aiheader: BOT_CONFIG.aiheader,
            aityping: BOT_CONFIG.aityping,
            quick_actions: BOT_CONFIG.quick_actions,
            fullscreen_questions: BOT_CONFIG.fullscreen_questions,
            api_url: BOT_CONFIG.api_url
        };

        // Add mock API handler if needed
        if (USE_MOCK_API && typeof MockAPI !== 'undefined') {
            botOptions.processUserInput = function(input) {
                MockAPI.processUserInput(input, container);
            };
        }

        container.chatBotWidget(botOptions);
        
        // Initialize speech-to-text after widget is created
        setTimeout(function() {
            if (typeof SpeechToText !== 'undefined' && typeof SpeechToText.init === 'function') {
                SpeechToText.init();
            }
        }, 100);
    }

    /**
     * Setup fullscreen mode
     */
    function setupFullscreenMode(container) {
        container.addClass('chatbot-fullscreen show');
        
        // Create and add fullscreen overlay
        const overlay = $('<div class="chatbot-fullscreen-overlay"></div>');
        $('body').prepend(overlay);
    }

})(jQuery);
