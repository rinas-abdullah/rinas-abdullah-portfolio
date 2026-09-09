import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Cpu,
  Palette,
  Code2,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Terminal,
  Database,
  Layers,
  Globe,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Heart,
  Award,
  Zap,
  Activity,
  User,
  Send,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Play,
  CheckCircle2,
  ArrowUpRight,
  Footprints,
  Thermometer,
  Gem,
} from 'lucide-react';
import { translations } from './translations';
import portraitImg from './assets/portrait.webp';

// --- Context & Hooks ---
type Language = 'en' | 'ar';
type Translations = typeof translations['en'];
interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
};

const useTypewriter = (words: string[], speed = 80, delay = 2500) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), delay);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed, delay]);

  return words[index].substring(0, subIndex);
};

// --- UI Primitives ---

const Tag = ({ children }: { children: React.ReactNode; color?: "indigo" | "violet" | "emerald" | "rose" | "amber" }) => {
  return (
    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
      {children}
    </span>
  );
};

// --- Background (light, airy) ---

const BackgroundEffects = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-dot-grid opacity-100" />
    <div className="absolute top-[-20%] right-[-10%] w-[60rem] h-[60rem] rounded-full bg-cyan-500/10 blur-[160px] animate-float-slow" />
    <div className="absolute bottom-[-10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-violet-500/10 blur-[140px] animate-float-slow-alt" />
  </div>
);

// --- Custom Cursor ---

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = !window.matchMedia('(hover: hover)').matches || window.innerWidth < 768;
    setEnabled(!isMobile);
    if (!isMobile) document.body.classList.add('has-custom-cursor');
    return () => document.body.classList.remove('has-custom-cursor');
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHovered(!!t.closest('a') || !!t.closest('button') || !!t.closest('[role="button"]') || !!t.closest('input') || !!t.closest('textarea'));
    };
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`${hovered ? 'cursor-hover' : ''} ${pressed ? 'cursor-active' : ''}`}>
      <div className="custom-cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }} />
      <div className="custom-cursor-inner" style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    </div>
  );
};

// --- Navbar ---

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.volunteer, href: '#volunteer' },
    { name: t.nav.certs, href: '#certifications' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl py-3 border-b border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)] group-hover:bg-cyan-400 transition-colors">
            <span className="text-white font-heading font-black text-sm">R</span>
          </div>
          <span className="text-sm font-heading font-bold text-white tracking-tight hidden sm:block">
            {lang === 'en' ? 'Rinas Abdullah' : 'ريناس عبدالله'}
          </span>
        </motion.a>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe size={12} className="text-slate-500 animate-spin-slow" />
            <span>{lang === 'en' ? 'عربي' : 'English'}</span>
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] text-[10px] font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <Globe size={10} className="text-slate-500" />
            <span>{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? (lang === 'en' ? 'Close menu' : 'إغلاق القائمة') : (lang === 'en' ? 'Open menu' : 'فتح القائمة')}
            className="text-white hover:text-cyan-400 transition-colors p-1"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white/[0.04] border-t border-white/10 px-6 py-4"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 border-b border-white/5 last:border-0 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Terminal Console (dark — intentionally contrasts with light page) ---

const TerminalConsole = () => {
  const { lang, t } = useLang();
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [hackingActive, setHackingActive] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLogs(t.terminal.welcome); }, [lang]);
  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    if (!cleanCmd) return;
    const prefix = lang === 'en' ? `guest@rinas:~$ ` : `زائر@ريناس:~$ `;
    const newLogs = [...logs, `${prefix}${inputVal}`];
    setInputVal('');

    if (cleanCmd === 'help' || cleanCmd === 'مساعدة') setLogs([...newLogs, ...t.terminal.helpResult]);
    else if (cleanCmd === 'about' || cleanCmd === 'نبذة') setLogs([...newLogs, ...t.terminal.aboutResult]);
    else if (cleanCmd === 'skills' || cleanCmd === 'مهارات') setLogs([...newLogs, ...t.terminal.skillsResult]);
    else if (cleanCmd === 'projects' || cleanCmd === 'مشاريع') setLogs([...newLogs, ...t.terminal.projectsResult]);
    else if (cleanCmd === 'contact' || cleanCmd === 'تواصل') setLogs([...newLogs, ...t.terminal.contactResult]);
    else if (cleanCmd === 'clear' || cleanCmd === 'مسح') setLogs([]);
    else if (cleanCmd === 'download_cv' || cleanCmd === 'سيرة') { setLogs([...newLogs, ...t.terminal.cvResult]); window.open('https://github.com/rinas-abdullah', '_blank'); }
    else if (cleanCmd === 'hack' || cleanCmd === 'اختراق') {
      setHackingActive(true);
      setLogs([...newLogs, ...t.terminal.hackWarning]);
      setTimeout(() => setHackingActive(false), 5000);
    } else {
      setLogs([...newLogs, t.terminal.cmdNotFound]);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-900 bg-[#0d1117] shadow-2xl">
      {hackingActive && (
        <div className="absolute inset-0 bg-red-950/30 pointer-events-none animate-pulse z-20 flex items-center justify-center border border-red-500/40 rounded-xl">
          <div className="text-red-400 font-mono font-bold text-xs tracking-widest uppercase">
            {lang === 'en' ? 'INTRUSION DETECTED / ACTIVE DEFENSE' : 'نشاط مشبوه / الحماية مشغلة'}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#161b22]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
            <Terminal size={10} />
            {lang === 'en' ? 'guest — rinas-portfolio' : 'زائر — لوحة-ريناس'}
          </span>
        </div>
      </div>

      <div className="p-5 h-60 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 select-text">
        {logs.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {log.startsWith('guest@') || log.startsWith('زائر@') ? (
              <span className="text-emerald-400 font-semibold">{log}</span>
            ) : log.includes('[WARNING]') || log.includes('[تحذير]') ? (
              <span className="text-amber-400">{log}</span>
            ) : log.includes('[OK]') || log.includes('[موافق]') ? (
              <span className="text-emerald-400">{log}</span>
            ) : (
              <span className="text-slate-400">{log}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3 bg-[#0d1117]">
        <span className="terminal-input-prefix">
          {lang === 'en' ? 'guest@rinas:~$' : 'زائر@ريناس:~$'}
        </span>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.terminal.placeholder}
            className="w-full bg-transparent outline-none border-none text-slate-200 font-mono text-[11px] placeholder-slate-700"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {inputVal === '' && <span className="terminal-cursor" />}
        </div>
      </form>
    </div>
  );
};

// --- Project Simulators ---

const CyberMindSimulator = () => {
  const { lang, t } = useLang();
  const [selectedAttack, setSelectedAttack] = useState<'phishing' | 'ransomware' | 'sqli'>('phishing');
  const [simulating, setSimulating] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setOutputLogs([]);
    const logPool = selectedAttack === 'phishing' ? t.simulators.cybermind.phishingLog : selectedAttack === 'ransomware' ? t.simulators.cybermind.ransomwareLog : t.simulators.cybermind.sqliLog;
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < logPool.length) { setOutputLogs(prev => [...prev, logPool[idx]]); idx++; }
      else { clearInterval(iv); setSimulating(false); }
    }, 900);
  };

  return (
    <div className="glow-card-container bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="glow-card-border" />
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
          <Shield size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{t.simulators.cybermind.title}</h4>
          <p className="text-[11px] text-slate-500">{t.simulators.cybermind.desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
            {t.simulators.cybermind.selectAttack}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['phishing', 'ransomware', 'sqli'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedAttack(id)}
                disabled={simulating}
                className={`px-2.5 py-2 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                  selectedAttack === id
                    ? 'bg-cyan-500 border-blue-600 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)]'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-300'
                }`}
              >
                {id === 'phishing' ? t.simulators.cybermind.phishing : id === 'ransomware' ? t.simulators.cybermind.ransomware : t.simulators.cybermind.sqli}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/[0.08] disabled:text-slate-400 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          {simulating ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
          {simulating ? t.simulators.cybermind.btnSimulating : t.simulators.cybermind.btnSimulate}
        </button>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {t.simulators.cybermind.outputTitle}
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] font-mono text-[10px] h-36 overflow-y-auto leading-relaxed space-y-1.5">
            {outputLogs.length === 0 ? (
              <span className="text-slate-400 italic block text-center pt-10">
                {lang === 'en' ? '// Simulator idle. Select attack vector above.' : '// النظام خامل. اختر نوع الهجوم.'}
              </span>
            ) : outputLogs.map((log, i) => (
              <div key={i}>
                {log.startsWith('[INJECT]') || log.startsWith('[حقن]') ? <span className="text-red-400">{log}</span>
                  : log.startsWith('[DETECTION]') || log.startsWith('[رصد]') ? <span className="text-amber-400">{log}</span>
                  : log.startsWith('[MITIGATION]') || log.startsWith('[عزل]') ? <span className="text-emerald-400">{log}</span>
                  : <span className="text-slate-400">{log}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MUEEN_SECTORS = [
  { id: 1, name: { en: 'Muzdalifah Bridge', ar: 'جسر مزدلفة' }, initialCount: 20 },
  { id: 2, name: { en: 'Arafat Gate 3', ar: 'بوابة عرفات ٣' }, initialCount: 45 },
  { id: 3, name: { en: 'Mina Corridor C', ar: 'ممر منى ج' }, initialCount: 15 },
  { id: 4, name: { en: 'Jamarat Tunnel 2', ar: 'نفق الجمرات ٢' }, initialCount: 85 },
  { id: 5, name: { en: 'Al-Haram Piazza', ar: 'ساحة الحرم' }, initialCount: 60 },
  { id: 6, name: { en: 'Station 4 Plaza', ar: 'ساحة المحطة ٤' }, initialCount: 30 },
] as const;

const MueenSimulator = () => {
  const { lang, t } = useLang();
  const [counts, setCounts] = useState<Record<number, number>>(
    () => Object.fromEntries(MUEEN_SECTORS.map(s => [s.id, s.initialCount]))
  );
  const sectors = MUEEN_SECTORS.map(s => ({ id: s.id, name: s.name[lang], count: counts[s.id] }));

  const handleSectorClick = (id: number) => {
    setCounts(prev => {
      const current = prev[id];
      const next = current === 20 ? 55 : current === 55 ? 95 : 15;
      return { ...prev, [id]: next };
    });
  };

  const avg = Math.round(sectors.reduce((a, c) => a + c.count, 0) / sectors.length);
  const alertState = sectors.some(s => s.count > 80) ? 'danger' : avg > 50 ? 'warning' : 'normal';

  return (
    <div className="glow-card-container bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="glow-card-border" />
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Cpu size={18} /></div>
        <div>
          <h4 className="text-sm font-bold text-white">{t.simulators.mueen.title}</h4>
          <p className="text-[11px] text-slate-500">{t.simulators.mueen.desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t.simulators.mueen.densityLevel}</span>
            <div className="text-2xl font-black text-white">{avg}%</div>
            <div className="mt-2 h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500/100 transition-all duration-500 rounded-full" style={{ width: `${avg}%` }} />
            </div>
          </div>
          <div className={`p-4 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
            alertState === 'danger' ? 'bg-red-50 border-red-200' : alertState === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t.simulators.mueen.alertState}</span>
            <div className={`text-xs font-bold uppercase flex items-center gap-1.5 ${
              alertState === 'danger' ? 'text-red-600' : alertState === 'warning' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {alertState === 'danger' && <AlertTriangle size={12} />}
              {alertState === 'danger' ? t.simulators.mueen.statusDanger : alertState === 'warning' ? t.simulators.mueen.statusWarning : t.simulators.mueen.statusNormal}
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
            {t.simulators.mueen.instructions}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sectors.map((sec) => {
              const status = sec.count > 80 ? 'danger' : sec.count > 50 ? 'warning' : 'normal';
              return (
                <div
                  key={sec.id}
                  onClick={() => handleSectorClick(sec.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between h-20 ${
                    status === 'danger' ? 'bg-red-50 border-red-200 hover:border-red-400'
                      : status === 'warning' ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                      : 'bg-white/[0.02] border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[8px] font-semibold uppercase">
                    <span className={status === 'danger' ? 'text-red-500' : status === 'warning' ? 'text-amber-500' : 'text-cyan-400'}>
                      {t.simulators.mueen.sectorLabel} 0{sec.id}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'danger' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div className="text-[10px] font-bold text-white truncate">{sec.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 rounded-full ${status === 'danger' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-cyan-500/100'}`} style={{ width: `${sec.count}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{sec.count}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DitharSimulator = () => {
  const { lang, t } = useLang();
  const [plantarTemp, setPlantarTemp] = useState(33.0);
  const [pressureLoad, setPressureLoad] = useState(60);

  useEffect(() => {
    setPressureLoad(Math.round(60 + (plantarTemp - 30) * 14 + Math.random() * 8));
  }, [plantarTemp]);

  const isEmergency = plantarTemp >= 37.5 || pressureLoad >= 190;
  const isWarning = !isEmergency && (plantarTemp >= 35.0 || pressureLoad >= 140);

  return (
    <div className="glow-card-container bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="glow-card-border" />
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Footprints size={18} /></div>
        <div>
          <h4 className="text-sm font-bold text-white">{t.simulators.dithar.title}</h4>
          <p className="text-[11px] text-slate-500">{t.simulators.dithar.desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl border transition-all ${
          isEmergency ? 'bg-red-50 border-red-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.simulators.dithar.heatstrokeRisk}</span>
          </div>
          <div className={`text-xs font-semibold ${isEmergency ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isEmergency ? t.simulators.dithar.dangerStatus : isWarning ? t.simulators.dithar.warningStatus : t.simulators.dithar.safeStatus}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span>{t.simulators.dithar.tempLabel}</span>
              <span className="text-white font-black">{plantarTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range" min="30.0" max="40.0" step="0.1" value={plantarTemp}
              onChange={(e) => setPlantarTemp(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase block">{t.simulators.dithar.heartLabel}</span>
                <span className="text-lg font-black text-white block mt-0.5">{pressureLoad} <span className="text-xs font-semibold text-slate-400">kPa</span></span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: isEmergency ? 0.4 : isWarning ? 0.6 : 0.9, ease: "easeInOut" }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isEmergency ? 'bg-red-100 text-red-500' : isWarning ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-500'}`}
              >
                <Activity size={15} />
              </motion.div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase block">{lang === 'en' ? 'Temp' : 'الحرارة'}</span>
                <span className="text-lg font-black text-white block mt-0.5">{plantarTemp.toFixed(1)}<span className="text-xs font-semibold text-slate-400">°C</span></span>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isEmergency ? 'bg-red-100 text-red-500' : isWarning ? 'bg-amber-100 text-amber-500' : 'bg-cyan-500/15 text-cyan-400'}`}>
                <Thermometer size={15} className={isEmergency ? 'animate-pulse' : ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LAVIE_PRODUCTS = [
  { id: 1, name: { en: 'Royal Blue Zircon Ring', ar: 'خاتم زيركون أزرق ملكي' }, price: 152, badge: 'new' },
  { id: 2, name: { en: 'Royal Yellow Zircon Ring', ar: 'خاتم زيركون أصفر ملكي' }, price: 156, badge: 'soldout' },
  { id: 3, name: { en: 'Elegant Solitaire Ring', ar: 'خاتم سوليتير الأنيق' }, price: 129, badge: 'new' },
] as const;

const LaVieSimulator = () => {
  const { lang, t } = useLang();
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  return (
    <div className="glow-card-container bg-white/[0.04] border border-white/10 rounded-2xl p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="glow-card-border" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Gem size={18} /></div>
          <div>
            <h4 className="text-sm font-bold text-white">{t.simulators.lavieahd.title}</h4>
            <p className="text-[11px] text-slate-500">{t.simulators.lavieahd.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
          <Heart size={12} className="text-cyan-400" fill={wishlist.length > 0 ? 'currentColor' : 'none'} />
          <span className="text-[11px] font-bold text-cyan-300">{t.simulators.lavieahd.wishlistLabel} ({wishlist.length})</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {LAVIE_PRODUCTS.map((product) => {
          const saved = wishlist.includes(product.id);
          const soldOut = product.badge === 'soldout';
          return (
            <div key={product.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${soldOut ? 'bg-white/[0.08] text-slate-500' : 'bg-cyan-500/15 text-cyan-300'}`}>
                  {soldOut ? t.simulators.lavieahd.outOfStockBadge : t.simulators.lavieahd.newBadge}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={t.simulators.lavieahd.saveLabel}
                  className="cursor-pointer"
                >
                  <Heart size={14} className={saved ? 'text-cyan-400' : 'text-slate-300'} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500/20 to-slate-900/60 flex items-center justify-center">
                <Gem size={22} className="text-cyan-300" />
              </div>
              <div className="text-[10px] font-semibold text-slate-100 leading-snug">{product.name[lang]}</div>
              <div className="text-[11px] font-black text-white">
                {product.price} {lang === 'en' ? 'SAR' : 'ر.س'}
              </div>
              <div className="text-[9px] font-semibold text-cyan-400">
                {saved ? t.simulators.lavieahd.savedLabel : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Scroll Storytelling ---

const Reveal = ({
  children,
  delay = 0,
  className = '',
  y = 32,
  x = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  x?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) => {
  const { lang } = useLang();
  return (
    <Reveal className="mb-14">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-mono font-semibold text-cyan-400 tracking-wider">{number}</span>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 32 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="h-px bg-cyan-500/25"
        />
      </div>
      <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-[15px] max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
};

// --- Hero ---

const Hero = () => {
  const { t, lang } = useLang();
  const typedTitle = useTypewriter(t.hero.titles, 80, 2500);
  const nameParts = t.hero.name.split(' ');
  const nameLine1 = nameParts[0];
  const nameLine2 = nameParts.slice(1).join(' ') || nameParts[0];

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-28 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/100 animate-pulse" />
          {lang === 'en' ? 'Available for opportunities' : 'متاحة للفرص'}
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-3 items-center">

          {/* Bio + CTA + stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <div className="flex items-center gap-1.5 h-8">
              <span className="text-lg md:text-xl font-mono font-semibold text-cyan-400">
                {typedTitle}
              </span>
              <span className="hero-cursor" />
            </div>

            <p className="text-[15px] text-slate-400 leading-relaxed max-w-sm">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.03)] cursor-pointer"
              >
                {t.hero.cta_projects}
                <ArrowUpRight size={14} />
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] text-slate-200 font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                {t.hero.cta_contact}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {[
                { val: "100%", label: lang === 'en' ? 'Uptime' : 'توفر' },
                { val: "5.00/4.96", label: lang === 'en' ? 'KAU GPA' : 'GPA' },
              ].map((stat, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="text-sm font-black text-white">{stat.val}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Portrait with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="order-1 lg:order-2 relative flex justify-center items-center"
          >
            <div
              className="absolute h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle at 35% 30%, rgba(34,211,238,0.55), rgba(139,92,246,0.35) 55%, transparent 75%)' }}
            />
            <img
              src={portraitImg}
              alt={t.hero.name}
              className="relative z-10 w-[220px] sm:w-[280px] lg:w-[320px] h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            />
          </motion.div>

          {/* Giant name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-3 text-center lg:text-left"
          >
            <h1 className="font-heading font-black text-white leading-[0.9] tracking-tighter text-5xl sm:text-6xl lg:text-7xl">
              {nameLine1}
              <br />
              {nameLine2}
            </h1>
          </motion.div>
        </div>

        {/* Socials + location */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <a href="https://www.linkedin.com/in/rinas-abdullah" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/rinas-abdullah" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
              <Github size={18} />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-400 hover:text-cyan-400 transition-colors">
              <Mail size={18} />
            </a>
          </div>
          <div className="text-sm font-medium text-slate-400">{t.hero.location}</div>
        </motion.div>

      </div>
    </section>
  );
};

// --- Security Terminal Section ---

const SecurityTerminalSection = () => {
  const { lang } = useLang();
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal className="mb-10 text-center">
          <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
            {lang === 'en' ? '// Interactive Access' : '// وصول تفاعلي'}
          </span>
          <h3 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
            {lang === 'en' ? 'Security Terminal' : 'الطرفية الأمنية'}
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            {lang === 'en' ? 'Run real commands to explore this profile.' : 'نفّذي أوامر حقيقية لاستكشاف هذا الملف.'}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <TerminalConsole />
        </Reveal>
      </div>
    </section>
  );
};

// --- About ---

const About = () => {
  const { t, lang } = useLang();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="01." title={t.nav.about} />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal x={-28} y={0} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><User size={18} /></div>
              <h3 className="text-lg font-bold text-white">{t.about.title}</h3>
            </div>
            <div className="space-y-4 text-[15px] text-slate-400 leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {t.about.interests.map((interest: string) => (
                <span key={interest} className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-400 text-[11px] font-medium border border-white/10 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors">
                  {interest}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 items-start">
            {[
              { icon: <Shield size={24} />, label: lang === 'en' ? "Security & GRC" : "الأمن والحوكمة", desc: lang === 'en' ? "Vulnerability audit & standards" : "تدقيق الثغرات والمعايير" },
              { icon: <Cpu size={24} />, label: lang === 'en' ? "AI Systems" : "نظم الذكاء الاصطناعي", desc: lang === 'en' ? "Adaptive learning & analytics" : "التعلم التكيفي والتحليلات" },
              { icon: <Palette size={24} />, label: lang === 'en' ? "Creative UX/UI" : "UX/UI الإبداعي", desc: lang === 'en' ? "Interactive mockups & code" : "نماذج تفاعلية وكود" },
              { icon: <Code2 size={24} />, label: lang === 'en' ? "System Architect" : "مهندسة أنظمة", desc: lang === 'en' ? "Secure fullstack codebases" : "أنظمة متكاملة وآمنة" }
            ].map((card, i) => {
              const accent = i % 2 === 0 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30/60' : 'bg-white/[0.06] text-slate-200 border-white/10';
              return (
                <Reveal key={i} delay={i * 0.1} className={i % 2 === 1 ? 'sm:mt-8' : ''}>
                  <div
                    onMouseMove={handleMouseMove}
                    className="glow-card-container p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] card-lift group"
                  >
                    <div className="glow-card-border" />
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${accent}`}>
                      {card.icon}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{card.label}</h4>
                    <p className="text-[12px] text-slate-500">{card.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Skills ---

const Skills = () => {
  const { t } = useLang();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const skillGroups = [
    { title: t.skills.cyber.title, items: t.skills.cyber.items, icon: <Shield size={16} /> },
    { title: t.skills.ai.title, items: t.skills.ai.items, icon: <Cpu size={16} /> },
    { title: t.skills.systems.title, items: t.skills.systems.items, icon: <Terminal size={16} /> },
    { title: t.skills.dev.title, items: t.skills.dev.items, icon: <Code2 size={16} /> },
    { title: t.skills.design.title, items: t.skills.design.items, icon: <Palette size={16} /> },
    { title: t.skills.data.title, items: t.skills.data.items, icon: <Database size={16} /> }
  ];

  const accents = ['bg-cyan-500/10 text-cyan-400 border-cyan-500/20', 'bg-white/[0.06] text-slate-200 border-white/10'];

  return (
    <section id="skills" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="02." title={t.skills.title} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {skillGroups.map((group, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1} className={i % 3 === 1 ? 'lg:mt-9' : ''}>
              <div
                onMouseMove={handleMouseMove}
                className="glow-card-container p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
              >
                <div className="glow-card-border" />
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`p-1.5 rounded-lg border ${accents[i % 2]}`}>
                    {group.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white">{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-slate-400 text-[11px] font-medium hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Projects ---

const Projects = () => {
  const { t, lang } = useLang();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <SectionHeader number="03." title={t.projects.title} />
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Sliders size={14} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.simulators.sandboxTitle}</div>
              <div className="text-[11px] text-slate-500">{t.simulators.sandboxSubtitle}</div>
            </div>
            <Tag color="indigo">{lang === 'en' ? 'Interactive' : 'تفاعلي'}</Tag>
          </div>
        </div>

        <div className="space-y-28">
          {t.projects.items.map((project: any, i: number) => {
            const isEven = i % 2 === 0;
            return (
            <div key={project.id} className="relative">
              <span
                aria-hidden="true"
                className={`hidden lg:block absolute -top-14 text-9xl font-heading font-black text-white/5 select-none pointer-events-none ${isEven ? 'left-0' : 'right-0'}`}
              >
                0{i + 1}
              </span>

              <Reveal className={`flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8 ${isEven ? '' : 'sm:flex-row-reverse sm:text-right'}`}>
                <div>
                  <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                    {project.tag}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">{project.title}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                    >
                      {t.projects.caseStudy.visit}
                      <ExternalLink size={11} />
                    </a>
                  )}
                  <Tag>{lang === 'en' ? 'Case Study' : 'دراسة حالة'}</Tag>
                </div>
              </Reveal>

              <Reveal delay={0.1} y={40} className="mb-8">
                {project.id === 'cybermind' && <CyberMindSimulator />}
                {project.id === 'mueen' && <MueenSimulator />}
                {project.id === 'dithar' && <DitharSimulator />}
                {project.id === 'lavieahd' && <LaVieSimulator />}
              </Reveal>

              <Reveal delay={0.15}>
                <p className={`text-[16px] text-slate-400 leading-relaxed mb-8 max-w-3xl ${isEven ? '' : 'ms-auto'}`}>{project.description}</p>
              </Reveal>

              <Reveal delay={0.2}>
                <div
                  onMouseMove={handleMouseMove}
                  className="glow-card-container p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                >
                  <div className="glow-card-border" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        {t.projects.caseStudy.problem}
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{project.problem}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        {t.projects.caseStudy.solution}
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{project.solution}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                        {t.projects.caseStudy.tech}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((skill: string) => (
                          <span key={skill} className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 text-[10px] font-medium border border-cyan-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 -m-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 mb-1 block">
                        {t.projects.caseStudy.impact}
                      </span>
                      <p className="text-[12px] text-cyan-100 font-semibold leading-relaxed">{project.impact}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- Experience ---

const Experience = () => {
  const { t, lang } = useLang();

  return (
    <section id="experience" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="04." title={t.experience.title} />

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

          <div className="space-y-10 relative border-l-2 border-white/10 pl-8 ml-2">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 -ml-8 pl-8 border-l-2 border-transparent">
              <Briefcase className="text-cyan-400" size={16} />
              {lang === 'en' ? 'Professional Experience' : 'الخبرة المهنية'}
            </h3>

            {t.experience.jobs.map((job: any, i: number) => (
              <Reveal key={i} x={-20} y={0} className="relative group">
                <div className="absolute -left-[37px] top-1.5 w-3.5 h-3.5 rounded-full bg-white/[0.04] border-2 border-cyan-400 timeline-pulse-node" />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold">{job.date}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{lang === 'en' ? 'Active' : 'نشط'}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">{job.role}</h4>
                    <div className="text-cyan-400 text-sm font-semibold">{job.company}</div>
                  </div>
                  <ul className="space-y-1.5 text-slate-400 text-[13px] leading-relaxed list-disc list-inside pt-1 pl-2">
                    {job.responsibilities.map((resp: string, idx: number) => (
                      <li key={idx} className="group-hover:text-slate-200 transition-colors">{resp}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-[0.04] text-white">
                <GraduationCap size={120} />
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{t.education.title}</h4>
                  <div className="text-cyan-400 text-xs font-semibold">{t.education.university}</div>
                </div>
              </div>

              <div className="text-sm font-bold text-slate-100 leading-snug mb-4">{t.education.degree}</div>

              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                  <div className="text-xl font-black text-white">{t.education.gpa}</div>
                  <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">GPA</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <div className="text-sm font-black text-cyan-100 leading-tight">{t.education.honors}</div>
                  <div className="text-[9px] font-semibold text-cyan-400 uppercase tracking-wider mt-1">{lang === 'en' ? 'Awards' : 'جوائز'}</div>
                </div>
              </div>

              <p className="text-[13px] text-slate-500 leading-relaxed mt-4">{t.education.desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <Globe className="text-cyan-400" size={15} />
                {t.experience.industries.title}
              </h4>
              <div className="space-y-5">
                {t.experience.industries.items.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white">{item.title}</h5>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase tracking-wider border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 transition-colors flex items-center gap-1 shrink-0"
                        >
                          {lang === 'en' ? 'Visit' : 'زيارة'}
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Volunteer ---

const Volunteer = () => {
  const { t } = useLang();

  return (
    <section id="volunteer" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="05." title={t.volunteer.title} />
        <div className="grid sm:grid-cols-2 gap-5">
          {t.volunteer.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] flex items-start gap-4">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Certifications ---

const Certifications = () => {
  const { t } = useLang();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="certifications" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="06." title={t.certs.title} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.certs.items.map((cert: string, i: number) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div
                onMouseMove={handleMouseMove}
                className="glow-card-container p-5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] flex items-start gap-4 card-lift group"
              >
                <div className="glow-card-border" />
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                  <Award size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-semibold text-slate-100 leading-relaxed">{cert}</h4>
                  <div className="mt-2 h-0.5 w-6 bg-cyan-400 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact ---

const CONTACT_EMAIL = "biliilez7200@gmail.com";

const Contact = () => {
  const { t, lang } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [encryptStep, setEncryptStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const encLogs = [
    lang === 'en' ? "Establishing secure connection..." : "إنشاء اتصال آمن...",
    lang === 'en' ? "Encrypting message with AES-256..." : "تشفير الرسالة بـ AES-256...",
    lang === 'en' ? "Binding system telemetry..." : "ربط بيانات النظام...",
    lang === 'en' ? "Transmitting signed payload..." : "إرسال البيانات الموقعة...",
    lang === 'en' ? "Delivered successfully." : "تم الإرسال بنجاح."
  ];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || submitSuccess) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const subject = String(data.get('subject') ?? '');
    const message = String(data.get('message') ?? '');
    const body = `${message}\n\n— ${name} (${email})`;
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setIsSubmitting(true);
    setEncryptStep(0);
    let step = 0;
    const iv = setInterval(() => {
      if (step < encLogs.length - 1) { step++; setEncryptStep(step); }
      else {
        clearInterval(iv);
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitSuccess(true);
          window.location.href = mailtoLink;
          form.reset();
        }, 600);
      }
    }, 600);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader number="07." title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">

          <div className="space-y-5">
            <h3 className="text-base font-bold text-white">{lang === 'en' ? 'Get in touch' : 'تواصل معي'}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "LinkedIn", info: "rinas-abdullah", icon: <Linkedin size={16} />, link: "https://linkedin.com/in/rinas-abdullah" },
                { label: "GitHub", info: "rinas-abdullah", icon: <Github size={16} />, link: "https://github.com/rinas-abdullah" },
                { label: "Email", info: CONTACT_EMAIL, icon: <Mail size={16} />, link: `mailto:${CONTACT_EMAIL}` },
                { label: "Phone", info: "+966502423872", icon: <Zap size={16} />, link: "tel:+966502423872" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] transition-all group"
                >
                  <div className="text-slate-400 group-hover:text-cyan-400 transition-colors mb-2">{item.icon}</div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{item.info}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] relative overflow-hidden">
            {isSubmitting && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin mb-6" />
                <div className="w-full max-w-xs space-y-2.5">
                  {encLogs.slice(0, encryptStep + 1).map((log, i) => (
                    <div key={i} className="text-[12px] text-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-black text-white mb-2">{lang === 'en' ? 'Message sent!' : 'تم إرسال رسالتك!'}</h4>
                <p className="text-[13px] text-slate-500 max-w-xs leading-relaxed mb-5">{t.contact.success}</p>
                <button
                  onClick={() => { setSubmitSuccess(false); setEncryptStep(0); }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Send another' : 'إرسال رسالة أخرى'}
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 block">{t.contact.name}</label>
                  <input
                    required type="text" name="name"
                    placeholder={lang === 'en' ? 'Rinas Abdullah' : 'ريناس عبدالله'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 focus:border-cyan-400 focus:bg-white/[0.06] outline-none text-white text-sm transition-all placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 block">{t.contact.email}</label>
                  <input
                    required type="email" name="email"
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 focus:border-cyan-400 focus:bg-white/[0.06] outline-none text-white text-sm transition-all placeholder-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 block">{t.contact.subject}</label>
                <input
                  required type="text" name="subject"
                  placeholder={lang === 'en' ? 'Security audit or development project' : 'تدقيق أمني أو مشروع تطوير'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 focus:border-cyan-400 focus:bg-white/[0.06] outline-none text-white text-sm transition-all placeholder-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 block">{t.contact.message}</label>
                <textarea
                  required rows={5} name="message"
                  placeholder={lang === 'en' ? 'Tell me about your goals and project needs...' : 'أخبرني عن أهدافك واحتياجات مشروعك...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 focus:border-cyan-400 focus:bg-white/[0.06] outline-none text-white text-sm resize-none transition-all placeholder-slate-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.03)] cursor-pointer"
              >
                <Send size={14} />
                {t.contact.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = () => {
  const { t, lang } = useLang();
  return (
    <footer className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center">
              <span className="text-white font-heading font-black text-base">R</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">{lang === 'en' ? 'Rinas Abdullah' : 'ريناس عبدالله'}</div>
              <div className="text-slate-400 text-xs">
                {lang === 'en' ? 'Cybersecurity · AI · Web' : 'أمن سيبراني · ذكاء اصطناعي · ويب'}
              </div>
            </div>
          </div>

          <p className="text-slate-500 text-sm text-center md:text-left max-w-sm">
            {lang === 'en'
              ? "Building secure, intelligent, and beautifully designed digital systems."
              : "بناء أنظمة رقمية آمنة، ذكية، ومصممة بعناية."}
          </p>

          <div className="flex items-center gap-3">
            {[
              { Icon: Linkedin, link: "https://www.linkedin.com/in/rinas-abdullah" },
              { Icon: Github, link: "https://github.com/rinas-abdullah" },
              { Icon: Mail, link: `mailto:${CONTACT_EMAIL}` }
            ].map(({ Icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-[12px] text-slate-400">
            © {new Date().getFullYear()} Rinas Abdullah. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- App Root ---

const readStoredLang = (): Language => {
  try {
    return (localStorage.getItem('lang') as Language) || 'en';
  } catch {
    return 'en';
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>(readStoredLang);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // storage may be unavailable (private mode, blocked cookies); language still works in-memory
    }
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Rinas Abdullah — Cybersecurity & AI Systems Developer'
      : 'ريناس عبدالله — محللة أمن سيبراني ومطورة نظم ذكاء اصطناعي';
  }, [lang]);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setLoadProgress(Math.round(progress * 100));
      if (progress < 1) requestAnimationFrame(animate);
      else setTimeout(() => setIsLoading(false), 200);
    };
    requestAnimationFrame(animate);
  }, []);

  const value = { lang, setLang, t: translations[lang] };

  return (
    <LanguageContext.Provider value={value}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-heading font-black text-2xl">R</span>
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-heading font-black text-white tracking-tight">
                  {lang === 'en' ? 'Rinas Abdullah' : 'ريناس عبدالله'}
                </h1>
                <p className="text-sm text-slate-400 font-medium">
                  {lang === 'en' ? 'Cybersecurity · AI · Web' : 'أمن سيبراني · ذكاء اصطناعي · ويب'}
                </p>
              </div>
              <div className="w-48">
                <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-75"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen relative font-sans ${lang === 'ar' ? 'rtl' : 'ltr'}`}
          >
            <BackgroundEffects />
            <CustomCursor />
            <Navbar />
            <main>
              <Hero />
              <SecurityTerminalSection />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Volunteer />
              <Certifications />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}
