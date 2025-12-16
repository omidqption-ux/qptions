import React from 'react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import SEOAlternates from '@/components/SEOAlternates'

export default function Glossary() {
     const { t: tGlossary, i18n } = useTranslation('glossary')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Terms come from locale JSON: glossary.terms = [{ key, title, desc }]
     const terms = tGlossary('terms', { returnObjects: true }) || []

     return (
          <>
               <Head>
                    <title>{tGlossary('seo.title')}</title>
                    <meta name="description" content={tGlossary('seo.description')} />
                    <meta name="keywords" content={tGlossary('seo.keywords')} />
                    {/* Open Graph / Twitter (localized) */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tGlossary('seo.ogTitle')} />
                    <meta property="og:description" content={tGlossary('seo.ogDescription')} />
                    <meta property="og:image" content={tGlossary('seo.image')} />
                    <meta property="og:url" content={tGlossary('seo.url')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={tGlossary('seo.twitterSite')} />
                    <meta name="twitter:title" content={tGlossary('seo.twitterTitle')} />
                    <meta name="twitter:description" content={tGlossary('seo.twitterDescription')} />
                    <meta name="twitter:image" content={tGlossary('seo.twitterImage')} />

                    <link rel="canonical" href={tGlossary('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
                    >
                         <div className="my-6 flex flex-col items-start w-full max-w-7xl mx-auto">
                              <div className="p-4 w-full">
                                   {/* Heading */}
                                   <div className="text-center">
                                        <span className="text-xl lg:text-3xl font-bold text-green-500">
                                             {tGlossary('hero.title')}
                                        </span>
                                   </div>

                                   {/* Terms */}
                                   <div className={`mt-6 space-y-8 text-blue-100 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {terms.map((term, idx) => (
                                             <div key={term.key || idx} className="p-4 rounded shadow border border-white/10 bg-white/5">
                                                  <span className="text-2xl font-semibold text-green-700 block">
                                                       {term.title}
                                                  </span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                       <li>
                                                            <span>{term.desc}</span>
                                                       </li>
                                                  </ul>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </main>
               </SlideUpSection>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'glossary'],
                    i18nConfig
               )),
          },
     }
}
