export const fmtDay = (d, tz) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(d)
    const get = k => parts.find(p => p.type === k).value
    return `${get('year')}-${get('month')}-${get('day')}` // YYYY-MM-DD
}
export const fmtMonth = (d, tz) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, year: 'numeric', month: '2-digit'
    }).formatToParts(d)
    const get = k => parts.find(p => p.type === k).value
    return `${get('year')}-${get('month')}` // YYYY-MM
}