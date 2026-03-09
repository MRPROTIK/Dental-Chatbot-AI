/**
 * DentalAI Widget — Embeddable Chat
 * Drop this single <script> tag on any website to add the chatbot.
 *
 * Usage:
 * <script
 *   src="https://YOUR-CDN-OR-GITHUB-PAGES-URL/widget.js"
 *   data-chat-url="https://YOUR-GITHUB-PAGES-URL/index.html"
 *   data-color="#0A7B6C"
 *   data-label="Chat with us"
 *   data-position="right"
 * ></script>
 */

(function () {
  // ── Read config from script tag attributes ──────────────────────────────
  const script = document.currentScript;
  const CHAT_URL    = script?.getAttribute('data-chat-url')  || 'index.html';
  const BRAND_COLOR = script?.getAttribute('data-color')     || '#0A7B6C';
  const LABEL       = script?.getAttribute('data-label')     || 'Chat with us';
  const POSITION    = script?.getAttribute('data-position')  || 'right'; // 'right' or 'left'

  // ── Inject Google Font (DM Sans) ─────────────────────────────────────────
  if (!document.querySelector('link[href*="DM+Sans"]')) {
    const font = document.createElement('link');
    font.rel  = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap';
    document.head.appendChild(font);
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #dental-widget-btn {
      position: fixed;
      bottom: 24px;
      ${POSITION}: 24px;
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 10px;
      background: ${BRAND_COLOR};
      color: #fff;
      border: none;
      border-radius: 100px;
      padding: 14px 22px 14px 18px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      letter-spacing: -0.01em;
    }
    #dental-widget-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 40px rgba(0,0,0,0.22);
    }
    #dental-widget-btn .widget-icon {
      font-size: 20px;
      line-height: 1;
    }
    #dental-widget-btn .widget-notif {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 12px;
      height: 12px;
      background: #FF4444;
      border-radius: 50%;
      border: 2px solid #fff;
      animation: dental-pulse-notif 2s infinite;
    }
    #dental-widget-frame-wrap {
      position: fixed;
      bottom: 90px;
      ${POSITION}: 24px;
      z-index: 99999;
      width: 390px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100vh - 120px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.2);
      transform: scale(0.92) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      transform-origin: bottom ${POSITION};
    }
    #dental-widget-frame-wrap.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #dental-widget-frame {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
    #dental-widget-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 28px;
      height: 28px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      z-index: 10;
      line-height: 1;
    }
    #dental-widget-close:hover { background: rgba(255,255,255,0.35); }

    @keyframes dental-pulse-notif {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,68,68,0.4); }
      50%       { box-shadow: 0 0 0 5px rgba(255,68,68,0); }
    }
    @media (max-width: 480px) {
      #dental-widget-frame-wrap {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
      #dental-widget-btn {
        bottom: 20px;
        ${POSITION}: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── Toggle Button ─────────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'dental-widget-btn';
  btn.setAttribute('aria-label', 'Open chat');
  btn.innerHTML = `
    <span class="widget-icon">🦷</span>
    <span class="widget-label">${LABEL}</span>
    <span class="widget-notif" id="dental-notif"></span>
  `;
  document.body.appendChild(btn);

  // ── Iframe Wrapper ────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.id = 'dental-widget-frame-wrap';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'dental-widget-close';
  closeBtn.setAttribute('aria-label', 'Close chat');
  closeBtn.innerHTML = '✕';
  wrap.appendChild(closeBtn);

  const iframe = document.createElement('iframe');
  iframe.id  = 'dental-widget-frame';
  iframe.src = CHAT_URL;
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Dental AI Chat');
  wrap.appendChild(iframe);

  document.body.appendChild(wrap);

  // ── Open / Close Logic ────────────────────────────────────────────────────
  let isOpen = false;

  function openChat() {
    isOpen = true;
    wrap.classList.add('open');
    btn.setAttribute('aria-label', 'Close chat');
    // Hide notification dot once opened
    const notif = document.getElementById('dental-notif');
    if (notif) notif.style.display = 'none';
    // Update button icon to X
    btn.querySelector('.widget-icon').textContent = '✕';
    btn.querySelector('.widget-label').textContent = 'Close';
  }

  function closeChat() {
    isOpen = false;
    wrap.classList.remove('open');
    btn.setAttribute('aria-label', 'Open chat');
    btn.querySelector('.widget-icon').textContent = '🦷';
    btn.querySelector('.widget-label').textContent = LABEL;
  }

  btn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // Auto-show notification dot after 3s to grab attention
  setTimeout(() => {
    const notif = document.getElementById('dental-notif');
    if (notif && !isOpen) notif.style.display = 'block';
  }, 3000);

})();
