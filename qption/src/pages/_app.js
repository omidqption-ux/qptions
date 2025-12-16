import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import RootLayout from '@/Layout'
function App({ Component, pageProps }) {
     return (
          <RootLayout>
               <Component {...pageProps} />
          </RootLayout>
     )
}

export default appWithTranslation(App)
