
const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-foreground font-semibold text-xl cursor-pointer hover:opacity-90 transition-opacity">
      <div className="relative">
        <div className="absolute inset-0 bg-primary blur-lg opacity-20 rounded-full"></div>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary relative z-10"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12c2-1 5-2 9-2s7 1 9 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5 15c2-.8 4.5-1.2 7-1.2s5 .4 7 1.2"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>
      <span className="tracking-wide text-slate-100 uppercase font-bold">
        Journal
      </span>
    </div>
  );
};

export default Logo;