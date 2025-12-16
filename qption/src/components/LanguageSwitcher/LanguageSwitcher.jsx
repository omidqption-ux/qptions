import { useEffect, useMemo, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

const FALLBACK_LOCALES = [
    'en', 'ru', 'es', 'zh', 'ja', 'pt',
    'de', 'fr', 'tr', 'it', 'ar', 'fa'
]

const FLAG_BY_LOCALE = {
    en: '🇺🇸', ru: '🇷🇺', ar: '🇸🇦', fa: '🇮🇷',
    es: '🇪🇸', zh: '🇨🇳', ja: '🇯🇵', pt: '🇧🇷',
    de: '🇩🇪', fr: '🇫🇷', tr: '🇹🇷', it: '🇮🇹',
}

const LABEL_BY_LOCALE = {
    en: 'English', ru: 'Русский', ar: 'العربية', fa: 'فارسی',
    es: 'Español', zh: '中文', ja: '日本語', pt: 'Português',
    de: 'Deutsch', fr: 'Français', tr: 'Türkçe', it: 'Italiano',
}

export default function LanguageSelect({ className = '' }) {
    const router = useRouter();
    const { i18n } = useTranslation();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // union locales from i18n, router, and fallback
    const locales = useMemo(() => {
        const fromI18n = i18n?.options?.locales || [];
        const fromRouter = router.locales || [];
        const union = Array.from(new Set([...fromI18n, ...fromRouter, ...FALLBACK_LOCALES]));
        const order = FALLBACK_LOCALES.filter(l => union.includes(l));
        const extras = union.filter(l => !FALLBACK_LOCALES.includes(l));
        return [...order, ...extras];
    }, [i18n?.options?.locales, router.locales]);

    const currentLocale = mounted ? (i18n?.language || router.locale || 'en') : 'en';
    const { pathname, asPath, query } = router;

    const handleChange = async (event) => {
        const next = event.target.value;
        if (!next || next === currentLocale) return;
        await router.push({ pathname, query }, asPath, { locale: next });
    };

    const options = locales.map((lng) => ({
        value: lng,
        flag: FLAG_BY_LOCALE[lng] || '🏳️',
        label: LABEL_BY_LOCALE[lng] || lng.toUpperCase(),
    }));

    return (
        <Box component="label" className={`inline-flex items-center  ${className}`}>
            <span className="sr-only">Language</span>
            <Select
                value={currentLocale}
                onChange={handleChange}
                renderValue={() => (
                    <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
                        {FLAG_BY_LOCALE[currentLocale] || '🏳️'}
                    </Box>
                )}
                size="small"
                displayEmpty
                MenuProps={{
                    // keep the menu anchored to the Select to avoid body overflow issues
                    disablePortal: false,                 // (set true if your layout prefers non-portal)
                    disableScrollLock: true,              // don't mess with <body> scrollbar
                    PaperProps: {
                        elevation: 6,
                        sx: {
                            mt: 0.5,
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            maxHeight: 360,                   // scroll inside the menu, not the page
                            maxWidth: 'min(90vw, 420px)',     // clamp within viewport
                            overflowX: 'hidden',              // prevent horizontal scrollbar
                        },
                        className: 'bg-linear-to-b from-[#142B47] to-[#142B47]/90',
                    },
                    MenuListProps: {
                        sx: {
                            // use grid instead of CSS columns
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',   // two columns
                            columnGap: 1.5,
                            rowGap: 0.25,
                            p: 0,                             // tighter padding
                            '& .MuiMenuItem-root': {
                                // ensure items don't stretch oddly or cause overflow
                                minWidth: 0,
                                width: 'auto',
                                whiteSpace: 'nowrap',
                            },
                        },
                    },
                }}
                sx={{
                    bgcolor: 'transparent',
                    color: '#cecece',
                    borderRadius: 25,
                    px: 0, py: 0,
                    width: 50,
                    '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
                    '& fieldset': { border: 'none' },
                }}
                aria-label="Language"
                IconComponent={() => null}
            >
                {options.map(({ value, flag, label }) => (
                    <MenuItem
                        key={value}
                        value={value}
                        sx={{ py: 0.2, fontSize: { xs: 13, lg: 14 }, fontWeight: value === currentLocale ? 600 : 400 }}
                        className="hover:scale-110 hover:bg-[#142B47] transition-all duration-300"
                    >
                        <ListItemIcon>
                            <Box component="span" className="font-semibold leading-7 text-xs lg:text-sm">{flag}</Box>
                        </ListItemIcon>
                        <span className="text-xs lg:text-sm text-blue-200 hover:text-blue-100">{label}</span>
                    </MenuItem>
                ))}
            </Select>
        </Box>
    )
}
