import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "../components/ThemeProvider";

const ReactLenis = dynamic(() => import('@studio-freight/react-lenis').then(mod => mod.ReactLenis), { ssr: false });
const InteractiveFeatures = dynamic(() => import('../components/InteractiveFeatures'), { ssr: false });

import { 

  ArrowRight, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Zap,
  Activity,
  Box,
  Target,
  Sun,
  Moon
} from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sticky Tab List Scrollytelling engine moved to Client Component to prevent Framer Motion hydration bugs
  // Global scroll for Hero & Parallax
  const { scrollY } = useScroll();
  
  // High-performance direct transforms (No useSpring needed since ReactLenis already smooths scrollY)
  const rotateX = useTransform(scrollY, [0, 600], [25, 0]);
  const scale = useTransform(scrollY, [0, 600], [0.85, 1]);
  const z = useTransform(scrollY, [0, 600], [-300, 0]);
  const opacity = useTransform(scrollY, [0, 400], [0.5, 1]);

  // Smooth transforms with springs to reduce render churn during fast scrolls
  const rotateXS = useSpring(rotateX, { stiffness: 120, damping: 22 });
  const scaleS = useSpring(scale, { stiffness: 140, damping: 26 });
  const zS = useSpring(z, { stiffness: 120, damping: 24 });
  const opacityS = useSpring(opacity, { stiffness: 80, damping: 20 });

  // Floating Background Geometry
  const floatY1 = useTransform(scrollY, [0, 3000], [0, -800]);
  const floatR1 = useTransform(scrollY, [0, 3000], [0, 180]);
  
  const floatY2 = useTransform(scrollY, [0, 3000], [0, -500]);
  const floatR2 = useTransform(scrollY, [0, 3000], [0, -120]);

  const floatY1S = useSpring(floatY1, { stiffness: 80, damping: 28 });
  const floatR1S = useSpring(floatR1, { stiffness: 50, damping: 30 });
  const floatY2S = useSpring(floatY2, { stiffness: 80, damping: 28 });
  const floatR2S = useSpring(floatR2, { stiffness: 50, damping: 30 });

  // Abstract BG gradients
  const parallaxBg1 = useTransform(scrollY, [0, 2000], [0, 400]);
  const parallaxBg2 = useTransform(scrollY, [0, 2000], [0, -300]);

  const parallaxBg1S = useSpring(parallaxBg1, { stiffness: 60, damping: 26 });
  const parallaxBg2S = useSpring(parallaxBg2, { stiffness: 60, damping: 26 });

  const animateProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const statCardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }}
  };

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
      <div className="min-h-screen bg-bg-main text-text-primary selection:bg-indigo-500/30 font-sans overflow-x-hidden relative transition-colors duration-500">
        <Head>
          <title>BudgetWise | Enterprise-Grade Wealth Management</title>
          <meta name="description" content="Personal and enterprise finance dashboard with AI insights." />
        </Head>

        {/* --- DEEP BACKGROUND PARALLAX (Simplified Radial Shape) --- */}
        <motion.div
          style={{ y: parallaxBg1S }}
          className="fixed top-[-10%] left-[-10%] w-[720px] h-[720px] opacity-[0.1] pointer-events-none z-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.24)_0%,rgba(79,70,229,0.00)_70%)] transition-opacity duration-1000"
        />
        <motion.div
          style={{ y: parallaxBg2S }}
          className="fixed bottom-[-10%] right-[-10%] w-[680px] h-[680px] opacity-[0.06] pointer-events-none z-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.24)_0%,rgba(56,189,248,0.00)_70%)] transition-opacity duration-1000"
        />

        {/* --- FLOATING SVG SHAPES --- */}
        {isMounted && (
          <>
            {/* Outline Box */}
            <motion.div style={{ y: floatY1S, rotate: floatR1S }} className="absolute top-[20%] left-[10%] opacity-[0.05] pointer-events-none z-0">
              <Box className="w-64 h-64 text-indigo-400" strokeWidth={0.5} />
            </motion.div>
            
            {/* Outline Wireframe/Target */}
            <motion.div style={{ y: floatY2S, rotate: floatR2S }} className="absolute top-[60%] right-[5%] opacity-[0.05] pointer-events-none z-0">
              <Target className="w-96 h-96 text-purple-400" strokeWidth={0.5} />
            </motion.div>
            
            {/* Abstract Activity wave */}
            <motion.div style={{ y: floatY1S, rotate: floatR2S }} className="absolute top-[120%] left-[20%] opacity-[0.05] pointer-events-none z-0">
              <Activity className="w-72 h-72 text-emerald-400" strokeWidth={0.5} />
            </motion.div>
          </>
        )}

        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-border-subtle bg-bg-main/80 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-primary">BudgetWise</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Platform</a>
              <a href="#security" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Security</a>
              <Link href="/premium" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2.5 bg-bg-surface text-text-secondary hover:text-accent-primary hover:bg-bg-elevated rounded-xl transition-all shadow-sm active:scale-95 group border border-border-subtle/50"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                )}
              </button>
              <Link href="/login" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link 
                href="/login"
                className="group relative px-5 py-2.5 bg-text-primary text-bg-main rounded-full font-bold text-sm overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch App
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="pt-32 pb-20 sm:pt-40 lg:pb-32 lg:pt-48 relative z-10">
          
          {/* --- HERO SECTION --- */}
          <section className="relative max-w-7xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-600 text-xs font-black uppercase tracking-widest mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-black">BudgetWise 2.0 is Live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-text-primary max-w-5xl mx-auto mb-8"
            >
              Financial Command,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-500 dark:from-indigo-400 dark:via-indigo-400 dark:to-indigo-400">
                Engineered for Scale.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
            >
              Stop tracking past expenses and start engineering your future wealth. BudgetWise delivers real-time analytics, predictive modeling, and absolute control.
            </motion.p>
          </section>

          {/* --- 3D SCROLL PERSPECTIVE MOCKUP --- */}
          <section className="relative w-full max-w-6xl mx-auto px-6 mt-16 perspective-[2000px]">
            {isMounted && (
              <motion.div 
                style={{ rotateX: rotateXS, scale: scaleS, z: zS, opacity: opacityS }}
                className="origin-top rounded-[1.5rem] p-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))] shadow-sm mx-auto"
              >
                <div className="rounded-[1.4rem] bg-bg-surface overflow-hidden relative border border-border-subtle">
                  
                  {/* Mockup Title Bar */}
                  <div className="h-10 border-b border-white/5 bg-[#13152180] flex items-center px-5 gap-3">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.3)]"/>
                         <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.3)]"/>
                         <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.3)]"/>
                      </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                      {/* Stat Cards Flow Animation */}
                      <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                      >
                         <motion.div variants={statCardVariant} className="bg-bg-elevated border border-border-subtle rounded-xl p-4">
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Balance</p>
                            <p className="text-xl font-black text-text-primary mt-1">$24,560</p>
                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold mt-1">↑ 12.5%</p>
                         </motion.div>
                         <motion.div variants={statCardVariant} className="bg-bg-elevated border border-border-subtle rounded-xl p-4">
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Income</p>
                            <p className="text-xl font-black text-text-primary mt-1">$8,420</p>
                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold mt-1">↑ 8.1%</p>
                         </motion.div>
                         <motion.div variants={statCardVariant} className="bg-bg-elevated border border-border-subtle rounded-xl p-4">
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Expenses</p>
                            <p className="text-xl font-black text-text-primary mt-1">$3,890</p>
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold mt-1">↓ 4.2%</p>
                         </motion.div>
                         <motion.div variants={statCardVariant} className="bg-bg-elevated border border-border-subtle rounded-xl p-4">
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Savings</p>
                            <p className="text-xl font-black text-text-primary mt-1">32%</p>
                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold mt-1">↑ 2.4%</p>
                         </motion.div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-3"
                      >
                         <div className="lg:col-span-2 h-48 bg-bg-surface border border-border-subtle rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
                           <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                 <pattern id="mock-grid-inner" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-text-secondary/20" strokeWidth="1"/>
                                 </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#mock-grid-inner)" />
                           </svg>
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              {/* Fake shadow stroke for GPU performance */}
                              <path d="M-50,150 C200,40 350,225 650,180 S950,25 1200,50" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="16" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
                              <path d="M-50,150 C200,40 350,225 650,180 S950,25 1200,50" fill="none" stroke="currentColor" className="text-accent-primary" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
                           </svg>
                         </div>
                         <div className="h-48 bg-bg-elevated border border-border-subtle rounded-xl p-5 flex flex-col justify-end">
                            <div className="space-y-3 w-full">
                              <div className="h-2 w-full bg-text-primary/5 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: '66%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-indigo-500 rounded-full"></motion.div></div>
                              <div className="h-2 w-full bg-text-primary/5 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: '50%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-emerald-500 rounded-full"></motion.div></div>
                              <div className="h-2 w-full bg-text-primary/5 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: '33%' }} transition={{ duration: 1, delay: 0.8 }} className="h-full bg-rose-500 rounded-full"></motion.div></div>
                            </div>
                         </div>
                      </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* --- METRICS / SOCIAL PROOF --- */}
          <section className="bg-bg-surface/90 border-y border-border-subtle mt-32 py-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/5 relative z-10">
              {[
                { label: "Assets Tracked", val: "$50M+" },
                { label: "Active Users", val: "10k+" },
                { label: "Uptime", val: "99.9%" },
                { label: "Visual Latency", val: "0ms" }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <h4 className="text-4xl sm:text-5xl font-black text-text-primary">{stat.val}</h4>
                  <p className="text-xs sm:text-sm text-text-secondary font-bold uppercase tracking-widest mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- SCROLLYTELLING STICKY SHOWCASE (Client Side Only) --- */}
          <InteractiveFeatures animateProps={animateProps} />


          {/* --- FINAL CTA --- */}
          <motion.section {...animateProps} className="max-w-4xl mx-auto px-6 mt-32 text-center relative z-20">
            <div className="p-12 sm:p-16 rounded-[3rem] bg-bg-surface border border-border-subtle relative overflow-hidden shadow-lg">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.12)_0%,rgba(79,70,229,0)_55%)] pointer-events-none" />
               <h2 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight mb-6 relative">Ready to engineer your wealth?</h2>
               <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto relative">Join the absolute vanguard of personal finance management. Free forever for individuals.</p>
               <Link 
                  href="/login"
                  className="inline-flex relative items-center gap-2 px-8 py-4 rounded-full bg-text-primary text-bg-main font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all"
               >
                  Enter Dashboard <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </motion.section>

        </main>

        {/* --- FOOTER --- */}
        <footer className="border-t border-border-subtle bg-bg-main py-12 text-center relative z-30 pt-16 mt-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-text-primary">BudgetWise</span>
          </div>
          <p className="text-text-secondary font-medium text-sm">© {new Date().getFullYear()} BudgetWise Inc. Designed globally. Engineered locally.</p>
          <div className="flex justify-center gap-8 mt-8">
            <a href="#" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Status</a>
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
}
