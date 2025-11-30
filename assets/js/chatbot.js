(function($) {
    $.fn.chatBotWidget = function(optionsOrMethod) {
        // Handle method calls
        if (typeof optionsOrMethod === 'string') {
            if (optionsOrMethod === 'updateSecretKey') {
                const newKey = arguments[1];
                return this.each(function() {
                    $(this).data('secret_key', newKey);
                });
            }
            return this;
        }

        // Initialization
        return this.each(function() {
            const $this = $(this);

            // If already initialized, remove previous instances
            if ($this.data('chatBotWidgetInitialized')) {
                $this.find('.chatbot-container-child').remove();
                $('body').find('.chatbot-OpenIcon').remove();
                $this.removeData('chatBotWidgetInitialized');
            }

            // Default settings
            const defaults = {
                secret_key: '',
                greetings: [
                    "Hello! How can I assist you today?",
                    "Hi there! What would you like to know?",
                    "Greetings! What can I help you with?"
                ],
                greeting: 'Hello! How can I assist you today?',
                predefinedAnswers: {
                    "Hi": "Hello! How can I help you?",
                    "What is your name?": "I am an AI Bot.",
                    "How are you?": "I'm just a bunch of code, but thank you for asking!",
                    "Help": "Sure! What do you need help with?"
                },
                predefinedQuestions: [
                    "Hi",
                    "What is your name?",
                    "How are you?",
                    "Help"
                ],
                initialGreeting: true,
                processUserInput: null,
                aiheader: 'AI Genie',
                aityping: 'AI Genie is typing...',
                quick_actions: [],
                fullscreen_questions: [
                    "Check my attendance",
                    "Apply for leave"
                ]
            };
            
            const settings = $.extend({}, defaults, optionsOrMethod);

            $this.data('processUserInput', settings.processUserInput);
            $this.data('secret_key', settings.secret_key);
            $this.data('settings', settings);
            $this.data('chatBotWidgetInitialized', true);

            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isFullscreenMode = $this.hasClass('chatbot-fullscreen');
            
            // Create chat container elements
            const chatContainer = $('<div class="chatbot-container-child"></div>');
            
            // Get the base URL for fullscreen link (handle both http and file:// protocols)
            let fullscreenUrl = '?chatbot=fullscreen';
            if (window.location.protocol === 'file:') {
                // For file:// protocol, use the current file's directory
                const currentPath = window.location.pathname;
                const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
                fullscreenUrl = fileName + '?chatbot=fullscreen';
                // If already on index.html or empty, just use index.html
                if (!fileName || fileName === '' || fileName === '/') {
                    fullscreenUrl = 'index.html?chatbot=fullscreen';
                }
            } else {
                fullscreenUrl = window.location.origin + window.location.pathname + '?chatbot=fullscreen';
            }
            
            const chatContainerHeader = $('<div class="chatbot-header"><div class="make-flex chatbot-header-info"><span style="display: inline-flex;" class="back-to-home icon-btn"><i class="fas fa-chevron-left"></i></span><span class="chatbot-header-img make-flex"><img src="' + settings.ai_avatar + '"></span><span> ' + settings.aiheader + ' </span></div><div class="make-flex closNfullSrn-btn"><a class="chatbot-fullSrnBtn icon-btn" href="' + fullscreenUrl + '"><i class="fas fa-expand"></i></a><span class="chat-close-btn icon-btn"><i class="fas fa-times"></i></span></div></div>');
            const chatBox = $('<div class="chatbot-chatBox hide-chatBox"></div>');
            const inputGroup = $('<div class="chatbot-inputGrp center-content hidden"></div>');
            const startChatContainer = $('<div class="start-chat-container"><a class="start-chat-btn fullwidth"><i class="far fa-comment-alt"></i> Start Chat</a></div>');
            const botFooter = $('<div class="chatbot-bot-footer"></div>');
            const userInputWrapper = $('<div class="chatbot-usrInput-wrap fullwidth make-flex"></div>');
            const userInput = $('<input type="text" class="chatbot-usrInput fullwidth speechToText" data-processspeech="botSearch" data-speech-config=\'{"layout":"onlyButton"}\' placeholder="Type your message here...">');
            const sendButton = $('<button class="icon-btn chatbot-send-btn"><i class="fas fa-paper-plane"></i></button>');
            const chatContainer_sub_question = $('<div class="chatbot-subQues hidden"></div>');
            
            chatContainer.append(chatContainerHeader);
            userInputWrapper.append(userInput);
            inputGroup.append(userInputWrapper).append(sendButton);
            botFooter.append(startChatContainer).append(inputGroup);
            chatContainer.append(chatBox);
            chatContainer.append(chatContainer_sub_question);
            chatContainer.append(botFooter);
            $this.append(chatContainer);

            // Initialize speech-to-text for the input field
            if (typeof SpeechToText !== 'undefined' && typeof SpeechToText.makeSpeechToTextInput === 'function') {
                SpeechToText.makeSpeechToTextInput(userInput[0]);
            }

            const questionButtonsContainer = $('<div class="chatbot-predefinedQues"></div>');

            // Create chat icon
            const chatIcon = $('#chatIcon');
            const chatCloseBtn = $('.chat-close-btn');

            // Chat bubble functionality
            (function() {
                const DESKTOP_MIN_WIDTH = 1024; 
                function isDesktop() {
                    try {
                        if (window.matchMedia) {
                            return window.matchMedia('(min-width: ' + DESKTOP_MIN_WIDTH + 'px) and (pointer: fine)').matches;
                        }
                        return window.innerWidth >= DESKTOP_MIN_WIDTH;
                    } catch (e) {
                        return window.innerWidth >= DESKTOP_MIN_WIDTH;
                    }
                }
                function createBubble() {
                    try {
                        const todayKey = new Date().toDateString();
                        const hiddenForToday = localStorage.getItem('chatbot_welcome_hidden');
                        const chatbotWidgetElement = document.querySelector('.chatbot-widget');
                        const widgetAlreadyOpen = chatbotWidgetElement && chatbotWidgetElement.classList.contains('show');
                        if (hiddenForToday === todayKey || widgetAlreadyOpen) return;
                        if (window._chatbot_bubble) return;
                        const $bubble = $("<div class='chatbot-chat-bubble' role='button' aria-label='Portfolio Assistant'><div class='chatbot-chat-bubble-text'>How can I help you today?</div></div>");
                        const $closeBtn = $("<a href='javascript:void(0);' class='chatbot-chat-bubble-close' aria-label='Dismiss'><svg width='18' height='18' viewBox='0 0 12 13' fill='none' style='pointer-events: none; display: block;' xmlns='http://www.w3.org/2000/svg'><path d='M3.6001 4.1001L8.4001 8.9001M3.6001 8.9001L8.4001 4.1001' stroke='white' stroke-width='1.33333'></path></svg></a>");
                        $bubble.append($closeBtn);
                        $bubble.on('click', function(e) {
                            if ($(e.target).hasClass('chatbot-chat-bubble-close')) return;
                            chatIcon.trigger('click');
                        });
                        $closeBtn.on('click', function(e) {
                            e.stopPropagation();
                            destroyBubble();
                            try { localStorage.setItem('chatbot_welcome_hidden', new Date().toDateString()); } catch (err) {}
                        });
                        setTimeout(function() {
                            $('body').append($bubble);
                            window._chatbot_bubble = $bubble;
                            window._chatbot_bubble_key = new Date().toDateString();
                        }, 1000);
                    } catch (e) {
                        console.warn('chatbot: bubble create failed', e);
                    }
                }
                function destroyBubble() {
                    try {
                        if (window._chatbot_bubble) {
                            window._chatbot_bubble.remove();
                            window._chatbot_bubble = null;
                            window._chatbot_bubble_key = null;
                        }
                    } catch (e) {
                        console.warn('chatbot: bubble destroy failed', e);
                    }
                }
                try { if (isDesktop()) createBubble(); } catch (e) {}
            })();

            // Fullscreen mode setup
            let chatBotFullSrnWidget = null;
            let fullscreenChatBox = null;
            let fullscreenLandingWrapper = null;
            let fsInput = null;
            let fsSendButton = null;
            let fsSuggestedQues = null;

            if (isFullscreenMode) {
                let fullscreen_html = '';
                settings.fullscreen_questions.forEach(question => {
                    fullscreen_html += '<button type="button">' + question + '</button>';
                });

                const fullscreenLanding = `
                <div id="chatbot-fullscreen-landing" class="chatbot-fullscreen-landing center-content">
                    <div class="chatbot-fs-landing-wrap">
                        <div class="chatbot-fs-header make-flex fullwidth center-content">
                            <div class="chatbot-fs-head-wrap center-content">
                                <img src="${settings.ai_avatar}" alt="Chatbot Logo" class="chatbot-fS-logo" />
                                <div class="chatbot-fs-head-btn center-content">
                                    <div class="showInChatStart">
                                        <a href="javascript:void(0);" onclick="goToFullscreenBotHome()" class="icon-btn fs-icon-btn" title="Go to Home">
                                            <i class="fas fa-home"></i>
                                        </a>
                                    </div>
                                    <a href="javascript:void(0);" onclick="exitBotFullscreen()" class="icon-btn fs-icon-btn" title="Exit Fullscreen">
                                        <i class="fas fa-compress"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="chatbot-fs-content fullwidth center-content">
                            <div class="make-flex chatbot-fs-content-head">
                                <h1 class="nomargin">Hi, I'm Anirudh Vartak</h1>
                                <p class="chatbot-fs-subtitle">Full Stack Product Developer | AI Enthusiast</p>
                            </div>
                            <div id="chatbot-fs-suggestedQ" class="chatbot-fs-suggestedQ" role="group" aria-label="Suggested Questions">
                                ${fullscreen_html}
                            </div>
                            <div class="chatbot-mic-btn-wrap">
                                <div class="mic-button">
                                    <div class="mic-pulse pulse1"></div>
                                    <div class="mic-pulse pulse2"></div>
                                    <div class="mic-pulse pulse3"></div>
                                    <div class="chatbot-mic-input">
                                        <input type="text" class="speechToText mic-btn-input" data-speech-config='{"layout":"onlyButton"}' data-processspeech="botSearchFSLanding" placeholder="">
                                    </div>
                                    <div class="chatbot-speech-mic-button"></div>
                                </div>
                            </div>
                            <div class="fS-msg-box make-flex center-content fullwidth">
                                <div id="fS-chatBox" class="fS-chatBox fullwidth"></div>
                            </div>
                            <div class="fs-typing-box make-flex center-content fullwidth">
                                <form class="chatbot-fs-input" onsubmit="return false;" role="search">
                                    <div class="chatbot-question-wrap fullwidth">
                                        <input type="text" id="chatbot-question" class="fullwidth speechToText" data-speech-config='{"layout":"onlyButton"}' data-processspeech="botSearchFS" placeholder="${isMobile ? 'Ask me anything...' : 'Ask about my skills, projects, or experience...'}" />
                                    </div>
                                    <button id="fSrn-sendBtn" class="chatbot-send-button" type="submit" title="Send">
                                        <i class="fas fa-paper-plane" aria-hidden="true"></i>
                                        <span class="btn-text">Send</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                $this.append(fullscreenLanding);
                window.chatBotFullSrnWidget = $this;
                fullscreenLandingWrapper = $this.find('#chatbot-fullscreen-landing');
                window.fullscreenLandingWrapper = fullscreenLandingWrapper;
                fullscreenChatBox = fullscreenLandingWrapper.find('#fS-chatBox');
                fsInput = fullscreenLandingWrapper.find('#chatbot-question');
                fsSendButton = fullscreenLandingWrapper.find('#fSrn-sendBtn');
                fsSuggestedQues = fullscreenLandingWrapper.find('#chatbot-fs-suggestedQ');

                // Initialize speech-to-text for fullscreen input
                if (typeof SpeechToText !== 'undefined' && typeof SpeechToText.makeSpeechToTextInput === 'function') {
                    SpeechToText.makeSpeechToTextInput(fsInput[0]);
                    
                    // Initialize the mic button in chatbot-mic-btn-wrap
                    const micBtnInput = fullscreenLandingWrapper.find('.chatbot-mic-input .mic-btn-input');
                    if (micBtnInput.length) {
                        SpeechToText.makeSpeechToTextInput(micBtnInput[0]);
                    }
                }

                fsSendButton.click(function() {
                    sendUserInput(fsInput);
                });

                fsInput.keypress(function(e) {
                    if (e.which === 13 && !e.shiftKey) {
                        e.preventDefault();
                        sendUserInput(fsInput);
                    }
                });

                fsSuggestedQues.find('button').click(function() {
                    const question = $(this).text().trim();
                    if (question) {
                        fullscreenLandingWrapper.addClass('chat-started');
                        fsInput.val(question);
                        sendUserInput(fsInput);
                    }
                });
            }

            // Toggle chat container on icon click
            let isAnimating = false;
            
            function toggleChatVisibility() {
                if (isAnimating) return;
                isAnimating = true;
                
                const chatBotWidgetEl = document.querySelector('.chatbot-widget');
                if (chatBotWidgetEl.classList.contains('show')) {
                    chatBotWidgetEl.classList.remove('show');
                    chatBotWidgetEl.classList.add('hide');
                    chatIcon.removeClass('open');
                    
                    chatBotWidgetEl.addEventListener('animationend', function handler(e) {
                        if (e.animationName === 'shrinkToButton') {
                            chatBotWidgetEl.classList.remove('hide');
                            chatBotWidgetEl.classList.add('hidden');
                            chatBotWidgetEl.removeEventListener('animationend', handler);
                            isAnimating = false;
                        }
                    });
                } else {
                    chatBotWidgetEl.classList.remove('hidden');
                    chatBotWidgetEl.classList.add('show');
                    chatIcon.addClass('open');
                    // Destroy bubble when widget opens
                    if (window._chatbot_bubble) {
                        window._chatbot_bubble.remove();
                        window._chatbot_bubble = null;
                        window._chatbot_bubble_key = null;
                    }
                    scrollChatToBottom({ target: chatBox, timeout: 0 });
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            handleExpandableContainers();
                            isAnimating = false;
                        }, 0);
                    });
                }
            }
            
            chatIcon.click(toggleChatVisibility);
            chatCloseBtn.click(toggleChatVisibility);

            let chatHistory = [];
            let isBotResponding = false;
            let is_show_greeting = true;
            
            // Load chat history from localStorage
            const storedHistory = localStorage.getItem('chatHistory');
            if (storedHistory) {
                try {
                    const parsedHistory = JSON.parse(storedHistory);
                    parsedHistory.forEach(function(msg) {
                        is_show_greeting = false;
                        const msgtxt = msg.text;
                        if (msgtxt) {
                            addMessage(msgtxt, msg.sender, false);
                        }
                        if (msg.graph && typeof msg.graph === 'object' && msg.graph !== null && Object.keys(msg.graph).length !== 0) {
                            const uqid = 'graph' + generateUniqueId();
                            const graph_html = '<div id="' + uqid + '" class="' + uqid + '"></div>';
                            addMessage(graph_html, msg.sender, false);
                            plotAiGraph(uqid, msg.graph);
                        }
                    });

                    questionButtonsContainer.addClass('hide-predefined');
                    chatBox.removeClass('hide-chatBox');
                    inputGroup.removeClass('hidden');
                    startChatContainer.addClass('hidden');
                    $('.back-to-home').css("display", "inline-flex");

                    chatHistory = parsedHistory;
                } catch (e) {
                    chatHistory = [];
                    localStorage.removeItem('chatHistory');
                }
            }

            // Show initial greeting
            if (settings.initialGreeting && is_show_greeting) {
                const initialGreeting = settings.greeting;
                addMessage(initialGreeting, 'bot', false);
            }

            // Build Quick Actions
            settings.quick_actions.forEach(question => {
                if (Array.isArray(question.actions)) {
                    const parentButton = $(`
                        <div class="chatbot-accordion ${question.class}">
                            <a class="chatbot-predefinedQ">
                                <div class="chatbot-predefinedQ-left">
                                    <div class="chatbot-predefinedQIcon p-sm">
                                        <i class="${question.icon}"></i>
                                    </div>
                                    <div class="chatbot-predefinedQContent">
                                        <h3 class="font-bold nomargin">${question.label}</h3>
                                        <span class="chatbot-predefinedQSummary">${question.description}</span>
                                    </div>
                                </div>
                                <span class="accordion-arrow"><i class="fas fa-chevron-down"></i></span>
                            </a>
                            <div class="chatbot-accordion-content" style="display:none;"></div>
                        </div>
                    `);

                    const contentDiv = parentButton.find('.chatbot-accordion-content');
                    question.actions.forEach(action => {
                        const actionBtn = $(`<button class="chatbot-subPredefinedQ">${action.label}</button>`);
                        actionBtn.click(function(e) {
                            e.stopPropagation();
                            sendPredefinedQuestion(action);
                            questionButtonsContainer.addClass('hide-predefined');
                            chatBox.removeClass('hide-chatBox');
                            chatContainer_sub_question.addClass('hidden');
                            inputGroup.removeClass('hidden');
                            startChatContainer.addClass('hidden');
                            updateBackToHomeVisibility();

                            if (action.sub_questions && Array.isArray(action.sub_questions) && action.sub_questions.length > 0) {
                                chatContainer_sub_question.html('');
                                action.sub_questions.forEach(subq => {
                                    const subBtn = $(`<button class="chatbot-subPredefinedQ">${subq.label}</button>`);
                                    subBtn.click(function() {
                                        sendPredefinedQuestion(subq);
                                        questionButtonsContainer.addClass('hide-predefined');
                                        chatBox.removeClass('hide-chatBox');
                                        chatContainer_sub_question.removeClass('hidden');
                                        inputGroup.removeClass('hidden');
                                        startChatContainer.addClass('hidden');
                                        updateBackToHomeVisibility();
                                    });
                                    chatContainer_sub_question.append(subBtn);
                                });
                                chatContainer_sub_question.removeClass('hidden');
                            }
                        });
                        contentDiv.append(actionBtn);
                    });

                    parentButton.find('.chatbot-predefinedQ').click(function(e) {
                        e.preventDefault();
                        const $accordion = $(this).closest('.chatbot-accordion');
                        const content = $accordion.find('.chatbot-accordion-content');
                        content.slideToggle(200);
                        $accordion.toggleClass('opened');
                    });

                    questionButtonsContainer.append(parentButton);
                } else {
                    const questionButton = $(`
                        <a class="chatbot-predefinedQ ${question.class}">
                            <div class="chatbot-predefinedQ-left">
                                <div class="chatbot-predefinedQIcon p-sm">
                                    <i class="${question.icon}"></i>
                                </div>
                                <div class="chatbot-predefinedQContent">
                                    <h3 class="font-bold nomargin">${question.label}</h3>
                                    <span class="chatbot-predefinedQSummary">${question.description}</span>
                                </div>
                            </div>
                        </a>
                    `);

                    questionButton.click(function() {
                        sendPredefinedQuestion(question);
                        questionButtonsContainer.addClass('hide-predefined');
                        chatBox.removeClass('hide-chatBox');
                        inputGroup.removeClass('hidden');
                        startChatContainer.addClass('hidden');
                        updateBackToHomeVisibility();
                    });

                    questionButtonsContainer.append(questionButton);
                }
            });
            
            botFooter.before(questionButtonsContainer);

            startChatContainer.find('.start-chat-btn').click(function() {
                questionButtonsContainer.addClass('hide-predefined');
                chatBox.removeClass('hide-chatBox');
                inputGroup.removeClass('hidden');
                startChatContainer.addClass('hidden');
                updateBackToHomeVisibility();
                scrollChatToBottom({ target: chatBox, timeout: 0 });
            });

            $('.back-to-home').click(function() {
                questionButtonsContainer.removeClass('hide-predefined');
                chatBox.addClass('hide-chatBox');
                chatContainer_sub_question.addClass('hidden');
                inputGroup.addClass('hidden');
                startChatContainer.removeClass('hidden');
                $(this).hide();
            });

            // Helper function to manage back-to-home button visibility
            function updateBackToHomeVisibility() {
                if (questionButtonsContainer.hasClass('hide-predefined')) {
                    $('.back-to-home').css("display", "inline-flex");
                } else {
                    $('.back-to-home').hide();
                }
            }
            
            // Check initial state when bot loads
            updateBackToHomeVisibility();

            // Handle dynamic button clicks from bot responses
            $(document).on('click', '.chatbot-dynamicProssBtn', function() {
                if (!isBotResponding) {
                    let inputText = $(this).data('input');
                    if (inputText) {
                        addMessage(inputText, 'user');
                        const processFunc = $this.data('processUserInput');
                        if (typeof processFunc === 'function') {
                            processFunc.call($this, inputText);
                        } else {
                            processUserInput(inputText);
                        }
                        $(this).removeClass('chatbot-dynamicProssBtn');
                    }
                }
            });

            function sendUserInput(inputElement) {
                if (!isBotResponding) {
                    const userInputValue = inputElement.val().trim();
                    if (userInputValue) {
                        addMessage(userInputValue, 'user');
                        
                        // If fullscreen mode, add chat-started class
                        if (isFullscreenMode && fullscreenLandingWrapper) {
                            fullscreenLandingWrapper.addClass('chat-started');
                        }
                        
                        const processFunc = $this.data('processUserInput');
                        if (typeof processFunc === 'function') {
                            processFunc.call($this, userInputValue);
                        } else {
                            processUserInput(userInputValue);
                        }
                        inputElement.val('');
                    }
                }
            }

            sendButton.click(function() {
                sendUserInput(userInput);
            });

            userInput.keypress(function(event) {
                if (event.which === 13) {
                    sendButton.click();
                }
            });

            function addMessage(message, sender, is_history = true, extraClass = '', graph = null, graph_html = '') {
                const messageClass = sender === 'user' ? 'chatbot-user-msg' : 'chatbot-bot-msg';
                const avatarUrl = sender === 'user' ? settings.user_avatar : settings.ai_avatar;
                const avatarImg = `<div class="chatbot-avatar"><img src="${avatarUrl}" alt="${sender} avatar"></div>`;

                const messageElement = $(`<div class="${messageClass} ${extraClass}">${avatarImg}<div class="chatbot-msg-text"></div></div>`);
                messageElement.find('.chatbot-msg-text').html(message);
                chatBox.append(messageElement);

                // Also add to fullscreen chatbox if in fullscreen mode
                if (isFullscreenMode && fullscreenChatBox && fullscreenChatBox.length) {
                    fullscreenChatBox.append(messageElement.clone());
                    scrollChatToBottom({ target: fullscreenChatBox });
                }

                messageElement.hide().fadeIn(300);

                if (is_history) {
                    if (graph) {
                        chatHistory.push({ text: '', sender: sender, graph: graph });
                    } else {
                        chatHistory.push({ text: message, sender: sender });
                    }
                    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                }

                scrollChatToBottom({ target: chatBox, timeout: 0 });
            }

            function handleExpandableContainers(maxHeight = 400) {
                $('.chatbot-expandable-container').each(function() {
                    const $container = $(this);
                    if ($container.data('chatbot-initialized')) return;
                    
                    const fullScrollHeight = $container[0].scrollHeight;
                    if (fullScrollHeight <= maxHeight) {
                        $container.removeClass('truncated expanded').css('max-height', '');
                        $container.parent('.chatbot-expandable-wrapper').find('.chatbot-show-more-btn').remove();
                        $container.data('chatbot-initialized', true);
                        return;
                    }

                    if (!$container.parent().hasClass('chatbot-expandable-wrapper')) {
                        $container.wrap('<div class="chatbot-expandable-wrapper"></div>');
                    }

                    const $wrapper = $container.parent();
                    let $button = $wrapper.find('.chatbot-show-more-btn');
                    if ($button.length === 0) {
                        $button = $('<button class="chatbot-show-more-btn"><span>Show More</span><i class="fas fa-chevron-down"></i></button>');
                        $wrapper.append($button);
                    }

                    $container.addClass('truncated').css('max-height', maxHeight + 'px');
                    $button.addClass('visible').removeClass('expanded').find('span').text('Show More');

                    $button.off('click').on('click', function() {
                        if (!$container.hasClass('expanded')) {
                            const fullHeight = $container[0].scrollHeight;
                            $container.css('max-height', $container.height()).addClass('expanded').stop().animate({ maxHeight: fullHeight }, 300, () => {
                                $container.css('max-height', 'none');
                            });
                            $button.addClass('expanded').find('span').text('Show Less');
                        } else {
                            $container.css('max-height', $container.height()).stop().animate({ maxHeight }, 300, () => {
                                $container.removeClass('expanded').css('max-height', maxHeight + 'px');
                            });
                            $button.removeClass('expanded').find('span').text('Show More');
                        }
                    });

                    $container.data('chatbot-initialized', true);
                });
            }

            function scrollChatToBottom(options = {}) {
                const { target = '.chatbot-chatBox', animated = false, duration = 500, addClass = '', timeout = 0 } = options;
                const chatBox = (target instanceof jQuery) ? target : (target instanceof HTMLElement) ? $(target) : $(target);
                const el = chatBox[0];
                if (!el) return;
                
                if (addClass) chatBox.addClass(addClass);
                
                setTimeout(() => {
                    if (animated) {
                        chatBox.stop().animate({ scrollTop: el.scrollHeight }, duration);
                    } else {
                        el.scrollTop = el.scrollHeight;
                    }
                }, timeout);
            }

            function addBotTypingIndicator() {
                const typingHTML = `
                    <span class="typing-dots">
                        <span class="dot dot1"></span>
                        <span class="dot dot2"></span>
                        <span class="dot dot3"></span>
                    </span>
                `;
                addMessage(typingHTML, 'bot', false, 'typing-message');
                scrollChatToBottom({ target: chatBox, timeout: 0 });
            }

            function processUserInput(input) {
                addBotTypingIndicator();
                isBotResponding = true;
                userInput.prop('disabled', true);
                sendButton.prop('disabled', true);
                if (isFullscreenMode && fsInput) {
                    fsInput.prop('disabled', true);
                    fsSendButton.prop('disabled', true);
                }

                const setns = $this.data('settings');
                const data = {
                    query: input,
                    chat_history: chatHistory
                };

                // Make AJAX request to API
                $.ajax({
                    url: setns.api_url,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response_jn) {
                        console.log("response_jn", response_jn);
                        
                        const response = response_jn.response_html || "Sorry, I didn't understand that.";
                        chatBox.find('.typing-message').remove();
                        if (isFullscreenMode && fullscreenChatBox) {
                            fullscreenChatBox.find('.typing-message').remove();
                        }

                        let uqid = '';
                        chatContainer_sub_question.addClass('hidden');
                        let graph_html = '';
                        
                        if (response_jn.response_graph) {
                            uqid = response_jn.intent + generateUniqueId();
                            graph_html = '<div id="' + uqid + '" class="' + uqid + '"></div>';
                        }
                        
                        addMessage(response, 'bot');
                        
                        if (response_jn.response_graph && typeof response_jn.response_graph === 'object' && response_jn.response_graph !== null && Object.keys(response_jn.response_graph).length !== 0 && uqid) {
                            graph_html = '<div id="' + uqid + '" class="' + uqid + '"></div>';
                            addMessage(graph_html, 'bot', true, '', response_jn.response_graph, graph_html);
                            plotAiGraph(uqid, response_jn.response_graph);
                        }

                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                handleExpandableContainers();
                            }, 0);
                        });

                        $(document).off('click', '.chatbot-dynamicProssBtn').on('click', '.chatbot-dynamicProssBtn', function() {
                            let inputp = $(this).data('input');
                            addMessage(inputp, 'user');
                            processUserInput(inputp);
                            $(this).closest('div').find('.chatbot-dynamicProssBtn').removeClass('chatbot-dynamicProssBtn');
                        });

                        scrollChatToBottom({ target: chatBox, timeout: 0, animated: true });
                        isBotResponding = false;
                        userInput.prop('disabled', false);
                        sendButton.prop('disabled', false);
                        userInput.focus();
                        if (isFullscreenMode && fsInput) {
                            fsInput.prop('disabled', false);
                            fsSendButton.prop('disabled', false);
                            fsInput.focus();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        let message = '';

                        if (textStatus === 'timeout') {
                            message = 'The request timed out. Please check your internet connection and try again.';
                        } else if (jqXHR.status === 0) {
                            message = 'Network error. Please check your internet connection.';
                        } else if (jqXHR.status >= 500) {
                            message = 'Server error occurred. Please try again later.';
                        } else if (jqXHR.status >= 400) {
                            message = 'An error occurred: ' + jqXHR.status + '. Please try again.';
                        } else {
                            message = 'An unexpected error occurred. Please try again.';
                        }

                        chatBox.find('.typing-message').remove();
                        if (isFullscreenMode && fullscreenChatBox) {
                            fullscreenChatBox.find('.typing-message').remove();
                        }
                        addMessage(message, 'bot');
                        
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                handleExpandableContainers();
                            }, 0);
                        });
                        
                        scrollChatToBottom({ target: chatBox, timeout: 0, animated: true });
                        isBotResponding = false;
                        userInput.prop('disabled', false);
                        sendButton.prop('disabled', false);
                        userInput.focus();
                        if (isFullscreenMode && fsInput) {
                            fsInput.prop('disabled', false);
                            fsSendButton.prop('disabled', false);
                            fsInput.focus();
                        }
                    }
                });
            }

            function sendPredefinedQuestion(question) {
                if (!isBotResponding) {
                    addMessage(question.query, 'user');
                    const processFunc = $this.data('processUserInput');
                    if (typeof processFunc === 'function') {
                        processFunc.call($this, question.query);
                    } else {
                        processUserInput(question.query);
                    }
                }
            }
        });
    };
})(jQuery);

function goToFullscreenBotHome() {
    if (window.fullscreenLandingWrapper && window.fullscreenLandingWrapper.length) {
        window.fullscreenLandingWrapper.removeClass('chat-started');
    }
}

function exitBotFullscreen() {
    const url = new URL(window.location.href);
    url.searchParams.delete('chatbot');
    window.history.replaceState({}, document.title, url.toString());
    
    // Remove fullscreen overlay
    document.querySelector('.chatbot-fullscreen-overlay')?.remove();
    
    // Reset fullscreen landing wrapper
    window.fullscreenLandingWrapper?.length && window.fullscreenLandingWrapper.removeClass('chat-started');
    
    const widget = window.chatBotFullSrnWidget?.get(0);
    if (!widget) return;
    
    if (widget.classList.contains('chatbot-closing-anim')) return;
    
    requestAnimationFrame(() => {
        widget.classList.add('chatbot-closing-anim');
        const handleAnimationEnd = () => {
            widget.classList.remove('chatbot-closing-anim', 'chatbot-fullscreen', 'show');
            widget.style.opacity = '';
            widget.removeEventListener('animationend', handleAnimationEnd);
        };
        widget.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
}

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

function plotAiGraph(elemid, response_graph) {
    if (response_graph && typeof response_graph === 'object' && response_graph !== null && Object.keys(response_graph).length !== 0) {
        jQuery('.' + elemid).each(function() {
            if (typeof Highcharts !== 'undefined') {
                Highcharts.chart(this, response_graph);
            }
        });
    }
}

// Helper functions for speech-to-text integration
function botSearch(text, $field, uid) {
    const isMostlyEnglish = /^[A-Za-z0-9\s.,?!'"-]+$/.test(text);
    const finalText = isMostlyEnglish ? text.replace(/[^\w\s]/gi, '') : text;
    $field.val(finalText).trigger('input');
    setTimeout(() => {
        jQuery('.chatbot-send-btn').trigger('click');
    }, 100);
}

function botSearchFSLanding(text, uid) {
    const isMostlyEnglish = /^[A-Za-z0-9\s.,?!'"-]+$/.test(text);
    const finalText = isMostlyEnglish ? text.replace(/[^\w\s]/gi, '') : text;
    jQuery('#chatbot-question').val(finalText).trigger('input');
    setTimeout(() => {
        jQuery('#fSrn-sendBtn').trigger('click');
    }, 100);
}

function botSearchFS(text, $field, uid) {
    const isMostlyEnglish = /^[A-Za-z0-9\s.,?!'"-]+$/.test(text);
    const finalText = isMostlyEnglish ? text.replace(/[^\w\s]/gi, '') : text;
    $field.val(finalText).trigger('input');
    setTimeout(() => {
        jQuery('#fSrn-sendBtn').trigger('click');
    }, 100);
}
