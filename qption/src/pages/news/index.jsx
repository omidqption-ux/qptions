import axiosInstance from "@/network/axios";
import { useEffect, useRef, useState, useCallback } from "react";
import Head from 'next/head'
import NewsCard from "../../components/newsCard"
import SEOAlternates from '@/components/SEOAlternates'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'

export default function NewsFeed() {
     const [news, setNews] = useState([]);
     const [nextCursor, setNextCursor] = useState(null);
     const [loading, setLoading] = useState(false);
     const [done, setDone] = useState(false);
     const seen = useRef(new Set());
     const sentinelRef = useRef(null);

     const loadPage = useCallback(async () => {
          if (loading || done) return;
          setLoading(true);

          try {
               const url = nextCursor ? `/api/news?cursor=${encodeURIComponent(nextCursor)}` : `/api/news`
               const resp = await axiosInstance.get(url)
               if (resp.status !== 'OK') throw new Error({ message: 'Not Ok' })
               const data = resp.results
               const fresh = [];
               for (const a of data || []) {
                    if (!seen.current.has(a.id)) {
                         seen.current.add(a.id);
                         fresh.push(a);
                    }
               }

               setNews((prev) => [...prev, ...fresh])
               setNextCursor(resp.next_url || null)
               if (!resp.next_url) setDone(true);
          } catch (err) {
               console.error("Fetch error:", err);
          } finally {
               setLoading(false);
          }
     }, [nextCursor, done])

     // initial load
     useEffect(() => {
          loadPage()
     }, [])

     // intersection observer
     useEffect(() => {
          const sentinel = sentinelRef.current;
          if (!sentinel) return;

          const observer = new IntersectionObserver(
               (entries) => {
                    const first = entries[0];
                    if (first.isIntersecting && !loading && !done) {
                         loadPage();
                    }
               },
               { threshold: 0.5 }
          );

          observer.observe(sentinel);
          return () => {
               observer.disconnect()
               setNextCursor(null)
          }
     }, [done])
     return (
          <>
               <Head>
                    {/* Primary meta */}
                    <title>NEWS – Qption</title>
                    <meta
                         name="description"
                         content="Stay updated with the latest market news, crypto insights, and financial developments from trusted sources — curated by Qption to keep traders informed and ahead."
                    />
                    <meta
                         name="keywords"
                         content="Qption news, market updates, crypto news, stock market, financial insights, trading analysis, economy, blockchain news"
                    />

                    {/* Open Graph (for Facebook, LinkedIn, Slack, etc.) */}
                    <meta
                         property='og:type'
                         content='website'
                    />
                    <meta
                         property='og:title'
                         content='News – Qption'
                    />
                    <meta
                         property='og:description'
                         content='Everything you need to know about using Qption—compiled in one handy Frequently-Asked-Questions page.'
                    />
                    <meta
                         property='og:url'
                         content='https://qption.com/news'
                    />
                    <meta
                         property='og:image'
                         content='https://qption.com/images/og/news-qption.jpg'
                    />

                    {/* Canonical URL */}
                    <link
                         rel='canonical'
                         href='https://qption.com/news'
                    />

                    {/* Indexing directive (explicit but optional) */}
                    <meta
                         name='robots'
                         content='index,follow'
                    />
               </Head>
               <SEOAlternates />
               <main className="min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12">
                    <div className="max-w-7xl gap-5   mx-auto grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 " >
                         {news.map((item) => (
                              <NewsCard key={item.id} newsItem={item} />
                         ))}

                         {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}
                         {done && <div className="text-center py-4 text-gray-400">End of news</div>}
                         <div ref={sentinelRef} style={{ height: "1px" }}></div>
                    </div>
               </main>
          </>
     );
}


export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'auth'], i18nConfig)),
          },
     }
}
