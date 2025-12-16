import moment from 'moment-timezone'

const timezones = moment.tz.names().map((tz) => {
     const offset = moment.tz(tz).utcOffset() // Get offset in minutes
     const hours = Math.floor(offset / 60)
     const minutes = Math.abs(offset % 60)
     const formattedOffset = `UTC${hours >= 0 ? '+' : ''}${hours}:${minutes
          .toString()
          .padStart(2, '0')}`

     return {
          value: tz,
          label: `${tz} (${formattedOffset})`,
     }
})

const UTCSelect = ({ disabled, selected, onChange }) => {
     return (
          <select
               value={selected}
               onChange={(e) => onChange(e.target.value)}
               disabled={disabled}
               className={`w-[200px] bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] text-xs rounded-lg`}
          >
               {timezones.map((tz) => (
                    <option
                         key={tz.value}
                         value={tz.label}
                    >
                         {tz.label}
                    </option>
               ))}
          </select>
     )
}
export default UTCSelect
