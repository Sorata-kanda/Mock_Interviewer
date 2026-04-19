'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

function ElectronCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const electrons = [
    { id: 0, radius: 28, speed: 0.04,  size: 3, color: '#818cf8' },
    { id: 1, radius: 38, speed: 0.052, size: 5, color: '#a78bfa' },
    { id: 2, radius: 28, speed: 0.064, size: 3, color: '#60a5fa' },
    { id: 3, radius: 48, speed: 0.076, size: 5, color: '#f472b6' },
    { id: 4, radius: 38, speed: 0.088, size: 3, color: '#34d399' },
    { id: 5, radius: 48, speed: 0.1,   size: 5, color: '#fbbf24' },
  ];
  const anglesRef = useRef<number[]>(electrons.map((_, i) => (i / 6) * Math.PI * 2));
  const rafRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const tick = () => {
      electrons.forEach((e, i) => { anglesRef.current[i] += e.speed; });
      forceUpdate(n => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] cursor-none">
      <div className="absolute w-3 h-3 rounded-full bg-white/80 shadow-[0_0_8px_2px_rgba(129,140,248,0.8)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }} />
      {electrons.map((e, i) => (
        <div key={e.id} className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            left: pos.x + Math.cos(anglesRef.current[i]) * e.radius,
            top: pos.y + Math.sin(anglesRef.current[i]) * e.radius,
            width: e.size, height: e.size,
            backgroundColor: e.color,
            boxShadow: `0 0 6px 2px ${e.color}88`,
          }} />
      ))}
    </div>
  );
}

export default function ProjectShowcase() {
  const [current, setCurrent] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = 15;
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 700);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const bottomThreshold = windowHeight - 120; // Show when cursor is within 120px of bottom
      
      setShowNavigation(mouseY > bottomThreshold);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Modern animation for all slides
  const getSlideAnimation = () => {
    return isAnimating ? 'animate-modern-slide' : '';
  };

  const renderSlide = (slideIndex: number) => {
    switch (slideIndex) {
      case 0:
        return (
          <div className={`flex flex-col items-center justify-center h-full text-center px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] ${getSlideAnimation()}`}>
            <div className="mb-6 animate-pulse hover:animate-none hover:opacity-80 transition-all duration-500">
              <Image 
                src="/logo.svg" 
                alt="Prepwise Logo" 
                width={120} 
                height={120}
                className="drop-shadow-2xl"
              />
            </div>
            <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
              Prep<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">wise</span>
            </h1>
            <p className="text-2xl text-white/70 mb-8 max-w-2xl">AI-Powered Mock Interview Platform that prepares you for your dream job</p>
            <div className="flex gap-3 flex-wrap justify-center mb-10">
              {['Next.js 16','Firebase','Vapi AI','Google Gemini','TypeScript'].map(t => (
                <span key={t} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-sm animate-pulse">Press → or click the arrow to continue</p>
          </div>
        );
      case 1:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#11998e] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">Why does interview prep <span className="text-red-400">fail?</span></h2>
            <p className="text-white/60 mb-10 text-lg">Most candidates walk in underprepared. Here's why traditional prep doesn't work.</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { 
                  icon: '😰', 
                  stat: '73%', 
                  label: 'of job seekers experience interview anxiety', 
                  detail: 'Nervousness leads to poor performance even when candidates know the material',
                  color: 'border-red-500/40 from-red-500/20 to-red-900/20' 
                },
                { 
                  icon: '🎯', 
                  stat: '0%',  
                  label: 'of generic prep matches your actual interview', 
                  detail: 'One-size-fits-all questions don\'t prepare you for role-specific scenarios',
                  color: 'border-orange-500/40 from-orange-500/20 to-orange-900/20' 
                },
                { 
                  icon: '🔁', 
                  stat: 'No',  
                  label: 'real feedback loop — you never know what went wrong', 
                  detail: 'Without detailed feedback, you repeat the same mistakes in every interview',
                  color: 'border-yellow-500/40 from-yellow-500/20 to-yellow-900/20' 
                },
              ].map(item => (
                <div key={item.stat} className={`bg-gradient-to-br ${item.color} border rounded-2xl p-8 text-center hover:scale-105 transition-transform`}>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-5xl font-black text-white mb-2">{item.stat}</div>
                  <div className="text-white/70 text-sm mb-3 font-semibold">{item.label}</div>
                  <div className="text-white/50 text-xs leading-relaxed">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Prepwise</span></h2>
            <p className="text-white/60 mb-10 text-lg">One platform. Real AI. Actual results. Here's how we solve interview prep.</p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { 
                  icon: '🎙️', 
                  title: 'AI Voice Interviews', 
                  desc: 'Powered by Vapi AI — have a real spoken conversation with an AI interviewer, just like the real thing. No typing, just natural speech.',
                  tech: 'Vapi AI + Web SDK'
                },
                { 
                  icon: '🧠', 
                  title: 'Smart Question Generation', 
                  desc: 'Google Gemini 2.5 Flash crafts role-specific, level-appropriate questions tailored to your exact tech stack and experience.',
                  tech: 'Google Gemini 2.5 Flash'
                },
                { 
                  icon: '📊', 
                  title: 'Interactive Performance Reports', 
                  desc: 'Get detailed 15-slide interactive feedback on your answers, strengths, areas to improve, and a personalized action plan.',
                  tech: 'React + Tailwind'
                },
                { 
                  icon: '🔐', 
                  title: 'Secure & Personalized', 
                  desc: 'Firebase Auth with session cookies keeps your data safe. Every interview is saved to your personal dashboard with full history.',
                  tech: 'Firebase + Next.js'
                },
              ].map(f => (
                <div key={f.title} className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex gap-4">
                  <div className="text-4xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-bold text-white text-lg mb-1">{f.title}</div>
                    <div className="text-white/60 text-sm leading-relaxed mb-2">{f.desc}</div>
                    <div className="text-cyan-300 text-xs font-mono bg-white/10 px-2 py-1 rounded">{f.tech}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#16213e] via-[#0f3460] to-[#533483] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Works</span></h2>
            <p className="text-white/60 mb-8 text-lg">From sign-up to feedback in 4 simple steps. The entire process takes just 10-15 minutes.</p>
            <div className="space-y-5">
              {[
                { 
                  n: 1, 
                  title: 'Sign Up & Set Preferences', 
                  desc: 'Create your account with Firebase Auth. Choose your target role (Frontend, Backend, Full-stack), experience level (Junior, Mid, Senior), and tech stack.',
                  detail: 'Secure authentication with session cookies. All preferences saved to Firestore.'
                },
                { 
                  n: 2, 
                  title: 'AI Generates Custom Questions', 
                  desc: 'Google Gemini 2.5 Flash creates 5-10 tailored interview questions based on your exact preferences. Mix of technical and behavioral questions.',
                  detail: 'Questions are voice-assistant friendly (no special characters) and saved to your interview record.'
                },
                { 
                  n: 3, 
                  title: 'Voice Interview with AI Agent', 
                  desc: 'Vapi AI conducts a real spoken interview. The AI asks questions aloud, you answer by speaking naturally. Real-time transcription captures everything.',
                  detail: 'Sub-second response times. Dynamic follow-up questions based on your answers.'
                },
                { 
                  n: 4, 
                  title: 'Get Your Performance Report', 
                  desc: 'Receive a detailed 15-slide interactive report with overall score, per-question feedback, strengths, improvement areas, and a 30-day action plan.',
                  detail: 'Includes learning resources, practice projects, and progress tracking over time.'
                },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-6 bg-white/10 border border-white/20 rounded-2xl px-6 py-5 hover:bg-white/20 hover:translate-x-2 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg mb-1">{s.title}</div>
                    <div className="text-white/70 text-sm mb-2 leading-relaxed">{s.desc}</div>
                    <div className="text-white/50 text-xs italic">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#0d0d0d] via-[#1a1a2e] to-[#16213e] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Stack</span></h2>
            <p className="text-white/60 mb-8 text-lg">Built with modern, production-grade technologies for scalability, performance, and developer experience.</p>
            <div className="grid grid-cols-3 gap-5">
              {[
                { 
                  icon: '⚡', 
                  name: 'Next.js 16', 
                  desc: 'App Router with React Server Components, API Routes, Server Actions, and optimized bundling',
                  features: ['App Router', 'Server Components', 'API Routes', 'Server Actions'],
                  color: 'border-white/20 from-white/10 to-white/5' 
                },
                { 
                  icon: '🔥', 
                  name: 'Firebase', 
                  desc: 'Complete backend solution with Authentication, Firestore database, and Admin SDK for server-side operations',
                  features: ['Auth + Session Cookies', 'Firestore Database', 'Admin SDK', 'Real-time Updates'],
                  color: 'border-orange-500/30 from-orange-500/20 to-orange-900/10' 
                },
                { 
                  icon: '🎙️', 
                  name: 'Vapi AI', 
                  desc: 'Real-time voice AI agent for conducting spoken interviews with natural conversation flow',
                  features: ['Voice Recognition', 'Real-time Responses', 'Transcription', 'Web SDK'],
                  color: 'border-blue-500/30 from-blue-500/20 to-blue-900/10' 
                },
                { 
                  icon: '✨', 
                  name: 'Google Gemini', 
                  desc: 'Advanced AI model for generating personalized interview questions via the official AI SDK',
                  features: ['Question Generation', 'Context Awareness', 'Role-specific', 'AI SDK Integration'],
                  color: 'border-purple-500/30 from-purple-500/20 to-purple-900/10' 
                },
                { 
                  icon: '🔷', 
                  name: 'TypeScript', 
                  desc: 'Full type safety across the entire codebase with strict mode enabled for better DX',
                  features: ['Strict Mode', 'Type Safety', 'IntelliSense', 'Error Prevention'],
                  color: 'border-cyan-500/30 from-cyan-500/20 to-cyan-900/10' 
                },
                { 
                  icon: '🎨', 
                  name: 'Tailwind CSS', 
                  desc: 'Utility-first CSS framework with custom design system, animations, and responsive design',
                  features: ['Utility Classes', 'Custom Design', 'Animations', 'Responsive'],
                  color: 'border-teal-500/30 from-teal-500/20 to-teal-900/10' 
                },
              ].map(t => (
                <div key={t.name} className={`bg-gradient-to-br ${t.color} border rounded-2xl p-5 hover:scale-105 transition-all duration-300`}>
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="font-bold text-white text-lg mb-2">{t.name}</div>
                  <div className="text-white/60 text-xs leading-relaxed mb-3">{t.desc}</div>
                  <div className="space-y-1">
                    {t.features.map(feature => (
                      <div key={feature} className="text-white/40 text-xs flex items-center gap-1">
                        <span className="text-white/20">▸</span>{feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1f1c2c] via-[#928dab] to-[#1f1c2c] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🔐 Authentication <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Flow</span></h2>
            <p className="text-white/60 mb-8 text-lg">Secure, session-based authentication powered by Firebase Admin SDK with production-grade security.</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl mb-4">🚀 Sign Up Flow</h3>
                {[
                  { step: 'User fills email + password form', detail: 'Client-side validation with React Hook Form + Zod' },
                  { step: 'Firebase creates auth user', detail: 'Secure user creation with Firebase Auth SDK' },
                  { step: 'Firestore user document created', detail: 'User profile stored in Firestore with metadata' },
                  { step: 'Session cookie set (7 days)', detail: 'HttpOnly, secure session cookie for server-side auth' },
                  { step: 'Redirected to dashboard', detail: 'Automatic redirect to protected dashboard route' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition-all">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</div>
                    <div>
                      <span className="text-white/80 text-sm font-semibold block">{item.step}</span>
                      <span className="text-white/50 text-xs">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl mb-4">🛡️ Route Protection</h3>
                {[
                  { route: '/', label: 'Dashboard', protected: true, desc: 'Main interview dashboard' },
                  { route: '/interview', label: 'Interview', protected: true, desc: 'Live interview page' },
                  { route: '/interview-docs', label: 'Reports', protected: true, desc: 'Performance reports' },
                  { route: '/sign-in', label: 'Sign In', protected: false, desc: 'Public auth page' },
                  { route: '/sign-up', label: 'Sign Up', protected: false, desc: 'Public registration' },
                ].map(r => (
                  <div key={r.route} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 text-sm font-mono">{r.route}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.protected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {r.protected ? '🔒 Protected' : '🌐 Public'}
                      </span>
                    </div>
                    <span className="text-white/50 text-xs">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#2d1b69] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">✨ AI Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Generation</span></h2>
            <p className="text-white/60 mb-8 text-lg">Google Gemini 2.5 Flash creates personalized interview questions on demand, tailored to your exact requirements.</p>
            <div className="grid grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-white/80 font-bold mb-4 text-xl">📡 API Request Flow</h3>
                <div className="bg-black/50 border border-white/20 rounded-2xl p-5 font-mono text-sm mb-4">
                  <div className="text-green-400 mb-2">POST /api/vapi/generate</div>
                  <div className="text-white/70 space-y-1">
                    <div><span className="text-blue-400">"role"</span>: <span className="text-yellow-400">"Frontend Developer"</span></div>
                    <div><span className="text-blue-400">"level"</span>: <span className="text-yellow-400">"Senior"</span></div>
                    <div><span className="text-blue-400">"techstack"</span>: <span className="text-yellow-400">"Next.js, React"</span></div>
                    <div><span className="text-blue-400">"type"</span>: <span className="text-yellow-400">"mixed"</span></div>
                    <div><span className="text-blue-400">"amount"</span>: <span className="text-yellow-400">"7"</span></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Uses Google Gemini 2.5 Flash model', 'Processes request in ~2-3 seconds', 'Handles rate limiting & retries', 'Validates input parameters'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <span className="text-purple-400">▸</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white/80 font-bold mb-4 text-xl">🎯 What Gemini Returns</h3>
                <div className="space-y-3">
                  {[
                    { 
                      title: 'Role-specific technical questions', 
                      desc: 'Questions tailored to the exact job role and seniority level' 
                    },
                    { 
                      title: 'Behavioral questions by experience', 
                      desc: 'Leadership questions for seniors, learning questions for juniors' 
                    },
                    { 
                      title: 'Voice-assistant friendly format', 
                      desc: 'No special characters that could break text-to-speech' 
                    },
                    { 
                      title: 'Saved to Firebase Firestore', 
                      desc: 'Questions stored with interview metadata for history' 
                    },
                    { 
                      title: 'Ready for Vapi AI to read aloud', 
                      desc: 'Optimized for natural speech synthesis and conversation flow' 
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400 mt-1">✦</span>
                        <div>
                          <span className="text-white/80 text-sm font-semibold block">{item.title}</span>
                          <span className="text-white/50 text-xs">{item.desc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#0f0c29] via-[#1a1a4e] to-[#302b63] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🎙️ Voice Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Agent</span></h2>
            <p className="text-white/60 mb-8 text-lg">Vapi AI conducts a real-time spoken interview — no typing, just natural conversation like a real interviewer.</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { 
                  icon: '🎤', 
                  title: 'Real Voice Conversation', 
                  desc: 'The AI agent speaks questions aloud using natural text-to-speech and listens to your spoken answers in real time.',
                  tech: 'Vapi Web SDK + WebRTC'
                },
                { 
                  icon: '🧩', 
                  title: 'Dynamic Follow-ups', 
                  desc: 'Vapi can ask intelligent follow-up questions based on your answers, just like a real interviewer would.',
                  tech: 'Context-aware AI responses'
                },
                { 
                  icon: '📝', 
                  title: 'Transcript Captured', 
                  desc: 'Every word is transcribed and stored for detailed analysis in your performance report and future reference.',
                  tech: 'Real-time speech-to-text'
                },
                { 
                  icon: '⚡', 
                  title: 'Low Latency', 
                  desc: 'Sub-second response times make the conversation feel natural and fluid, just like talking to a human.',
                  tech: 'Optimized voice processing'
                },
                { 
                  icon: '🌐', 
                  title: 'Works in Browser', 
                  desc: 'No app install needed. Works directly in your browser using the Vapi Web SDK with microphone access.',
                  tech: 'Web Audio API + WebRTC'
                },
                { 
                  icon: '🔄', 
                  title: 'Retry Anytime', 
                  desc: 'Not happy with your performance? Start a new interview with fresh questions instantly. No limits.',
                  tech: 'Stateless interview sessions'
                },
              ].map(f => (
                <div key={f.title} className="bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/20 hover:scale-105 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="font-bold text-white mb-2 text-lg">{f.title}</div>
                  <div className="text-white/60 text-xs leading-relaxed mb-3">{f.desc}</div>
                  <div className="text-cyan-300 text-xs font-mono bg-white/10 px-2 py-1 rounded">{f.tech}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#134e5e] via-[#71b280] to-[#134e5e] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">📊 Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">Report</span></h2>
            <p className="text-white/60 mb-8 text-lg">After every interview, you get a comprehensive 15-slide interactive report with actionable insights.</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl mb-4">📋 Report Includes</h3>
                {[
                  { item: 'Overall performance score (0-100)', detail: 'Weighted average across all evaluation criteria' },
                  { item: 'Per-question score with feedback', detail: 'Individual analysis of each answer with improvement tips' },
                  { item: 'Strengths & areas for improvement', detail: 'Personalized insights based on your specific performance' },
                  { item: 'Technical, communication & cultural fit', detail: 'Comprehensive evaluation across multiple dimensions' },
                  { item: '30-day personalized action plan', detail: 'Step-by-step roadmap for skill improvement' },
                  { item: 'Recommended learning resources', detail: 'Curated courses, docs, and practice projects' }
                ].map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                    <span className="text-green-400 text-lg mt-0.5">✓</span>
                    <div>
                      <span className="text-white/80 text-sm font-semibold block">{entry.item}</span>
                      <span className="text-white/50 text-xs">{entry.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-black/30 border border-white/20 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl font-black text-green-400 mb-2">78%</div>
                  <div className="text-white/60 text-lg">Overall Score</div>
                  <div className="text-green-300 text-sm">Good Performance</div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Technical Knowledge', score: 80, color: 'from-blue-400 to-blue-600' },
                    { label: 'Communication', score: 83, color: 'from-green-400 to-green-600' },
                    { label: 'Problem Solving', score: 73, color: 'from-yellow-400 to-yellow-600' },
                    { label: 'Confidence', score: 81, color: 'from-purple-400 to-purple-600' },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>{m.label}</span>
                        <span className="font-semibold">{m.score}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r ${m.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${m.score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🏠 Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dashboard</span></h2>
            <p className="text-white/60 mb-8 text-lg">Everything in one place — your interview history, progress tracking, and quick actions for continuous improvement.</p>
            <div className="grid grid-cols-3 gap-5">
              {[
                { 
                  icon: '📋', 
                  title: 'Interview History', 
                  desc: 'All your past interviews listed chronologically with role, date, overall score, and tech stack used.',
                  features: ['Sortable by date/score', 'Filter by role/tech', 'Export to PDF']
                },
                { 
                  icon: '🚀', 
                  title: 'Start New Interview', 
                  desc: 'One-click to configure and launch a new AI-powered mock interview session with your preferences.',
                  features: ['Quick start templates', 'Custom configurations', 'Saved preferences']
                },
                { 
                  icon: '📈', 
                  title: 'Progress Tracking', 
                  desc: 'See how your scores improve over time across different roles, topics, and skill areas.',
                  features: ['Score trends', 'Skill progression', 'Goal setting']
                },
                { 
                  icon: '🎯', 
                  title: 'Interview Cards', 
                  desc: 'Each interview displayed as an attractive card with cover image, metadata, and quick stats.',
                  features: ['Visual thumbnails', 'Quick actions', 'Status indicators']
                },
                { 
                  icon: '🔍', 
                  title: 'Filter & Search', 
                  desc: 'Find past interviews instantly by role, tech stack, date range, or performance score.',
                  features: ['Advanced filters', 'Search by keyword', 'Saved searches']
                },
                { 
                  icon: '👤', 
                  title: 'Profile & Settings', 
                  desc: 'Manage your account preferences, notification settings, and interview configurations.',
                  features: ['Profile customization', 'Privacy controls', 'Export data']
                },
              ].map(f => (
                <div key={f.title} className="bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/20 hover:scale-105 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="font-bold text-white mb-2 text-lg">{f.title}</div>
                  <div className="text-white/60 text-xs leading-relaxed mb-3">{f.desc}</div>
                  <div className="space-y-1">
                    {f.features.map(feature => (
                      <div key={feature} className="text-white/40 text-xs flex items-center gap-1">
                        <span className="text-blue-400">•</span>{feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#0d0d0d] via-[#1a0533] to-[#2d1b69] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🏗️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Architecture</span></h2>
            <p className="text-white/60 mb-8 text-lg">A clean, scalable full-stack architecture built on Next.js App Router with modern best practices.</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { 
                  layer: 'Frontend', 
                  color: 'border-blue-500/40 bg-blue-500/10', 
                  items: [
                    { name: 'Next.js App Router', desc: 'File-based routing with layouts' },
                    { name: 'React Server Components', desc: 'Server-side rendering optimization' },
                    { name: 'Tailwind CSS UI', desc: 'Utility-first styling system' },
                    { name: 'Shadcn/ui Components', desc: 'Accessible component library' },
                    { name: 'React Hook Form + Zod', desc: 'Type-safe form validation' }
                  ]
                },
                { 
                  layer: 'Backend / API', 
                  color: 'border-purple-500/40 bg-purple-500/10', 
                  items: [
                    { name: 'Next.js API Routes', desc: 'Serverless API endpoints' },
                    { name: 'Server Actions', desc: 'Server-side form handling' },
                    { name: 'Firebase Admin SDK', desc: 'Server-side Firebase operations' },
                    { name: 'Google Gemini AI SDK', desc: 'AI question generation' },
                    { name: '@google/generative-ai', desc: 'Official Google AI library' }
                  ]
                },
                { 
                  layer: 'Infrastructure', 
                  color: 'border-green-500/40 bg-green-500/10', 
                  items: [
                    { name: 'Firebase Auth', desc: 'User authentication system' },
                    { name: 'Firestore Database', desc: 'NoSQL document database' },
                    { name: 'Session Cookies (httpOnly)', desc: 'Secure authentication tokens' },
                    { name: 'Vapi AI Web SDK', desc: 'Voice AI integration' },
                    { name: 'Environment Variables', desc: 'Secure configuration management' }
                  ]
                }
              ].map(col => (
                <div key={col.layer} className={`border ${col.color} rounded-2xl p-5`}>
                  <h3 className="font-bold text-white text-lg mb-4 text-center">{col.layer}</h3>
                  <div className="space-y-3">
                    {col.items.map(item => (
                      <div key={item.name} className="bg-white/5 rounded-lg p-2">
                        <div className="text-white/80 text-sm font-semibold">{item.name}</div>
                        <div className="text-white/50 text-xs">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 11:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">⭐ Key <span className="text-white/80">Features</span></h2>
            <p className="text-white/70 mb-8 text-lg">What makes Prepwise stand out from traditional interview prep platforms and generic practice tools.</p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { 
                  icon: '🎙️', 
                  title: 'Real Voice AI', 
                  desc: 'Not chatbots or text-based practice — actual spoken conversation powered by Vapi AI voice agent technology with natural speech patterns.',
                  highlight: 'Industry-first voice interviews'
                },
                { 
                  icon: '🧠', 
                  title: 'Truly Personalized', 
                  desc: 'Questions generated fresh for every interview based on your exact role, seniority level, and tech stack. No generic question banks.',
                  highlight: 'AI-powered customization'
                },
                { 
                  icon: '📊', 
                  title: 'Interactive Reports', 
                  desc: '15-slide interactive web presentation with detailed scores, visual charts, and actionable feedback. Not just PDFs.',
                  highlight: 'Engaging visual feedback'
                },
                { 
                  icon: '🔒', 
                  title: 'Production-Grade Auth', 
                  desc: 'Firebase session cookies with httpOnly, secure flags, and server-side verification. Enterprise-level security.',
                  highlight: 'Bank-level security'
                },
                { 
                  icon: '⚡', 
                  title: 'Blazing Fast', 
                  desc: 'Next.js 16 with App Router, React Server Components, and optimized API routes for sub-second response times.',
                  highlight: 'Lightning-fast performance'
                },
                { 
                  icon: '📱', 
                  title: 'Fully Responsive', 
                  desc: 'Works beautifully on desktop, tablet, and mobile devices. Interview anywhere, anytime with consistent experience.',
                  highlight: 'Cross-platform compatibility'
                },
              ].map(f => (
                <div key={f.title} className="bg-white/20 border border-white/30 rounded-2xl p-5 hover:bg-white/30 hover:scale-105 transition-all flex gap-4">
                  <div className="text-3xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-bold text-white text-base mb-1">{f.title}</div>
                    <div className="text-white/70 text-xs leading-relaxed mb-2">{f.desc}</div>
                    <div className="text-emerald-200 text-xs font-semibold bg-white/20 px-2 py-1 rounded-full inline-block">{f.highlight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 12:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🎬 Demo <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Flow</span></h2>
            <p className="text-white/60 mb-8 text-lg">A complete end-to-end walkthrough of the user journey from landing to getting actionable feedback.</p>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/20" />
              <div className="space-y-5">
                {[
                  { 
                    step: '01', 
                    action: 'Visit Prepwise', 
                    detail: 'User lands on the homepage and sees their personalized interview dashboard with past history.',
                    time: '~30 seconds'
                  },
                  { 
                    step: '02', 
                    action: 'Sign Up / Sign In', 
                    detail: 'Firebase Auth creates a secure session with httpOnly cookie. New users get onboarding flow.',
                    time: '~2 minutes'
                  },
                  { 
                    step: '03', 
                    action: 'Configure Interview', 
                    detail: 'Choose target role, experience level, tech stack, question type (technical/behavioral), and amount.',
                    time: '~1 minute'
                  },
                  { 
                    step: '04', 
                    action: 'AI Generates Questions', 
                    detail: 'POST /api/vapi/generate → Gemini 2.5 Flash returns 5-10 tailored questions → saved to Firestore.',
                    time: '~3 seconds'
                  },
                  { 
                    step: '05', 
                    action: 'Start Voice Interview', 
                    detail: 'Vapi AI agent reads questions aloud, user answers by speaking naturally. Real-time transcription.',
                    time: '~10-15 minutes'
                  },
                  { 
                    step: '06', 
                    action: 'View Performance Report', 
                    detail: 'Interactive 15-slide report with scores, detailed feedback, strengths, improvements, and action plan.',
                    time: '~5-10 minutes'
                  },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-6 pl-12 relative">
                    <div className="absolute left-3 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">{s.step}</div>
                    <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-lg">{s.action}</span>
                        <span className="text-blue-300 text-xs bg-white/20 px-2 py-1 rounded-full">{s.time}</span>
                      </div>
                      <span className="text-white/60 text-sm">{s.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 13:
        return (
          <div className={`flex flex-col justify-center h-full px-16 bg-gradient-to-br from-[#1a1a2e] via-[#533483] to-[#1a1a2e] ${getSlideAnimation()}`}>
            <h2 className="text-5xl font-black text-white mb-3">🗺️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Roadmap</span></h2>
            <p className="text-white/60 mb-8 text-lg">What's coming next for Prepwise — exciting features and improvements on the horizon.</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { 
                  phase: 'Now ✅', 
                  color: 'border-green-500/40 bg-green-500/10', 
                  items: [
                    { feature: 'AI voice interviews', desc: 'Real-time spoken conversations' },
                    { feature: 'Gemini question generation', desc: 'Personalized interview questions' },
                    { feature: 'Firebase auth & storage', desc: 'Secure user management' },
                    { feature: 'Interactive performance reports', desc: '15-slide detailed feedback' },
                    { feature: 'Interview history dashboard', desc: 'Track progress over time' }
                  ]
                },
                { 
                  phase: 'Coming Soon 🔄', 
                  color: 'border-yellow-500/40 bg-yellow-500/10', 
                  items: [
                    { feature: 'Real-time score during interview', desc: 'Live performance indicators' },
                    { feature: 'Multi-language support', desc: 'Interviews in 10+ languages' },
                    { feature: 'Interview scheduling', desc: 'Calendar integration & reminders' },
                    { feature: 'Company-specific prep packs', desc: 'FAANG, startup, enterprise prep' },
                    { feature: 'Peer comparison stats', desc: 'Anonymous benchmarking' }
                  ]
                },
                { 
                  phase: 'Future 🚀', 
                  color: 'border-purple-500/40 bg-purple-500/10', 
                  items: [
                    { feature: 'Resume analysis & matching', desc: 'AI-powered resume optimization' },
                    { feature: 'Live coding interview mode', desc: 'Technical coding challenges' },
                    { feature: 'Video interview recording', desc: 'Practice with video feedback' },
                    { feature: 'AI career coach chatbot', desc: '24/7 career guidance' },
                    { feature: 'Team / enterprise plans', desc: 'Corporate training solutions' }
                  ]
                },
              ].map(col => (
                <div key={col.phase} className={`border ${col.color} rounded-2xl p-5`}>
                  <h3 className="font-bold text-white text-lg mb-4">{col.phase}</h3>
                  <div className="space-y-3">
                    {col.items.map(item => (
                      <div key={item.feature} className="bg-white/5 rounded-lg p-2">
                        <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
                          <span className="text-white/40">•</span>{item.feature}
                        </div>
                        <div className="text-white/50 text-xs ml-3">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 14:
        return (
          <div className={`flex flex-col items-center justify-center h-full text-center px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] ${getSlideAnimation()}`}>
            <div className="text-8xl mb-6 animate-bounce"></div>
            <h2 className="text-7xl font-black text-white mb-4">
              Thank <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">You!</span>
            </h2>
            <p className="text-2xl text-white/70 mb-8 max-w-2xl">Prepwise — helping developers land their dream jobs, one interview at a time.</p>
            
            <div className="grid grid-cols-3 gap-6 mb-10 w-full max-w-2xl">
              {[
                { icon: '⚡', label: 'Next.js 16', desc: 'Modern React framework' },
                { icon: '🔥', label: 'Firebase', desc: 'Backend as a service' },
                { icon: '🎙️', label: 'Vapi AI', desc: 'Voice AI platform' },
                { icon: '✨', label: 'Gemini AI', desc: 'Google\'s AI model' },
                { icon: '🔷', label: 'TypeScript', desc: 'Type-safe JavaScript' },
                { icon: '🎨', label: 'Tailwind', desc: 'Utility-first CSS' },
              ].map(t => (
                <div key={t.label} className="bg-white/10 border border-white/20 rounded-xl py-4 px-3 text-white/80 hover:bg-white/20 transition-all">
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-sm font-semibold">{t.label}</div>
                  <div className="text-xs text-white/50">{t.desc}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <p className="text-white/60 text-lg mb-4">Ready to ace your next interview?</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-white text-xl font-semibold">Try now:</span>
                <a 
                  href="/" 
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🚀 Start Your Interview
                </a>
              </div>
            </div>

            <p className="text-white/40 text-sm">Built with ❤️ using modern web technologies</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 text-white">
            <h2 className="text-5xl font-black mb-8">Slide {slideIndex + 1}</h2>
            <p className="text-xl">Content for slide {slideIndex + 1}</p>
            <p className="text-white/60 mt-4">More detailed content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-40">
      <ElectronCursor />
      <div className="w-full h-full overflow-hidden">
        {renderSlide(current)}
      </div>
      
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 z-50 transition-all duration-300 ${showNavigation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={prev} disabled={current === 0}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6 h-2' : 'bg-white/30 hover:bg-white/60 w-2 h-2'}`} />
          ))}
        </div>

        <button onClick={next} disabled={current === total - 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <span className="ml-2 text-white/60 text-sm font-mono">{current + 1} / {total}</span>
      </div>

      <div className="absolute top-6 left-8 text-white/40 text-sm font-mono z-50">
        Prepwise — Slide {current + 1}
      </div>

      <div className="absolute top-6 right-8 text-white/30 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg z-50">
        ← → to navigate
      </div>
    </div>
  );
}