const LogoLoader = ({ size = 21.5, className = "" }) => {
    const resolvedSize = typeof size === "number" ? `${size}px` : size;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="100 110 240 140"   // 🔥 NEW: only green section area
            style={{ width: resolvedSize, height: resolvedSize }}
            className={className}
        >
            <defs>
                <style>{`
                    .cls-1 { fill: url(#linear-gradient); }
                    .cls-2 { fill: url(#linear-gradient-2); }
                    .cls-4 { fill: url(#linear-gradient-3); }
                    .cls-5 { fill: url(#linear-gradient-4); }

                    /* GREEN BASE: shared animation */
                    .green-anim {
                        opacity: 0;
                        transform: scaleY(0);
                        animation: green-grow 3s ease-in-out infinite;
                        transform-box: fill-box;
                    }

                    .green-up { transform-origin: 50% 100%; }
                    .green-down { transform-origin: 50% 0%; }

                    .green-1 { animation-delay: 0s; }
                    .green-2 { animation-delay: 0.45s; }
                    .green-3 { animation-delay: 0.9s; }
                    .green-4 { animation-delay: 1.35s; }

                    @keyframes green-grow {
                        0%   { transform: scaleY(0); opacity: 0; }
                        18%  { transform: scaleY(1); opacity: 1; }
                        38%  { transform: scaleY(1); opacity: 1; }
                        65%  { transform: scaleY(0); opacity: 0; }
                        100% { transform: scaleY(0); opacity: 0; }
                    }
                `}</style>

                {/* gradients */}
                <linearGradient
                    id="linear-gradient"
                    x1="105.31" y1="173.84" x2="159.78" y2="173.84"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.24" stopColor="#23b375" />
                    <stop offset="1" stopColor="#21b474" />
                </linearGradient>
                <linearGradient
                    id="linear-gradient-2"
                    x1="165.73" y1="161.15" x2="220.2" y2="161.15"
                    xlinkHref="#linear-gradient"
                />
                <linearGradient
                    id="linear-gradient-3"
                    x1="229.84" y1="162.01" x2="284.41" y2="162.01"
                    xlinkHref="#linear-gradient"
                />
                <linearGradient
                    id="linear-gradient-4"
                    x1="290.37" y1="162.08" x2="342.41" y2="162.08"
                    xlinkHref="#linear-gradient"
                />
            </defs>

            {/* 🟩 GREEN TILES – ONLY! */}
            <path className="cls-1 green-anim green-up green-1"
                d="M159.78,135.57H128a22.69,22.69,0,0,0-22.69,22.69v49.67a22.11,22.11,0,0,0,.4,4.18l54.07-22.85Z"
            />
            <path className="cls-2 green-anim green-down green-2"
                d="M197.51,135.57H165.73v51.17l54.47-23v-5.45A22.69,22.69,0,0,0,197.51,135.57Z"
            />
            <path className="cls-4 green-anim green-up green-3"
                d="M284.41,135.57H252.53a22.69,22.69,0,0,0-22.69,22.69V165l54.57,23.48Z"
            />
            <path className="cls-5 green-anim green-down green-4"
                d="M290.37,188.59l52-40.31A22.68,22.68,0,0,0,322,135.57H290.37Z"
            />
        </svg>
    );
};

export default LogoLoader;
