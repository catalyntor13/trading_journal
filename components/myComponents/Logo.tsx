
const Logo = ({ collapsed }: { collapsed?: boolean }) => {
  return (
    <div className="flex items-center gap-3 text-foreground font-semibold text-xl cursor-pointer hover:opacity-90 transition-opacity">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-30 rounded-full scale-150"></div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-orange-500 relative z-10"
        >
          <circle cx="12" cy="12" r="9" fill="currentColor" />
          <circle cx="9" cy="9" r="2.5" fill="#9a3412" opacity="0.6" />
          <circle cx="14" cy="14" r="3" fill="#9a3412" opacity="0.5" />
          <circle cx="16" cy="7" r="1.5" fill="#9a3412" opacity="0.6" />
          <circle cx="7" cy="14" r="1" fill="#9a3412" opacity="0.5" />
          <circle cx="12" cy="17" r="2" fill="#9a3412" opacity="0.4" />
        </svg>
      </div>
      {!collapsed && (
        <span className="tracking-wide text-white uppercase font-bold drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
          Journal
        </span>
      )}
    </div>
  );
};

export default Logo;