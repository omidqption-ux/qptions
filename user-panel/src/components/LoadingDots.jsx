const LoadingDots = ({ label = "loading" }) => (
  <span className="inline-flex items-center">
    {label}
    <span className="ml-1 inline-flex">
      <span className="dot">.</span>
      <span className="dot" style={{ animationDelay: '0.2s' }}>.</span>
      <span className="dot" style={{ animationDelay: '0.4s' }}>.</span>
    </span>

    <style jsx>{`
      .dot {
        opacity: 0;
        animation: dotFade 1.2s infinite;
      }
      @keyframes dotFade {
        0%   { opacity: 0; transform: translateY(0); }
        30%  { opacity: 1; transform: translateY(-1px); }
        60%  { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; }
      }
    `}</style>
  </span>
)
export default LoadingDots