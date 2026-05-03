/**
 * GCSC BuilderAI — Embeddable Chat Widget
 * Viktor-style: persistent memory, proactive actions, document generation
 *
 * Embed on any page with:
 *   <script src="https://your-server.com/widget.js"
 *           data-api="https://your-server.com"
 *           data-user-type="homeowner"
 *           data-title="BuilderAI">
 *   </script>
 */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────────
  const scriptTag = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const _apiAttr = scriptTag?.getAttribute('data-api');
  const API_BASE = (_apiAttr != null && _apiAttr !== '') ? _apiAttr : '';
  const DEFAULT_USER_TYPE = scriptTag?.getAttribute('data-user-type') || '';
  const WIDGET_TITLE = scriptTag?.getAttribute('data-title') || 'GCSC BuilderAI';
  const STORAGE_KEY = 'gcsc_chat_v2';
  const MAX_HISTORY = 60; // messages to keep in memory

  // ── State ─────────────────────────────────────────────────────────────────────
  let isOpen = false;
  let isLoading = false;
  let messages = [];
  let userType = DEFAULT_USER_TYPE;
  let suggestionsLoaded = false;
  let memoryLoaded = false;

  // ── Memory: save ──────────────────────────────────────────────────────────────
  function saveMemory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages: messages.slice(-MAX_HISTORY),
        userType,
        ts: Date.now(),
      }));
    } catch (_) {}
  }

  // ── Memory: load ──────────────────────────────────────────────────────────────
  function loadMemory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw);
      // Expire after 30 days
      if (Date.now() - d.ts > 30 * 24 * 3600 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
      messages = d.messages || [];
      if (d.userType !== undefined) userType = d.userType;
      return messages.length > 0;
    } catch (_) {
      return false;
    }
  }

  // ── Memory: clear ────────────────────────────────────────────────────────────
  function clearMemory() {
    messages = [];
    localStorage.removeItem(STORAGE_KEY);
    const el = document.getElementById('gcsc-messages');
    if (el) el.innerHTML = '';
    const sug = document.getElementById('gcsc-suggestions');
    if (sug) sug.innerHTML = '';
    suggestionsLoaded = false;
    addWelcomeMessage();
    loadSuggestions();
    updateMemoryBadge(false);
  }

  // ── Load CSS ──────────────────────────────────────────────────────────────────
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${API_BASE}/widget.css`;
    document.head.appendChild(link);
  }

  // ── Markdown parser ───────────────────────────────────────────────────────────
  function parseMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^⚠️(.+)$/gm, '<strong style="color:#E74C3C">⚠️$1</strong>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(?!<[hpuol])(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
  }

  // ── Extract action buttons from AI response ───────────────────────────────────
  // AI ends responses with lines like: "• [Generate lien waiver]"
  function extractActions(text) {
    const actions = [];
    const cleaned = text.replace(/•\s*\[([^\]]+)\]/g, (_, label) => {
      actions.push(label.trim());
      return '';
    });
    return { cleaned: cleaned.replace(/\n{3,}/g, '\n\n').trim(), actions };
  }

  // ── Format time ───────────────────────────────────────────────────────────────
  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ── Update memory badge ───────────────────────────────────────────────────────
  function updateMemoryBadge(show) {
    const badge = document.getElementById('gcsc-memory-badge');
    if (badge) badge.style.display = show ? 'flex' : 'none';
  }

  // ── Build HTML ────────────────────────────────────────────────────────────────
  function buildWidget() {
    const container = document.createElement('div');
    container.id = 'gcsc-builder-ai';
    container.innerHTML = `
      <div id="gcsc-chat-window">
        <div id="gcsc-header">
          <div id="gcsc-header-icon">🏗️</div>
          <div id="gcsc-header-info">
            <div id="gcsc-header-title">${WIDGET_TITLE}</div>
            <div id="gcsc-header-subtitle">Construction Expert · GCSC Ecosystem</div>
          </div>
          <div id="gcsc-header-actions">
            <div id="gcsc-memory-badge" style="display:none" title="Memory active — I remember our previous conversations">
              🧠 <span>Memory</span>
            </div>
            <button id="gcsc-clear-btn" title="Clear conversation history">🗑️</button>
          </div>
          <div id="gcsc-status-dot"></div>
        </div>

        <div id="gcsc-role-selector">
          <button class="gcsc-role-btn ${userType === '' ? 'active' : ''}" data-role="">🏠 General</button>
          <button class="gcsc-role-btn ${userType === 'homeowner' ? 'active' : ''}" data-role="homeowner">👤 Homeowner</button>
          <button class="gcsc-role-btn ${userType === 'contractor' ? 'active' : ''}" data-role="contractor">🔨 Contractor</button>
        </div>

        <div id="gcsc-messages"></div>
        <div id="gcsc-action-buttons"></div>
        <div id="gcsc-suggestions"></div>

        <div id="gcsc-input-area">
          <div id="gcsc-input-row">
            <textarea
              id="gcsc-input"
              placeholder="Ask about contracts, permits, pricing, disputes..."
              rows="1"
              maxlength="2000"
            ></textarea>
            <button id="gcsc-send-btn" aria-label="Send">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div id="gcsc-footer">
            Powered by <a href="https://gcsc.io" target="_blank">GCSC</a> · Construction AI
          </div>
        </div>
      </div>

      <button id="gcsc-toggle-btn" aria-label="Open GCSC BuilderAI">
        <svg class="icon-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    `;
    document.body.appendChild(container);
  }

  // ── Restore history to UI ─────────────────────────────────────────────────────
  function restoreHistory() {
    const el = document.getElementById('gcsc-messages');
    if (!el || !messages.length) return;

    // Show divider
    const divider = document.createElement('div');
    divider.className = 'gcsc-history-divider';
    divider.innerHTML = '<span>Previous conversation</span>';
    el.appendChild(divider);

    messages.forEach(m => {
      appendMessage(m.role, m.content, false);
    });

    // Divider before new messages
    const divider2 = document.createElement('div');
    divider2.className = 'gcsc-history-divider';
    divider2.innerHTML = '<span>Now</span>';
    el.appendChild(divider2);

    updateMemoryBadge(true);
    scrollToBottom();
  }

  // ── Welcome message ───────────────────────────────────────────────────────────
  function addWelcomeMessage() {
    const welcomeTexts = {
      '': "Hi! I'm **GCSC BuilderAI** — your proactive construction advisor.\n\nI **remember our conversations**, can **generate documents** (lien waivers, contracts, change orders), and I'll proactively suggest next steps as we work through your project.\n\nAre you a homeowner or contractor? Select your role above for tailored advice.",
      homeowner: "Hi! I'm **GCSC BuilderAI** — your personal construction advisor.\n\nI remember everything we discuss and can proactively help you **vet contractors, review contracts, generate documents**, and navigate any project from start to finish.\n\nWhat's your project about?",
      contractor: "Welcome back! I'm **GCSC BuilderAI** — built for the trades.\n\nI remember your projects and can help you **generate lien waivers, draft change orders, review contract clauses**, and protect your payment rights.\n\nWhat do you need today?",
    };
    appendMessage('assistant', welcomeTexts[userType] || welcomeTexts[''], false);
  }

  // ── Append message ────────────────────────────────────────────────────────────
  function appendMessage(role, content, animate = true) {
    const el = document.getElementById('gcsc-messages');
    if (!el) return;

    const msgEl = document.createElement('div');
    msgEl.className = `gcsc-message ${role}`;
    if (!animate) msgEl.style.animation = 'none';

    const bubble = document.createElement('div');
    bubble.className = 'gcsc-bubble';
    bubble.innerHTML = parseMarkdown(content);

    const time = document.createElement('div');
    time.className = 'gcsc-time';
    time.textContent = formatTime();

    msgEl.appendChild(bubble);
    msgEl.appendChild(time);
    el.appendChild(msgEl);
    scrollToBottom();
    return bubble;
  }

  // ── Render action buttons ─────────────────────────────────────────────────────
  function renderActionButtons(actions) {
    const el = document.getElementById('gcsc-action-buttons');
    if (!el || !actions.length) return;
    el.innerHTML = '';

    const label = document.createElement('div');
    label.className = 'gcsc-actions-label';
    label.textContent = '⚡ Quick Actions';
    el.appendChild(label);

    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = 'gcsc-action-btn';
      btn.textContent = action;
      btn.addEventListener('click', () => {
        el.innerHTML = '';
        const input = document.getElementById('gcsc-input');
        if (input) { input.value = action; sendMessage(); }
      });
      el.appendChild(btn);
    });
  }

  // ── Streaming message ─────────────────────────────────────────────────────────
  function appendStreamingMessage() {
    const el = document.getElementById('gcsc-messages');
    if (!el) return null;

    const typing = document.getElementById('gcsc-typing');
    if (typing) typing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = 'gcsc-message assistant';
    msgEl.id = 'gcsc-streaming-msg';

    const bubble = document.createElement('div');
    bubble.className = 'gcsc-bubble';
    bubble.id = 'gcsc-streaming-bubble';

    const time = document.createElement('div');
    time.className = 'gcsc-time';
    time.textContent = formatTime();

    msgEl.appendChild(bubble);
    msgEl.appendChild(time);
    el.appendChild(msgEl);
    scrollToBottom();
    return bubble;
  }

  // ── Typing indicator ──────────────────────────────────────────────────────────
  function showTyping() {
    const el = document.getElementById('gcsc-messages');
    if (!el) return;
    const dot = document.createElement('div');
    dot.id = 'gcsc-typing';
    dot.innerHTML = '<span></span><span></span><span></span>';
    el.appendChild(dot);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('gcsc-typing');
    if (el) el.remove();
  }

  // ── Scroll ────────────────────────────────────────────────────────────────────
  function scrollToBottom() {
    const el = document.getElementById('gcsc-messages');
    if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
  }

  // ── Suggestions ───────────────────────────────────────────────────────────────
  async function loadSuggestions() {
    const el = document.getElementById('gcsc-suggestions');
    if (!el || suggestionsLoaded) return;
    try {
      const res = await fetch(`${API_BASE}/api/suggestions?userType=${userType}`);
      const data = await res.json();
      el.innerHTML = '';
      (data.suggestions || []).slice(0, 3).forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'gcsc-suggestion';
        btn.textContent = s;
        btn.addEventListener('click', () => {
          document.getElementById('gcsc-input').value = s;
          el.innerHTML = '';
          sendMessage();
        });
        el.appendChild(btn);
      });
      suggestionsLoaded = true;
    } catch (_) {}
  }

  // ── Send Message ──────────────────────────────────────────────────────────────
  async function sendMessage() {
    const input = document.getElementById('gcsc-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text || isLoading) return;

    // Clear UI suggestions and action buttons
    const sugEl = document.getElementById('gcsc-suggestions');
    if (sugEl) sugEl.innerHTML = '';
    const actEl = document.getElementById('gcsc-action-buttons');
    if (actEl) actEl.innerHTML = '';

    messages.push({ role: 'user', content: text });
    appendMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    saveMemory();
    updateMemoryBadge(true);

    isLoading = true;
    const sendBtn = document.getElementById('gcsc-send-btn');
    if (sendBtn) sendBtn.disabled = true;
    showTyping();

    let fullText = '';
    let streamBubble = null;

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          context: { userType: userType || undefined },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      hideTyping();
      streamBubble = appendStreamingMessage();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              if (streamBubble) {
                const { cleaned } = extractActions(fullText);
                streamBubble.innerHTML = parseMarkdown(cleaned);
                scrollToBottom();
              }
            }
          } catch (_) {}
        }
      }

      // Finalize
      if (fullText) {
        const { cleaned, actions } = extractActions(fullText);

        // Update bubble with cleaned text (without action lines)
        if (streamBubble) streamBubble.innerHTML = parseMarkdown(cleaned);

        // Render action buttons
        if (actions.length) renderActionButtons(actions);

        messages.push({ role: 'assistant', content: fullText });
        saveMemory();

        // Remove streaming IDs
        const streamEl = document.getElementById('gcsc-streaming-msg');
        if (streamEl) streamEl.removeAttribute('id');
        const bubbleEl = document.getElementById('gcsc-streaming-bubble');
        if (bubbleEl) bubbleEl.removeAttribute('id');
      }

    } catch (err) {
      hideTyping();
      appendMessage('assistant', `⚠️ ${err.message || 'Something went wrong. Please try again.'}`);
    } finally {
      isLoading = false;
      if (sendBtn) sendBtn.disabled = false;
      input.focus();
    }
  }

  // ── Toggle Widget ─────────────────────────────────────────────────────────────
  function toggleWidget() {
    isOpen = !isOpen;
    const win = document.getElementById('gcsc-chat-window');
    const btn = document.getElementById('gcsc-toggle-btn');
    if (win) win.classList.toggle('visible', isOpen);
    if (btn) btn.classList.toggle('open', isOpen);

    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('gcsc-input');
        if (input) input.focus();
      }, 300);
      loadSuggestions();
    }
  }

  // ── Set Role ──────────────────────────────────────────────────────────────────
  function setUserType(type) {
    userType = type;
    suggestionsLoaded = false;
    document.querySelectorAll('.gcsc-role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === type);
    });
    messages = [];
    const el = document.getElementById('gcsc-messages');
    if (el) el.innerHTML = '';
    const sug = document.getElementById('gcsc-suggestions');
    if (sug) sug.innerHTML = '';
    const act = document.getElementById('gcsc-action-buttons');
    if (act) act.innerHTML = '';
    localStorage.removeItem(STORAGE_KEY);
    updateMemoryBadge(false);
    addWelcomeMessage();
    loadSuggestions();
  }

  // ── Auto-resize ───────────────────────────────────────────────────────────────
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }

  // ── Bind Events ───────────────────────────────────────────────────────────────
  function bindEvents() {
    document.getElementById('gcsc-toggle-btn')?.addEventListener('click', toggleWidget);
    document.getElementById('gcsc-send-btn')?.addEventListener('click', sendMessage);
    document.getElementById('gcsc-clear-btn')?.addEventListener('click', clearMemory);

    const input = document.getElementById('gcsc-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      input.addEventListener('input', () => autoResize(input));
    }

    document.querySelectorAll('.gcsc-role-btn').forEach(btn => {
      btn.addEventListener('click', () => setUserType(btn.dataset.role));
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    loadCSS();

    const run = () => {
      buildWidget();
      bindEvents();

      // Load memory or show welcome
      memoryLoaded = loadMemory();
      if (memoryLoaded) {
        restoreHistory();
      } else {
        addWelcomeMessage();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  init();

  // ── Public API ────────────────────────────────────────────────────────────────
  window.GCSCBuilderAI = {
    open: () => { if (!isOpen) toggleWidget(); },
    close: () => { if (isOpen) toggleWidget(); },
    toggle: toggleWidget,
    setRole: setUserType,
    clearMemory,
    sendMessage: (text) => {
      const input = document.getElementById('gcsc-input');
      if (input) { input.value = text; sendMessage(); }
    },
  };

})();
