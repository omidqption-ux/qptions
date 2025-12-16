// hooks/useViewportVars.ts
import { useEffect } from "react";

export default function useViewportVars(enabled = true) {
    useEffect(() => {
        if (!enabled) return;
        const set = () => {
            const vv = window.visualViewport;
            const h = vv?.height ?? window.innerHeight;
            const w = vv?.width ?? window.innerWidth;
            document.documentElement.style.setProperty("--vh", `${h}px`);
            document.documentElement.style.setProperty("--vw", `${w}px`);
        };
        set();
        window.addEventListener("resize", set);
        window.addEventListener("orientationchange", set);
        window.visualViewport?.addEventListener("resize", set);
        return () => {
            window.removeEventListener("resize", set);
            window.removeEventListener("orientationchange", set);
            window.visualViewport?.removeEventListener("resize", set);
        };
    }, [enabled]);
}
