/**
 * Mock API Handler for Portfolio Bot
 * Simulates intelligent responses about Anirudh Vartak's portfolio
 */

const MockAPI = {
    /**
     * Process user input and return mock response
     */
    processUserInput: function(input, chatbotInstance) {
        const $this = chatbotInstance;
        const chatBox = $this.find('.chatbot-chatBox');
        const fullscreenChatBox = $this.find('#fS-chatBox');
        const isFullscreen = $this.hasClass('chatbot-fullscreen');
        const targetChatBox = isFullscreen && fullscreenChatBox.length ? fullscreenChatBox : chatBox;
        
        // Add typing indicator
        const typingHTML = `
            <span class="typing-dots">
                <span class="dot dot1"></span>
                <span class="dot dot2"></span>
                <span class="dot dot3"></span>
            </span>
        `;
        this.addMessage(typingHTML, 'bot', false, 'typing-message', targetChatBox, isFullscreen);
        
        // Simulate API delay
        setTimeout(() => {
            targetChatBox.find('.typing-message').remove();
            if (isFullscreen && chatBox.length) {
                chatBox.find('.typing-message').remove();
            }
            
            const response = this.getResponse(input);
            this.addMessage(response, 'bot', true, '', targetChatBox, isFullscreen);
            
            // Handle expandable containers
            setTimeout(() => {
                if (typeof handleExpandableContainers === 'function') {
                    handleExpandableContainers();
                }
            }, 100);
        }, 1000);
    },

    /**
     * Get appropriate response based on user input
     */
    getResponse: function(input) {
        const queryLower = input.toLowerCase();
        
        // Intent detection for portfolio queries
        if (queryLower.match(/about|who|introduce/)) {
            return MockResponses.about;
        } else if (queryLower.match(/skill|technology|technologies|tech stack|expertise|proficient/)) {
            return MockResponses.skills;
        } else if (queryLower.match(/project|portfolio|work|built|developed/)) {
            return MockResponses.projects;
        } else if (queryLower.match(/experience|career|job|position|work history/)) {
            return MockResponses.experience;
        } else if (queryLower.match(/contact|email|reach|connect|social|linkedin|github/)) {
            return MockResponses.contact;
        } else if (queryLower.match(/award|achievement|recognition|star/)) {
            return MockResponses.awards;
        } else if (queryLower.match(/education|degree|qualification/)) {
            return MockResponses.education;
        } else if (queryLower.match(/^(hi|hello|hey|greetings|hi there)/)) {
            return MockResponses.greeting;
        } else {
            return MockResponses.fallback(input);
        }
    },

    /**
     * Add message to chat
     */
    addMessage: function(message, sender, is_history, extraClass, chatBox, isFullscreen) {
        const messageClass = sender === 'user' ? 'chatbot-user-msg' : 'chatbot-bot-msg';
        const avatarUrl = sender === 'user' ? BOT_CONFIG.user_avatar : BOT_CONFIG.ai_avatar;
        const avatarImg = `<div class="chatbot-avatar"><img src="${avatarUrl}" alt="${sender} avatar"></div>`;
        
        const messageElement = $(`<div class="${messageClass} ${extraClass}">${avatarImg}<div class="chatbot-msg-text"></div></div>`);
        messageElement.find('.chatbot-msg-text').html(message);
        chatBox.append(messageElement);
        
        // If fullscreen, also add to regular chatbox
        if (isFullscreen) {
            const regularChatBox = $('#chatbot-container').find('.chatbot-chatBox');
            if (regularChatBox.length && !regularChatBox.is(chatBox)) {
                regularChatBox.append(messageElement.clone());
            }
        }
        
        messageElement.hide().fadeIn(300);
        
        // Scroll to bottom
        chatBox[0].scrollTop = chatBox[0].scrollHeight;
        
        if (is_history) {
            let chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            chatHistory.push({ text: message, sender: sender });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }
};

/**
 * Mock Response Templates for Portfolio
 */
const MockResponses = {
    // About Anirudh
    about: `<div class="chatbot-response-card">
        <h3>👋 About Anirudh Vartak</h3>
        <p>I'm a <strong>Full Stack Product Developer</strong> with <strong>2.7+ years of experience</strong> building scalable and intelligent web systems at <strong>uKnowva HRMS</strong>.</p>
        
        <div class="highlight-box">
            <h4>🏆 Recognition & Impact</h4>
            <ul>
                <li>⭐ <strong>Star of the Year 2023</strong></li>
                <li>⭐ <strong>Star of the Department 2024</strong></li>
                <li>✅ <strong>40+ Projects Successfully Completed</strong></li>
            </ul>
        </div>
        
        <div class="chatbot-expandable-container">
            <h4>💡 Core Expertise:</h4>
            <ul>
                <li><strong>AI-Powered Development:</strong> Built AI chatbots, OpenAI integrations, and intelligent automation systems</li>
                <li><strong>Full Stack Engineering:</strong> Modern, scalable UI/UX with robust backend architecture</li>
                <li><strong>Voice & Accessibility:</strong> Developed speech-to-text modules for real-time input</li>
                <li><strong>HR Tech Innovation:</strong> Automated workflows, OCR-based processing, and dynamic form generation</li>
            </ul>
        </div>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What are his technical skills?">View Skills</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">View Projects</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="How can I contact him?">Contact Info</button>
        </div>
    </div>`,

    // Skills
    skills: `<div class="chatbot-response-card">
        <h3>💻 Technical Skills & Expertise</h3>
        
        <div class="skill-category">
            <h4>🎨 Frontend Development</h4>
            <div class="tech-tags">
                <span class="tech-tag">JavaScript</span>
                <span class="tech-tag">React</span>
                <span class="tech-tag">Next.js</span>
                <span class="tech-tag">HTML5</span>
                <span class="tech-tag">CSS3</span>
                <span class="tech-tag">Tailwind CSS</span>
                <span class="tech-tag">Bootstrap</span>
                <span class="tech-tag">jQuery</span>
            </div>
        </div>
        
        <div class="skill-category">
            <h4>⚙️ Backend Development</h4>
            <div class="tech-tags">
                <span class="tech-tag">PHP</span>
                <span class="tech-tag">Node.js</span>
                <span class="tech-tag">MySQL</span>
                <span class="tech-tag">Python</span>
                <span class="tech-tag">MVC Architecture</span>
                <span class="tech-tag">Joomla3</span>
                <span class="tech-tag">REST APIs</span>
            </div>
        </div>
        
        <div class="skill-category">
            <h4>🤖 AI & Emerging Tech</h4>
            <div class="tech-tags">
                <span class="tech-tag">OpenAI Integration</span>
                <span class="tech-tag">AI Chatbots</span>
                <span class="tech-tag">NLP</span>
                <span class="tech-tag">Machine Learning</span>
                <span class="tech-tag">OCR</span>
                <span class="tech-tag">Speech-to-Text</span>
                <span class="tech-tag">Web Speech API</span>
            </div>
        </div>
        
        <div class="skill-category">
            <h4>🛠️ Tools & Others</h4>
            <div class="tech-tags">
                <span class="tech-tag">Git</span>
                <span class="tech-tag">Figma</span>
                <span class="tech-tag">Canva</span>
                <span class="tech-tag">Tabulator.js</span>
                <span class="tech-tag">Progressive Web Apps</span>
            </div>
        </div>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about his experience">Work Experience</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">View Projects</button>
        </div>
    </div>`,

    // Projects
    projects: `<div class="chatbot-response-card">
        <h3>🚀 Featured Projects</h3>
        
        <div class="chatbot-expandable-container">
            <div class="project-card">
                <h4>🤖 AI-Powered Portfolio Chatbot</h4>
                <p>Developed a comprehensive AI-powered chatbot for HR operations. Handles leave applications, salary inquiries, attendance tracking, and more through natural language processing.</p>
                <div class="tech-tags">
                    <span class="tech-tag">PHP</span>
                    <span class="tech-tag">JavaScript</span>
                    <span class="tech-tag">OpenAI</span>
                    <span class="tech-tag">NLP</span>
                </div>
            </div>
            
            <div class="project-card">
                <h4>🎤 Speech-to-Text Module</h4>
                <p>Built a fully configurable speech-to-text module for real-time input and accessibility across the platform. Features multiple layouts and dynamic positioning.</p>
                <div class="tech-tags">
                    <span class="tech-tag">Web Speech API</span>
                    <span class="tech-tag">JavaScript</span>
                    <span class="tech-tag">ResizeObserver</span>
                </div>
            </div>
            
            <div class="project-card">
                <h4>📝 AI-Powered Form Generator</h4>
                <p>Created dynamic form generators using OpenAI to produce complete form layouts through JSON with intelligent field detection and validation.</p>
                <div class="tech-tags">
                    <span class="tech-tag">OpenAI</span>
                    <span class="tech-tag">JSON</span>
                    <span class="tech-tag">PHP</span>
                    <span class="tech-tag">JavaScript</span>
                </div>
            </div>
            
            <div class="project-card">
                <h4>🧾 OCR-Based Reimbursement</h4>
                <p>Automated reimbursement processing using OCR-based invoice scanning, streamlining HR workflows with smart automation.</p>
                <div class="tech-tags">
                    <span class="tech-tag">OCR</span>
                    <span class="tech-tag">Python</span>
                    <span class="tech-tag">Automation</span>
                </div>
            </div>
            
            <div class="project-card">
                <h4>🛒 Flipkart Clone</h4>
                <p>E-commerce clone built from scratch using HTML and CSS. Includes homepage, product listing, and detail pages.</p>
                <div class="tech-tags">
                    <span class="tech-tag">HTML5</span>
                    <span class="tech-tag">CSS3</span>
                </div>
                <a href="https://anirudhvartak.github.io/flipkart_clone/" target="_blank" class="btn-mini">Live Demo →</a>
            </div>
        </div>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What technologies does he use?">Technologies</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about his experience">Experience</button>
        </div>
    </div>`,

    // Experience
    experience: `<div class="chatbot-response-card">
        <h3>💼 Professional Experience</h3>
        
        <div class="experience-card">
            <h4>Full Stack Product Developer</h4>
            <p><strong>uKnowva HRMS</strong> | Full Stack Product Developer | 2022 - Present (2.7+ years)</p>
            
            <div class="highlight-box">
                <h4>🏆 Key Achievements:</h4>
                <ul>
                    <li>⭐ Star of the Year 2023</li>
                    <li>⭐ Star of the Department 2024</li>
                    <li>🤖 Developed AI-powered chatbot for HR operations</li>
                    <li>📝 Built dynamic form generator with OpenAI integration</li>
                    <li>🎤 Created speech-to-text module for accessibility</li>
                    <li>🧾 Automated reimbursement processing with OCR</li>
                    <li>✅ Successfully completed 40+ projects</li>
                </ul>
            </div>
            
            <div class="chatbot-expandable-container">
                <h4>📋 Core Responsibilities:</h4>
                <ul>
                    <li><strong>Product Innovation:</strong> Driving new feature development with AI/ML integration</li>
                    <li><strong>Full Stack Development:</strong> Building scalable UI features with PHP, MySQL, JavaScript, Joomla3</li>
                    <li><strong>Code Refactoring:</strong> Rewriting legacy logic into clean, reusable, maintainable code</li>
                    <li><strong>Automation Systems:</strong> Creating smart workflows for HR operations</li>
                    <li><strong>UI/UX Enhancement:</strong> Developing modern, responsive interfaces with Tabulator.js</li>
                    <li><strong>API Integration:</strong> Building and consuming RESTful APIs</li>
                </ul>
            </div>
        </div>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What are his technical skills?">View Skills</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">View Projects</button>
        </div>
    </div>`,

    // Awards
    awards: `<div class="chatbot-response-card">
        <h3>🏆 Awards & Recognition</h3>
        
        <div class="highlight-box">
            <h4>Career Achievements</h4>
            <ul>
                <li>🌟 <strong>Star of the Year 2023</strong> - uKnowva HRMS<br><small>Recognized for outstanding product innovation and core feature development</small></li>
                <li>🌟 <strong>Star of the Department 2024</strong> - uKnowva HRMS<br><small>Awarded for driving innovation and technical excellence</small></li>
                <li>✅ <strong>40+ Projects Successfully Completed</strong><br><small>Delivered scalable solutions across AI, automation, and full-stack development</small></li>
            </ul>
        </div>
        
        <p><strong>Impact:</strong> Consistently recognized for bringing cutting-edge technologies like AI chatbots, OpenAI integration, and automation to production environments.</p>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about his experience">View Experience</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">View Projects</button>
        </div>
    </div>`,

    // Education
    education: `<div class="chatbot-response-card">
        <h3>🎓 Education & Qualifications</h3>
        
        <div class="highlight-box">
            <p><strong>Full Stack Product Developer</strong><br>
            Specialized in AI-powered development, chatbot systems, and automation</p>
            
            <h4>Key Certifications & Skills:</h4>
            <ul>
                <li>Full Stack Web Development (Frontend & Backend)</li>
                <li>AI Integration & Machine Learning</li>
                <li>Database Management & Optimization</li>
                <li>UI/UX Design with Figma</li>
                <li>API Development & Integration</li>
            </ul>
        </div>
        
        <p>2.7+ years of hands-on experience building production-grade systems.</p>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What are his technical skills?">View Skills</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about his experience">View Experience</button>
        </div>
    </div>`,

    // Contact
    contact: `<div class="chatbot-response-card">
        <h3>📞 Get In Touch</h3>
        
        <div class="contact-info">
            <div class="contact-item">
                <strong>📧 Email:</strong>
                <a href="mailto:anirudhvartak33@gmail.com">anirudhvartak33@gmail.com</a>
            </div>
            
            <div class="contact-item">
                <strong>📍 Location:</strong>
                <span>Mumbai, India</span>
            </div>
            
            <div class="contact-item">
                <strong>🌐 Portfolio:</strong>
                <a href="https://anirudh-portfolio-react-wheat.vercel.app/" target="_blank">View Full Portfolio →</a>
            </div>
        </div>
        
        <div class="highlight-box">
            <h4>🔗 Connect on Social Media:</h4>
            <div class="social-links" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="https://www.linkedin.com/in/anirudh-vartak/" target="_blank" class="btn-mini">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="https://github.com/Anirudhvartak" target="_blank" class="btn-mini">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="https://www.instagram.com/anirudh.vartak/" target="_blank" class="btn-mini">
                    <i class="fab fa-instagram"></i> Instagram
                </a>
            </div>
        </div>
        
        <p><strong>💡 Always open to new opportunities and collaborations!</strong></p>
        
        <div class="chatbot-subQues">
            <a href="https://anirudh-portfolio-react-wheat.vercel.app/Anirudh_vartak_2025.pdf" target="_blank" class="chatbot-subPredefinedQ">
                <i class="fas fa-download"></i> Download Resume
            </a>
        </div>
    </div>`,

    // Default greeting
    greeting: `<div class="chatbot-response-card">
        <h3>👋 Hello! I'm Anirudh's AI Assistant</h3>
        <p>I can help you learn about <strong>Anirudh Vartak</strong> - a Full Stack Product Developer with expertise in AI-powered development and automation.</p>
        
        <div class="highlight-box">
            <h4>💡 What would you like to know?</h4>
            <ul>
                <li>💼 Professional experience and achievements</li>
                <li>💻 Technical skills and expertise</li>
                <li>🚀 Portfolio projects</li>
                <li>🏆 Awards and recognition</li>
                <li>📞 Contact information</li>
            </ul>
        </div>
        
        <p>Feel free to ask me anything!</p>
        
        <div class="chatbot-subQues">
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about Anirudh">About Anirudh</button>
            <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">View Projects</button>
        </div>
    </div>`,

    // Fallback response
    fallback: function(input) {
        return `<div class="chatbot-response-card">
            <h3>🤔 Let me help you with that!</h3>
            <p>You asked: <em>"${input}"</em></p>
            <p>I'm Anirudh's portfolio assistant. I can tell you about:</p>
            
            <div class="chatbot-subQues">
                <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Tell me about Anirudh">About Anirudh</button>
                <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What are his skills?">Skills</button>
                <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="Show me his projects">Projects</button>
                <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="What is his experience?">Experience</button>
                <button class="chatbot-subPredefinedQ chatbot-dynamicProssBtn" data-input="How can I contact him?">Contact</button>
            </div>
        </div>`;
    }
};
