import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, Truck, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AgroAppLogo } from '../../components/common/AgroAppLogo';

import cooperativeFarmImg from '../../assets/images/african_cooperative_farm_1786635857001.jpg';
import marketProduceImg from '../../assets/images/african_market_produce_1786635867422.jpg';
import agritechLogisticsImg from '../../assets/images/african_agritech_logistics_1786635878572.jpg';

interface SplashScreenProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

const HIGHLIGHT_SLIDES = [
  {
    icon: <Users className="w-4 h-4 text-[#008751]" />,
    badge: 'Cooperative Hubs',
    title: 'Aggregated Produce & Direct Off-take',
    desc: 'Connecting 40M+ farmers directly with food processors and state grain reserves.',
    img: cooperativeFarmImg,
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-[#e0a000]" />,
    badge: 'Live Naira Prices',
    title: 'Real-time Market Transparency',
    desc: 'Track commodity rates across Dawanau, Bodija, Mile 12, and Zaki Biam markets.',
    img: marketProduceImg,
  },
  {
    icon: <Truck className="w-4 h-4 text-[#053221]" />,
    badge: 'Interstate Logistics',
    title: 'Tracked Cold-chain & Haulage',
    desc: 'Guaranteed waybills and transport route assignment across 36 States & FCT.',
    img: agritechLogisticsImg,
  },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLogin }) => {
  const { setActiveView } = useApp();
  const { loginRole, user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance highlights every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HIGHLIGHT_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      setActiveView('role_selection');
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      if (!user) {
        loginRole('farmer');
      }
      setActiveView('role_selection');
    }
  };

  const currentSlide = HIGHLIGHT_SLIDES[activeSlide];

  return (
    <div className="min-h-screen bg-[#f4f7f5] sm:bg-[#e6ece8] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 selection:bg-[#c1ecd4]">
      {/* Container Box */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md sm:max-w-xl bg-white sm:rounded-3xl sm:shadow-2xl sm:border sm:border-[#d0d7d2] p-5 sm:p-8 flex flex-col justify-between items-center my-auto relative overflow-hidden min-h-[92vh] sm:min-h-[720px]"
      >
        {/* Decorative Top Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#008751]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-[#e0a000]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Federal Nigerian Identity Tag */}
        <div className="w-full flex flex-col items-center gap-2.5 z-10 pt-1">
          {/* Green-White-Green Flag Accent Tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 bg-[#f0f7f3] border border-[#c2e2d0] px-3 py-1 rounded-full shadow-2xs"
          >
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="w-2 h-3.5 bg-[#008751] rounded-xs" />
              <span className="w-2 h-3.5 bg-white border-y border-[#d0d7d2] rounded-xs" />
              <span className="w-2 h-3.5 bg-[#008751] rounded-xs" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-[#004d2e] uppercase">
              Federal Ministry of Agriculture & Food Security x USUCO
            </span>
          </motion.div>

          {/* Logo Brand Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="pt-1"
          >
            <AgroAppLogo iconSize={38} textSize="text-3xl sm:text-4xl" />
          </motion.div>
        </div>

        {/* Dynamic Hero Carousel Card */}
        <div className="w-full flex-1 flex flex-col justify-center items-center my-3 z-10 space-y-4 max-w-lg">
          {/* Animated Media Frame */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#dce4de] bg-slate-100 relative group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.img}
                src={currentSlide.img}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Gradient Overlay for bottom readable badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            {/* Top Floating Glass Badge */}
            <div className="absolute top-3 left-3 bg-[#012d1d]/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c1ecd4]" />
              <span>36 States & FCT Digital Registry</span>
            </div>

            {/* Bottom Overlay Info on Image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white">
                <span className="text-[10px] text-[#c1ecd4] font-bold block uppercase tracking-wide">
                  Live Commodity Index
                </span>
                <span className="text-xs font-bold font-mono text-white">
                  🇳🇬 Maize ₦480k/T • Paddy ₦520k/T
                </span>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/15">
                {HIGHLIGHT_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-5 bg-[#c1ecd4]' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Staggered Text & Value Proposition */}
          <div className="w-full text-center space-y-2 px-1 min-h-[96px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center gap-1.5 bg-[#f0f7f3] text-[#008751] font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-[#c2e2d0]">
                  {currentSlide.icon}
                  <span>{currentSlide.badge}</span>
                </div>
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#111827] tracking-tight leading-tight">
                  {currentSlide.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#4b5563] max-w-md mx-auto leading-relaxed">
                  {currentSlide.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Key Metrics Strip */}
          <div className="w-full grid grid-cols-3 gap-2 pt-1 border-t border-[#e2e8e4]">
            <div className="p-2 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
              <div className="text-xs sm:text-sm font-extrabold text-[#008751] font-heading">36 States</div>
              <div className="text-[10px] text-[#6b7280] font-medium">+ FCT Abuja</div>
            </div>
            <div className="p-2 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
              <div className="text-xs sm:text-sm font-extrabold text-[#111827] font-heading">40M+</div>
              <div className="text-[10px] text-[#6b7280] font-medium">Smallholders</div>
            </div>
            <div className="p-2 rounded-xl bg-[#f8faf9] border border-[#e2e8e4] text-center">
              <div className="text-xs sm:text-sm font-extrabold text-[#008751] font-heading">Zero-Fee</div>
              <div className="text-[10px] text-[#6b7280] font-medium">PWA Offline</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full pt-2 space-y-3 text-center z-10"
        >
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleGetStarted}
            className="w-full h-13 sm:h-14 bg-[#053221] hover:bg-[#09462e] text-white font-heading font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Subtle Shimmer Effect */}
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

            <Sparkles className="w-4 h-4 text-[#c1ecd4]" />
            <span>Get Started / Select Profile Role</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <div className="flex items-center justify-between text-xs text-[#6b7280] px-1">
            <span>Already registered on AgroApp?</span>
            <button
              onClick={handleLogin}
              className="font-bold text-[#008751] hover:text-[#053221] hover:underline cursor-pointer transition-colors"
            >
              Sign In to Account →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};


