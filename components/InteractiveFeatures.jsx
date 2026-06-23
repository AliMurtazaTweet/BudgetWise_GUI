import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion, useScroll, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";

const SEGMENT_A = 0.33;
const SEGMENT_B = 0.66;
const COIN_COUNT = 5;
const FALLING_COUNT = 6;

const clamp01 = (n) => Math.max(0, Math.min(1, n));

// Pre-sample points along an SVG path for high performance (avoids getPointAtLength and getTotalLength during scroll events)
function preSamplePath(pathEl, steps = 120) {
  if (!pathEl || typeof pathEl.getTotalLength !== "function") return null;
  try {
    const length = pathEl.getTotalLength();
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = pathEl.getPointAtLength(length * t);
      points.push({ x: point.x, y: point.y });
    }
    return { length, points };
  } catch (err) {
    console.warn("Failed to sample path", err);
    return null;
  }
}

function getPointFromCache(cache, progress) {
  if (!cache || !cache.points || cache.points.length === 0) {
    return { x: 0, y: 0 };
  }
  const points = cache.points;
  const len = points.length;
  const index = clamp01(progress) * (len - 1);
  const idxLow = Math.floor(index);
  const idxHigh = Math.ceil(index);
  if (idxLow === idxHigh) return points[idxLow];
  const t = index - idxLow;
  const p1 = points[idxLow];
  const p2 = points[idxHigh];
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function getPathCache(pathEl, cacheRef, key) {
  if (!pathEl) return null;
  if (!cacheRef.current) {
    cacheRef.current = {};
  }
  if (!cacheRef.current[key]) {
    cacheRef.current[key] = preSamplePath(pathEl, 200);
  }
  return cacheRef.current[key];
}

function setPathProgress(pathEl, progress, cachedLength) {
  if (!pathEl) return;
  const length = cachedLength !== undefined ? cachedLength : (typeof pathEl.getTotalLength === "function" ? pathEl.getTotalLength() : 0);
  if (!length) return;
  pathEl.style.strokeDasharray = `${length}`;
  pathEl.style.strokeDashoffset = `${length * (1 - clamp01(progress))}`;
}

function placeCoinsOnPath(coinEls, progress, cache) {
  if (!coinEls?.length || !cache) return;
  const t = clamp01(progress);
  coinEls.forEach((coin, index) => {
    if (!coin) return;
    const lag = (index / COIN_COUNT) * 0.26;
    const coinT = clamp01((t - lag) / (1 - lag || 1));
    const point = getPointFromCache(cache, coinT);

    // cache quickSetter functions on the DOM node to avoid recreation each frame
    if (!coin.__qs) {
      coin.__qs = {
        x: gsap.quickSetter(coin, "x", "px"),
        y: gsap.quickSetter(coin, "y", "px"),
        scale: gsap.quickSetter(coin, "scale"),
        rotation: gsap.quickSetter(coin, "rotation")
      };
    }

    coin.__qs.x(point.x);
    coin.__qs.y(point.y);
    coin.__qs.scale(0.8 + coinT * 0.3);
    coin.__qs.rotation(15 + coinT * 320);
    coin.style.opacity = coinT > 0.02 ? "1" : "0";
  });
}

function setBars(barEls, incomeT, expenseT, savingsT) {
  if (!barEls?.length) return;
  const baseline = 262;
  const maxHeights = [130, 95, 150];
  const progress = [incomeT, expenseT, savingsT];

  barEls.forEach((bar, index) => {
    if (!bar) return;
    const h = 20 + maxHeights[index] * clamp01(progress[index]);
    gsap.set(bar, { attr: { y: baseline - h, height: h } });
  });
}

function setFallingCoins(coinEls, expenseT) {
  if (!coinEls?.length) return;
  const t = clamp01(expenseT);
  coinEls.forEach((coin, i) => {
    if (!coin) return;
    const lane = i % 4;
    const startX = 312 + lane * 46 + (i % 2 ? 12 : -8);
    const startY = 18 - (i % 3) * 14;
    const endY = 286 - lane * 18;
    const y = startY + (endY - startY) * t;
    const drift = Math.sin((t + i * 0.18) * Math.PI * 2) * (5 + lane * 1.5);

    if (!coin.__qs) {
      coin.__qs = {
        x: gsap.quickSetter(coin, "x", "px"),
        y: gsap.quickSetter(coin, "y", "px"),
        scale: gsap.quickSetter(coin, "scale"),
        rotation: gsap.quickSetter(coin, "rotation")
      };
    }

    coin.__qs.x(startX + drift);
    coin.__qs.y(y);
    coin.__qs.scale(0.58 + t * 0.42 - lane * 0.04);
    coin.__qs.rotation(t * 360 + i * 22);
    coin.style.opacity = t > 0.01 ? String(0.2 + t * 0.8) : "0";
  });
}

function setTrendLine(lineEl, incomeT, expenseT, savingsT) {
  if (!lineEl) return;
  const net = clamp01((incomeT * 1.1 + savingsT * 1.25 - expenseT * 0.8 + 1) / 2);
  gsap.set(lineEl, { attr: { y1: 190 - net * 54, y2: 140 - net * 64 }, opacity: 0.35 + net * 0.65 });
}

function syncScene(progress, refs, cacheRef) {
  const {
    incomePathRef,
    expensePathRef,
    savingsPathRef,
    incomeCoinsRef,
    expenseCoinsRef,
    savingsCoinsRef,
    barsRef,
    fallingCoinsRef,
    trendLineRef
  } = refs;
  const incomeT = clamp01(progress / SEGMENT_A);
  const expenseT = clamp01((progress - SEGMENT_A) / (SEGMENT_B - SEGMENT_A));
  const savingsT = clamp01((progress - SEGMENT_B) / (1 - SEGMENT_B));

  const incomeCache = getPathCache(incomePathRef.current, cacheRef, "income");
  const expenseCache = getPathCache(expensePathRef.current, cacheRef, "expense");
  const savingsCache = getPathCache(savingsPathRef.current, cacheRef, "savings");

  setPathProgress(incomePathRef.current, incomeT, incomeCache?.length);
  setPathProgress(expensePathRef.current, expenseT, expenseCache?.length);
  setPathProgress(savingsPathRef.current, savingsT, savingsCache?.length);

  placeCoinsOnPath(incomeCoinsRef.current, incomeT, incomeCache);
  placeCoinsOnPath(expenseCoinsRef.current, expenseT, expenseCache);
  placeCoinsOnPath(savingsCoinsRef.current, savingsT, savingsCache);
  setBars(barsRef.current, incomeT, expenseT, savingsT);
  setFallingCoins(fallingCoinsRef.current, expenseT);
  setTrendLine(trendLineRef.current, incomeT, expenseT, savingsT);
}

// Leaf and wreathArc defined outside component to avoid type recreation performance hit
const Leaf = ({ angle, side, scale = 1 }) => {
  const rad = (angle * Math.PI) / 180;
  const r = 7.9;
  const x = r * Math.cos(rad);
  const y = r * Math.sin(rad);
  const rotation = angle + 90 + side * 18;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <path
        d="M 0 0 C -0.55 -0.9 -0.45 -1.9 0 -2.6 C 0.45 -1.9 0.55 -0.9 0 0 Z"
        fill="url(#leafGradient)"
        stroke="rgba(40,40,45,0.55)"
        strokeWidth="0.06"
      />
      <line x1="0" y1="0" x2="0" y2="-2.5" stroke="rgba(60,60,65,0.4)" strokeWidth="0.05" />
    </g>
  );
};

const wreathArc = (startAngle, endAngle, count) => {
  const leaves = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const angle = startAngle + (endAngle - startAngle) * t;
    leaves.push(
      <g key={`${startAngle}-${i}`}>
        <Leaf angle={angle} side={-1} />
        <Leaf angle={angle} side={1} />
      </g>
    );
  }
  return leaves;
};

// SVG template for the highly complex coin rendering, defined once to avoid thousands of DOM elements
function CoinTemplate() {
  return (
    <g id="coinTemplate">
      <circle r="12.4" fill="url(#coinEdgeGradient)" />
      <circle r="11.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.25" />
      <circle r="10.9" fill="none" stroke="rgba(60,60,65,0.35)" strokeWidth="0.2" />
      <circle r="10.3" fill="url(#coinCoreGradient)" />
      {/* Reduced coin ridges from 72 to 36 for 2x vector rasterization speed with identical visual fidelity */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i * 360) / 18;
        const rad = (a * Math.PI) / 180;
        const x2 = 10.1 * Math.cos(rad);
        const y2 = 10.1 * Math.sin(rad);
        return (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.05"
          />
        );
      })}
      <circle r="8.6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.18" />
      <circle r="8.4" fill="none" stroke="rgba(70,70,75,0.3)" strokeWidth="0.12" />
      <g>{wreathArc(160, 250, 7)}</g>
      <g>{wreathArc(-70, 20, 7)}</g>
      <g transform="translate(0 4.6) scale(0.85)">
        <path
          d="M 0 -2.2 L 0.55 -0.6 L 2.2 -0.9 L 1 0.3 L 2.1 1.6 L 0.45 1.2 L 0 2.6 L -0.5 1.1 L -2.1 1.5 L -0.95 0.25 L -2.15 -0.85 L -0.5 -0.55 Z"
          fill="url(#starGradient)"
          stroke="rgba(60,60,65,0.45)"
          strokeWidth="0.08"
        />
      </g>
    </g>
  );
}

function MoneyCoin({ label = "" }) {
  return (
    <>
      <use href="#coinTemplate" />
      {label && (
        <text
          x="0"
          y="2.8"
          textAnchor="middle"
          fontSize="4.2"
          fontWeight="700"
          letterSpacing="0.06em"
          fill="rgba(60,60,65,0.65)"
          fontFamily="'Arial', sans-serif"
        >
          {label}
        </text>
      )}
    </>
  );
}

export default function InteractiveFeatures({ animateProps }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const featuresRef = useRef(null);
  const incomePathRef = useRef(null);
  const expensePathRef = useRef(null);
  const savingsPathRef = useRef(null);
  const incomeCoinsRef = useRef([]);
  const expenseCoinsRef = useRef([]);
  const savingsCoinsRef = useRef([]);
  const fallingCoinsRef = useRef([]);
  const barsRef = useRef([]);
  const trendLineRef = useRef(null);
  
  // High-performance path sampling cache ref
  const pathCacheRef = useRef({
    income: null,
    expense: null,
    savings: null
  });

  const { scrollYProgress: featureProgress } = useScroll({
    target: featuresRef,
    offset: ["start start", "end end"]
  });

  // throttle updates via RAF to avoid flooding syncScene during fast scrolls
  const latestProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  useMotionValueEvent(featureProgress, "change", (latest) => {
    if (latest < 0.33) setActiveFeature(0);
    else if (latest < 0.66) setActiveFeature(1);
    else setActiveFeature(2);
  });

  useMotionValueEvent(featureProgress, "change", (latest) => {
    latestProgressRef.current = latest;
    if (reducedMotion) return;
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(() => {
        syncScene(latestProgressRef.current, {
          incomePathRef,
          expensePathRef,
          savingsPathRef,
          incomeCoinsRef,
          expenseCoinsRef,
          savingsCoinsRef,
          barsRef,
          fallingCoinsRef,
          trendLineRef
        }, pathCacheRef);
        rafIdRef.current = null;
      });
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => setReducedMotion(media.matches);
    applyMotionPreference();
    media.addEventListener("change", applyMotionPreference);
    return () => media.removeEventListener("change", applyMotionPreference);
  }, []);

  // Pre-sample SVG paths once when component mounts to avoid expensive DOM calls during scroll
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = setTimeout(() => {
      try {
        getPathCache(incomePathRef.current, pathCacheRef, "income");
        getPathCache(expensePathRef.current, pathCacheRef, "expense");
        getPathCache(savingsPathRef.current, pathCacheRef, "savings");
      } catch (e) {
        // silent
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      syncScene(1, {
        incomePathRef,
        expensePathRef,
        savingsPathRef,
        incomeCoinsRef,
        expenseCoinsRef,
        savingsCoinsRef,
        barsRef,
        fallingCoinsRef,
        trendLineRef
      }, pathCacheRef);
      return;
    }

    syncScene(0.001, {
      incomePathRef,
      expensePathRef,
      savingsPathRef,
      incomeCoinsRef,
      expenseCoinsRef,
      savingsCoinsRef,
      barsRef,
      fallingCoinsRef,
      trendLineRef
    }, pathCacheRef);
  }, [reducedMotion]);

  return (
    <motion.section id="features" ref={featuresRef} className="relative h-[250vh] mt-32">
      <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col justify-center max-w-7xl mx-auto px-6">
        <motion.div {...animateProps} className="text-center mb-10 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight mb-4">Built differently.</h2>
          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
            As you scroll, watch your income, spend, and savings move together as a single living story.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center relative">
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div
              onClick={() => setActiveFeature(0)}
              className={`w-full flex flex-col items-start p-6 sm:p-8 rounded-[2rem] cursor-pointer transition-all duration-300 border-l-[6px] ${
                activeFeature === 0
                  ? "bg-bg-elevated/80 border-indigo-500 shadow-2xl opacity-100"
                  : "border-transparent opacity-50 hover:bg-bg-elevated/30 hover:opacity-80"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter leading-tight italic flex items-center gap-4">
                <BarChart3 className={`w-8 h-8 ${activeFeature === 0 ? "text-indigo-400" : "text-text-secondary"}`} strokeWidth={2} />
                Zero-Latency Visualizations
              </h3>
              <AnimatePresence>
                {activeFeature === 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} overflow="hidden">
                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-bold mt-4 opacity-80">
                      Interact with massive datasets effortlessly. BudgetWise leverages bleeding-edge canvas orchestration to render beautiful data insights smoothly, enabling you to zoom, pan, and interpret market trends instantly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              onClick={() => setActiveFeature(1)}
              className={`w-full flex flex-col items-start p-6 sm:p-8 rounded-[2rem] cursor-pointer transition-all duration-300 border-l-[6px] ${
                activeFeature === 1
                  ? "bg-bg-elevated/80 border-emerald-500 shadow-2xl opacity-100"
                  : "border-transparent opacity-50 hover:bg-bg-elevated/30 hover:opacity-80"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter leading-tight italic flex items-center gap-4">
                <ShieldCheck className={`w-8 h-8 ${activeFeature === 1 ? "text-emerald-400" : "text-text-secondary"}`} strokeWidth={2} />
                Military-Grade Cold Storage
              </h3>
              <AnimatePresence>
                {activeFeature === 1 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} overflow="hidden">
                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-bold mt-4 opacity-80">
                      Feel secure with absolute architectural isolation. All user data is fiercely protected behind hardware-level AES-256 encryption tunnels, ensuring your financial profile remains completely anonymous to external actors.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              onClick={() => setActiveFeature(2)}
              className={`w-full flex flex-col items-start p-6 sm:p-8 rounded-[2rem] cursor-pointer transition-all duration-300 border-l-[6px] ${
                activeFeature === 2
                  ? "bg-bg-elevated/80 border-amber-500 shadow-2xl opacity-100"
                  : "border-transparent opacity-50 hover:bg-bg-elevated/30 hover:opacity-80"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter leading-tight italic flex items-center gap-4">
                <Zap className={`w-8 h-8 ${activeFeature === 2 ? "text-amber-400" : "text-text-secondary"}`} strokeWidth={2} />
                Hyper-Responsive Engine
              </h3>
              <AnimatePresence>
                {activeFeature === 2 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} overflow="hidden">
                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-bold mt-4 opacity-80">
                      Log a transaction on your phone and deploy budget adjustments dynamically. Watch your master dashboard update in parallel under 50 milliseconds across global endpoints effortlessly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] rounded-[2.5rem] border border-border-subtle overflow-hidden bg-bg-surface shadow-lg dark:shadow-lg flex items-center justify-center relative money-premium-panel">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_37%),radial-gradient(circle_at_82%_12%,rgba(79,70,229,0.24),transparent_40%),radial-gradient(circle_at_82%_82%,rgba(244,63,94,0.15),transparent_36%)]" />
            <div className="absolute inset-0 money-noise-overlay opacity-35" />
            <div className="absolute inset-0 money-light-sweep" />
            <svg className="relative z-10 w-full h-full" viewBox="0 0 520 320" aria-label="BudgetWise money storytelling graph">
              <defs>
                <linearGradient id="incomePathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <linearGradient id="expensePathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient id="savingsPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <radialGradient id="coinEdgeGradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#DCDCDE" />
                <stop offset="75%" stopColor="#A8A8AC" />
                <stop offset="100%" stopColor="#7A7A7E" />
                </radialGradient>
                <radialGradient id="coinCoreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#ECEEEF" />
                <stop offset="70%" stopColor="#CFD2D4" />
                <stop offset="100%" stopColor="#B3B6B9" />
                </radialGradient>

                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(129,140,248,0)" />
                  <stop offset="50%" stopColor="rgba(129,140,248,0.95)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0.95)" />
                </linearGradient>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f4f5f6" />
                  <stop offset="100%" stopColor="#aeb1b4" />
                  </linearGradient>
                  <radialGradient id="starGradient" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#9FA2A5" />
                  </radialGradient>
                  <CoinTemplate />
              </defs>

              <g opacity="0.2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="0" y1={68 + i * 45} x2="520" y2={68 + i * 45} stroke="currentColor" className="text-text-secondary/35" strokeWidth="1" />
                ))}
              </g>

              <path ref={incomePathRef} d="M 30 220 C 120 200, 170 150, 235 140 S 355 125, 490 88" stroke="url(#incomePathGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path ref={expensePathRef} d="M 30 85 C 95 110, 162 164, 248 184 S 380 230, 490 255" stroke="url(#expensePathGradient)" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path ref={savingsPathRef} d="M 30 258 C 130 266, 182 236, 260 188 S 370 118, 490 72" stroke="url(#savingsPathGradient)" strokeWidth="9" fill="none" strokeLinecap="round" />
              <line ref={trendLineRef} x1="308" y1="190" x2="500" y2="140" stroke="url(#trendGradient)" strokeWidth="3.2" strokeLinecap="round" opacity="0.6" />

              <g>
                {Array.from({ length: COIN_COUNT }).map((_, i) => (
                  <g key={`income-coin-${i}`} ref={(el) => { incomeCoinsRef.current[i] = el; }} transform="translate(0 0)" opacity="0">
                    <MoneyCoin label="IN" />
                  </g>
                ))}
                {Array.from({ length: COIN_COUNT }).map((_, i) => (
                  <g key={`expense-coin-${i}`} ref={(el) => { expenseCoinsRef.current[i] = el; }} transform="translate(0 0)" opacity="0">
                    <MoneyCoin label="OUT" />
                  </g>
                ))}
                {Array.from({ length: COIN_COUNT }).map((_, i) => (
                  <g key={`savings-coin-${i}`} ref={(el) => { savingsCoinsRef.current[i] = el; }} transform="translate(0 0)" opacity="0">
                    <MoneyCoin label="SV" />
                  </g>
                ))}
              </g>

              <g>
                {Array.from({ length: FALLING_COUNT }).map((_, i) => (
                  <g key={`falling-coin-${i}`} ref={(el) => { fallingCoinsRef.current[i] = el; }} transform="translate(0 0)" opacity="0">
                    <MoneyCoin />
                  </g>
                ))}
              </g>

              <g>
                <rect x="62" width="44" y="242" height="20" rx="10" fill="rgba(16,185,129,0.72)" ref={(el) => { barsRef.current[0] = el; }} />
                <rect x="118" width="44" y="242" height="20" rx="10" fill="rgba(244,63,94,0.72)" ref={(el) => { barsRef.current[1] = el; }} />
                <rect x="174" width="44" y="242" height="20" rx="10" fill="rgba(129,140,248,0.72)" ref={(el) => { barsRef.current[2] = el; }} />
                <text x="85" y="279" textAnchor="middle" fontSize="10" className="fill-text-secondary font-black">Income</text>
                <text x="141" y="279" textAnchor="middle" fontSize="10" className="fill-text-secondary font-black">Expense</text>
                <text x="197" y="279" textAnchor="middle" fontSize="10" className="fill-text-secondary font-black">Savings</text>
              </g>
            </svg>
            <div className="absolute bottom-5 right-5 rounded-full px-3 py-1.5 bg-bg-main/75 backdrop-blur border border-border-subtle text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary">
              {reducedMotion ? "Static Mode" : "Scroll Driven"}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
