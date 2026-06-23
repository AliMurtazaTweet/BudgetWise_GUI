import DashboardLayout from "../components/DashboardLayout";
import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for students and individuals just starting their financial journey.",
    features: [
      "Up to 50 transactions/mo",
      "Basic Budgeting Tools",
      "Standard Analytics",
      "Email Support"
    ],
    buttonText: "Current Plan",
    highlight: false,
    icon: Zap
  },
  {
    name: "Pro",
    price: "$9",
    description: "The most popular choice for power users who want deep insights and sync.",
    features: [
      "Unlimited transactions",
      "Advanced AI Insights",
      "Real-time Bank Sync",
      "Custom Budget Categories",
      "Priority Support"
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
    icon: Star
  },
  {
    name: "Elite",
    price: "$19",
    description: "For corporate players and high-net-worth individual portfolios.",
    features: [
      "Everything in Pro",
      "Multiple Currency Support",
      "Tax Planning Assistant",
      "Dedicated Advisor",
      "Custom Reports Generation"
    ],
    buttonText: "Contact Sales",
    highlight: false,
    icon: Crown
  }
];

export default function PremiumPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [demoStatus, setDemoStatus] = useState("idle"); // idle, loading, success

  const handleScheduleDemo = () => {
    if (demoStatus !== "idle") return;
    setDemoStatus("loading");
    setTimeout(() => {
      setDemoStatus("success");
      setTimeout(() => setDemoStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-8">
              <Crown size={14} className="text-accent-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary">Exclusive Premium Tier Access</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-8 leading-tight">
              Scale Your Wealth <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-indigo-500">Professional Grade Analytics</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-bold leading-relaxed opacity-60">
              Join 10,000+ top-tier users worldwide who leverage BudgetWise <br className="hidden md:block" /> to optimize portfolios and secure a modern financial future.
            </p>
          </motion.div>

          <div className="mt-16 flex justify-center items-center space-x-8">
            <span className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all ${billingCycle === 'monthly' ? 'text-text-primary scale-110' : 'text-text-secondary opacity-30 italic'}`}>Monthly Tier</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-bg-elevated rounded-full p-1.5 transition-all duration-300 focus:outline-none hover:bg-bg-surface border border-border-subtle shadow-inner"
            >
              <motion.div 
                layout
                className={`w-5 h-5 bg-accent-primary rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all ${billingCycle === 'yearly' ? 'ml-auto' : 'ml-0'}`}
              />
            </button>
            <span className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all flex items-center ${billingCycle === 'yearly' ? 'text-text-primary scale-110' : 'text-text-secondary opacity-30 italic'}`}>
              Yearly Protocol 
              <span className="ml-5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-pulse">
                -20% Efficiency
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isMonthly = billingCycle === 'monthly';
            const price = isMonthly 
              ? plan.price 
              : `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8 * 12)}`;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 group ${
                  plan.highlight 
                    ? "bg-bg-main border-accent-primary/30 shadow-2xl shadow-accent-primary/10 ring-8 ring-accent-primary/5" 
                    : "bg-bg-surface border-border-subtle shadow-xl shadow-text-primary/5 hover:border-accent-primary/20 hover:shadow-2xl"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary text-bg-main text-[10px] font-black uppercase tracking-[0.25em] px-8 py-2.5 rounded-full shadow-xl shadow-accent-primary/20 z-10">
                    Most Popular
                  </div>
                )}

                <div className="mb-8 relative">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 ${
                    plan.highlight ? "bg-accent-primary text-bg-main shadow-xl shadow-accent-primary/10" : "bg-bg-elevated text-text-secondary"
                  }`}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-black text-text-primary tracking-tighter transition-all duration-300">
                      {price}
                    </span>
                    <span className="text-text-secondary font-bold ml-2 text-sm uppercase tracking-widest opacity-60">
                      {isMonthly ? "/ mo" : "/ yr"}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary font-bold leading-relaxed opacity-80">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-6 border-b border-border-subtle pb-4">Core Benefits</p>
                  <ul className="space-y-5 mb-12">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-xs font-black text-text-primary group/item">
                        <div className={`mt-0.5 mr-4 p-1 rounded-full transition-colors ${
                          plan.highlight ? "bg-accent-primary/10 text-accent-primary group-hover/item:bg-accent-primary group-hover/item:text-bg-main" : "bg-bg-elevated text-text-secondary group-hover/item:bg-text-primary group-hover/item:text-bg-main"
                        }`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`relative overflow-hidden w-full py-5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn ${
                  plan.highlight 
                    ? "bg-accent-primary text-bg-main hover:bg-opacity-90 shadow-accent-primary/20" 
                    : "bg-text-primary text-bg-main hover:bg-opacity-90 shadow-text-primary/10"
                }`}>
                  <span className="relative z-10 flex items-center justify-center">
                    {plan.buttonText}
                    <ArrowRight className="ml-2 transition-transform group-hover/btn:translate-x-1" size={16} />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32 p-16 rounded-[4rem] bg-bg-elevated border border-border-subtle overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000 group-hover:scale-150 group-hover:bg-accent-primary/20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="flex items-center space-x-3 mb-8 justify-center lg:justify-start">
                <div className="p-2.5 bg-accent-primary/10 rounded-2xl border border-accent-primary/20">
                  <Shield className="text-accent-primary" size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-primary">Enterprise Core Encryption</span>
              </div>
              <h2 className="text-4xl font-black text-text-primary mb-8 tracking-tighter leading-tight italic">Custom Financial Infrastructure?</h2>
              <p className="text-text-secondary font-bold text-base leading-relaxed mb-0 opacity-60">
                Tailored multi-user environments with advanced API access, dedicated account managers, 
                and predictive portfolio modeling for professional asset management at scale.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-5">
              <button 
                onClick={handleScheduleDemo}
                disabled={demoStatus !== "idle"}
                className={`px-16 py-7 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-text-primary/10 active:scale-95 whitespace-nowrap flex items-center justify-center ${
                  demoStatus === "success" 
                    ? "bg-emerald-500 text-bg-main" 
                    : "bg-text-primary text-bg-main hover:bg-accent-primary group/contact"
                }`}
              >
                {demoStatus === "idle" && (
                  <>
                    Schedule Demo
                    <ArrowRight className="inline-block ml-3 transition-transform group-hover/contact:translate-x-1" size={18} />
                  </>
                )}
                {demoStatus === "loading" && (
                  <>
                    <span className="animate-pulse">Confirming...</span>
                  </>
                )}
                {demoStatus === "success" && (
                  <>
                    <Check className="inline-block mr-3" size={18} />
                    Check Your Email
                  </>
                )}
              </button>
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Priority response: 60 mins</p>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-24 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-10 text-text-secondary opacity-30">Strategic Liquidity Partners & Global Custodians</p>
           <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 text-text-primary">
              <div className="font-black text-2xl tracking-tighter">FINTECH.CORE</div>
              <div className="font-black text-2xl tracking-tighter italic opacity-80">BLOCKCHAIN.ONE</div>
              <div className="font-black text-3xl tracking-tighter">wealth.ly</div>
              <div className="font-black text-2xl tracking-tighter underline underline-offset-8">PRIME.ASSET</div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
