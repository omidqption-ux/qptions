// components/SEOAlternates.jsx
import Head from 'next/head';
import { useRouter } from 'next/router';

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || '';

function toAbsolute(path) {
    // ensure leading slash and no double slashes
    const p = path.startsWith('/') ? path : `/${path}`;
    return ORIGIN ? `${ORIGIN}${p}` : p;
}

export default function SEOAlternates() {
    const { locales = [], asPath, defaultLocale, locale } = useRouter();

    // strip query/hash from asPath for canonical
    const cleanPath = asPath.split('?')[0].split('#')[0] || '/';

    // canonical for current locale (no /en prefix for defaultLocale)
    const localizedPath =
        locale === defaultLocale ? cleanPath : `/${locale}${cleanPath}`;

    return (
        <Head>
            {/* canonical */}
            <link rel="canonical" href={toAbsolute(localizedPath)} />

            {/* hreflang for all locales */}
            {locales.map((lng) => {
                const href = lng === defaultLocale ? cleanPath : `/${lng}${cleanPath}`;
                return (
                    <link
                        key={lng}
                        rel="alternate"
                        hrefLang={lng}
                        href={toAbsolute(href)}
                    />
                );
            })}

            {/* x-default points to default locale */}
            <link
                rel="alternate"
                hrefLang="x-default"
                href={toAbsolute(cleanPath)}
            />
        </Head>
    );
}
