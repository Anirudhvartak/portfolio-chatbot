/**
 * Dynamic Theme System
 * Applies custom colors from configuration to chatbot
 * Similar to ukvbot's dynamic PHP CSS generation
 */

(function() {
    'use strict';
    
    // Helper functions for color manipulation
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function darkenColor(hex, percent = 20) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        const r = Math.max(0, Math.min(255, rgb.r - (rgb.r * percent / 100)));
        const g = Math.max(0, Math.min(255, rgb.g - (rgb.g * percent / 100)));
        const b = Math.max(0, Math.min(255, rgb.b - (rgb.b * percent / 100)));
        
        return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    }
    
    function lightenColor(hex, percent = 85) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        const r = Math.min(255, rgb.r + Math.round((255 - rgb.r) * percent / 100));
        const g = Math.min(255, rgb.g + Math.round((255 - rgb.g) * percent / 100));
        const b = Math.min(255, rgb.b + Math.round((255 - rgb.b) * percent / 100));
        
        return rgbToHex(r, g, b);
    }
    
    function getConfigFromLocalStorage() {
        try {
            const saved = localStorage.getItem('chatbot_config');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Failed to load chatbot config:', e);
            return null;
        }
    }
    
    function getConfigFromURL() {
        const params = new URLSearchParams(window.location.search);
        const config = {};
        
        // Parse URL parameters (similar to original PHP approach)
        if (params.has('btc')) config.basetheme_color = '#' + params.get('btc');
        if (params.has('hbg')) config.header_bg = '#' + params.get('hbg');
        if (params.has('lc')) config.link_color = '#' + params.get('lc');
        if (params.has('fc')) config.font_color = '#' + params.get('fc');
        if (params.has('fn')) config.font_family = params.get('fn');
        if (params.has('fs')) config.font_size = params.get('fs');
        
        return Object.keys(config).length > 0 ? { theme: config } : null;
    }
    
    function applyTheme(theme) {
        if (!theme) return;
        
        const basetheme = theme.basetheme_color || '#10B981';
        const basethemeDark = darkenColor(basetheme, 20);
        const basethemeSoft = lightenColor(basetheme, 40);
        const basethemeLight = lightenColor(basetheme, 85);
        
        // Create CSS custom properties
        const root = document.documentElement;
        
        // Base theme colors
        root.style.setProperty('--basetheme-color', basetheme);
        root.style.setProperty('--basetheme-color-dark', basethemeDark);
        root.style.setProperty('--basetheme-color-soft', basethemeSoft);
        root.style.setProperty('--basetheme-color-light', basethemeLight);
        
        // Additional theme colors
        if (theme.header_bg) {
            root.style.setProperty('--header-bg-color', theme.header_bg);
        }
        if (theme.link_color) {
            root.style.setProperty('--link-color', theme.link_color);
        }
        if (theme.font_color) {
            root.style.setProperty('--font-color', theme.font_color);
        }
        if (theme.font_family) {
            root.style.setProperty('--font-family', theme.font_family);
        }
        if (theme.font_size) {
            root.style.setProperty('--font-size-base', theme.font_size);
        }
        
        console.log('Theme applied:', {
            basetheme,
            basethemeDark,
            basethemeSoft,
            basethemeLight
        });
    }
    
    function applyConfiguration(config) {
        if (!config) return;
        
        // Apply theme colors
        if (config.theme) {
            applyTheme(config.theme);
        }
        
        // Apply behavior settings
        if (config.settings) {
            window.CHATBOT_SETTINGS = config.settings;
        }
        
        // Apply API settings
        if (config.api_config) {
            window.CHATBOT_API_CONFIG = config.api_config;
        }
        
        // Update BOT_CONFIG if it exists
        if (window.BOT_CONFIG && config.theme) {
            window.BOT_CONFIG.theme = config.theme;
        }
        
        if (window.BOT_CONFIG && config.settings) {
            window.BOT_CONFIG.settings = config.settings;
        }
        
        if (window.BOT_CONFIG && config.api_config) {
            window.BOT_CONFIG.api_config = config.api_config;
        }
        
        // Update bot header text if changed
        if (config.aiheader) {
            window.CHATBOT_HEADER = config.aiheader;
        }
        
        if (config.aityping) {
            window.CHATBOT_TYPING = config.aityping;
        }
    }
    
    // Initialize theme
    function initializeTheme() {
        // Priority: URL params > localStorage > defaults
        const urlConfig = getConfigFromURL();
        const localConfig = getConfigFromLocalStorage();
        
        const config = urlConfig || localConfig;
        
        if (config) {
            applyConfiguration(config);
            console.log('Chatbot configuration loaded:', config);
        } else {
            console.log('Using default chatbot configuration');
        }
    }
    
    // Export functions for external use
    window.ChatbotTheme = {
        apply: applyTheme,
        applyConfig: applyConfiguration,
        darken: darkenColor,
        lighten: lightenColor,
        reload: initializeTheme
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }
    
})();
