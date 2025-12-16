import React from 'react';
import dynamic from 'next/dynamic';
import PaymentMethods from '@/components/mainPageParts/PaymentMethods';
const Registeration = dynamic(() => import('../RegisterationModal/Registeration'), { ssr: false });
import styles from './Footer.module.css';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from 'next-i18next'


const Footer = ({ toggleMenu, isLogin }) => {
     const [openLogin, setOpenLogin] = React.useState(false);
     const [isRegister, setIsRegister] = React.useState(false);
     const handleOpen = () => setOpenLogin(true);
     const handleClose = () => setOpenLogin(false);
     const openMenu = (e, isReg) => { setIsRegister(isReg); e.preventDefault(); handleOpen(); toggleMenu && toggleMenu(); };

     const { t, i18n } = useTranslation('footer');
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);

     return (
          <div className={styles.footer + ' bg-linear-to-t from-[#142B47] to-[#142B47]/90'} dir={isRTL ? 'rtl' : 'ltr'}>
               <Registeration handleClose={handleClose} open={openLogin} isRegister={isRegister} />
               <div className={styles.container}>
                    {/* Section: Home */}
                    <div className={styles.section}>
                         <h3
                              className={`relative mb-2 pb-1
                                   text-[1.125rem] font-medium
                                   after:content-[''] after:absolute ${isRTL ? 'after:right-0' : 'after:left-0'} after:bottom-0
                                   after:h-0.5 after:w-10
                                   after:bg-linear-to-r after:from-[#21b474] after:to-[#21b474]/50
                                   after:transition-[width] after:duration-300 after:ease-linear
                                   hover:after:w-20 text-gray-300 `}
                         >
                              {t('sections.home')}
                         </h3>

                         <Link
                              onClick={() => toggleMenu && toggleMenu()}
                              href="/"
                              className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}
                         >
                              {t('links.home')}
                         </Link>

                         {!isLogin && (
                              <Link onClick={(e) => openMenu(e, true)} href="/" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                                   {t('links.register')}
                              </Link>
                         )}

                         <Link onClick={() => toggleMenu && toggleMenu()} href="/about" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.about')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/contactus" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.contact')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/faq" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.faq')}
                         </Link>
                    </div>

                    {/* Section: Trading */}
                    <div className={styles.section}>
                         <h3 className={`relative mb-2 pb-1
                                   text-[1.125rem] font-medium
                                   after:content-[''] after:absolute ${isRTL ? 'after:right-0' : 'after:left-0'} after:bottom-0
                                   after:h-0.5 after:w-10
                                   after:bg-linear-to-r after:from-[#21b474] after:to-[#21b474]/50
                                   after:transition-[width] after:duration-300 after:ease-linear
                                   hover:after:w-20 text-gray-300 `}>{t('sections.trading')}</h3>

                         <Link onClick={() => toggleMenu && toggleMenu()} href="/news" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.news')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/Accounttypes" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.accountTypes')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/socialTrading" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.socialTrading')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/AITrading" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.aiTrading')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/Affiliate" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.affiliate')}
                         </Link>
                    </div>

                    {/* Section: Education */}
                    <div className={styles.section}>
                         <h3 className={`relative mb-2 pb-1
                                   text-[1.125rem] font-medium
                                   after:content-[''] after:absolute ${isRTL ? 'after:right-0' : 'after:left-0'} after:bottom-0
                                   after:h-0.5 after:w-10
                                   after:bg-linear-to-r after:from-[#21b474] after:to-[#21b474]/50
                                   after:transition-[width] after:duration-300 after:ease-linear
                                   hover:after:w-20 text-gray-300 `}>{t('sections.education')}</h3>

                         <Link onClick={() => toggleMenu && toggleMenu()} href="/technical-analysis" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.technicalAnalysis')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/trading-strategy" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.tradingStrategies')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/graphical-analysis" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.graphicalAnalysis')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/fundamentalanalysis" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.fundamentalAnalysis')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/Glossary" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.glossary')}
                         </Link>
                    </div>

                    {/* Section: Company */}
                    <div className={styles.section}>
                         <h3 className={`relative mb-2 pb-1
                                   text-[1.125rem] font-medium
                                   after:content-[''] after:absolute ${isRTL ? 'after:right-0' : 'after:left-0'} after:bottom-0
                                   after:h-0.5 after:w-10
                                   after:bg-linear-to-r after:from-[#21b474] after:to-[#21b474]/50
                                   after:transition-[width] after:duration-300 after:ease-linear
                                   hover:after:w-20 text-gray-300 `}>{t('sections.company')}</h3>

                         <Link onClick={() => toggleMenu && toggleMenu()} href="/PaymentPolicy" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.paymentPolicy')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/ReturnPolicy" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.returnPolicy')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/AMLAndKYC" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.amlKyc')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/PricvacyPolicy" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.privacyPolicy')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/TermsAndCondition" className={`
                                   text-blue-100 relative py-0.5
                                        text-sm font-light no-underline
                                   transition-all duration-300 ease-linear
                                   hover:text-[#21b474] hover:translate-x-[5px]
                                   before:content-[''] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:bottom-0
                                   before:h-px before:w-0
                                   before:bg-linear-to-r before:from-[#21b474] before:to-[#21b474]/50
                                   before:transition-[width] before:duration-300 before:ease-linear
                                   hover:before:w-full
                                   `}>
                              {t('links.terms')}
                         </Link>
                    </div>

                    {/* Payments + Social */}
                    <div className={styles.paymentSection}>
                         <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                              <PaymentMethods />
                         </motion.div>

                         <div className="flex flex-col items-center gap-4 py-6">
                              <div className="flex items-center gap-6">
                                   <span className="font-medium text-gray-300">{t('followUs')}</span>

                                   <Link href="https://www.facebook.com/people/Qption/61570227296877/" target="_blank" rel="noopener noreferrer" prefetch={false} aria-label="Qption on Facebook" className={styles.socialIcon}>
                                        <FaFacebook className="text-xl text-blue-500" />
                                   </Link>

                                   <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" prefetch={false} aria-label="Qption on X/Twitter" className={styles.socialIcon}>
                                        <FaTwitter className="text-xl text-blue-500" />
                                   </Link>

                                   <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" prefetch={false} aria-label="Qption on LinkedIn" className={styles.socialIcon}>
                                        <FaLinkedin className="text-xl text-blue-500" />
                                   </Link>

                                   <Link href="https://www.instagram.com/qption_llc/#" target="_blank" rel="noopener noreferrer" prefetch={false} aria-label="Qption on Instagram" className={styles.socialIcon}>
                                        <FaInstagram className="text-xl text-blue-500" />
                                   </Link>

                                   <Link href="https://t.me" target="_blank" rel="noopener noreferrer" prefetch={false} aria-label="Qption on Telegram" className={styles.socialIcon}>
                                        <FaTelegram className="text-xl text-blue-700" />
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Risk warning */}
               <div className={styles.riskWarning}>
                    <Image src="/logo-info.png" alt="Site Logo" width={60} height={60} />
                    <div className={styles.riskWarningContent + ' text-justify'}>
                         {t('riskWarning')}
                    </div>
               </div>

               {/* Bottom line */}
               <div className={styles.bottomLinks + ' flex flex-col text-center lg:flex-row items-center justify-between py-2'}>
                    <p className="text-sm text-gray-400">
                         {t('recaptcha.prefix')}
                         <a className="text-blue-500 mx-0.5" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                              {t('recaptcha.privacy')}
                         </a>
                         {t('recaptcha.and')}
                         <a className="text-blue-500 mx-0.5" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                              {t('recaptcha.terms')}
                         </a>
                         {t('recaptcha.apply')}
                    </p>
                    <div className="flex">
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/PricvacyPolicy" className={styles.bottomLink + ' mx-2 lg:mx-4 text-sm'}>
                              {t('links.privacyPolicy')}
                         </Link>
                         <Link onClick={() => toggleMenu && toggleMenu()} href="/TermsAndCondition" className={styles.bottomLink + ' mx-2 lg:mx-4 text-sm'}>
                              {t('links.terms')}
                         </Link>
                    </div>
               </div>
          </div>
     );
};

export default Footer;
