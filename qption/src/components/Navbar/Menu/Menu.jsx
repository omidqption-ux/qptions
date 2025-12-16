'use client'
import React, { useState, useMemo } from 'react'
import styles from './menu.module.css'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
     Business,
     School,
     TrendingUp,
     Email,
     Phone,
     LocationOn,
} from '@mui/icons-material'
import MobileRewardsCarousel from './MobileRewardsCarousel'
import { useTranslation } from 'next-i18next'

const ICON_MAP = {
     trading: <TrendingUp className="section-icon text-green-500" />,
     education: <School className="section-icon text-green-500" />,
     company: <Business className="section-icon text-green-500" />,
}

function SlideInMenu({ isLogin }) {
     const [isOpen, setIsOpen] = useState(false)
     const router = useRouter()
     const toggleMenu = () => setIsOpen((v) => !v)

     // i18n
     const { t: tM, i18n } = useTranslation('nav')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Build sections from i18n JSON
     const menuSections = useMemo(() => {
          const raw = tM('sections', { returnObjects: true }) || []
          return Array.isArray(raw) ? raw : []
     }, [tM])


     return (
          <div className="px-2 w-full h-full items-center" dir={isRTL ? 'rtl' : 'ltr'}>
               <MenuIcon
                    onClick={toggleMenu}
                    className="cursor-pointer hover:scale-110 duration-300 text-2xl text-emerald-700 mt-2"
               />
               <AnimatePresence>
                    {isOpen && (
                         <>
                              <motion.div
                                   className={styles.menuOverlay}
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                   transition={{ duration: 0.5, ease: 'easeOut' }}
                                   onClick={toggleMenu}
                              />
                              <motion.div
                                   className={styles.sideMenu}
                                   initial={{ x: isRTL ? '100%' : '-100%', opacity: 0 }}
                                   animate={{ x: 0, opacity: 1 }}
                                   exit={{ x: isRTL ? '100%' : '-100%', opacity: 0 }}
                                   transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
                              >
                                   <div className={styles.menuContent}>
                                        {/* Header */}
                                        <motion.div
                                             className={styles.menuHeader}
                                             initial={{ y: -20, opacity: 0 }}
                                             animate={{ y: 0, opacity: 1 }}
                                             transition={{ delay: 0.2, duration: 0.5 }}
                                        >
                                             <div className="flex items-center gap-4">
                                                  <div className={styles.siteLogo}>
                                                       <Image
                                                            src="/logo.png"
                                                            alt="Qption Logo"
                                                            width={150}
                                                            height={50}
                                                            className={styles.logoImage}
                                                            priority
                                                       />
                                                  </div>
                                             </div>
                                             <ChevronRightIcon onClick={toggleMenu} className={styles.closeIcon + ` hover:scale-110 ${isRTL ? " " : " rotate-180"}`} />
                                        </motion.div>

                                        {/* Sections */}
                                        <div className={`${styles.menuSections} space-y-1`}>
                                             {menuSections.map((section, index) => (
                                                  <motion.div
                                                       key={`${section.title}-${index}`}
                                                       className={styles.menuSections}
                                                       initial={{ y: 20, opacity: 0 }}
                                                       animate={{ y: 0, opacity: 1 }}
                                                       transition={{
                                                            delay: 0.4 + index * 0.1,
                                                            duration: 0.5,
                                                            ease: 'easeOut',
                                                       }}
                                                  >
                                                       <div className={`${styles.sectionHeader} py-1`}>
                                                            <div className="flex items-center gap-3">
                                                                 {ICON_MAP[section.key] ?? (
                                                                      <TrendingUp className="section-icon text-green-500" />
                                                                 )}
                                                                 <span className={styles.sectionTitle}>{section.title}</span>
                                                            </div>
                                                       </div>

                                                       <div className={`${styles.sectionItems} space-y-1`}>
                                                            {(section.items || []).map((item, itemIndex) => (
                                                                 <motion.div
                                                                      key={`${item.title}-${itemIndex}`}
                                                                      initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
                                                                      animate={{ x: 0, opacity: 1 }}
                                                                      transition={{
                                                                           delay: 0.1 + itemIndex * 0.05,
                                                                           duration: 0.4,
                                                                           ease: 'easeOut',
                                                                      }}
                                                                 >
                                                                      <Link
                                                                           href={item.link}
                                                                           onClick={toggleMenu}
                                                                           className={`${styles.menuItem} py-1`}
                                                                      >
                                                                           {item.title}
                                                                      </Link>
                                                                 </motion.div>
                                                            ))}
                                                       </div>
                                                  </motion.div>
                                             ))}
                                        </div>

                                        {/* Contact */}
                                        <div className={`${styles.companyInfo} max-w-[360px] mx-0`}>
                                             <h3 className={styles.infoTitle}>{tM('contact.title')}</h3>
                                             <div className="flex ">
                                                  <div className={styles.infoItems}>
                                                       <div className={styles.infoItem}>
                                                            <Email className={styles.infoIcon} />
                                                            <span>{tM('contact.email')}</span>
                                                       </div>
                                                       <div className={styles.infoItem}>
                                                            <Phone className={`${styles.infoIcon} my-4`} />
                                                            <span>{tM('contact.phone')}</span>
                                                       </div>
                                                       <div className={styles.infoItem}>
                                                            <LocationOn className={styles.infoIcon} />
                                                            <span>{tM('contact.location')}</span>
                                                       </div>

                                                       <MobileRewardsCarousel />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
                         </>
                    )}
               </AnimatePresence>
          </div>
     )
}

export default SlideInMenu
