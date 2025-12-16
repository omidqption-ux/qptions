// utils/timeAgo.ts (no React imports here!)

export function agoYMDHMS(iso: string | Date): string {
     const then = iso instanceof Date ? iso : new Date(iso);
     const diff = Date.now() - then.getTime(); // ms

     const ms = 1;
     const s = 1000 * ms;
     const m = 60 * s;
     const h = 60 * m;
     const d = 24 * h;
     const mo = 30 * d; // avg month
     const y = 365 * d; // avg year

     const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? 's' : ''} ago`;
     const whole = (span: number) => Math.floor(diff / span);

     if (diff < 10 * m) return 'Just now';
     if (diff < 60 * m) return plural(whole(m), 'minute');
     if (diff < 24 * h) return plural(whole(h), 'hour');
     if (diff < 30 * d) return plural(whole(d), 'day');
     if (diff < 12 * mo) return plural(whole(mo), 'month');
     return plural(whole(y), 'year');
}

export function timeAgo(date: string | number | Date): string {
     const now = new Date();
     const past = new Date(date);
     const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

     const intervals = [
          { label: 'year', seconds: 31536000 },
          { label: 'month', seconds: 2592000 },
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
          { label: 'second', seconds: 1 },
     ];

     for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count >= 1) {
               return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
          }
     }

     return 'just now';
}

export function formatTimeFromSeconds(totalSeconds: number): string {
     const minutes = Math.floor(totalSeconds / 60);
     const seconds = totalSeconds % 60;

     const minutesStr = String(minutes).padStart(2, '0');
     const secondsStr = String(seconds).padStart(2, '0');

     return `${minutesStr}:${secondsStr}`;
}

export function formatSeconds(seconds: number): string {
     const totalSeconds = Math.floor(seconds);

     if (totalSeconds < 60) {
          return '00:' + String(totalSeconds).padStart(2, '0');
     } else if (totalSeconds < 3600) {
          const minutes = Math.floor(totalSeconds / 60);
          return (
               String(minutes).padStart(2, '0') +
               ':' +
               String(totalSeconds % 60).padStart(2, '0')
          );
     } else {
          const hours = Math.floor(totalSeconds / 3600);
          return hours + 'h';
     }
}

/**
 * Return parts for HH:MM:SS
 */
export function formatTimeParts(totalSeconds: number) {
     const hours = Math.floor(totalSeconds / 3600);
     const remainingSeconds = totalSeconds % 3600;
     const minutes = Math.floor(remainingSeconds / 60);
     const seconds = remainingSeconds % 60;

     const hh = String(hours).padStart(2, '0');
     const mm = String(minutes).padStart(2, '0');
     const ss = String(seconds).padStart(2, '0');

     return { hh, mm, ss };
}

/**
 * Simple "HH:MM:SS" string
 */
export function formatTimeString(totalSeconds: number): string {
     const { hh, mm, ss } = formatTimeParts(totalSeconds);
     return `${hh}:${mm}:${ss}`;
}

/**
 * If you still want a small compact string
 */
export function formatTimeSmallString(totalSeconds: number): string {
     return formatTimeString(totalSeconds); // or any variant
}

export function formatDateTime(isoString: string): string {
     const dateObj = new Date(isoString);

     const yy = dateObj.getFullYear().toString().slice(-2);
     const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
     const dd = String(dateObj.getDate()).padStart(2, '0');

     const hh = String(dateObj.getHours()).padStart(2, '0');
     const min = String(dateObj.getMinutes()).padStart(2, '0');
     const ss = String(dateObj.getSeconds()).padStart(2, '0');

     const datePart = `${yy}-${mm}-${dd}`;
     const timePart = `${hh}:${min}:${ss}`;

     return `${datePart} ${timePart}`;
}

export function getEpochFromDate(dateString: string): number {
     // "YY:MM:DD HH:MM:SS"
     const parts = dateString.split(/[:\s]/);
     if (parts.length !== 6) {
          throw new Error('Invalid date format. Expected format: YY:MM:DD HH:MM:SS');
     }

     let [yy, mm, dd, hh, min, ss] = parts.map(Number);
     const yyyy = yy < 100 ? 2000 + yy : yy;

     const date = new Date(yyyy, mm - 1, dd, hh, min, ss);

     return Math.floor(date.getTime() / 1000);
}

export function formatDateFromEpoch(epoch: number): string {
     const date = new Date(epoch * 1000);

     const yy = date.getFullYear() % 100;
     const mm = String(date.getMonth() + 1).padStart(2, '0');
     const dd = String(date.getDate()).padStart(2, '0');
     const hh = String(date.getHours()).padStart(2, '0');
     const min = String(date.getMinutes()).padStart(2, '0');
     const ss = String(date.getSeconds()).padStart(2, '0');

     return `${yy}/${mm}/${dd} ${hh}:${min}:${ss}`;
}
