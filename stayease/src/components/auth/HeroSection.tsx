import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="hidden lg:flex w-1/2 relative bg-slate-200">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAl_ebxGoTof_yjzqN6gqWqdjWgTNxSJD3gmBPK1_VqONgsCNVBSkesKkcwMBELf2NboAv9VQ8SwpdD84ahVa1YD4Fwa9ztR_CS5nt9mEmo9SQDWzApAMB76UD6PpEeUjVv2kzNJj4sIcoC5wdH8aa1lslpG8-qNUXAJPGFlachL0S8vqUkglYCaoF-3JcucFrtTeoh6KsdPM47JCjUrc6khn61D7IMO6c0yYdgtFIIiMToRji-hbtjuEWgWmCef0EagG3iKa2g5V0')",
        }}
        role="img"
        aria-label="Cozy boutique hotel room with warm lighting"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-12">
        <div className="max-w-lg animate-fade-in-up">
          <h1 className="text-white text-4xl font-bold leading-tight mb-4 drop-shadow-sm">
            Find your next perfect stay
          </h1>
          <p className="text-white/90 text-lg font-medium leading-relaxed drop-shadow-sm">
            Join millions of travelers discovering unique homes and experiences
            around the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

