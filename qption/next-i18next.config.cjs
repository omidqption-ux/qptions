/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: [
            'en', // English (default)
            'ru', // Russian           
            'es', // Spanish
            'zh', // Chinese
            'ja', // Japanese
            'pt', // Portuguese
            'de', // German
            'tr', // Turkish
            'it', // Italian
            'fr', // French
            'ar', // Arabic
            'fa' // Persian
        ],
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
