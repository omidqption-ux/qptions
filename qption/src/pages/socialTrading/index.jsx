'use client'

import { motion } from 'framer-motion'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const SocialTrading = () => {
     const { t, i18n } = useTranslation('socialTrading')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const seo = t('seo', { returnObjects: true })
     const page = t('page', { returnObjects: true })
     const bullets = page?.introBullets || []
     const social = page?.social || {}

     return (
          <>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name="description" content={seo?.description} />
                    <meta name="keywords" content={seo?.keywords} />
                    <meta property="og:type" content={seo?.ogType || 'website'} />
                    <meta property="og:title" content={seo?.ogTitle} />
                    <meta property="og:description" content={seo?.ogDescription} />
                    <meta property="og:url" content={seo?.ogUrl} />
                    <meta property="og:image" content={seo?.ogImage} />
                    <meta name="twitter:card" content={seo?.twitterCard} />
                    <meta name="twitter:site" content={seo?.twitterSite} />
                    <meta name="twitter:title" content={seo?.twitterTitle} />
                    <meta name="twitter:description" content={seo?.twitterDescription} />
                    <meta name="twitter:image" content={seo?.twitterImage} />
                    <link rel="canonical" href={seo?.canonical} />
                    <meta name="robots" content={seo?.robots || 'index,follow'} />
               </Head>
               <SEOAlternates />
               <main dir={isRTL ? "rtl" : "ltr"} className="font-normal bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12 ">
                    <h3 className="text-4xl font-semibold mt-8 text-green-500">
                         {page?.h1}
                    </h3>

                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="m-5 w-full xl:w-1/2 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col"
                    >
                         <ul className="list-disc pl-6 m-0">
                              {bullets.map((b, i) => (
                                   <li
                                        key={i}
                                        className="text-green-100 text-lg font-normal leading-8 my-2 marker:text-[#21b474] marker:text-[1.2rem] mx-4"
                                   >
                                        {b}
                                   </li>
                              ))}
                         </ul>
                    </motion.div>

                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="w-full xl:w-1/2 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col"
                    >
                         <video
                              src={page?.video?.src}
                              poster={page?.video?.poster}
                              controls
                              playsInline
                              preload="metadata"
                              style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                              aria-description={page?.video?.aria}
                         />
                    </motion.div>

                    <span className="text-2xl font-semibold text-green-700 my-5">
                         {page?.followUs}
                    </span>

                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mb-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 items-center justify-center place-items-center place-content-center gap-6 p-4 w-full max-w-7xl"
                    >
                         <Link
                              href="https://www.facebook.com/people/Qption/61570227296877/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              aria-label={social?.facebook?.aria}
                              className="hover:text-footerTxt border border-blue-700-fb w-[180px] flex flex-col items-center justify-center backdrop-blur-3xl py-6 rounded-lg shadow-lg relative"
                         >
                              <span className="text-4xl font-semibold flex items-center text-blue-700-fb">
                                   {social?.facebook?.label || 'Facebook'}
                              </span>
                              <span className="text-xl font-semibold text-footerTxt text-blue-700-fb">
                                   {social?.facebook?.handle}
                              </span>
                              <FacebookIcon className="absolute bottom-1 right-1 text-blue-700-fb" />
                         </Link>

                         <Link
                              href="https://twitter.com/qption"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              aria-label={social?.twitter?.aria}
                              className="hover:text-blue-tw border text-blue-tw border-blue-tw w-[180px] flex flex-col items-center justify-center backdrop-blur-3xl py-6 rounded-lg shadow-lg relative"
                         >
                              <span className="text-4xl font-semibold">
                                   {social?.twitter?.label || 'Twitter'}
                              </span>
                              <span className="text-xl font-semibold text-footerTxt">
                                   {social?.twitter?.handle}
                              </span>
                              <TwitterIcon className="absolute bottom-1 right-1" />
                         </Link>

                         <Link
                              href="https://www.instagram.com/qption_llc/#"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              aria-label={social?.instagram?.aria}
                              className="hover:text-instagram text-instagram border border-instagram w-[180px] flex flex-col items-center justify-center py-6 rounded-lg shadow-lg relative"
                         >
                              <span className="text-4xl font-semibold">
                                   {social?.instagram?.label || 'Instagram'}
                              </span>
                              <span className="text-xl font-semibold text-footerTxt">
                                   {social?.instagram?.handle}
                              </span>
                              <InstagramIcon className="absolute bottom-1 right-1" />
                         </Link>

                         <Link
                              href="https://www.youtube.com/@qption"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              aria-label={social?.youtube?.aria}
                              className="hover:text-youtube text-youtube border border-youtube w-[180px] flex flex-col items-center justify-center py-6 rounded-lg shadow-lg relative"
                         >
                              <span className="text-4xl font-semibold">
                                   {social?.youtube?.label || 'YouTube'}
                              </span>
                              <span className="text-xl font-semibold text-footerTxt">
                                   {social?.youtube?.handle}
                              </span>
                              <YouTubeIcon className="absolute bottom-1 right-1" />
                         </Link>
                    </motion.div>
               </main>
          </>
     )
}

export default SocialTrading

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'socialTrading'], i18nConfig)),
          },
     }
}
