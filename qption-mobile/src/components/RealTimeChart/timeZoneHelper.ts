/**
 * Resolves a valid IANA time zone string.
 *
 * @param automaticDetection - If true, use the browser's time zone (if available).
 * @param timeZone - Fallback / explicit time zone (e.g. "Europe/Sofia", "UTC").
 * @returns A valid time zone string; defaults to "UTC".
 */
export function resolveTimeZone(
    automaticDetection: boolean,
    timeZone?: string | null
): string {
    if (automaticDetection) {
        try {
            const z = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (z && typeof z === "string") return z; // e.g., "Europe/Sofia"
        } catch {
            // ignore and fall back
        }
    }
    return timeZone || "UTC";
}
