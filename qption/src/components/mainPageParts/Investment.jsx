'use client';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TuneIcon from '@mui/icons-material/Tune';
import AddCardIcon from '@mui/icons-material/AddCard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTranslation } from 'next-i18next';

const icons = [EmojiEventsIcon, TuneIcon, AddCardIcon, SupportAgentIcon];

const Investment = () => {
    const { t, i18n } = useTranslation('home');
    const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);
    const features = t('investment.features', { returnObjects: true });

    return (
        <div className="relative w-full overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="text-center space-y-6 mb-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2
                    className="text-4xl sm:text-5xl font-bold text-blue-100"
                    dangerouslySetInnerHTML={{
                        __html: t('investment.title').replace(/<accent>/g, '<span class="text-[#1a8c5e]">').replace(/<\/accent>/g, '</span>')
                    }}
                />
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">{t('investment.sub')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, idx) => {
                        const Icon = icons[idx] || EmojiEventsIcon;
                        const color = idx === 0 ? 'text-[#FFBF00]' : idx === 1 ? 'text-[#77DD77]' : idx === 2 ? 'text-[#FF6B6B]' : 'text-[#96defa]';
                        const gradient = idx === 0 ? 'from-[#FFBF00] to-[#FFBF00]/80' : idx === 1 ? 'from-[#77DD77] to-[#77DD77]/80' : idx === 2 ? 'from-[#FF6B6B] to-[#FF6B6B]/80' : 'from-[#96defa] to-[#96defa]/80';

                        return (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.2 }} className="relative h-full">
                                <div className="group relative transform transition-all duration-300 hover:scale-105 h-full">
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#21b474]/10 to-[#132a46]/10 blur-xl group-hover:blur-2xl transition-all duration-300" />
                                    <div className="relative flex flex-col items-center rounded-2xl bg-linear-to-b from-[#132a46] to-[#132a46]/95 p-6 shadow-lg border border-[#21b474]/10 h-full">
                                        <div className={`mb-4 p-3 rounded-full bg-linear-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-3xl" />
                                        </div>
                                        <h3 className={`text-xl font-bold ${color} text-center mb-2 line-clamp-2`}>{f.title}</h3>
                                        <p className="text-sm leading-7 text-blue-100 text-center line-clamp-3">{f.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default Investment;
