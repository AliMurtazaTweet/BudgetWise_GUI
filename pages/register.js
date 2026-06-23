import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, Github, Mail, Lock, Eye, EyeOff,
  User, CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck, Zap
} from "lucide-react";
import { sanitizeEmail, sanitizePassword, sanitizeName } from "../utils/sanitize";

// ─── Animation Variants ──────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Password Strength Meter ─────────────────────────────────────────────────

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "bg-rose-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"];
const STRENGTH_TEXT = ["", "text-rose-500", "text-amber-500", "text-indigo-500", "text-emerald-500"];

function PasswordStrengthMeter({ strength }) {
  if (!strength) return null;
  return (
    <div className="space-y-1.5 mt-2 px-1">
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className={`flex-1 rounded-full transition-colors duration-300 ${level <= strength ? STRENGTH_COLORS[strength] : "bg-border-subtle"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= strength ? 1 : 0 }}
          />
        ))}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-wider ${STRENGTH_TEXT[strength]}`}>
        {STRENGTH_LABELS[strength]}
      </p>
    </div>
  );
}

// ─── FormField (Floating Label) ───────────────────────────────────────────────

function FormField({ id, label, type = "text", value, onChange, icon: Icon, error, success, autoComplete }) {
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
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div className="relative flex-1">
          <input
            id={id} name={id} type={inputType} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-label={label} aria-describedby={error ? `${id}-error` : undefined} aria-invalid={!!error}
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
          <motion.p id={`${id}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs font-semibold text-rose-500 pl-1">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Register Component ──────────────────────────────────────────────────

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [agreeError, setAgreeError] = useState("");

  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");
  const [shake, setShake] = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handleNameChange = useCallback((e) => {
    const val = e.target.value; setName(val);
    if (val.length > 1) {
      const r = sanitizeName(val);
      setNameError(r.valid ? "" : r.message); setNameValid(r.valid);
    } else { setNameError(""); setNameValid(false); }
  }, []);

  const handleEmailChange = useCallback((e) => {
    const val = e.target.value; setEmail(val);
    if (val.length > 3) {
      const r = sanitizeEmail(val);
      setEmailError(r.valid ? "" : r.message); setEmailValid(r.valid);
    } else { setEmailError(""); setEmailValid(false); }
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const val = e.target.value; setPassword(val);
    if (val.length > 0) {
      const r = sanitizePassword(val);
      setPasswordError(r.valid ? "" : r.message);
      setPasswordValid(r.valid);
      setPasswordStrength(r.strength || 0);
    } else { setPasswordError(""); setPasswordValid(false); setPasswordStrength(0); }
    if (confirmPassword) {
      setConfirmError(val === confirmPassword ? "" : "Passwords do not match.");
      setConfirmValid(val === confirmPassword);
    }
  }, [confirmPassword]);

  const handleConfirmChange = useCallback((e) => {
    const val = e.target.value; setConfirmPassword(val);
    if (val.length > 0) {
      setConfirmError(val === password ? "" : "Passwords do not match.");
      setConfirmValid(val === password);
    } else { setConfirmError(""); setConfirmValid(false); }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Step 1: Register
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const registerData = await registerRes.json();

      if (registerData.status !== "success") {
        setStatus("error");
        setApiError(registerData.message);
        return;
      }

      // Step 2: Login immediately
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (loginData.status === "success") {
        localStorage.setItem("bw_user", JSON.stringify(loginData.user));
        setStatus("success");
        router.push("/dashboard");
      } else {
        setStatus("success");
        router.push("/login");
      }
    } catch {
      setStatus("error");
      setApiError("Network error. Please try again.");
    }
  };

  const ctaContent = {
    idle: <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>,
    loading: <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating account...</span></>,
    success: <><CheckCircle className="w-5 h-5" /><span>Account Created!</span></>,
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
        <title>Create Account | BudgetWise</title>
        <meta name="description" content="Create your BudgetWise account and start engineering your financial future." />
      </Head>

      {/* ── RIGHT: Register Form ─────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-20 bg-bg-main shadow-[-20px_0_60px_rgba(0,0,0,0.06)] dark:shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">
        <div className="p-8 absolute top-0 w-full flex items-center justify-between">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">BudgetWise</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 pt-16 pb-12">
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className={`w-full max-w-md mx-auto ${shake ? "animate-shake" : ""}`}
          >

            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-5">
              <h1 className="text-4xl font-black tracking-tight mb-2">Create your account.</h1>
              <p className="text-text-secondary font-medium">Start engineering your financial command center today.</p>
            </motion.div>

            {/* OAuth */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-4">
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
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
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
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest whitespace-nowrap">or sign up with email</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </motion.div>

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} role="alert"
                  className="flex items-center gap-3 px-4 py-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fields */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField id="name" label="Full name" type="text" value={name} onChange={handleNameChange} icon={User} error={nameError} success={nameValid} autoComplete="name" />
              <FormField id="email" label="Email address" type="email" value={email} onChange={handleEmailChange} icon={Mail} error={emailError} success={emailValid} autoComplete="email" />
              <div>
                <FormField id="password" label="Password" type="password" value={password} onChange={handlePasswordChange} icon={Lock} error={passwordError} success={passwordValid} autoComplete="new-password" />
                <PasswordStrengthMeter strength={passwordStrength} />
              </div>
              <FormField id="confirmPassword" label="Confirm password" type="password" value={confirmPassword} onChange={handleConfirmChange} icon={Lock} error={confirmError} success={confirmValid} autoComplete="new-password" />

              {/* Terms */}
              <div>
                <label htmlFor="agree" className="flex items-start gap-3 cursor-pointer select-none pt-1">
                  <div
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? "bg-indigo-600 border-indigo-600" : agreeError ? "border-rose-500" : "border-border-subtle bg-bg-elevated"}`}
                  >
                    <AnimatePresence>
                      {agreed && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <input type="checkbox" id="agree" className="sr-only" checked={agreed} onChange={() => { setAgreed(!agreed); setAgreeError(""); }} />
                  <span className="text-sm font-semibold text-text-secondary leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Privacy Policy</a>
                  </span>
                </label>
                <AnimatePresence>
                  {agreeError && (
                    <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs font-semibold text-rose-500 pl-1 mt-1">{agreeError}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                aria-busy={status === "loading"}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-2 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${ctaClass[status]}`}
              >
                {ctaContent[status]}
              </motion.button>
            </motion.form>

            <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary font-medium mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">Sign in instead</Link>
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-border-subtle">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SOC 2 Compliant</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary"><Lock className="w-3.5 h-3.5 text-indigo-500" /> AES-256 Encrypted</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary"><Zap className="w-3.5 h-3.5 text-amber-500" /> 99.9% Uptime</div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ── LEFT: Showcase Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#060810]">
        <motion.div
          className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.12] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-start pt-12 xl:pt-16 px-14 xl:px-20 h-full">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-7">
              <ShieldCheck className="w-3.5 h-3.5" /> Free Forever Plan Available
            </div>
            <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight text-white mb-5">
              Start your journey.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                Free. Instant. Powerful.
              </span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
              No credit card required. Get instant access to real-time financial analytics, predictive budgeting, and wealth orchestration tools trusted by 10,000+ users.
            </p>

            {/* Feature checklist */}
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, color: "text-emerald-400", label: "Military-grade AES-256 encryption on all data" },
                { icon: Zap, color: "text-amber-400", label: "Real-time sync across all your devices globally" },
                { icon: TrendingUp, color: "text-indigo-400", label: "AI-powered budget forecasting engine" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                  </div>
                  <p className="text-sm font-bold text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
