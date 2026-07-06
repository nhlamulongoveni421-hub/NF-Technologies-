import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  X, 
  Send, 
  Phone, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  User, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  isVoice?: boolean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState<'chat' | 'voice' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: "Hello! I'm Mary, your AI business consultant at NF Technologies. How can I help you innovate, automate, or elevate your business today?" }]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice Assistant specific states
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'user_speaking' | 'processing' | 'speaking' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceVolume, setVoiceVolume] = useState<number>(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const submitDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio analysis refs for real-time voice volume
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentTranscriptRef = useRef<string>('');

  const voiceStatusRef = useRef(voiceStatus);
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, voiceTranscript]);

  // Clean up Speech on unmount
  useEffect(() => {
    const handleOpenRequest = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(customEvent.detail?.type || 'chat');
    };
    window.addEventListener('open-ai-assistant', handleOpenRequest);

    return () => {
      stopVoiceActivity();
      window.removeEventListener('open-ai-assistant', handleOpenRequest);
    };
  }, []);

  // Verbal Greeting when Voice Call opens
  useEffect(() => {
    if (isOpen === 'voice') {
      // First cancel any existing speech/recognition
      stopVoiceActivity();
      
      // Start persistent mic stream and volume analysis once for the entire call
      startAudioAnalysis();
      
      // Set status to speaking greeting
      setVoiceStatus('speaking');
      setVoiceTranscript("Connecting to live voice assistant...");
      
      // Speak greeting
      const greetingText = "Hello! I'm Mary, your AI business consultant at NF Technologies. How can I help you innovate, automate, or elevate your business today?";
      const timer = setTimeout(() => {
        setVoiceTranscript(greetingText);
        speakText(greetingText);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      stopVoiceActivity();
    }
  }, [isOpen]);

  const startAudioAnalysis = async () => {
    try {
      if (streamRef.current) return; // Already running

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let lastTimeSpoken = Date.now();
      
      const checkVolume = () => {
        if (!analyserRef.current) return;
        
        const currentStatus = voiceStatusRef.current;
        if (currentStatus === 'listening' || currentStatus === 'user_speaking') {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          let count = 0;
          for (let i = 1; i < Math.min(bufferLength, 40); i++) {
            sum += dataArray[i];
            count++;
          }
          const average = count > 0 ? sum / count : 0;
          
          // Highly responsive calculation
          const normalizedVolume = Math.min(100, Math.round((average / 110) * 100));
          const finalVolume = normalizedVolume > 4 ? normalizedVolume : 0;
          setVoiceVolume(finalVolume);
          
          if (finalVolume > 8) {
            lastTimeSpoken = Date.now();
          }
          
          // Voice Activity Detection: If user spoke something and there is now 1.2s of silence, submit!
          if (currentTranscriptRef.current.trim() && (Date.now() - lastTimeSpoken > 1200)) {
            const textToSubmit = currentTranscriptRef.current;
            currentTranscriptRef.current = '';
            handleVoiceSubmit(textToSubmit);
          }
        } else {
          setVoiceVolume(0);
        }
        
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      
      animationFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.warn("Failed to start audio analysis:", err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }
    setVoiceVolume(0);
  };

  const stopVoiceActivity = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (submitDebounceTimerRef.current) clearTimeout(submitDebounceTimerRef.current);
    stopAudioAnalysis();
    currentTranscriptRef.current = '';
    setIsListening(false);
  };

  // Trigger TTS
  const speakText = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    // Clean markdown characters from spoken text for natural pronunciation
    const cleanText = text
      .replace(/[\*\#\`\_]/g, '')
      .replace(/R(\d+)/g, 'Rands $1')
      .replace(/(\d+)\/month/g, '$1 Rands per month');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Find a nice high-quality human female English voice if available (Mary persona)
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    const femaleVoiceKeywords = ['mary', 'female', 'samantha', 'zira', 'karen', 'victoria', 'hazel', 'google uk english', 'google us english'];
    selectedVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      const isEnglish = v.lang.startsWith('en-') || v.lang.startsWith('en_');
      return isEnglish && femaleVoiceKeywords.some(keyword => name.includes(keyword));
    });

    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.lang.startsWith('en-ZA') || 
        v.lang.startsWith('en-GB') || 
        v.lang.startsWith('en-US')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setVoiceStatus('speaking');
      setVoiceTranscript(text); // Show Mary's response in the transcription window!
      stopAudioAnalysis(); // Stop volume analysis when agent is speaking
    };

    utterance.onend = () => {
      setVoiceStatus('idle');
      // After speaking completes, restart listening automatically to keep conversation flowing naturally
      if (isOpen === 'voice' && !isMuted) {
        startListeningSession();
      }
    };

    utterance.onerror = () => {
      setVoiceStatus('idle');
      if (isOpen === 'voice' && !isMuted) {
        startListeningSession();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start Recognition Session
  const startListeningSession = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceTranscript("Voice recognition is not supported in this browser. Please type your query in the text chat below!");
      return;
    }

    // Stop current recognition if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Persistent mic stream is already running, no need to call startAudioAnalysis() here.

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Disable continuous to leverage native fast punctuation/pause detection
    recognition.interimResults = true;
    recognition.lang = 'en-ZA';

    currentTranscriptRef.current = '';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('listening');
      setVoiceTranscript('Listening...');
      resetSilenceTimer();
    };

    recognition.onresult = (event: any) => {
      resetSilenceTimer();
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      if (activeText.trim()) {
        currentTranscriptRef.current = activeText;
        setVoiceTranscript(activeText);
        setVoiceStatus('user_speaking');
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      
      const currentStatus = voiceStatusRef.current;
      // If there is leftover text when the speech recognition natively ends, submit it instantly!
      if (currentTranscriptRef.current.trim() && currentStatus === 'user_speaking') {
        const textToSubmit = currentTranscriptRef.current;
        currentTranscriptRef.current = '';
        handleVoiceSubmit(textToSubmit);
        return;
      }

      // Auto-restart listening if call is still active and we are in an idle/listening/user_speaking state
      setTimeout(() => {
        const updatedStatus = voiceStatusRef.current;
        if (isOpen === 'voice' && !isMuted && (updatedStatus === 'listening' || updatedStatus === 'idle' || updatedStatus === 'user_speaking')) {
          startListeningSession();
        }
      }, 250);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Inactivity / silence timeout
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (isOpen === 'voice' && voiceStatusRef.current === 'listening') {
        stopVoiceActivity();
        setVoiceTranscript("Call ended due to inactivity.");
        setVoiceStatus('ended');
        speakText("Thank you for calling NF Technologies. Have a fantastic day ahead! Goodbye.");
      }
    }, 15000); // 15 seconds auto timeout
  };

  const handleVoiceSubmit = async (spokenText: string) => {
    if (submitDebounceTimerRef.current) clearTimeout(submitDebounceTimerRef.current);
    if (!spokenText || spokenText.trim() === 'Listening...' || spokenText.trim() === '') return;
    
    currentTranscriptRef.current = '';
    // Do NOT stop persistent audio context here to keep live wave feedback smooth during processing/speaking.
    
    // Stop listening immediately to process
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch(e){}
    }
    setIsListening(false);
    setVoiceStatus('processing');

    // Add user message to history
    const userMsg: Message = {
      role: 'user',
      parts: [{ text: spokenText }],
      isVoice: true
    };
    setMessages(prev => [...prev, userMsg]);

    // Check for explicit hang-up commands
    const lowercaseText = spokenText.toLowerCase();
    if (lowercaseText.includes('goodbye') || lowercaseText.includes('thank you') || lowercaseText.includes('end call') || lowercaseText.includes('bye')) {
      setVoiceStatus('ended');
      const responseText = "You are very welcome! If you need anything else, feel free to call or WhatsApp us at 073 103 0264. Have a beautiful day. Goodbye!";
      const assistantMsg: Message = {
        role: 'model',
        parts: [{ text: responseText }],
        isVoice: true
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(responseText);
      setTimeout(() => {
        setIsOpen(null);
        stopVoiceActivity();
      }, 5000);
      return;
    }

    try {
      // Map history for Gemini structure
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: spokenText,
          history: apiHistory,
          mode: 'voice'
        })
      });

      const data = await res.json();
      if (data.text) {
        const assistantMsg: Message = {
          role: 'model',
          parts: [{ text: data.text }],
          isVoice: true
        };
        setMessages(prev => [...prev, assistantMsg]);
        speakText(data.text);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (e) {
      setVoiceTranscript("Error connecting to voice systems. Try again.");
      setVoiceStatus('idle');
    }
  };

  // Text Chat Submit Handler
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    setInputText('');
    setIsLoading(true);

    const userMsg: Message = {
      role: 'user',
      parts: [{ text: userText }]
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: apiHistory,
          mode: 'chat'
        })
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, {
          role: 'model',
          parts: [{ text: data.text }]
        }]);
      } else {
        throw new Error(data.error || "No response");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "I apologize, but I encountered a network connectivity error. Please try again, or contact NF Technologies directly at 073 103 0264." }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      // Restart call flow
      if (voiceStatus === 'idle') {
        startListeningSession();
      }
    } else {
      setIsMuted(true);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsListening(false);
      setVoiceStatus('idle');
    }
  };

  return (
    <>
      {/* FLOAT GROUP: Bottom Right Corner */}
      <div id="ai-float-group" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
        
        {/* WhatsApp Floating Button */}
        <motion.a
          id="whatsapp-float-btn"
          href="https://wa.me/27731030264"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full p-3.5 shadow-xl hover:shadow-emerald-500/20 transition-all cursor-pointer border border-emerald-400/40 group relative"
          title="Chat on WhatsApp"
        >
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.025 14.077 1 11.41 1 5.973 1 1.548 5.37 1.543 10.8c-.001 1.774.475 3.507 1.38 5.061L1.91 20.3l4.738-1.146zM17.31 14.86c-.292-.146-1.729-.854-1.996-.951-.268-.097-.463-.146-.658.146-.195.293-.755.951-.926 1.146-.171.195-.341.219-.633.073-1.212-.514-2.181-1.09-3.053-1.841-.772-.664-1.341-1.48-1.493-1.738-.152-.259-.016-.399.13-.544.131-.13.292-.341.439-.512.146-.171.195-.292.292-.487.097-.195.049-.365-.024-.512-.073-.146-.658-1.586-.902-2.17-.238-.574-.479-.496-.658-.505-.171-.007-.366-.008-.561-.008-.195 0-.512.073-.78.365-.268.293-1.024 1.001-1.024 2.439 0 1.438 1.048 2.829 1.195 3.023.146.195 2.062 3.149 4.996 4.413.698.301 1.243.481 1.668.616.702.223 1.341.191 1.846.115.562-.084 1.729-.707 1.972-1.389.244-.682.244-1.267.171-1.389-.071-.122-.266-.194-.559-.34z"/>
          </svg>
          <span className="hidden group-hover:inline-block font-mono text-xs font-bold uppercase mr-1 transition-all">WhatsApp Us</span>
        </motion.a>

        {/* AI Voice Assistant Call Button */}
        <motion.button
          id="ai-voice-assistant-float-btn"
          onClick={() => {
            setIsOpen('voice');
          }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full p-3.5 shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer border border-blue-400/30 group"
          title="Start AI Voice Call"
        >
          <Mic className="w-5.5 h-5.5 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-48 group-hover:ml-1 transition-all duration-300 font-mono text-xs font-bold uppercase whitespace-nowrap block">Call Mary (AI)</span>
        </motion.button>

        {/* AI Chat Assistant Floating Button */}
        <motion.button
          id="ai-chat-assistant-float-btn"
          onClick={() => setIsOpen('chat')}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full p-4 shadow-xl hover:shadow-cyan-500/25 transition-all cursor-pointer border border-cyan-400/40 relative"
          title="Open AI Consultant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-600"></span>
          </span>
          <MessageSquare className="w-5.5 h-5.5" />
          <span className="font-mono text-xs font-black uppercase tracking-wider pl-1 pr-1">Ask AI</span>
        </motion.button>
      </div>

      {/* EXPANDED INTERFACES (MODAL-LIKE DRAWER OVERLAYS) */}
      <AnimatePresence>
        
        {/* 1. TEXT CHAT PANEL */}
        {isOpen === 'chat' && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-end p-4 print:hidden">
            <motion.div
              id="ai-chat-panel"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-md h-[80vh] sm:h-[650px] flex flex-col overflow-hidden text-zinc-800"
            >
              {/* Header */}
              <div className="bg-zinc-50 p-4 text-zinc-850 flex justify-between items-center shrink-0 border-b border-zinc-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-wider uppercase font-display leading-tight text-zinc-900">NF Tech Consultant</h4>
                    <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest block leading-none font-bold">● AI Assistant Online</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-zinc-50 space-y-4 text-xs">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role !== 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 text-cyan-600 shrink-0 mt-0.5 text-[10px] font-black flex items-center justify-center shadow-xs">
                        NF
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                        m.role === 'user'
                          ? 'bg-cyan-500 text-white font-bold rounded-tr-none shadow-[0_2px_10px_rgba(6,182,212,0.2)]'
                          : 'bg-white border border-zinc-200 text-zinc-700 rounded-tl-none'
                      }`}
                    >
                      {m.parts[0].text.split('\n').map((line, key) => (
                        <p key={key} className={key > 0 ? 'mt-1.5' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 text-cyan-600 shrink-0 text-[10px] font-black flex items-center justify-center">
                      NF
                    </div>
                    <div className="bg-white border border-zinc-200 text-zinc-500 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>Formulating solution...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-3 border-t border-zinc-200 bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about website setup, AI automation, cybersecurity..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-100 text-white disabled:text-zinc-400 border border-cyan-400/30 p-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 2. VOICE CALL PANEL */}
        {isOpen === 'voice' && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 print:hidden">
            <motion.div
              id="ai-voice-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[520px]"
            >
              {/* Call Header */}
              <div className="p-4 border-b border-zinc-200 flex justify-between items-center text-zinc-800 shrink-0 bg-zinc-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">Live AI Call Connection</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(null);
                    stopVoiceActivity();
                  }}
                  className="p-1.5 rounded-full bg-white text-zinc-400 hover:text-zinc-700 border border-zinc-200 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Central Voice Status Indicator & Animation */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-5 bg-white">
                <div>
                  <h3 className="text-lg font-black tracking-wide text-zinc-900 font-display uppercase">Mary — NF AI Agent</h3>
                  <p className="text-xs text-zinc-500 mt-1">Direct consulting line</p>
                </div>

                {/* Pulsing microphone bubble */}
                <div className="relative">
                  {/* Glowing decorative rings */}
                  {voiceStatus === 'listening' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-cyan-500/15 animate-ping scale-150" style={{ animationDuration: '2s' }} />
                      <div className="absolute inset-0 rounded-full bg-cyan-500/5 animate-ping scale-200" style={{ animationDuration: '3s' }} />
                    </>
                  )}
                  {voiceStatus === 'user_speaking' && (
                    <>
                      {/* Interactive volume pulsing rings */}
                      <div 
                        className="absolute inset-0 rounded-full bg-emerald-500/20 transition-all duration-75" 
                        style={{ 
                           transform: `scale(${1 + (voiceVolume / 100) * 0.75})`, 
                           opacity: 0.2 + (voiceVolume / 100) * 0.6 
                        }} 
                      />
                      <div 
                        className="absolute inset-0 rounded-full bg-emerald-500/5 transition-all duration-100" 
                        style={{ 
                          transform: `scale(${1.2 + (voiceVolume / 100) * 1.1})`, 
                          opacity: 0.1 + (voiceVolume / 100) * 0.4 
                        }} 
                      />
                    </>
                  )}
                  {voiceStatus === 'speaking' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-indigo-500/15 animate-pulse scale-150" />
                    </>
                  )}

                  <div 
                    className={`w-28 h-28 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-75 ${
                      voiceStatus === 'listening'
                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/20'
                        : voiceStatus === 'user_speaking'
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'
                        : voiceStatus === 'speaking'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20'
                        : voiceStatus === 'processing'
                        ? 'bg-zinc-50 border-amber-500 text-amber-500 animate-pulse'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                    }`}
                    style={
                      voiceStatus === 'user_speaking'
                        ? { transform: `scale(${1 + (voiceVolume / 100) * 0.2})` }
                        : undefined
                    }
                  >
                    {voiceStatus === 'speaking' ? (
                      <Volume2 className="w-12 h-12 animate-bounce" />
                    ) : voiceStatus === 'user_speaking' ? (
                      <div className="flex items-center gap-1.5 h-12">
                        <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-9 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="w-1.5 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                      </div>
                    ) : (
                      <Mic className={`w-12 h-12 ${voiceStatus === 'listening' ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                </div>

                {/* Real-time sound wave equalizer */}
                <div className="flex items-end justify-center gap-1 h-7 my-1">
                  {[0.6, 1.2, 0.8, 1.5, 0.9, 1.3, 0.5, 1.1, 1.4, 0.7].map((factor, index) => {
                    const activeHeight = voiceVolume > 2 
                      ? Math.min(28, 4 + Math.round(voiceVolume * factor * 0.32))
                      : 4;
                    return (
                      <motion.div
                        key={index}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          voiceStatus === 'user_speaking' 
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                            : voiceStatus === 'listening' 
                            ? 'bg-cyan-500/30' 
                            : voiceStatus === 'speaking' 
                            ? 'bg-indigo-500/40 animate-pulse'
                            : 'bg-zinc-200'
                        }`}
                        style={{ height: `${activeHeight}px` }}
                        animate={{ height: `${activeHeight}px` }}
                        transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                      />
                    );
                  })}
                </div>

                {/* Live Transcript / Activity status text */}
                <div className="w-full max-w-xs space-y-2">
                  <p className={`text-sm font-bold capitalize tracking-wide ${
                    voiceStatus === 'listening' ? 'text-cyan-600' :
                    voiceStatus === 'user_speaking' ? 'text-emerald-600 animate-pulse' :
                    voiceStatus === 'speaking' ? 'text-indigo-600' :
                    voiceStatus === 'processing' ? 'text-amber-500' : 'text-zinc-500'
                  }`}>
                    {voiceStatus === 'listening' ? 'Agent listening...' :
                     voiceStatus === 'user_speaking' ? 'You speaking...' :
                     voiceStatus === 'speaking' ? 'Mary speaking...' :
                     voiceStatus === 'processing' ? 'Thinking...' :
                     voiceStatus === 'ended' ? 'Call Ended' : 'Idle'}
                  </p>
                  
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 h-20 overflow-y-auto text-center flex items-center justify-center">
                    <p className="text-xs text-zinc-650 italic line-clamp-3">
                      {voiceTranscript || "Tap the microphone below to start speaking. Speak naturally about your project requirements!"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Call Control Buttons */}
              <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-around shrink-0">
                
                {/* Mute output / input toggle */}
                <button
                  id="mute-call-btn"
                  onClick={toggleMute}
                  className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20' 
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800 shadow-xs'
                  }`}
                  title={isMuted ? "Unmute Call" : "Mute Call"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Hang Up Action */}
                <button
                  id="hang-up-call-btn"
                  onClick={() => {
                    setIsOpen(null);
                    stopVoiceActivity();
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-full border border-red-500/30 shadow-lg shadow-red-600/10 hover:shadow-red-500/20 transition-all cursor-pointer"
                  title="Hang Up Call"
                >
                  <Phone className="w-6 h-6 rotate-135" />
                </button>

                {/* Force Restart Listening manually if they get stuck */}
                <button
                  id="restart-listen-btn"
                  onClick={startListeningSession}
                  disabled={voiceStatus === 'processing' || voiceStatus === 'speaking' || isMuted}
                  className="p-3.5 rounded-full bg-white disabled:opacity-40 text-zinc-500 disabled:text-zinc-300 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-800 shadow-xs transition-all cursor-pointer"
                  title="Restart Mic Capture"
                >
                  <Mic className="w-5 h-5" />
                </button>

              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </>
  );
}
