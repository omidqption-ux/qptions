// utils/emailValidation.js (or inline above the component)
const EMAIL_MAX_LEN = 254;     // overall limit
const LOCAL_MAX_LEN = 64;      // part before '@'

export const normalizeEmail = (val = '') =>
    String(val).trim().toLowerCase();

export const isValidEmail = (raw) => {
    const email = normalizeEmail(raw);

    // basic shape
    if (!email || !email.includes('@')) return false;

    // length guards
    if (email.length > EMAIL_MAX_LEN) return false;
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (local.length > LOCAL_MAX_LEN) return false;

    // pragmatic regex (case-insensitive, requires a dot TLD 2+ chars)
    const RE =
        /^(?=.{1,254}$)(?=.{1,64}@)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return RE.test(email);
};
