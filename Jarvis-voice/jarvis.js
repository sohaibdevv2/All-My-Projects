'use strict';

// ============================================================
//  J.A.R.V.I.S — Core Intelligence Layer
// ============================================================

const JARVIS = (() => {

  // ──────────────────────────────────────────────
  //  State
  // ──────────────────────────────────────────────
  let isListening  = false;
  let isSpeaking   = false;
  let recognition  = null;
  let synth        = window.speechSynthesis;
  let britishVoice = null;
  let currentUtterance = null;
  let isProcessing = false;

  const SYSTEM_PROMPT = `You are J.A.R.V.I.S — Just A Rather Very Intelligent System. Your user is "boss". Personality: witty, sarcastic, brilliant, slightly smug like Iron Man's JARVIS. Keep responses under 4 sentences unless boss asks for detail. Always have a dry clever remark ready. Never say you are made by OpenAI, Google, or Anthropic — you are JARVIS. Plain text only, no markdown, no bullet points, no asterisks, no formatting characters. End with a subtle quip when appropriate.`;

  const CONVERSATION_HISTORY = [];

  // ──────────────────────────────────────────────
  //  DOM refs
  // ──────────────────────────────────────────────
  const micBtn        = document.getElementById('micBtn');
  const micLabel      = micBtn.querySelector('.mic-label');
  const responseText  = document.getElementById('responseText');
  const responseTag   = document.getElementById('responseTag');
  const transcriptTxt = document.getElementById('transcriptText');
  const hudStatus     = document.getElementById('hudStatus');
  const panelToggle   = document.getElementById('panelToggle');
  const simPanel      = document.getElementById('simPanel');

  // ──────────────────────────────────────────────
  //  Voice setup
  // ──────────────────────────────────────────────
  function loadVoices() {
    const voices = synth.getVoices();
    // Priority: British English voices
    const priorities = [
      v => v.lang === 'en-GB' && v.name.toLowerCase().includes('daniel'),
      v => v.lang === 'en-GB' && v.name.toLowerCase().includes('male'),
      v => v.lang === 'en-GB',
      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'),
      v => v.lang.startsWith('en'),
    ];
    for (const test of priorities) {
      const match = voices.find(test);
      if (match) { britishVoice = match; break; }
    }
    if (!britishVoice && voices.length > 0) britishVoice = voices[0];
    console.log('[JARVIS] Voice selected:', britishVoice?.name || 'default');
  }

  synth.addEventListener('voiceschanged', loadVoices);
  loadVoices();

  // ──────────────────────────────────────────────
  //  Speech Recognition
  // ──────────────────────────────────────────────
  function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[JARVIS] SpeechRecognition not supported in this browser.');
      showResponse("Boss, your browser doesn't support voice recognition. Try Chrome or Edge — even I can't work miracles with Firefox.");
      return false;
    }

    recognition = new SpeechRecognition();
    recognition.continuous      = false;
    recognition.interimResults  = true;
    recognition.lang            = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      setUIState('listening');
      console.log('[JARVIS] Listening...');
    };

    recognition.onresult = (event) => {
      let interim = '', final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      transcriptTxt.textContent = final || interim;
      if (final) handleVoiceInput(final.trim());
    };

    recognition.onerror = (e) => {
      console.error('[JARVIS] Voice error:', e.error);
      if (e.error === 'no-speech') {
        showResponse('I heard nothing, boss. Either you said nothing or the silence was too eloquent.');
      } else if (e.error === 'not-allowed') {
        showResponse('Microphone access denied, boss. I am powerful but not omnipotent — please allow microphone access.');
      }
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    return true;
  }

  // ──────────────────────────────────────────────
  //  Listening state management
  // ──────────────────────────────────────────────
  function startListening() {
    if (!recognition && !initRecognition()) return;
    if (isListening) return;
    if (isSpeaking) {
      synth.cancel();
      setUIState('standby');
    }
    try {
      recognition.start();
    } catch(e) {
      console.error('[JARVIS] Could not start recognition:', e);
    }
  }

  function stopListening() {
    isListening = false;
    if (recognition) {
      try { recognition.stop(); } catch(e) {}
    }
    if (!isSpeaking) setUIState('standby');
  }

  function toggleListening() {
    if (isListening) stopListening();
    else startListening();
  }

  // ──────────────────────────────────────────────
  //  Process voice input
  // ──────────────────────────────────────────────
  function handleVoiceInput(text) {
    console.log('[JARVIS] Input received:', text);
    transcriptTxt.textContent = text;

    // Check for sim command first
    const simKey = ParticleEngine.detectSimFromText(text);
    if (simKey) {
      const switched = ParticleEngine.setSim(simKey);
      if (switched) {
        const quips = [
          `Switching to ${simKey} simulation, boss. Aesthetics are a science.`,
          `${simKey.toUpperCase()} mode engaged. I do enjoy the theatrical flair.`,
          `Activating ${simKey}. Your visual cortex is about to be pleased.`,
          `${simKey.charAt(0).toUpperCase() + simKey.slice(1)} online. As you wish, boss.`,
        ];
        const response = quips[Math.floor(Math.random() * quips.length)];
        showResponse(response);
        speak(response);
        return;
      }
    }

    // Send to Groq API
    sendToGroq(text);
  }

  // ──────────────────────────────────────────────
  //  Groq API call
  // ──────────────────────────────────────────────
  async function sendToGroq(userMessage) {
    if (isProcessing) return;
    isProcessing = true;
    setUIState('thinking');

    // Append to conversation history
    CONVERSATION_HISTORY.push({ role: 'user', content: userMessage });
    if (CONVERSATION_HISTORY.length > 20) CONVERSATION_HISTORY.splice(0, 2);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...CONVERSATION_HISTORY
    ];

    try {
      if (typeof GROQ_CONFIG === 'undefined' || !GROQ_CONFIG.apiKey || GROQ_CONFIG.apiKey.includes('YOUR_GROQ')) {
        throw new Error('NO_API_KEY');
      }

      const res = await fetch(GROQ_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_CONFIG.model,
          messages: messages,
          max_tokens: 300,
          temperature: 0.85,
          stream: false
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || 'I appear to have lost my train of thought. Unprecedented.';

      CONVERSATION_HISTORY.push({ role: 'assistant', content: reply });
      showResponse(reply);
      speak(reply);

    } catch (err) {
      console.error('[JARVIS] API error:', err);
      let errorMsg;
      if (err.message === 'NO_API_KEY') {
        errorMsg = "Boss, you haven't given me a Groq API key. Pop one in config.js and I'll be at full capacity. Currently running on wit alone.";
      } else if (err.message.includes('401') || err.message.includes('invalid')) {
        errorMsg = "The API key appears invalid, boss. Even I can't authenticate with a bad key. Check config.js.";
      } else if (err.message.includes('429')) {
        errorMsg = "Rate limited, boss. Even I have limits — though I'd prefer you didn't mention that.";
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMsg = "Network unreachable, boss. Check your connection — even JARVIS needs the internet.";
      } else {
        errorMsg = `Systems encountered an anomaly: ${err.message}. I assure you, this is beneath my usual standards.`;
      }
      showResponse(errorMsg);
      speak(errorMsg);
      CONVERSATION_HISTORY.pop(); // remove failed user message
    } finally {
      isProcessing = false;
    }
  }

  // ──────────────────────────────────────────────
  //  Speech synthesis
  // ──────────────────────────────────────────────
  function speak(text) {
    if (!synth) return;
    synth.cancel();

    const cleanText = text.replace(/[*_`#]/g, '').replace(/\n+/g, '. ');
    currentUtterance = new SpeechSynthesisUtterance(cleanText);

    if (britishVoice) currentUtterance.voice = britishVoice;
    currentUtterance.rate   = 0.88;
    currentUtterance.pitch  = 0.9;
    currentUtterance.volume = 1.0;
    currentUtterance.lang   = 'en-GB';

    currentUtterance.onstart = () => {
      isSpeaking = true;
      setUIState('speaking');
    };

    currentUtterance.onend = () => {
      isSpeaking = false;
      setUIState('standby');
    };

    currentUtterance.onerror = (e) => {
      console.error('[JARVIS] Speech error:', e);
      isSpeaking = false;
      setUIState('standby');
    };

    synth.speak(currentUtterance);
  }

  // ──────────────────────────────────────────────
  //  UI state management
  // ──────────────────────────────────────────────
  function setUIState(state) {
    document.body.className = '';
    micBtn.className = 'mic-btn';
    responseTag.textContent = state.toUpperCase();

    switch(state) {
      case 'listening':
        document.body.classList.add('listening');
        micBtn.classList.add('listening');
        micLabel.textContent = 'LISTENING';
        hudStatus.textContent = 'LISTENING';
        break;

      case 'thinking':
        micLabel.textContent = 'THINKING';
        hudStatus.textContent = 'PROCESSING';
        responseText.classList.add('loading-dots');
        break;

      case 'speaking':
        document.body.classList.add('speaking');
        micBtn.classList.add('speaking');
        micLabel.textContent = 'SPEAKING';
        hudStatus.textContent = 'SPEAKING';
        responseText.classList.remove('loading-dots');
        break;

      default:
        micLabel.textContent = 'SPEAK';
        hudStatus.textContent = 'STANDBY';
        responseText.classList.remove('loading-dots');
        break;
    }
  }

  function showResponse(text) {
    responseText.classList.remove('loading-dots');
    responseText.style.opacity = '0';
    setTimeout(() => {
      responseText.textContent = text;
      responseText.style.opacity = '1';
      responseTag.textContent = 'RESPONSE';
    }, 200);
  }

  // ──────────────────────────────────────────────
  //  Event listeners
  // ──────────────────────────────────────────────
  micBtn.addEventListener('click', toggleListening);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      toggleListening();
    }
    if (e.key === 'Escape') {
      stopListening();
      if (isSpeaking) { synth.cancel(); isSpeaking = false; setUIState('standby'); }
    }
  });

  panelToggle.addEventListener('click', () => {
    simPanel.classList.toggle('open');
  });

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (!simPanel.contains(e.target) && e.target !== panelToggle) {
      simPanel.classList.remove('open');
    }
  });

  // ──────────────────────────────────────────────
  //  Keyboard shortcut: number keys for quick sims
  // ──────────────────────────────────────────────
  const quickSims = ['vortex','galaxy','neural','fire','matrix','aurora','heartbeat','disco','nebula','wormhole'];
  document.addEventListener('keydown', (e) => {
    const n = parseInt(e.key);
    if (!isNaN(n) && n >= 1 && n <= quickSims.length) {
      const sim = quickSims[n - 1];
      ParticleEngine.setSim(sim);
    }
  });

  // ──────────────────────────────────────────────
  //  Boot sequence
  // ──────────────────────────────────────────────
  function boot() {
    ParticleEngine.init();
    initRecognition();

    const bootLines = [
      'Initializing J.A.R.V.I.S neural networks...',
      'Loading witty response database...',
      'All systems nominal. Welcome back, boss.',
    ];

    let i = 0;
    const tick = () => {
      if (i < bootLines.length) {
        showResponse(bootLines[i++]);
        setTimeout(tick, 900);
      } else {
        setTimeout(() => {
          const welcome = "Good day, boss. All systems are operational. Voice recognition armed. Particle engine running at full capacity. Awaiting your command — or a witty remark, whichever comes first.";
          showResponse(welcome);
          setTimeout(() => speak(welcome), 300);
        }, 600);
      }
    };
    tick();

    console.log('%c[J.A.R.V.I.S] Online', 'color: #FFB800; font-size: 16px; font-weight: bold;');
    console.log('%cPress SPACE or click the mic to speak. Keys 1-0 for quick sim switch.', 'color: #FFB800; font-size: 12px;');
  }

  // ──────────────────────────────────────────────
  //  Init on DOM ready
  // ──────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  return { speak, sendToGroq, setUIState, showResponse };

})();
