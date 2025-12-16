import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'next-i18next'
const Registeration = dynamic(() => import('../RegisterationModal/Registeration'), { ssr: false });
import SlideInMenu from "./Menu/Menu"

const Navbar = ({ isLogin }) => {
     const [isScrolled, setIsScrolled] = useState(false);
     const { t, i18n } = useTranslation('nav');
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);

     useEffect(() => {
          const handleScroll = () => setIsScrolled(window.scrollY > 51);
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
     }, []);

     const [openLogin, setOpenLogin] = useState(false);
     const handleOpen = () => setOpenLogin(true);
     const handleClose = () => setOpenLogin(false);

     return (
          <div
               dir={isRTL ? 'rtl' : 'ltr'}
               className={`sticky left-0 top-0 z-50 w-full transition-all duration-300 h-[50px] ${isScrolled ? 'bg-gray-500/40 shadow-lg backdrop-blur-md' : 'bg-[#293e58] shadow-lg backdrop-blur-md'
                    }`}
          >
               <div className="mx-auto px-4">
                    <div className="flex h-10 items-center justify-between">
                         <div className="flex items-center">
                              <Link href="/" locale={undefined}>
                                   <Image src={logo} alt="Qption" className="relative w-24 mt-2" />
                              </Link>
                         </div>

                         <div className="flex items-center space-x-1">
                              <div className="mt-2">
                                   <LanguageSwitcher />
                              </div>

                              {!isLogin ? (
                                   <button
                                        onClick={handleOpen}
                                        className="mt-2 inline-flex items-center justify-center px-5 py-0.5 rounded-xl
                           bg-emerald-600 text-gray-300 font-semibold shadow-md
                           transition duration-200 hover:bg-emerald-700 
                           focus:outline-none focus:ring-2 focus:ring-emerald-400 active:bg-emerald-800 cursor-pointer"
                                   >
                                        {t('login')}
                                   </button>
                              ) : (
                                   <Link
                                        href={process.env.NODE_ENV !== 'development' ? 'https://panel.qption.com' : 'http://localhost:3001'}
                                        className="mt-2 inline-flex items-center justify-center px-5 py-0.5 rounded-xl
                           bg-emerald-600 text-gray-300 font-semibold shadow-md
                           transition duration-200 hover:bg-emerald-700 
                           focus:outline-none focus:ring-2 focus:ring-emerald-400 active:bg-emerald-800"
                                   >
                                        {t('cabinet')}
                                   </Link>
                              )}

                              <div className="ml-1">
                                   {/* Your SlideInMenu keeps working as-is */}
                                   <SlideInMenu isLogin={isLogin} />
                              </div>
                         </div>
                    </div>
               </div>
               <Registeration handleClose={handleClose} open={openLogin} isRegister={false} />
          </div>
     );
}
export default Navbar

