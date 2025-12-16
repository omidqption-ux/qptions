import React from "react";

export default function CrossHatchLoader({
    line = 2,            // hatch line thickness (px)
    gap = 10,            // distance between lines (px)
    tilt = 45,           // hatch angle (deg)
    speed = 2.4,         // animation loop (s)
    fg = "rgba(255,255,255,0.08)", // hatch color
    bg = "#0b0f14",      // background
    shimmer = true,      // sweeping highlight on top
    className = "",      // allow extra layout classes
}) {
    const style = {
        "--line": `${line}px`,
        "--gap": `${gap}px`,
        "--unit": `${line + gap}px`,
        "--tilt": `${tilt}deg`,
        "--speed": `${speed}s`,
        "--fg": fg,
        "--bg": bg,
    };

    return (
        <div style={style} className={`crosshatch-wrap ${className}`}>
            <div className="crosshatch-pattern" />
            {shimmer && <div className="crosshatch-shimmer" />}
        </div>
    );
}
