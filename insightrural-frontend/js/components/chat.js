// Chat Component - AI-Powered Version
// Connects to Flask backend for real AI responses
// API_BASE_URL is defined in state.js (loaded first)

const ChatComponent = {
    isStreaming: false,
    currentStreamController: null,

    init() {
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.messagesContainer = document.getElementById('messages-container');

        this.setupEventListeners();
        this.setupAutoResize();
        this.loadChatHistory();
        this.checkAIStatus();
        this.showSuggestedQuestions();
    },

    showSuggestedQuestions() {
        // Only show if no chat history
        const history = AppState.getChatHistory();
        if (history && history.length > 0) return;

        const suggestions = [
            '🏛️ Which college can I get with rank 5000 in CSE?',
            '💰 What scholarships are available for SC students?',
            '📊 Compare RVCE vs MSRIT for Computer Science',
            '🏠 What are the hostel options near BMSCE?',
            '🏦 How to apply for education loans?',
            '📝 What is the KEA counseling process?'
        ];

        const container = document.createElement('div');
        container.className = 'suggested-questions';
        container.id = 'suggested-questions';

        suggestions.forEach(q => {
            const chip = document.createElement('button');
            chip.className = 'suggested-q';
            chip.textContent = q;
            chip.addEventListener('click', () => {
                this.chatInput.value = q;
                this.sendBtn.disabled = false;
                this.sendMessage();
                const suggestionsEl = document.getElementById('suggested-questions');
                if (suggestionsEl) suggestionsEl.remove();
            });
            container.appendChild(chip);
        });

        this.messagesContainer.appendChild(container);
    },

    async checkAIStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/status`);
            const status = await response.json();
            console.log('AI Status:', status);

            // Add AI status bar
            this.showAIStatusBar(status);

            if (!status.ai_modules_available) {
                this.addSystemMessage('⚠️ AI modules not fully loaded. Some features may be limited.');
            }
        } catch (error) {
            console.log('Backend not available, using offline mode');
            this.showAIStatusBar({ ai_modules_available: false, ollama_connected: false, rag_indexed: false });
        }
    },

    showAIStatusBar(status) {
        const existing = document.getElementById('ai-status-bar');
        if (existing) existing.remove();

        const bar = document.createElement('div');
        bar.className = 'ai-status-bar';
        bar.id = 'ai-status-bar';

        const isOnline = status.ai_modules_available && status.ollama_connected;
        bar.innerHTML = `
            <span class="ai-status-dot ${isOnline ? '' : 'offline'}"></span>
            ${isOnline ? '🧠 Llama 3.3 70B Connected' : '⚠️ Offline Mode'}
            ${status.rag_indexed ? ' • 📚 RAG Active' : ''}
            <span style="margin-left: auto; opacity: 0.6">InsightRural AI</span>
        `;

        // Insert before messages container
        this.messagesContainer.parentNode.insertBefore(bar, this.messagesContainer);
    },

    setupEventListeners() {
        // Send message on button click
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter to send (Shift+Enter for new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enable/disable send button
        this.chatInput.addEventListener('input', () => {
            const hasText = this.chatInput.value.trim().length > 0;
            this.sendBtn.disabled = !hasText || this.isStreaming;
            this.autoResize();
        });

        // Focus input when clicking on chat area
        this.messagesContainer.addEventListener('click', () => {
            this.chatInput.focus();
        });

        // Initialize button state
        this.sendBtn.disabled = true;
    },

    setupAutoResize() {
        this.autoResize();
    },

    autoResize() {
        this.chatInput.style.height = 'auto';
        const newHeight = Math.min(this.chatInput.scrollHeight, 150);
        this.chatInput.style.height = newHeight + 'px';
    },

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isStreaming) return;

        // Add user message
        this.addMessage('user', message);
        AppState.addMessage('user', message);

        // Clear input
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        this.autoResize();

        // Show typing indicator
        this.showTypingIndicator();
        this.isStreaming = true;

        // Get AI response
        await this.getAIResponse(message);
    },

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = type === 'user' ? 'Y' : 'IR';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = this.formatMessage(content);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();

        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        return textDiv; // Return for streaming updates
    },

    addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.style.cssText = 'text-align: center; color: var(--text-secondary); font-size: 0.85rem; padding: 0.5rem;';
        messageDiv.innerHTML = content;
        this.messagesContainer.appendChild(messageDiv);
    },

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = 'IR';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text typing-text';
        textDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

        contentDiv.appendChild(textDiv);
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    },

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },

    formatMessage(text) {
        if (!text) return '';

        let formatted = text;

        // Convert code blocks (``` ... ```)
        formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--bg-primary); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.9rem; border: 1px solid var(--border-color);">$1</pre>');

        // Convert inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: var(--bg-primary); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em;">$1</code>');

        // Convert **bold** to <strong>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert *italic* to <em>
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Convert ## headers
        formatted = formatted.replace(/^## (.*?)$/gm, '<h4 style="margin: 1rem 0 0.5rem; color: var(--primary); font-size: 1.1rem;">$1</h4>');
        formatted = formatted.replace(/^### (.*?)$/gm, '<h5 style="margin: 0.8rem 0 0.4rem; font-size: 1rem;">$1</h5>');

        // Convert blockquotes
        formatted = formatted.replace(/^> (.*?)$/gm, '<div style="border-left: 3px solid var(--primary); padding: 0.5rem 1rem; margin: 0.5rem 0; background: var(--bg-primary); border-radius: 0 6px 6px 0; font-style: italic;">$1</div>');

        // Convert bullet points
        formatted = formatted.replace(/^- (.*?)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.3rem;">$1</li>');
        formatted = formatted.replace(/^• (.*?)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.3rem;">$1</li>');

        // Convert numbered lists
        formatted = formatted.replace(/^\d+\. (.*?)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.3rem;">$1</li>');

        // Convert markdown links [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--primary); text-decoration: underline;">$1</a>');

        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        // Convert ₹ formatting for fees
        formatted = formatted.replace(/₹([\d,]+)/g, '<span style="color: var(--success); font-weight: 600;">₹$1</span>');

        // Highlight ranks
        formatted = formatted.replace(/Rank:?\s*(\d+)/gi, 'Rank: <strong style="color: var(--primary);">$1</strong>');
        formatted = formatted.replace(/Cutoff:?\s*(\d+)/gi, 'Cutoff: <strong style="color: var(--warning);">$1</strong>');

        // Highlight portals
        formatted = formatted.replace(/(ssp\.postmatric\.karnataka\.gov\.in)/gi, '<a href="https://$1" target="_blank" style="color: var(--primary);">$1</a>');
        formatted = formatted.replace(/(cetonline\.karnataka\.gov\.in)/gi, '<a href="https://$1" target="_blank" style="color: var(--primary);">$1</a>');

        return formatted;
    },

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    async getAIResponse(userMessage) {
        try {
            // Get student profile
            const profile = AppState.getProfile() || {};

            // Try streaming first
            const useStreaming = true; // Streaming enabled for ChatGPT-like experience

            if (useStreaming) {
                await this.getStreamingResponse(userMessage, profile);
            } else {
                await this.getNonStreamingResponse(userMessage, profile);
            }

        } catch (error) {
            console.error('Error getting AI response:', error);
            this.removeTypingIndicator();
            this.isStreaming = false;

            // Fallback to mock response
            const response = this.getFallbackResponse(userMessage);
            this.addMessage('ai', response);
            AppState.addMessage('ai', response);
        }
    },

    async getNonStreamingResponse(userMessage, profile) {
        try {
            // Build conversation history for LLM memory
            const chatHistory = (AppState.getChatHistory() || []).slice(-6).map(m => ({
                role: m.sender === 'ai' ? 'assistant' : 'user',
                content: m.content
            }));

            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    profile: profile,
                    session_id: AppState.getSessionId(),
                    history: chatHistory
                })
            });

            const data = await response.json();

            this.removeTypingIndicator();
            this.isStreaming = false;

            if (data.error) {
                this.addMessage('ai', data.response || 'Sorry, an error occurred.');
            } else {
                this.addMessage('ai', data.response);
                AppState.addMessage('ai', data.response);
            }

        } catch (error) {
            throw error;
        }
    },

    async getStreamingResponse(userMessage, profile) {
        try {
            this.removeTypingIndicator();

            // Create placeholder message for streaming
            const textDiv = this.addMessage('ai', '');
            let fullResponse = '';

            // Build conversation history for LLM memory
            const chatHistory = (AppState.getChatHistory() || []).slice(-6).map(m => ({
                role: m.sender === 'ai' ? 'assistant' : 'user',
                content: m.content
            }));

            const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    profile: profile,
                    history: chatHistory
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                fullResponse += data.chunk;
                                textDiv.innerHTML = this.formatMessage(fullResponse);
                                this.scrollToBottom();
                            }
                            if (data.done) {
                                AppState.addMessage('ai', fullResponse);
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }

            this.isStreaming = false;

        } catch (error) {
            throw error;
        }
    },

    getFallbackResponse(userMessage) {
        const feature = AppState.currentFeature;
        const query = userMessage.toLowerCase();

        // Check for greeting
        if (query.match(/^(hi|hello|hey|namaste)/i)) {
            return `Hello! 👋 I'm InsightRural AI, your educational counselor for Karnataka KEA students.

I can help you with:
🏛️ **College Recommendations** - Based on your KCET rank
💰 **Scholarships** - SC/ST/OBC/EWS schemes
🏦 **Education Loans** - From nationalized banks
🏠 **Hostels** - College and private options

To give you personalized guidance, please share:
1. Your KCET rank
2. Preferred branch (CSE, ECE, etc.)
3. Your category (GM/OBC/SC/ST)
4. Family income (for scholarship eligibility)

How can I help you today?`;
        }

        if (feature === 'colleges' || query.includes('college') || query.includes('rank')) {
            return `For personalized college recommendations, I need to know your KCET rank.

**Quick Reference for CSE (2024 Cutoffs):**
🏛️ **RVCE**: GM ~593, OBC ~315
🏛️ **PES University**: GM ~2154, OBC ~763
🏛️ **BMSCE**: GM ~2156, OBC ~925
🏛️ **MSRIT**: GM ~1850, OBC ~920
🏛️ **SIT Tumkur**: GM ~3200, OBC ~1650

**Government Colleges (Lower fees):**
🏛️ **UVCE**: GM ~850, OBC ~420
🏛️ **SJCE Mysore**: GM ~1200, OBC ~600

Please share your KCET rank and preferred branch for specific recommendations.`;
        }

        if (feature === 'scholarships' || query.includes('scholarship')) {
            return `**Karnataka Post-Matric Scholarships:**

**For SC Students** (Income < ₹2.5 Lakhs):
✅ Full fee reimbursement
✅ Maintenance: ₹1200/month (hosteller)
📅 Deadline: January 15, 2026

**For ST Students** (Income < ₹2.5 Lakhs):
✅ Full fee reimbursement
✅ Free government hostels available
📅 Deadline: February 15, 2026

**For OBC Category-1** (Income < ₹2.5 Lakhs):
✅ Fee reimbursement
✅ ₹20,000 educational allowance

**Apply at:** ssp.postmatric.karnataka.gov.in

What's your category and family income? I can tell you exactly which scholarships you're eligible for.`;
        }

        if (feature === 'loans' || query.includes('loan') || query.includes('fee')) {
            return `**Education Loan Options:**

**SBI Student Loan:**
💰 Up to ₹15 Lakhs (India)
📊 Interest: 8.5% (8.0% for girls)
🔓 No collateral up to ₹7.5 Lakhs

**Central Interest Subsidy (CISS):**
If your family income is < ₹4.5 Lakhs:
✅ **Zero interest** during course + 1 year
✅ Apply through any nationalized bank

**Steps to Apply:**
1. Get admission letter
2. Visit any SBI/Canara/BoB branch
3. Submit documents
4. Loan sanctioned in 7-15 days

Would you like details on specific bank schemes or the documents required?`;
        }

        if (feature === 'hostels' || query.includes('hostel')) {
            return `**Hostel Options:**

**College Hostels:**
🏠 RVCE: ₹45,000/year + ₹4,500/month mess
🏠 BMSCE: ₹40,000/year + ₹4,000/month mess
🏠 SIT Tumkur: ₹15,000/year (Mutt managed - very affordable!)

**Government Free Hostels (SC/ST):**
🆓 Apply through Social Welfare Department
🆓 Available in most district headquarters

**Private PGs in Bangalore:**
💰 Shared room: ₹6,000-12,000/month
💰 Single room: ₹10,000-18,000/month

Which college are you planning to join? I can give specific hostel information.`;
        }

        return `I'm here to help with your educational journey! You can ask me about:

🏛️ **Colleges** - "Which college can I get with rank 5000?"
💰 **Scholarships** - "What scholarships are available for SC students?"
🏦 **Loans** - "How to get an education loan?"
🏠 **Hostels** - "What are the hostel options near BMSCE?"

What would you like to know?`;
    },

    loadChatHistory() {
        const history = AppState.getChatHistory();
        history.forEach(msg => {
            this.addMessage(msg.sender, msg.content);
        });
    },

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
};