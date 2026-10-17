import React from 'react';

interface SplashScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

  const slides = [
    {
      image: '/src/assets/images/african_agritech_tablet_1791954606275.jpg',
      badge: 'Smart Agronomy & IoT Telemetry',
      badgeIcon: 'sensors',
      title: 'Precision Farm Advisory',
      description: 'Satellite & field sensors delivering localized soil data to smallholders across Nigeria.',
      ticker: 'NG Maize ₦480k/T • Soil Moisture 68%',
      alt: 'African agronomist using digital tablet and solar telemetry in maize field',
    },
    {
      image: '/src/assets/images/african_drone_farming_1791954607666.jpg',
      badge: 'Aerial Drone Survey & Mapping',
      badgeIcon: 'flight',
      title: 'Multispectral Crop Health',
      description: 'Early pest and drought detection across grain belts in Kaduna, Niger and Benue.',
      ticker: 'Paddy Rice ₦520k/T • Drone Scan Active',
      alt: 'African agricultural engineer operating monitoring drone over golden harvest fields',
    },
    {
      image: '/src/assets/images/african_smart_greenhouse_1791954607562.jpg',
      badge: 'Climate-Smart Hydroponics',
      badgeIcon: 'psychiatry',
      title: 'Controlled Environment Farming',
      description: 'Automated solar irrigation and micro-climate regulation for high-yield horticulture.',
      ticker: 'Bell Peppers ₦18k/Crate • Zone 3 Online',
      alt: 'African female scientist monitoring hydroponic produce in modern smart greenhouse',
    },
    {
      image: '/src/assets/images/african_digital_market_1791954607959.jpg',
      badge: 'Digital Weighing & Trade Hubs',
      badgeIcon: 'qr_code_scanner',
      title: 'Real-Time Commodity Offtake',
      description: 'Mobile digital payments, electronic scale manifests, and verified cooperative offtake.',
      ticker: 'Soybeans ₦610k/T • Digital Trade Hub',
      alt: 'African cooperative farmers and traders using digital devices at harvest collection hub',
    },
  ];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLogin }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-[#ebf0ed] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[500px] overflow-hidden">
        <div className="p-6 pb-8 space-y-6">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-10 bg-[#063d28] rounded-bl-full rounded-br-full rounded-tr-full flex items-center justify-center relative overflow-hidden">
                <span className="material-symbols-outlined text-[#f2a611] text-[20px] absolute">emoji_nature</span>
              </div>
              <h1 className="font-heading font-black text-2xl text-[#012d1d] tracking-tight flex items-baseline">
                Agro<span className="text-[#f2a611]">App</span><span className="text-[#063d28] w-1.5 h-1.5 rounded-full bg-[#063d28] ml-1"></span>
              </h1>
            </div>
            <p className="text-[10px] mt-1 text-[#414844] font-bold tracking-widest uppercase">
              FEDERAL MINISTRY OF AGRICULTURE • USUCO AGRO-CONNECT
            </p>
          </div>

          {/* Hero Image Slider Card */}
          <div 
            className="relative w-full aspect-[4/2.5] rounded-2xl overflow-hidden shadow-inner group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slide Images */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.alt} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              </div>
            ))}

            {/* Top Badge (Dynamic per slide) */}
            <div className="absolute top-3 left-3 z-20 bg-[#0a3826]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/20 shadow-md">
              <span className="material-symbols-outlined text-[13px] text-[#f2a611]">{slides[currentSlide].badgeIcon}</span>
              <span>{slides[currentSlide].badge}</span>
            </div>

            {/* Slide Index Counter Badge */}
            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/10">
              {currentSlide + 1} / {slides.length}
            </div>

            {/* Previous & Next Control Buttons */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-[#0a3826] text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-75 hover:opacity-100 active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-[#0a3826] text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-75 hover:opacity-100 active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>

            {/* Bottom Bar overlay with Ticker & Pagination Indicators */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#1e2a22]/90 backdrop-blur-md px-3 py-2 flex justify-between items-center text-white border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[8.5px] font-bold text-[#f2a611] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-ping" />
                  AGRITECH LIVE TELEMETRY
                </span>
                <div className="text-[11px] font-bold flex items-center gap-1.5 text-white/95">
                  <span>{slides[currentSlide].ticker}</span>
                </div>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(dotIndex);
                    }}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIndex === currentSlide 
                        ? 'w-5 bg-[#f2a611]' 
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Slide Context Headline */}
          <div className="text-center space-y-2 px-2 transition-all">
            <div className="inline-flex items-center gap-1.5 bg-[#f4f7f5] border border-[#c1c8c2]/60 rounded-full px-3 py-1 shadow-sm">
              <span className="material-symbols-outlined text-[#f2a611] text-[15px]">psychology</span>
              <span className="text-[#0a3826] font-bold text-[11px]">Nigerian Agri-Technology Initiative</span>
            </div>

            <h2 className="font-heading font-black text-2xl text-[#1a1c1c] leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs text-[#414844] max-w-sm mx-auto leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[#c1c8c2] rounded-xl p-2 text-center bg-[#f9faf9]">
              <div className="font-bold text-[#0a3826] text-sm">36 States</div>
              <div className="text-[10px] text-[#717973]">+ FCT Abuja</div>
            </div>
            <div className="border border-[#c1c8c2] rounded-xl p-2 text-center bg-[#f9faf9]">
              <div className="font-bold text-[#1a1c1c] text-sm">40M+</div>
              <div className="text-[10px] text-[#717973]">Smallholders</div>
            </div>
            <div className="border border-[#c1c8c2] rounded-xl p-2 text-center bg-[#f9faf9]">
              <div className="font-bold text-[#1a1c1c] text-sm">Zero-Fee</div>
              <div className="text-[10px] text-[#717973]">PWA Offline</div>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-2 space-y-3.5">
            <button
              onClick={onGetStarted}
              className="w-full h-14 bg-[#0a3826] text-white font-heading font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              <span>Browse Roles & Enter</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <div className="text-center flex justify-between items-center text-[12px] px-1">
              <span className="text-[#717973]">Quick demo access?</span>
              <button
                onClick={onLogin}
                className="font-bold text-[#0a3826] hover:text-[#1b4332] flex items-center"
              >
                Enter Directly as Farmer
                <span className="material-symbols-outlined text-[14px] ml-0.5">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
