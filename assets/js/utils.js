/**
 * Chatbot Utilities
 * Helper functions for the chatbot plugin
 */

const ChatbotUtils = (function($) {
    'use strict';

    /**
     * Generate unique ID
     */
    function generateUniqueId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const timestamp = Date.now().toString(36);
        result += timestamp;
        while (result.length < length) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result.slice(0, length);
    }

    /**
     * Scroll chat to bottom
     */
    function scrollChatToBottom(options = {}) {
        const { target = '.chatbot-chatBox', animated = false, duration = 500, addClass = '', timeout = 0 } = options;
        const chatBox = (target instanceof jQuery) ? target : (target instanceof HTMLElement) ? $(target) : $(target);
        const el = chatBox[0];
        
        if (!el) return;
        
        if (addClass) chatBox.addClass(addClass);
        
        setTimeout(() => {
            if (animated) {
                chatBox.animate({ scrollTop: el.scrollHeight }, duration);
            } else {
                el.scrollTop = el.scrollHeight;
            }
        }, timeout);
    }

    /**
     * Handle expandable containers for long content
     */
    function handleExpandableContainers(maxHeight = 400) {
        $('.chatbot-expandable-container').each(function () {
            const $container = $(this);
            
            if ($container.data('chatbot-initialized')) return;
            
            const fullScrollHeight = $container[0].scrollHeight;
            
            if (fullScrollHeight <= maxHeight) {
                $container.data('chatbot-initialized', true);
                return;
            }
            
            if (!$container.parent().hasClass('chatbot-expandable-wrapper')) {
                $container.wrap('<div class="chatbot-expandable-wrapper"></div>');
            }
            
            const $wrapper = $container.parent();
            let $button = $wrapper.find('.chatbot-show-more-btn');
            
            if ($button.length === 0) {
                $button = $('<button class="chatbot-show-more-btn"><span>Show More</span> <i class="fas fa-chevron-down"></i></button>');
                $wrapper.append($button);
            }
            
            $container.addClass('truncated').css('max-height', maxHeight + 'px');
            $button.addClass('visible').removeClass('expanded').find('span').text('Show More');
            
            $button.off('click').on('click', function () {
                if ($container.hasClass('truncated')) {
                    $container.removeClass('truncated').css('max-height', 'none');
                    $button.addClass('expanded').find('span').text('Show Less');
                    $button.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                } else {
                    $container.addClass('truncated').css('max-height', maxHeight + 'px');
                    $button.removeClass('expanded').find('span').text('Show More');
                    $button.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    scrollChatToBottom({ target: '.chatbot-chatBox', animated: true });
                }
            });
            
            $container.data('chatbot-initialized', true);
        });
    }

    /**
     * Plot chart using Highcharts
     */
    function plotChart(elemId, chartConfig) {
        if (chartConfig && typeof chartConfig === 'object' && chartConfig !== null && Object.keys(chartConfig).length !== 0) {
            $('.' + elemId).each(function() {
                if (typeof Highcharts !== 'undefined') {
                    Highcharts.chart(this, chartConfig);
                }
            });
        }
    }

    /**
     * Auto-grow textarea based on content
     */
    function autoGrowTextarea($el) {
        if ($el.data('autogrow-initialized')) return;
        $el.data('autogrow-initialized', true);
        
        const resize = () => {
            $el.css('height', 'auto');
            $el.css('height', $el[0].scrollHeight + 'px');
        };
        
        requestAnimationFrame(resize);
        $el.on('input', resize);
    }

    /**
     * Initialize custom tooltips
     */
    function initCustomTooltips(selector = null) {
        let targetElements;
        
        if (selector) {
            targetElements = $(selector).filter('.chatbot-tooltip').add($(selector).find('.chatbot-tooltip'));
        } else {
            targetElements = $('.chatbot-tooltip');
        }
        
        targetElements.each(function() {
            const $this = $(this);
            const title = $this.attr('title');
            
            if (title) {
                const tooltip = $('<div class="chatbot-tooltip-text">' + title + '</div>');
                $this.append(tooltip);
                $this.removeAttr('title');
            }
        });
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    function sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    /**
     * Format date/time
     */
    function formatDateTime(date) {
        const now = new Date();
        const messageDate = new Date(date);
        const diffTime = Math.abs(now - messageDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    /**
     * Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Get localStorage with fallback
     */
    function getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
            return defaultValue;
        }
    }

    /**
     * Set localStorage with error handling
     */
    function setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Error writing to localStorage:', e);
            return false;
        }
    }

    /**
     * Remove localStorage item
     */
    function removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Error removing from localStorage:', e);
            return false;
        }
    }

    // Public API
    return {
        generateUniqueId,
        scrollChatToBottom,
        handleExpandableContainers,
        plotChart,
        autoGrowTextarea,
        initCustomTooltips,
        sanitizeHTML,
        formatDateTime,
        debounce,
        throttle,
        isInViewport,
        getLocalStorage,
        setLocalStorage,
        removeLocalStorage
    };

})(jQuery);

// Initialize utilities on DOM ready
$(document).ready(function() {
    ChatbotUtils.initCustomTooltips();
    
    // Initialize auto-growing textareas
    $('.txtgrow').each(function () {
        ChatbotUtils.autoGrowTextarea($(this));
    });
});
