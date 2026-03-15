import { motion, AnimatePresence } from 'framer-motion';
import LeadForm from './LeadForm';
import {
  PhoneCall, Zap, CalendarCheck, ShieldCheck, CheckCircle,
  Play, ChevronRight, BarChart3, Users, Headphones, Pause
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('buyer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [visibleTranscriptIndex, setVisibleTranscriptIndex] = useState(-1);
  const audioRef = useRef(null);
  const transcriptScrollRef = useRef(null);

  // ROI State
  const [roiLeads, setRoiLeads] = useState(100);
  const [avgHomePrice, setAvgHomePrice] = useState(500000);
  const [commRate, setCommRate] = useState(2.5);
  const [convRate, setConvRate] = useState(2);

  // Derived ROI Math
  const potentialDeals = Math.round(roiLeads * (convRate / 100));
  const monthlyCommission = potentialDeals * avgHomePrice * (commRate / 100);
  const revenueWithAI = monthlyCommission * 2.5; // Assuming 2.5x lift from AI

  // Call Examples Data
  const callExamples = [
    {
      id: 'buyer',
      label: 'Buyer Qualification',
      title: 'Qualifying a Zillow Lead',
      audioUrl: '/audio/Buyer_qualification_demo.mp3',
      duration: '0:24',
      transcript: [
        { speaker: 'AI Agent', text: 'Hi, this is Sarah from the real estate team. I saw you were looking at homes in the area.' },
        { speaker: 'Lead', text: 'Yes, I was browsing listings earlier today.' },
        { speaker: 'AI Agent', text: 'Great! Are you planning to buy within the next 3 months?' },
        { speaker: 'Lead', text: 'Yes, I\'m hoping to move soon.' }
      ]
    },
    {
      id: 'listing',
      label: 'Listing Appointment',
      title: 'Booking a Listing Appt',
      audioUrl: '/audio/Listing_appointment_demo.mp3',
      duration: '0:32',
      transcript: [
        { speaker: 'AI Agent', text: 'Hello! I noticed you checked your home value on our site. Have you considered selling this year?' },
        { speaker: 'Lead', text: 'Maybe, we need to know what we\'d walk away with first.' },
        { speaker: 'AI Agent', text: 'I understand completely. Our listing agent can prepare a net sheet and a custom marketing plan for you.' },
        { speaker: 'Lead', text: 'That sounds good. What\'s the next step?' },
        { speaker: 'AI Agent', text: 'Would you be open to a 10-minute discovery call tomorrow at 4 PM?' },
        { speaker: 'Lead', text: 'Yes, let\'s do it.' }
      ]
    },
    {
      id: 'followup',
      label: 'Cold Lead Follow-Up',
      title: 'Re-engaging a Dead Lead',
      audioUrl: '/audio/Cold_Lead_Follow-up_demo.mp3',
      duration: '0:28',
      transcript: [
        { speaker: 'AI Agent', text: 'Hi John, Realtor AI here following up from last month. Are you still actively looking for a condo downtown?' },
        { speaker: 'Lead', text: 'We paused for the holidays but we are starting to look again now.' },
        { speaker: 'AI Agent', text: 'Great timing! Inventory just picked up. I\'ll have an agent send you a refreshed list today.' },
        { speaker: 'Lead', text: 'Thanks, I\'ll keep an eye out.' }
      ]
    }
  ];

  const activeCall = callExamples.find(ex => ex.id === activeTab) || callExamples[0];

  useEffect(() => {
    // Reset state and stop audio when switching tabs
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioError(false);
    setVisibleTranscriptIndex(-1);
  }, [activeTab]);

  // Handle transcript revealing logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      // Reveal first line immediately if none visible
      if (visibleTranscriptIndex === -1) {
        setVisibleTranscriptIndex(0);
      }

      interval = setInterval(() => {
        setVisibleTranscriptIndex(prev => {
          if (prev < activeCall.transcript.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3000); // 3 seconds delay per line
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeCall.transcript.length, visibleTranscriptIndex]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [visibleTranscriptIndex]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setAudioError(true);
      });
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#4f46e5]/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ec4899]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/30 text-[#a5b4fc] text-sm w-fit font-semibold">
              <Zap size={16} className="text-[#8b5cf6]" /> AI Real Estate Agent 2.0
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Turn Website Visitors Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">Qualified Phone Leads</span> Automatically.
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-[#94a3b8] leading-relaxed max-w-xl">
              Realtor AI calls your leads within seconds, qualifies them, and books appointments 24/7. Stop losing deals to slow follow-up times.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4 mt-4">
              <a href="#lead-form" className="bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] hover:scale-105 transition-transform text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-2">
                Get Instant AI Call <ChevronRight size={20} />
              </a>
              <a href="#demo" className="bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/10 text-[#cbd5e1] px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2">
                <Play size={20} /> Watch Demo
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* 3D Phone Mockup Illustration */}
            <div className="relative w-full max-w-sm mx-auto z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-[#4f46e5]/30 to-transparent blur-2xl rounded-full"></div>
              <div className="glass-panel rounded-[2.5rem] p-4 border-[8px] border-[#0f172a] shadow-2xl relative overflow-hidden bg-[#020617] aspect-[9/19]">

                {/* Minimal App UI */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0f172a] rounded-b-xl z-20"></div>
                <div className="pt-8 h-full flex flex-col">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4f46e5] to-[#ec4899] rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
                      <PhoneCall size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-lg tracking-wide">Realtor AI Calling...</h3>
                    <p className="text-xs text-[#94a3b8]">Speaking with Sarah Jenkins</p>
                  </div>

                  <div className="flex-1 overflow-hidden relative">
                    <div className="absolute bottom-0 w-full space-y-3 pb-8 px-2">
                      <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm text-sm border border-white/5 mr-8 backdrop-blur-md">
                        Hi Sarah! I saw you viewing homes in downtown Austin. Are you looking to move soon?
                      </div>
                      <div className="bg-[#4f46e5]/40 p-3 rounded-2xl rounded-tr-sm text-sm border border-[#4f46e5]/30 ml-8 text-right backdrop-blur-md">
                        Yeah, hoping to find a 2 bedroom condo!
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -left-12 top-20 glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-xl border border-white/10"
              >
                <div className="bg-green-500/20 p-2 rounded-lg"><CalendarCheck size={20} className="text-green-400" /></div>
                <div>
                  <div className="text-xs text-[#94a3b8] font-medium">Auto-Booked</div>
                  <div className="text-sm font-bold">12 Appointments</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -right-8 bottom-32 glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-xl border border-white/10"
              >
                <div className="bg-[#8b5cf6]/20 p-2 rounded-lg"><Zap size={20} className="text-[#a5b4fc]" /></div>
                <div>
                  <div className="text-sm font-bold">Lead Qualified</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEAD CAPTURE SECTION */}
      <section id="lead-form" className="py-24 relative">
        <div className="absolute inset-0 bg-[#0f172a]/50 border-y border-white/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <LeadForm />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Everything You Need to Scale</h2>
            <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">Stop chasing unqualified leads. Let Realtor AI handle the top of your funnel so you can focus on closing deals.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <PhoneCall size={32} className="text-[#4f46e5]" />, title: 'AI Voice Calls', desc: 'Human-like conversational AI that dials leads within 60 seconds of them submitting a form.' },
              { icon: <ShieldCheck size={32} className="text-green-500" />, title: 'Lead Qualification', desc: 'Pre-screens for timeline, budget, and location before booking an appointment.' },
              { icon: <CalendarCheck size={32} className="text-[#ec4899]" />, title: 'Direct Booking', desc: 'Integrates natively with Google Calendar to automatically schedule showings and listings.' },
              { icon: <Zap size={32} className="text-yellow-500" />, title: '24/7 Response Time', desc: 'Never miss an opportunity. Realtor AI works nights, weekends, and holidays to close.' },
              { icon: <Headphones size={32} className="text-[#8b5cf6]" />, title: 'Call Transcripts', desc: 'Listen to call recordings and read full AI-generated summaries in your CRM.' },
              { icon: <BarChart3 size={32} className="text-blue-500" />, title: 'Smart Analytics', desc: 'Track your qualification ratio and pipeline value in real-time on your dashboard.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#4f46e5]/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#94a3b8] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-black text-center mb-24">How Realtor AI Works</h2>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-[#4f46e5]/50 to-transparent"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '01', title: 'Visitor Registers', desc: 'A lead fills out the form on your website or Zillow profile.' },
                { step: '02', title: 'Data Captured', desc: 'Details are instantly routed into your Supabase CRM database.' },
                { step: '03', title: 'AI Makes the Call', desc: 'Within 60 seconds, our AI agent calls to qualify the prospect.' },
                { step: '04', title: 'Agent Notified', desc: 'If qualified, it books an appointment and sends you a Slack ping.' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#020617] border-[3px] border-[#4f46e5] flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_30px_rgba(79,70,229,0.4)] z-10 transition-transform hover:scale-110">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-[#94a3b8] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LISTEN TO REAL CALLS SECTION */}
      <section id="demo" className="py-24 relative">
        <div className="absolute inset-0 bg-[#0f172a]/50 border-y border-white/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl lg:text-5xl font-black mb-6">Listen to Real AI Calls</motion.h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-xl">Hear how Realtor AI qualifies buyers and books appointments automatically.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Demo Tabs */}
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {callExamples.map(example => (
                <button
                  key={example.id}
                  onClick={() => setActiveTab(example.id)}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === example.id ? 'bg-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/30' : 'bg-[#020617] text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/30'}`}
                >
                  {example.label}
                </button>
              ))}
            </div>

            {/* Audio Player Card */}
            <motion.div
              key={activeTab} // Forces re-animation on tab change
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8 lg:p-12 rounded-[2.5rem] border border-white/10 bg-[#0B1120] flex flex-col items-center shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-[#4f46e5]/10 blur-[80px] -z-0"></div>

              {/* HTML5 Audio Element */}
              <audio
                id="demoCallAudio"
                ref={audioRef}
                src={activeCall.audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setAudioError(true)}
              />

              {/* Large Central Play Button */}
              <motion.div
                onClick={toggleAudio}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isPlaying ? {
                  boxShadow: ["0 0 20px rgba(79,70,229,0.4)", "0 0 50px rgba(79,70,229,0.6)", "0 0 20px rgba(79,70,229,0.4)"]
                } : {}}
                className={`w-32 h-32 bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] rounded-full flex flex-col items-center justify-center mb-6 shadow-[0_0_50px_rgba(79,70,229,0.4)] cursor-pointer z-10 relative group ${audioError ? 'grayscale opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isPlaying ? <Pause size={48} fill="white" className="text-white" /> : <Play size={48} fill="white" className="ml-2 text-white" />}

                {/* Pulsing ring when playing */}
                {isPlaying && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border-4 border-[#4f46e5]"
                  />
                )}
              </motion.div>

              {audioError && (
                <div className="text-red-400 font-bold mb-4 z-10 animate-pulse text-sm">
                  Audio demo unavailable.
                </div>
              )}

              <div className="text-center z-10 w-full mb-12">
                <h3 className="text-3xl font-black mb-3">{activeCall.title}</h3>
                <div className="flex items-center justify-center gap-4 text-[#a5b4fc] font-mono text-sm">
                  <span className="px-4 py-1 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/30">Duration: {activeCall.duration}</span>
                  <div className="flex gap-1 h-4 items-center">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={isPlaying ? { height: [4, 16, 4] } : { height: 4 }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1 bg-[#4f46e5] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Polished Waveform Progress */}
              <div className="w-full h-24 mb-12 flex items-center justify-center gap-[3px] px-4 pointer-events-none">
                {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? {
                      height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
                      backgroundColor: ['#4f46e5', '#8b5cf6', '#4f46e5']
                    } : {
                      height: `${10 + (Math.sin(i * 0.2) * 20 + 20)}%`,
                      backgroundColor: '#1e293b'
                    }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.01 }}
                    className="flex-1 rounded-full"
                  />
                ))}
              </div>

              {/* Transcript Section */}
              <div className="w-full z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#94a3b8] text-xs font-bold uppercase tracking-widest">
                    <Headphones size={14} /> Live Transcript
                  </div>
                  {isPlaying && (
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] text-green-500 font-bold uppercase">Syncing...</span>
                    </div>
                  )}
                </div>
                <div
                  ref={transcriptScrollRef}
                  className="bg-[#020617]/50 rounded-3xl p-6 border border-white/5 space-y-4 max-h-96 overflow-y-auto custom-scrollbar backdrop-blur-sm scroll-smooth"
                >
                  <AnimatePresence mode="popLayout">
                    {activeCall.transcript.map((line, idx) => {
                      const isVisible = isPlaying ? idx <= visibleTranscriptIndex : true;
                      if (!isVisible) return null;

                      const isLastVisible = idx === visibleTranscriptIndex && isPlaying;
                      const isAI = line.speaker.includes('AI');

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            borderColor: isLastVisible ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)'
                          }}
                          className={`flex flex-col gap-1 ${isAI ? 'items-start' : 'items-end'}`}
                        >
                          <span className={`text-[10px] font-black tracking-widest uppercase ${isAI ? 'text-[#8b5cf6] ml-2' : 'text-[#94a3b8] mr-2'}`}>
                            {line.speaker}
                          </span>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed border transition-all duration-500 ${isAI
                            ? 'bg-[#4f46e5]/20 border-white/5 rounded-tl-sm text-white shadow-[0_4px_15px_rgba(79,70,229,0.1)]'
                            : 'bg-white/5 border-white/5 rounded-tr-sm text-[#cbd5e1]'
                            } ${isLastVisible ? 'shadow-[0_0_20px_rgba(139,92,246,0.2)]' : ''}`}>
                            {line.text}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[#a5b4fc] font-bold uppercase tracking-widest text-sm mb-4">Simple pricing with one-time setup and monthly AI support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Starter */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-3xl border border-white/5 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-[#94a3b8] mb-6 min-h-[48px]">Perfect for solo real estate agents who want AI to instantly respond to new leads.</p>

              <div className="mb-6">
                <div className="text-lg font-bold text-white mb-1">$300 One-Time Setup</div>
                <div className="text-5xl font-black text-white">$79<span className="text-lg text-[#64748b] font-medium">/month</span></div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>AI Voice Agent Setup</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Lead Qualification Questions</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Instant AI Call to New Leads</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Lead Capture to Google Sheets</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Lead Notifications (Email or WhatsApp)</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Basic Automation Setup</span></li>
              </ul>
              <button className="w-full py-4 rounded-xl border border-[#4f46e5] hover:bg-[#4f46e5]/10 font-bold transition-colors">Start Setup</button>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-panel p-1 border-0 bg-gradient-to-b from-[#4f46e5] to-[#8b5cf6] rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.4)] relative transform md:-translate-y-4 h-[calc(100%+2rem)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] text-white px-4 py-1 rounded-b-xl text-sm font-bold uppercase tracking-wider z-10">Most Popular</div>
              <div className="bg-[#0f172a] p-8 rounded-[1.4rem] h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-2 pt-4">Pro</h3>
                <p className="text-[#94a3b8] mb-6 min-h-[48px]">Designed for agents receiving more leads and needing smarter AI conversations.</p>

                <div className="mb-6">
                  <div className="text-lg font-bold text-[#a5b4fc] mb-1">$800 One-Time Setup</div>
                  <div className="text-5xl font-black text-white">$199<span className="text-lg text-[#64748b] font-medium">/month</span></div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span className="text-white font-semibold">Everything in Starter</span></li>
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span>More AI Calls per Month</span></li>
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span>Advanced Lead Qualification</span></li>
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span>Custom AI Conversation Script</span></li>
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span>Automation Improvements</span></li>
                  <li className="flex gap-3"><CheckCircle size={20} className="text-[#8b5cf6] shrink-0" /> <span>Priority Email Support</span></li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] hover:scale-[1.02] text-white font-bold transition-transform shadow-lg shadow-[#4f46e5]/40">Upgrade to Pro</button>
              </div>
            </motion.div>

            {/* Custom Plan */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-3xl border border-white/5 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Custom Plan</h3>
              <p className="text-[#94a3b8] mb-6 min-h-[48px]">For real estate teams needing a tailored AI solution.</p>

              <div className="mb-6">
                <div className="text-lg font-bold text-white mb-1">Custom Pricing</div>
                <div className="text-5xl font-black text-white">Custom</div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Custom AI Setup</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Higher Call Limits</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Custom Automation Workflows</span></li>
                <li className="flex gap-3"><CheckCircle size={20} className="text-[#4f46e5] shrink-0" /> <span>Dedicated Setup Support</span></li>
              </ul>
              <button className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/5 font-bold transition-colors">Contact Us</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="roi" className="py-24 relative overflow-hidden bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">See How Much Revenue Realtor AI Can Generate</h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-xl">
              Estimate how much additional revenue you could close by using AI to instantly answer and qualify every lead.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel p-1 rounded-3xl border-0 bg-gradient-to-br from-[#4f46e5]/40 to-[#8b5cf6]/40 shadow-[0_0_80px_rgba(79,70,229,0.2)] relative max-w-5xl mx-auto"
          >
            <div className="bg-[#0f172a] rounded-[1.4rem] p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#a5b4fc]">Monthly Leads</label>
                      <span className="text-xl font-bold text-white">{roiLeads}</span>
                    </div>
                    <input
                      type="range" min="10" max="1000" step="10"
                      value={roiLeads} onChange={(e) => setRoiLeads(Number(e.target.value))}
                      className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#a5b4fc]">Average Home Price</label>
                      <span className="text-xl font-bold text-white">${avgHomePrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="100000" max="2000000" step="50000"
                      value={avgHomePrice} onChange={(e) => setAvgHomePrice(Number(e.target.value))}
                      className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-bold uppercase tracking-wider text-[#a5b4fc]">Commission (%)</label>
                        <span className="text-xl font-bold text-white">{commRate}%</span>
                      </div>
                      <input
                        type="range" min="1" max="6" step="0.1"
                        value={commRate} onChange={(e) => setCommRate(Number(e.target.value))}
                        className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-bold uppercase tracking-wider text-[#a5b4fc]">Conv. Rate (%)</label>
                        <span className="text-xl font-bold text-white">{convRate}%</span>
                      </div>
                      <input
                        type="range" min="0.5" max="10" step="0.5"
                        value={convRate} onChange={(e) => setConvRate(Number(e.target.value))}
                        className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-[#1e293b]/50 rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4f46e5]/10 blur-[60px] rounded-full"></div>
                  <div className="space-y-6 relative z-10">
                    <div>
                      <div className="text-sm font-medium text-[#94a3b8] mb-1">Potential Deals Closed</div>
                      <div className="text-3xl font-black text-white">{potentialDeals} <span className="text-sm text-[#64748b]">/mo</span></div>
                    </div>
                    <div className="w-full h-px bg-white/5"></div>
                    <div>
                      <div className="text-sm font-medium text-[#94a3b8] mb-1">Estimated Monthly Commission</div>
                      <div className="text-3xl font-black text-white">${Math.round(monthlyCommission).toLocaleString()}</div>
                    </div>
                    <div className="w-full h-px bg-white/5"></div>
                    <div>
                      <div className="text-sm font-medium text-[#a5b4fc] mb-1 uppercase tracking-loose font-bold">Revenue Generated with Realtor AI</div>
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a5b4fc] drop-shadow-[0_0_15px_rgba(165,180,252,0.3)]">
                        ${Math.round(revenueWithAI).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-[#64748b] pt-4 border-t border-white/5 italic">
                      "Agents using Realtor AI respond instantly and typically convert 2–3x more leads."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#4f46e5]/20 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-[#8b5cf6]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-black mb-6">Never Miss Another Lead Again.</h2>
          <p className="text-xl text-[#94a3b8] mb-10">Join top producing real estate agents who use Realtor AI to dominate their local market.</p>
          <a href="#lead-form" className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Hire Your AI Agent Today <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020617] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                Realtor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">AI</span>
              </div>
              <p className="text-[#94a3b8] max-w-xs">The world's smartest AI voice agent built specifically for the real estate industry.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-[#94a3b8]">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">AI Voices</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-[#94a3b8]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-[#64748b]">
            <p>© 2026 Realtor AI. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
