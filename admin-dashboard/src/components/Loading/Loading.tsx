const LoadingOverlay = () => {
    return (
        <div
            className="
                fixed inset-0 z-[9999]
                flex items-center justify-center
                bg-slate-950
                bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%)]
                backdrop-blur-xl
            "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 450.15 450.15"
                className="w-40 h-40"
            >
                <defs>
                    <style>{`
                        .cls-1 { fill: url(#linear-gradient); }
                        .cls-2 { fill: url(#linear-gradient-2); }
                        .cls-3 { fill: #132a46; } /* original blue */
                        .cls-4 { fill: url(#linear-gradient-3); }
                        .cls-5 { fill: url(#linear-gradient-4); }

                        /* BLUE PART: reveal ONCE from left to right */
                        .blue-mask-rect {
                            animation: blue-reveal 1s ease-out forwards;
                        }
                        @keyframes blue-reveal {
                            0%   { width: 0; }
                            100% { width: 450.15px; }
                        }

                        /* GREEN BASE: shared animation */
                        .green-anim {
                            opacity: 0;
                            transform: scaleY(0);
                            animation: green-grow 3s ease-in-out infinite;
                            transform-box: fill-box; /* important for origin */
                        }

                        /* Direction classes */
                        .green-up {
                            transform-origin: 50% 100%; /* bottom */
                        }
                        .green-down {
                            transform-origin: 50% 0%;   /* top */
                        }

                        /* stagger timing: 1 → 2 → 3 → 4 */
                        .green-1 { animation-delay: 0s; }
                        .green-2 { animation-delay: 0.45s; }
                        .green-3 { animation-delay: 0.9s; }
                        .green-4 { animation-delay: 1.35s; }

                        @keyframes green-grow {
                            0% {
                                transform: scaleY(0);
                                opacity: 0;
                            }
                            18% {
                                transform: scaleY(1);
                                opacity: 1;
                            }
                            38% {
                                transform: scaleY(1);
                                opacity: 1;
                            }
                            65% {
                                transform: scaleY(0);
                                opacity: 0;
                            }
                            100% {
                                transform: scaleY(0);
                                opacity: 0;
                            }
                        }
                    `}</style>

                    {/* gradients */}
                    <linearGradient
                        id="linear-gradient"
                        x1="105.31"
                        y1="173.84"
                        x2="159.78"
                        y2="173.84"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.24" stopColor="#23b375" />
                        <stop offset="1" stopColor="#21b474" />
                    </linearGradient>

                    <linearGradient
                        id="linear-gradient-2"
                        x1="165.73"
                        y1="161.15"
                        x2="220.2"
                        y2="161.15"
                        xlinkHref="#linear-gradient"
                    />
                    <linearGradient
                        id="linear-gradient-3"
                        x1="229.84"
                        y1="162.01"
                        x2="284.41"
                        y2="162.01"
                        xlinkHref="#linear-gradient"
                    />
                    <linearGradient
                        id="linear-gradient-4"
                        x1="290.37"
                        y1="162.08"
                        x2="342.41"
                        y2="162.08"
                        xlinkHref="#linear-gradient"
                    />

                    {/* mask for blue reveal (runs once) */}
                    <mask id="blue-mask">
                        <rect
                            className="blue-mask-rect"
                            x="0"
                            y="0"
                            width="0"
                            height="450.15"
                            fill="#ffffff"
                        />
                    </mask>
                </defs>

                {/* 🔵 BLUE PART (revealed once) */}
                <g mask="url(#blue-mask)">
                    <polygon
                        className="cls-3"
                        points="165.74 194.54 165.74 230.62 196.27 230.62 196.27 314.57 220.2 314.57 220.2 207.93 220.2 183.95 220.2 171.51 165.74 194.54"
                    />
                    <path
                        className="cls-3"
                        d="M159.78,197.06l-51.64,21.83A22.67,22.67,0,0,0,128,230.62h31.78Z"
                    />
                    <path
                        className="cls-3"
                        d="M344.68,155.69l-54.31,42.08v32.85h31.78a22.68,22.68,0,0,0,22.68-22.69V158.26A21.77,21.77,0,0,0,344.68,155.69Z"
                    />
                    <polygon
                        className="cls-3"
                        points="284.41 196.22 229.95 172.8 229.95 185.3 229.95 207.93 229.95 314.57 253.88 314.57 253.88 230.62 284.41 230.62 284.41 196.22"
                    />
                </g>

                {/* 🟩 GREEN TILES */}
                {/* 1: bottom → top */}
                <path
                    className="cls-1 green-anim green-up green-1"
                    d="M159.78,135.57H128a22.69,22.69,0,0,0-22.69,22.69v49.67a22.11,22.11,0,0,0,.4,4.18l54.07-22.85Z"
                />
                {/* 2: top → bottom */}
                <path
                    className="cls-2 green-anim green-down green-2"
                    d="M197.51,135.57H165.73v51.17l54.47-23v-5.45A22.69,22.69,0,0,0,197.51,135.57Z"
                />
                {/* 3: bottom → top */}
                <path
                    className="cls-4 green-anim green-up green-3"
                    d="M284.41,135.57H252.53a22.69,22.69,0,0,0-22.69,22.69V165l54.57,23.48Z"
                />
                {/* 4: top → bottom */}
                <path
                    className="cls-5 green-anim green-down green-4"
                    d="M290.37,188.59l52-40.31A22.68,22.68,0,0,0,322,135.57H290.37Z"
                />
            </svg>
        </div>
    );
};

export default LoadingOverlay;
