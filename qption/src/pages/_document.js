// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
     return (
          <Html lang='en'  >
               <Head>
                    <meta
                         name='author'
                         content='Qption'
                    />
                    <link
                         rel='icon'
                         href='/favicon.ico'
                    />
                    {/* SEO Meta Tags */}

                    <meta
                         name='description'
                         content='Qption is your all-in-one trading platform for spot markets and options. Trade with AI-driven insights, social copy-trading, and ultra-low fees.'
                    />
                    <meta
                         name='keywords'
                         content='trading, spot trading, options trading, crypto, forex, CFDs, social trading, AI trading, Qption'
                    />
               </Head>
               <body className='antialiased w-full'>
                    <Main />
                    <NextScript />
               </body>
          </Html>
     )
}
