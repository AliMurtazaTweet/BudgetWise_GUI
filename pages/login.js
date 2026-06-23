"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, Github, Mail, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck,
  BarChart3, DollarSign, TrendingDown, Zap
} from "lucide-react";
import { sanitizeEmail, sanitizePassword } from "../utils/sanitize";

// ─── Animation Variants ──────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const showcaseVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
};

// ─── Floating Particle ───────────────────────────────────────────────────────

function FloatingOrb({ size, top, left, color, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-30 blur-[2px]"
      style={{ width: size, height: size, top, left, background: color }}
      animate={{ y: [0, -20, 0], x: [0, 10, -10, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Live Stat Ticker ────────────────────────────────────────────────────────

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2000 }) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCurrent(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setCurrent(target);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span>{prefix}{current.toLocaleString()}{suffix}</span>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { quote: "BudgetWise cut our financial reporting time by 60%. Absolutely transformative.", name: "Sarah K.", role: "CFO, NovaTech" },
  { quote: "The real-time analytics are unlike anything I've used. My portfolio is up 34% YTD.", name: "James L.", role: "Private Investor" },
  { quote: "Finally, an enterprise tool that actually feels modern. The UI is stunning.", name: "Priya M.", role: "Head of Finance, Apex Corp" },
];

// ─── Input Field ─────────────────────────────────────────────────────────────

function FormField({ id, label, type = "text", value, onChange, icon: Icon, error, success, autoComplete, extra }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <div className="space-y-1">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 
          ${focused ? "border-indigo-500 ring-2 ring-indigo-500/20" : error ? "border-rose-500 ring-2 ring-rose-500/20" : success ? "border-emerald-500" : "border-border-subtle"}
          bg-bg-elevated`}
      >
        {Icon && (
          <div className={`pl-4 flex-shrink-0 transition-colors duration-200 ${focused ? "text-indigo-500" : "text-text-secondary"}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            name={id}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-label={label}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            placeholder=" "
            className="peer w-full px-4 py-4 pt-6 pb-2 bg-transparent text-text-primary text-sm font-medium outline-none"
            required
          />
          <label
            htmlFor={id}
            className={`absolute left-4 transition-all duration-200 pointer-events-none font-semibold
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-text-secondary
              peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-indigo-500
              ${value ? "top-2 translate-y-0 text-[10px] text-text-secondary" : "top-1/2 -translate-y-1/2 text-sm text-text-secondary"}`}
          >
            {label}
          </label>
        </div>
        <div className="pr-4 flex-shrink-0 flex items-center gap-2">
          {isPassword && (
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1} aria-label={showPass ? "Hide password" : "Show password"}>
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div key="err" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </motion.div>
            )}
            {!error && success && (
              <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-semibold text-rose-500 pl-1"
          >
            {error}
          </motion.p>
        )}
        {extra && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {extra}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Login Component ─────────────────────────────────────────────────────

export default function Login() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");
  const [shake, setShake] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Pre-fill remembered email
    const remembered = localStorage.getItem("bw_remembered_email");
    if (remembered) { setEmail(remembered); setRememberMe(true); }
  }, []);

  // Testimonial rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live validation
  const handleEmailChange = useCallback((e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 3) {
      const result = sanitizeEmail(val);
      setEmailError(result.valid ? "" : result.message);
      setEmailValid(result.valid);
    } else {
      setEmailError(""); setEmailValid(false);
    }
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0) {
      const result = sanitizePassword(val);
      setPasswordError(result.valid ? "" : result.message);
      setPasswordValid(result.valid);
    } else {
      setPasswordError(""); setPasswordValid(false);
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Final client-side validation
    const eResult = sanitizeEmail(email);
    const pResult = sanitizePassword(password);
    if (!eResult.valid) { setEmailError(eResult.message); triggerShake(); return; }
    if (!pResult.valid) { setPasswordError(pResult.message); triggerShake(); return; }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eResult.value, password: pResult.value }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setApiError(data.message || "Something went wrong. Please try again.");
        triggerShake();
        return;
      }

      // Persist session
      localStorage.setItem("bw_token", data.token);
      localStorage.setItem("bw_user", JSON.stringify(data.user));
      if (rememberMe) localStorage.setItem("bw_remembered_email", eResult.value);
      else localStorage.removeItem("bw_remembered_email");

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);

    } catch (err) {
      setStatus("error");
      setApiError("Network error. Please check your connection.");
      triggerShake();
    }
  };

  // CTA button content
  const ctaContent = {
    idle: <><span>Sign In to Dashboard</span><ArrowRight className="w-4 h-4" /></>,
    loading: <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>,
    success: <><CheckCircle className="w-5 h-5" /><span>Access Granted!</span></>,
    error: <><span>Try Again</span><ArrowRight className="w-4 h-4" /></>,
  };

  const ctaClass = {
    idle: "bg-text-primary text-bg-main hover:scale-[1.02] hover:shadow-xl",
    loading: "bg-indigo-600 text-white cursor-not-allowed",
    success: "bg-emerald-600 text-white",
    error: "bg-rose-600 text-white hover:scale-[1.02]",
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse min-h-screen bg-bg-main text-text-primary overflow-hidden">
      <Head>
        <title>Sign In | BudgetWise</title>
        <meta name="description" content="Access your BudgetWise financial command center." />
      </Head>

      {/* ── RIGHT: Auth Form ───────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-20 bg-bg-main shadow-[-20px_0_60px_rgba(0,0,0,0.06)] dark:shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">

        {/* Top nav */}
        <div className="p-8 absolute top-0 w-full flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">BudgetWise</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 pt-28 pb-12">
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className={`w-full max-w-md mx-auto ${shake ? "animate-shake" : ""}`}
          >

            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-4xl font-black tracking-tight mb-2">Welcome back.</h1>
              <p className="text-text-secondary font-medium">Log in to your financial command center.</p>
            </motion.div>

            {/* OAuth */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-5">
              <button type="button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="relative flex items-center justify-center gap-2 px-2 sm:px-4 py-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-elevated/80 text-text-primary text-sm font-bold transition-all duration-300 overflow-hidden group cursor-pointer hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-95">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent group-hover:animate-shimmer" />
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="relative z-10 hidden sm:inline">Google</span>
              </button>

              <button type="button" onClick={() => signIn('apple', { callbackUrl: '/dashboard' })} className="relative flex items-center justify-center gap-2 px-2 sm:px-4 py-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-elevated/80 text-text-primary text-sm font-bold transition-all duration-300 overflow-hidden group cursor-pointer hover:border-slate-500/40 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)] hover:-translate-y-1 active:scale-95">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-500/10 to-transparent group-hover:animate-shimmer" />
                <svg className="w-4 h-4 flex-shrink-0 relative z-10" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <span className="relative z-10 hidden sm:inline">Apple</span>
              </button>

              <button type="button" onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })} className="relative flex items-center justify-center gap-2 px-2 sm:px-4 py-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-elevated/80 text-text-primary text-sm font-bold transition-all duration-300 overflow-hidden group cursor-pointer hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 active:scale-95">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent group-hover:animate-shimmer" />
                <svg className="w-4 h-4 flex-shrink-0 relative z-10" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span className="relative z-10 hidden sm:inline">Microsoft</span>
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest whitespace-nowrap">or continue with email</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </motion.div>

            {/* API Error Banner */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  role="alert"
                  className="flex items-center gap-3 px-4 py-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                icon={Mail}
                error={emailError}
                success={emailValid}
                autoComplete="email"
              />
              <FormField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                icon={Lock}
                error={passwordError}
                success={passwordValid}
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1">
                <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${rememberMe ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20" : "border-border-subtle bg-bg-elevated group-hover:border-indigo-500/50"}`}
                  >
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <input type="checkbox" id="remember" className="sr-only" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                </label>
                
                <Link href="#" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-md">
                  Forgot password?
                </Link>
              </div>

              {/* CTA */}
              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                aria-busy={status === "loading"}
                aria-label={status === "loading" ? "Signing in, please wait" : "Sign in to your dashboard"}
                whileTap={{ scale: status === "idle" || status === "error" ? 0.98 : 1 }}
                className={`w-full mt-2 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${ctaClass[status]}`}
              >
                {ctaContent[status]}
              </motion.button>
            </motion.form>

            {/* Footer link */}
            <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary font-medium mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                Create one free
              </Link>
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 mt-7 pt-5 border-t border-border-subtle">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SOC 2 Compliant
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> AES-256 Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> 99.9% Uptime
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ── LEFT: Showcase Panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#060810]">

        {/* Drifting orbs */}
        {isMounted && (
          <>
            <FloatingOrb size={600} top="-15%" left="-15%" color="radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)" duration={14} delay={0} />
            <FloatingOrb size={500} top="50%" left="40%" color="radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)" duration={18} delay={2} />
            <FloatingOrb size={300} top="70%" left="-5%" color="radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" duration={22} delay={4} />
            <FloatingOrb size={80} top="20%" left="70%" color="#a78bfa" duration={8} delay={1} />
            <FloatingOrb size={50} top="60%" left="60%" color="#818cf8" duration={10} delay={3} />
            <FloatingOrb size={40} top="40%" left="20%" color="#c4b5fd" duration={12} delay={5} />
          </>
        )}

        {/* Carbon texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.12] mix-blend-overlay pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-start pt-12 xl:pt-16 px-14 xl:px-20 h-full gap-10">
          <motion.div variants={showcaseVariants} initial="hidden" animate="visible">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-7">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Ready
            </div>

            {/* Headline */}
            <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight text-white mb-5">
              Your wealth,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                algorithmically orchestrated.
              </span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
              Join thousands of elite individuals engineering their financial future with zero-latency, military-grade intelligence.
            </p>

            {/* Live Stats Widget */}
            {isMounted && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Balance</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    $<AnimatedCounter target={124850} />
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ 12.4% MTD</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="flex items-center justify-center gap-1 text-indigo-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Savings</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    $<AnimatedCounter target={8420} duration={1800} />
                  </p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-0.5">This month</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                    <TrendingDown className="w-4 h-4 rotate-180" />
                    <span className="text-xs font-black uppercase tracking-wider">Growth</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    <AnimatedCounter target={34} duration={1500} />%
                  </p>
                  <p className="text-[10px] text-purple-400 font-bold mt-0.5">YTD Return</p>
                </div>
              </div>
            )}

            {/* Testimonial Rotator */}
            <div className="relative h-24 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <p className="text-slate-300 text-sm font-medium italic leading-relaxed mb-3">
                    "{TESTIMONIALS[testimonialIndex].quote}"
                  </p>
                  <p className="text-slate-500 text-xs font-black">
                    — {TESTIMONIALS[testimonialIndex].name}, {TESTIMONIALS[testimonialIndex].role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-0">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIndex ? "bg-indigo-400 w-5" : "bg-slate-600 hover:bg-slate-400"}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
