// recaptcha.js
// Expects NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY and NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY

const V3_SITE_KEY = '6Lc6k_ArAAAAAKvwWBxOCXNo7dNF37U33yrzGHZu'
const V2_SITE_KEY = '6Ldck_ArAAAAANNTQEHdUyQbK2Y1X_jgPDCxE4sK'

function loadScriptOnce(src, id) {
    if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
    if (document.getElementById(id)) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.id = id;
        s.src = src;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load: " + src));
        document.head.appendChild(s);
    });
}

class RecaptchaManager {
    constructor() {
        this.v3Loaded = null;
        this.v2Loaded = null;
        this.v2WidgetId = null;
        this.v2Container = null;
        this.v2Busy = false;
    }

    ensureV3() {
        if (!this.v3Loaded) {
            this.v3Loaded = loadScriptOnce(
                "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(V3_SITE_KEY),
                "recaptcha-v3"
            ).then(() => new Promise((resolve) => {
                const iv = setInterval(() => {
                    if (window.grecaptcha && window.grecaptcha.ready) {
                        clearInterval(iv);
                        window.grecaptcha.ready(() => resolve());
                    }
                }, 30);
            }));
        }
        return this.v3Loaded;
    }

    async executeV3(action, timeoutMs = 8000) {
        await this.ensureV3();
        const grecaptcha = window.grecaptcha;
        if (!grecaptcha || !grecaptcha.execute) throw new Error("grecaptcha v3 not available");

        return new Promise((resolve, reject) => {
            const to = setTimeout(() => reject(new Error("reCAPTCHA v3 timeout")), timeoutMs);
            grecaptcha.execute(V3_SITE_KEY, { action })
                .then((token) => { clearTimeout(to); resolve(token); })
                .catch((e) => { clearTimeout(to); reject(e); });
        });
    }

    ensureV2() {
        if (!this.v2Loaded) {
            window.__recaptchaV2Onload = () => { };
            this.v2Loaded = loadScriptOnce(
                "https://www.google.com/recaptcha/api.js?onload=__recaptchaV2Onload&render=explicit",
                "recaptcha-v2"
            ).then(() => new Promise((resolve) => {
                const iv = setInterval(() => {
                    if (window.grecaptcha && window.grecaptcha.render) {
                        clearInterval(iv);
                        resolve();
                    }
                }, 30);
            }));
        }
        return this.v2Loaded;
    }

    /**
     * Render (if needed) and execute Invisible v2 in the given container.
     * onToken(token) is required; onError(msg) and onExpired() are optional.
     * Returns a cleanup function (you rarely need to call it).
     */
    async executeV2(containerEl, { onToken, onError, onExpired }, watchdogMs = 10000) {
        await this.ensureV2();
        const grecaptcha = window.grecaptcha;
        if (!grecaptcha || !grecaptcha.render) throw new Error("grecaptcha v2 not available");

        if (this.v2Container !== containerEl || this.v2WidgetId == null) {
            this.v2Container = containerEl;
            this.v2WidgetId = grecaptcha.render(containerEl, {
                sitekey: V2_SITE_KEY,
                size: "invisible",
                callback: (t) => {
                    clearTimeout(watchdog);
                    this.v2Busy = false;
                    if (onToken) onToken(t);
                },
                "error-callback": () => {
                    clearTimeout(watchdog);
                    this.v2Busy = false;
                    if (onError) onError("reCAPTCHA v2 error");
                },
                "expired-callback": () => {
                    clearTimeout(watchdog);
                    this.v2Busy = false;
                    if (onExpired) onExpired();
                },
            });
        }

        if (this.v2Busy) return () => { };
        this.v2Busy = true;

        const watchdog = setTimeout(() => {
            this.v2Busy = false;
            if (onError) onError("reCAPTCHA v2 watchdog timeout (ad-block/CSP?)");
        }, watchdogMs);

        grecaptcha.execute(this.v2WidgetId);

        return () => { clearTimeout(watchdog); };
    }
}

const recaptcha = new RecaptchaManager();
export default recaptcha;
