export function agoYMDHMS(iso) {
     const then = iso instanceof Date ? iso : new Date(iso)
     const diff = Date.now() - then.getTime() // ms

     const ms = 1
     const s = 1000 * ms
     const m = 60 * s
     const h = 60 * m
     const d = 24 * h
     const mo = 30 * d // average month
     const y = 365 * d // average year

     const plural = (n, word) => `${n} ${word}${n !== 1 ? 's' : ''} ago`
     const whole = (span) => Math.floor(diff / span)

     if (diff < 10 * m) return 'Just now'
     if (diff < 60 * m) return plural(whole(m), 'minute')
     if (diff < 24 * h) return plural(whole(h), 'hour')
     if (diff < 30 * d) return plural(whole(d), 'day')
     if (diff < 12 * mo) return plural(whole(mo), 'month')
     return plural(whole(y), 'year')
}
export function timeAgo(date) {
     const now = new Date()
     const past = new Date(date)
     const seconds = Math.floor((now - past) / 1000)

     const intervals = [
          { label: 'year', seconds: 31536000 },
          { label: 'month', seconds: 2592000 },
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
          { label: 'second', seconds: 1 },
     ]

     for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds)
          if (count >= 1) {
               return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
          }
     }

     return 'just now'
}
export function formatTimeFromSeconds(totalSeconds) {
     const minutes = Math.floor(totalSeconds / 60)
     const seconds = totalSeconds % 60

     const minutesStr = String(minutes).padStart(2, '0')
     const secondsStr = String(seconds).padStart(2, '0')

     return `${minutesStr}:${secondsStr}`
}
export function formatSeconds(seconds) {
     const totalSeconds = Math.floor(seconds)

     if (totalSeconds < 60) {
          return '00:' + String(totalSeconds).padStart(2, '0')
     } else if (totalSeconds < 3600) {
          const minutes = Math.floor(totalSeconds / 60)
          return (
               String(minutes).padStart(2, '0') +
               ':' +
               String(totalSeconds % 60).padStart(2, '0')
          )
     } else {
          const hours = Math.floor(totalSeconds / 3600)
          return hours + 'h'
     }
}
export function formatTime(totalSeconds) {
     // Calculate hours, minutes, and seconds
     const hours = Math.floor(totalSeconds / 3600)
     const remainingSeconds = totalSeconds % 3600
     const minutes = Math.floor(remainingSeconds / 60)
     const seconds = remainingSeconds % 60

     // Zero-pad each unit to 2 digits and build the final string
     const hh = String(hours).padStart(2, '0')
     const mm = String(minutes).padStart(2, '0')
     const ss = String(seconds).padStart(2, '0')

     return (
          <div className='flex justify-center items-center w-full'>
               <span className='w-[30px]'>{hh}</span>:&nbsp;
               <span className='w-[30px]'> {mm}</span>:&nbsp;
               <span className='w-[30px]'> {ss}</span>
          </div>
     )
}
export function formatTimeSmall(totalSeconds) {
     // Calculate hours, minutes, and seconds
     const hours = Math.floor(totalSeconds / 3600)
     const remainingSeconds = totalSeconds % 3600
     const minutes = Math.floor(remainingSeconds / 60)
     const seconds = remainingSeconds % 60

     // Zero-pad each unit to 2 digits and build the final string
     const hh = String(hours).padStart(2, '0')
     const mm = String(minutes).padStart(2, '0')
     const ss = String(seconds).padStart(2, '0')

     return (
          <div className='flex justify-center items-center lg:w-[calc(100% - 16px)] w-[calc(100% - 12px)]'>
               <span className='w-1/3'>{hh}</span>:&nbsp;
               <span className='w-1/3'> {mm}</span>:&nbsp;
               <span className='w-1/3'> {ss}</span>
          </div>
     )
}
export function formatDateTime(isoString) {
     const dateObj = new Date(isoString)

     const yy = dateObj.getFullYear().toString().slice(-2) // سال دو رقمی
     const mm = String(dateObj.getMonth() + 1).padStart(2, '0') // ماه (01-12)
     const dd = String(dateObj.getDate()).padStart(2, '0') // روز (01-31)

     const hh = String(dateObj.getHours()).padStart(2, '0') // ساعت (00-23)
     const min = String(dateObj.getMinutes()).padStart(2, '0') // دقیقه (00-59)
     const ss = String(dateObj.getSeconds()).padStart(2, '0') // ثانیه (00-59)

     const datePart = `${yy}-${mm}-${dd}`
     const timePart = `${hh}:${min}:${ss}`

     return datePart + ' ' + timePart
}
export function getEpochFromDate(dateString) {
     // تبدیل "YY:MM:DD HH:MM:SS" به "YYYY-MM-DDTHH:MM:SS"
     const parts = dateString.split(/[:\s]/)
     if (parts.length !== 6) {
          throw new Error(
               'Invalid date format. Expected format: YY:MM:DD HH:MM:SS'
          )
     }

     let [yy, mm, dd, hh, min, ss] = parts.map(Number)

     // تبدیل YY به YYYY (اگر سال دو رقمی باشد، فرض می‌کنیم مربوط به قرن 2000 است)
     let yyyy = yy < 100 ? 2000 + yy : yy

     // ایجاد آبجکت `Date`
     const date = new Date(yyyy, mm - 1, dd, hh, min, ss) // ماه‌ها از 0 تا 11 هستند!

     // برگرداندن مقدار Epoch در **ثانیه**
     return Math.floor(date.getTime() / 1000)
}
export function formatDateFromEpoch(epoch) {
     const date = new Date(epoch * 1000)

     const yy = date.getFullYear() % 100 // فقط دو رقم آخر سال
     const mm = String(date.getMonth() + 1).padStart(2, '0') // ماه (۱ اضافه می‌کنیم چون از 0 شروع می‌شود)
     const dd = String(date.getDate()).padStart(2, '0')
     const hh = String(date.getHours()).padStart(2, '0')
     const min = String(date.getMinutes()).padStart(2, '0')
     const ss = String(date.getSeconds()).padStart(2, '0')

     return `${yy}/${mm}/${dd} ${hh}:${min}:${ss}`
}
