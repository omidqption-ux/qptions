import * as am5 from "@amcharts/amcharts5";

export function resolveTimeZone(automaticDetection, timeZone) {
    if (automaticDetection) {
        try {
            const z = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (z && typeof z === "string") return z; // e.g., "Europe/Sofia"
        } catch { }
    }
    return timeZone || "UTC";
}
export function applyAm5TimeZone(root, tz) {
    if (tz === "UTC") {
        root.utc = true;                 // faster for UTC
        // optional: clear named tz if it was set before
        // @ts-ignore
        root.timezone = undefined;
    } else {
        root.utc = false;
        root.timezone = am5.Timezone.new(tz); // e.g., "Europe/Sofia"
    }
}