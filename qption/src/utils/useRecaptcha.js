"use client";
import { useEffect, useRef } from "react";
import recaptcha from "./recaptcha";

export function useRecaptchaV2() {
    const containerRef = useRef(null);

    useEffect(() => {
        return () => {
            // keep widget for reuse; nothing required on unmount
        };
    }, []);

    return {
        containerRef,
        run: async function (onToken, onError) {
            if (!containerRef.current) throw new Error("No v2 container");
            return recaptcha.executeV2(
                containerRef.current,
                {
                    onToken,
                    onError,
                    onExpired: () => onError && onError("reCAPTCHA v2 expired; retrying…"),
                }
            );
        },
    };
}

export function runV3(action) {
    return recaptcha.executeV3(action);
}
