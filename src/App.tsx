import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  ArrowUpRight, 
  MapPin, 
  Globe, 
  Users, 
  GraduationCap, 
  Handshake, 
  TrendingUp, 
  Phone, 
  Mail, 
  ExternalLink,
  BookOpen,
  Anchor,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Activity,
  Layers,
  Zap,
  Briefcase
} from 'lucide-react';

// --- AUDIO UTILITY ---
const useSound = () => {
  const playSound = useCallback((frequency: number, type: OscillatorType = 'sine', volume = 0.05) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio context might be blocked by certain browsers until user interaction
    }
  }, []);

  const hoverSound = () => playSound(880, 'sine', 0.02);
  const clickSound = () => playSound(440, 'triangle', 0.05);
  const playNetworkSound = () => {
    playSound(220, 'square', 0.01);
    setTimeout(() => playSound(330, 'square', 0.01), 50);
    setTimeout(() => playSound(440, 'square', 0.01), 100);
  };

  return { hoverSound, clickSound, playNetworkSound };
};

// --- COMPONENTS ---

const KineticPulse = ({ delay = 0 }: { delay?: number }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [1, 2], 
      opacity: [1, 0] 
    }}
    transition={{ 
      duration: 2, 
      repeat: Infinity, 
      delay,
      ease: "easeOut" 
    }}
    className="absolute inset-0 border border-brand-gold rounded-full pointer-events-none"
  />
);

const NetworkMap = () => {
  const points = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.4
  })), []);

  return (
    <div className="relative w-full h-[400px] bg-white/[0.02] border border-white/5 overflow-hidden">
       <div className="absolute top-4 left-4 mono-label !text-white/20">Chicago Hub Topology Map v1.2</div>
       {points.map((p, i) => (
         <div 
          key={i} 
          className="absolute w-2 h-2 bg-brand-gold rounded-full" 
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
         >
           <KineticPulse delay={p.delay} />
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
            className="absolute top-4 left-0 whitespace-nowrap text-[8px] font-mono uppercase tracking-widest text-brand-gold"
           >
            Active Node {i + 1}
           </motion.div>
         </div>
       ))}
       <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <motion.path 
            d="M 50 50 L 20 30 M 50 50 L 80 40 M 50 50 L 40 80"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
       </svg>
    </div>
  );
};

const DataModule = ({ label, value, trend, suffix = "" }: { label: string, value: string | number, trend?: string, suffix?: string }) => {
  const { hoverSound } = useSound();
  return (
    <motion.div 
      onMouseEnter={hoverSound}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      className="p-6 border-r border-b border-white/5 space-y-2 group cursor-crosshair"
    >
      <span className="mono-label">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-serif text-brand-gold">{value}{suffix}</span>
        {trend && <span className="text-[10px] text-brand-emerald font-bold tracking-tighter">{trend}</span>}
      </div>
      <div className="w-full h-1 bg-white/5 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          transition={{ duration: 1, ease: "circOut" }}
          className="w-full h-full bg-brand-gold/30"
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const { clickSound, hoverSound, playNetworkSound } = useSound();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.5]);
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen selection:bg-brand-gold/30 selection:text-white bg-brand-charcoal overflow-x-hidden">
      {/* Dynamic Progress Indicator */}
      <motion.div 
        style={{ scaleX: springScroll }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-gold z-[100] origin-left"
      />

      {/* Exclusive Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-6 group cursor-pointer" onMouseEnter={hoverSound}>
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: 0 }}
                whileHover={{ y: -20 }}
                className="block font-serif text-2xl tracking-tighter italic"
              >
                Vachakam Ltd.
              </motion.span>
              <motion.span 
                initial={{ y: 20 }}
                whileHover={{ y: -2 }}
                className="block font-mono text-[10px] uppercase tracking-[0.4em] text-brand-gold"
              >
                Bridge Initiative
              </motion.span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            {['Vision', 'Infrastructure', 'Intelligence', 'Network'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onMouseEnter={hoverSound}
                className="mono-label hover:text-brand-gold transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
          <motion.button 
            onClick={clickSound}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-brand-charcoal font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-colors"
          >
            Executive Access
          </motion.button>
        </div>
      </nav>

      {/* Hero: Information Saturation Layer */}
      <section className="relative h-screen flex items-center justify-center p-8 pt-32 overflow-hidden" id="vision">
        <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
            alt="Corporate Excellence" 
            className="w-full h-full object-cover grayscale opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-charcoal/50" />
        </motion.div>

        <div className="max-w-7xl w-full z-10 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
              onMouseEnter={hoverSound}
            >
              <span className="mono-label text-brand-gold flex items-center gap-2">
                <Zap className="w-3 h-3" /> Collaborative Wealth Hook
              </span>
              <h1 className="text-7xl md:text-[9.5rem] leading-[0.85] font-serif tracking-tighter group cursor-default">
                Educational <br/>
                <motion.span 
                  whileHover={{ skewX: -10, color: "#D4AF37" }}
                  className="inline-block italic text-brand-emerald transition-colors"
                >
                  Continuity
                </motion.span> & <br/>
                <motion.span 
                  whileHover={{ letterSpacing: "0.05em" }}
                  className="inline-block text-luxury transition-all"
                >
                  Dignity.
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-white/40 max-w-2xl leading-relaxed italic"
            >
              Building a Chicago-contexted engine for Indian migrant children. 
              Converting demographic shifts into precision-marketed human capital.
            </motion.p>
          </div>

          {/* Quick Metrics Sidebars */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-px bg-white/5 border border-white/5">
            <DataModule label="Target ROI" value="4.2" trend="+12%" suffix="x" />
            <DataModule label="Migration Velocity" value="840" trend="Active" />
            <DataModule label="Network Nodes" value="12" suffix=" Hubs" />
            <DataModule label="Scalability" value="High" />
          </div>
        </div>

        {/* Floating Decals */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 bottom-1/4 w-96 h-96 border border-white/[0.03] rounded-full pointer-events-none"
        />
      </section>

      {/* Advanced Infrastructure Grid */}
      <section className="py-32 px-8 bg-brand-ink/50" id="infrastructure">
        <div className="max-w-[1800px] mx-auto border border-white/5">
          <div className="grid lg:grid-cols-2 border-b border-white/5">
            <div className="p-16 space-y-8 border-r border-white/5">
              <h2 className="text-5xl font-serif">A Multi-Layered <br/> <span className="italic">Advantage Interface.</span></h2>
              <p className="text-white/50 leading-relaxed max-w-xl">
                The Vachakam Education Bridge operates as a sovereign ecosystem within Chicago, 
                leveraging the 2011 Indian Compulsory Education mandate to fuel academic acceleration 
                in a global context.
              </p>
              <div className="flex gap-4">
                <motion.button 
                  onMouseEnter={hoverSound}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-4 border border-white/10 rounded-full flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest"
                >
                  <Activity className="w-4 h-4 text-brand-gold" /> System Status: Operational
                </motion.button>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-12 border-r border-white/5 space-y-6 flex flex-col justify-between">
                <Globe className="w-12 h-12 text-brand-emerald" />
                <div>
                  <h4 className="font-serif text-2xl mb-2">Pop-up Hubs</h4>
                  <p className="text-sm text-white/40">Bilingual enrollment centers at strategic Vachakam nodes.</p>
                </div>
              </div>
              <div className="p-12 space-y-6 flex flex-col justify-between">
                <Layers className="w-12 h-12 text-brand-gold" />
                <div>
                  <h4 className="font-serif text-2xl mb-2">Learning Pods</h4>
                  <p className="text-sm text-white/40">Curriculum-aligned transition classrooms for rapid stabilization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence: Information Saturation Bento Grid */}
      <section className="py-32 px-8" id="intelligence">
        <div className="max-w-[1800px] mx-auto space-y-32">
          <div className="grid md:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden">
            <div className="md:col-span-2 p-16 space-y-8 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-4">
                <span className="mono-label text-brand-emerald">Strategic Pivot</span>
                <h3 className="text-6xl font-serif italic italic leading-tight uppercase">Economic <br/>Resilience.</h3>
              </div>
              <p className="text-white/40 text-lg leading-relaxed">
                Children arriving in Chicago with interrupted schooling are repositioned not as a disruption, 
                but as high-potential talent for the city’s future workforce.
              </p>
              <div className="pt-8 border-t border-white/5">
                <NetworkMap />
              </div>
            </div>
            <div className="p-10 bg-white group cursor-pointer overflow-hidden relative" onMouseEnter={() => { clickSound(); playNetworkSound(); }}>
               <motion.img 
                whileHover={{ scale: 1.1 }}
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
              />
              <div className="relative z-10 space-y-4">
                <Briefcase className="w-8 h-8 text-brand-emerald" />
                <h4 className="text-brand-charcoal font-serif text-3xl tracking-tighter">Investor Shield</h4>
                <p className="text-brand-charcoal/60 text-sm">Minimizing social gaps through proprietary transition modules.</p>
              </div>
              <div className="absolute bottom-8 right-8">
                <ArrowUpRight className="w-6 h-6 text-brand-charcoal/20 group-hover:text-brand-charcoal transition-colors" />
              </div>
            </div>
            <div className="p-10 border-l border-white/5 space-y-6 glass flex flex-col justify-between">
              <div>
                <TrendingUp className="w-8 h-8 text-brand-gold mb-8" />
                <h4 className="font-serif text-3xl">Decade Scaling</h4>
              </div>
              <div className="space-y-4 pt-12">
                {[
                  { yr: "1", text: "MOUs & Partnerships", val: "15%" },
                  { yr: "3", text: "Pilot Reliability", val: "45%" },
                  { yr: "5", text: "12+ Distributed Hubs", val: "80%" },
                  { yr: "10", text: "Institutional Legacy", val: "100%" }
                ].map((row, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="mono-label">Year {row.yr}</span>
                      <span className="text-[10px] italic text-white/40">{row.text}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: row.val }}
                        className="absolute inset-y-0 left-0 bg-brand-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Value Protocol: Wealth Collaborative */}
      <section className="py-24 px-8 border-y border-white/5 bg-gradient-to-b from-brand-charcoal to-brand-ink">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          {[
            { tag: "Sponsors/Advertisers", title: "Media Anchor", text: "Leverage Vachakam's status as a pre-eminent community voice to anchor your brand in Chicago's rising Malayali demographic." },
            { tag: "Investors", title: "Human Capital ROI", text: "Underwrite the bridge that converts migration disruption into a structured, high-attainment talent pipeline." },
            { tag: "Network Builders", title: "Civic Integration", text: "Partner with city agencies and CPS to streamline the future of migrant educational rights." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-12 glass space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="mono-label !text-brand-gold">{item.tag}</span>
                <h4 className="text-3xl font-serif italic">{item.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed font-sans">{item.text}</p>
              </div>
              <motion.button 
                onMouseEnter={hoverSound}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold hover:text-white transition-colors"
              >
                Request Prospectus <ArrowUpRight className="w-3 h-3" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Advanced Contact & Collaborative Interface */}
      <section className="py-40 bg-white" id="network">
        <div className="max-w-[1800px] mx-auto px-8 grid lg:grid-cols-2 gap-32 items-center text-brand-ink">
          <div className="space-y-12">
            <h2 className="text-8xl font-serif tracking-tighter leading-[0.85]">
              Let us <span className="text-luxury">build the network</span> together.
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer" onMouseEnter={hoverSound}>
                <div className="w-16 h-16 bg-brand-charcoal text-white flex items-center justify-center rounded-full group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="mono-label !text-brand-charcoal/40">Direct Access Line</span>
                  <p className="text-4xl font-serif tracking-tighter select-all">773-888-2242</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer" onMouseEnter={hoverSound}>
                <div className="w-16 h-16 bg-brand-charcoal text-white flex items-center justify-center rounded-full group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="mono-label !text-brand-charcoal/40">Digital Inquiries</span>
                  <p className="text-2xl font-mono tracking-tighter select-all">01@bteampaire.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-16 border-[1px] border-brand-ink/10 space-y-8 shadow-2xl relative"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-gold rounded-full flex items-center justify-center rotate-12">
              <span className="text-brand-charcoal font-mono text-[10px] font-bold text-center leading-tight tracking-widest px-4">NETWORK BUILDER ALPHA</span>
            </div>
            <h3 className="text-4xl font-serif italic text-brand-emerald">Request Collaborative Protocol</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="mono-label !text-brand-charcoal/60">Entity Type</label>
                <select className="w-full border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold bg-transparent">
                  <option>Sponsor</option>
                  <option>Investor</option>
                  <option>Network Partner</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="mono-label !text-brand-charcoal/60">Interest Tier</label>
                <select className="w-full border-b border-brand-charcoal/10 py-3 outline-none focus:border-brand-gold bg-transparent">
                  <option>Founding Partner</option>
                  <option>Strategic Ally</option>
                  <option>Media Client</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="mono-label !text-brand-charcoal/60">Your Vision Statement</label>
              <textarea placeholder="How will we lead the South Asian Bridge together?" className="w-full border-b border-brand-charcoal/10 py-3 h-32 outline-none focus:border-brand-gold bg-transparent resize-none" />
            </div>
            <motion.button 
              whileHover={{ x: 10 }}
              onMouseEnter={hoverSound}
              onClick={clickSound}
              className="w-full bg-brand-charcoal text-white py-6 flex items-center justify-center gap-4 group"
            >
              <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase">Initialize Connection</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Global Saturation Footer */}
      <footer className="bg-brand-charcoal px-8 py-32 border-t border-white/5">
        <div className="max-w-[1800px] mx-auto grid lg:grid-cols-12 gap-24">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif">Vachakam Ltd.</h2>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-wider">
                Converting Malayalam community media into a bridge for educational continuity and cultural dignity for Indian migrant children in Chicago.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="https://vachakam.com" className="p-3 border border-white/10 hover:border-brand-gold transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="https://bteampaire.com" className="p-3 border border-white/10 hover:border-brand-gold transition-colors"><Maximize2 className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-8">
              <span className="mono-label">Engagement Nodes</span>
              <ul className="space-y-4 text-xs tracking-widest uppercase text-white/40">
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Temple Hubs</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Grocery Distribution</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Library Micro-Pods</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Community Feeder CPS</li>
              </ul>
            </div>
            <div className="space-y-8">
              <span className="mono-label">Resource Protocol</span>
              <ul className="space-y-4 text-xs tracking-widest uppercase text-white/40">
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Enrollment Rights API</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Malayalam Curricula</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">Scholarship Microgrants</li>
                <li className="hover:text-brand-gold cursor-pointer transition-colors">CPS Integration Docs</li>
              </ul>
            </div>
            <div className="space-y-8">
              <span className="mono-label">Identity Anchor</span>
              <div className="p-6 bg-white/5 border border-white/10">
                <p className="text-[10px] leading-relaxed uppercase text-brand-gold opacity-80 tracking-widest">
                  "Migration becomes an educational advantage rather than a disruption."
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1800px] mx-auto pt-40 mt-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">
          <p>© 2026 Vachakam Ltd. All Metrics Simulated for Strategic Vision.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Sovereignty Policy</a>
            <a href="#" className="hover:text-white transition-colors">Protocol Access</a>
            <a href="#" className="hover:text-white transition-colors">Civic Integrity</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
