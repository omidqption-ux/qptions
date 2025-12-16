import { useEffect, useRef, useState, useCallback } from "react";
import axios from '../network/axios'

function useIO(onHit, enabled) {
     const ref = useRef(null);
     useEffect(() => {
          if (!enabled || !ref.current) return;
          const io = new IntersectionObserver(
               (entries) => entries.some((e) => e.isIntersecting) && onHit(),
               { rootMargin: "600px 0px" }
          );
          io.observe(ref.current);
          return () => io.disconnect();
     }, [onHit, enabled]);
     return ref;
}

export const useNews = ({ setNews }) => {
     const [items, setItems] = useState < Article[] > ([]);
     const [cursor, setCursor] = useState < string | null > (null);
     const [loading, setLoading] = useState(false);
     const [done, setDone] = useState(false);
     const [error, setError] = useState < string | null > (null);
     const seen = useRef < Set < string >> (new Set());

     const load = useCallback(async () => {
          if (loading || done) return;
          setLoading(true);
          setError(null);
          try {
               const params = new URLSearchParams({ limit: "20" });
               if (ticker) params.set("ticker", ticker);
               if (cursor) params.set("cursor", cursor);

               const res = await axios.get(`/api/news?${params.toString()}`, { cache: "no-store" });
               if (!res.ok) throw new Error(`HTTP ${res.status}`);
               const data = await res.json();

               const fresh = [];
               for (const a of data.results || []) {
                    if (!seen.current.has(a.id)) {
                         seen.current.add(a.id);
                         fresh.push(a);
                    }
               }
               setItems((prev) => prev.concat(fresh));

               if (data.next_url) {
                    const u = new URL(data.next_url);
                    setCursor(u.searchParams.get("cursor"));
               } else {
                    setDone(true);
               }
          } catch (e) {
               setError(e.message || "Failed to load");
          } finally {
               setLoading(false);
          }
     }, [cursor, ticker, loading, done]);

     useEffect(() => {
          // reset on ticker change
          setItems([]); setCursor(null); setDone(false); setError(null);
          seen.current = new Set();
          load();
     }, [ticker]); // eslint-disable-line react-hooks/exhaustive-deps

     const sentinelRef = useIO(() => load(), !loading && !done);
     return { items, error, done, loading }
}
