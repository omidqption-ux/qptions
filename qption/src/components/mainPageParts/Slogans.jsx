import { useTranslation } from 'next-i18next'

const Slogans = ({ className }) => {
     const { t, i18n } = useTranslation('slogan')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)
     return (
          <div dir={isRTL ? "rtl" : 'ltr'} className={'mb-6 flex flex-col items-center mx-2 ' + className}>
               <div className="mt-4 sm:mt-12 font-extrabold text-xl lg:text-4xl">
                    <span className="text-[#3197F0]">{t('main.part1')} </span>
                    <span className="text-green-400 mx-1">{t('main.part2')}</span>
                    <span className="text-[#3197F0]">{t('main.part3')} </span>
                    <span className="text-green-400">{t('main.part4')}</span>
               </div>
               <div className="mt-4 flex flex-col gap-2 text-gray-400 text-center">
                    <span className="text-lg lg:text-xl">{t('sub.line1')}</span>
                    <span className="text-sm lg:text-lg">{t('sub.line2')}</span>
               </div>
          </div>
     )
}
export default Slogans

