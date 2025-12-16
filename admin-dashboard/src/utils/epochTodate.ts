export function formatEpoch(epoch: number, tz = 'local') {
    const ms = epoch < 1e12 ? epoch * 1000 : epoch; // auto-handle sec vs ms
    const d = new Date(ms);

    const pad = (n: any) => String(n).padStart(2, '0');

    const day = tz === 'utc' ? pad(d.getUTCDate()) : pad(d.getDate());
    const month = tz === 'utc' ? pad(d.getUTCMonth() + 1) : pad(d.getMonth() + 1);
    const year = tz === 'utc' ? d.getUTCFullYear() : d.getFullYear();
    const hour = tz === 'utc' ? pad(d.getUTCHours()) : pad(d.getHours());
    const min = tz === 'utc' ? pad(d.getUTCMinutes()) : pad(d.getMinutes());
    const sec = tz === 'utc' ? pad(d.getUTCSeconds()) : pad(d.getSeconds());

    return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
}