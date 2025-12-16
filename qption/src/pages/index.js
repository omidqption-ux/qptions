import Benefits from '@/components/mainPageParts/Benefits'
import Investment from '@/components/mainPageParts/Investment'
import TopPage from '@/components/mainPageParts/top'
import FoundationPart from '@/components/mainPageParts/Foundation'
import SimpleStart from '@/components/mainPageParts/SimpleStart'
import { motion } from 'framer-motion'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Page = () => {

     return (
          <>
               <SEOAlternates />
               <div className='w-full flex flex-col relative bg-linear-to-b from-[#142B47]  to-[#142B47]/90 '>
                    <div className='w-full '>
                         <TopPage />
                    </div>
                    <div className='w-full relative'>
                         <div className='absolute inset-0 overflow-hidden'>
                              <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: [0.5, 1, 0.5] }}
                                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                   className="absolute top-0 left-1/2 w-34 h-34 bg-[#3197F0] rounded-full blur-3xl"
                              />
                         </div>
                         <Benefits />
                    </div>
                    <div className='w-full relative'>
                         <div className='absolute inset-0 overflow-hidden'>
                              <motion.div
                                   initial={{ scale: 0 }}
                                   animate={{ scale: [0.5, 1, 0.5] }}
                                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                   className="absolute top-0 right-1/2 w-54 h-54 bg-[#21b474]/50 rounded-full blur-3xl"
                              />
                         </div>
                         <SimpleStart />
                    </div>
                    <div className='w-full relative'>
                         <div className='absolute inset-0 overflow-hidden'>
                              <motion.div
                                   initial={{ scale: 1 }}
                                   animate={{ scale: [0.5, 1, 0.5] }}
                                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                   className="absolute top-0 right-1/2 w-64 h-64 bg-[#3197F0]/50 rounded-full blur-3xl"
                              />
                         </div>
                         <FoundationPart />
                    </div>
                    <div className='w-full relative'>
                         <div className='absolute inset-0 overflow-hidden'>
                              <motion.div
                                   initial={{ scale: 1 }}
                                   animate={{ scale: [0.5, 1, 0.5] }}
                                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                   className="absolute top-0 right-1/2 w-64 h-64 bg-[#21b474]/50 rounded-full blur-3xl"
                              />
                         </div>
                         <Investment />
                    </div>
               </div>
          </>
     )
}

export default Page

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'home', 'nav', 'footer', 'slogan', 'auth'], i18nConfig)),
          }
     };
}
