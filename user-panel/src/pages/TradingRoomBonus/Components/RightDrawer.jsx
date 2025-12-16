import TimeBox from './OptionPanel/TimeBox'
import Amount from './OptionPanel/Amount'
import OptionPanel from './OptionPanel/OptionPanel'
import Payout from './OptionPanel/Payout'

const RightDrawer = ({ socket }) => {
     return (
          <div className='w-[90px] lg:min-w-[120px] py-4 gap-5 flex h-full flex-col items-center justify-start bg-gradient-to-b from-blue-500/10 to-blue-500/3 backdrop-blur-sm border-l border-blue-500/10 shadow-lg'>
               <Amount />
               <TimeBox />
               <Payout />
               <div className='w-full'>
                    <OptionPanel socket={socket} />
               </div>
          </div>
     )
}
export default RightDrawer
