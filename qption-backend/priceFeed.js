// priceFeed.js
import EventEmitter from 'events'
import { websocketClient } from '@massive.com/client-js'
import { fetchRecentPolygon } from './polygon/polygonApis.js' // still used for historical fallback

/** Minimal shared-socket client for Massive (forex/crypto aggregates) */
class MarketSocket {
     constructor({ url, channelPrefix, acceptedEvents, apiKey }) {
          this.url = url;
          this.channelPrefix = channelPrefix; // 'CAS' or 'XAS'
          this.acceptedEvents = acceptedEvents; // new Set(['CAS']) or new Set(['XAS'])
          this.apiKey = apiKey;

          this.ws = null;
          this.connected = false;
          this.wantClose = false;

          this.symbols = new Set();        // wire symbols: 'EUR/USD', 'BTC-USDT'
          this.refCounts = new Map();      // appSymbol -> count

          this.lastPriceByWire = new Map();
          this.lastEmitMsByWire = new Map();

          this.onMessage = null;
          this.onLog = (..._args) => { };
          this.onError = (..._args) => { };

          this._keeper = null;
          this._reconnectDelay = 1000;
     }

     start() {
          if (this.ws) return;
          this.wantClose = false;
          this._connect();
     }

     stop() {
          this.wantClose = true;
          if (this.ws) {
               try { this.ws.close(1000, "shutdown"); } catch { }
          }
          if (this._keeper) clearInterval(this._keeper);
          this.ws = null;
          this.connected = false;
     }

     add(appSymbol, wireSymbol) {
          const n = (this.refCounts.get(appSymbol) || 0) + 1;
          this.refCounts.set(appSymbol, n);
          if (n > 1) return; // already subscribed

          this.symbols.add(wireSymbol);
          if (this.connected) this._sendSub([wireSymbol]);
          else this.start();
     }

     remove(appSymbol, wireSymbol) {
          const current = (this.refCounts.get(appSymbol) || 0) - 1;
          if (current <= 0) {
               this.refCounts.delete(appSymbol);
               if (this.symbols.has(wireSymbol) && this.connected) {
                    this._sendUnsub([wireSymbol]);
               }
               this.symbols.delete(wireSymbol);
          } else {
               this.refCounts.set(appSymbol, current);
          }
     }

     _connect() {
          this.onLog("WS connecting", this.url);

          // Massive forex/crypto WS
          this.ws = this.channelPrefix === "CAS"
               ? websocketClient(this.apiKey, this.url).forex()
               : websocketClient(this.apiKey, this.url).crypto();

          // MESSAGE HANDLER (this is where auth_success comes)
          this.ws.onmessage = (msg) => {
               let arr;
               try {
                    const raw = msg?.response ?? msg?.data ?? msg;
                    const text = typeof raw === "string" ? raw : raw?.toString();
                    arr = JSON.parse(text);
               } catch {
                    return;
               }
               if (!Array.isArray(arr)) return;

               for (const d of arr) {
                    // Handle status/auth first
                    if (d?.ev === "status") {
                         this.onLog("WS status", d.status, d.message);

                         if (d.status === "auth_success") {
                              // NOW we're effectively "open"
                              this.connected = true;
                              this._reconnectDelay = 1000;

                              if (this._keeper) clearInterval(this._keeper);
                              this._keeper = setInterval(() => this._tickEmit(), 1000);

                              if (this.symbols.size) {
                                   this._sendSub([...this.symbols]);
                              }
                         }
                         continue;
                    }

                    // Only handle actual data events (CAS / XAS)
                    if (!this.acceptedEvents.has(d?.ev)) continue;

                    const endMs = Number(d.e);
                    const startMs = Number(d.s);
                    const tradeTime = Number.isFinite(endMs)
                         ? Math.floor(endMs / 1000) * 1000
                         : Number.isFinite(startMs)
                              ? Math.floor(startMs / 1000) * 1000
                              : undefined;
                    const price = Number(d.c);
                    if (!Number.isFinite(tradeTime) || !Number.isFinite(price)) continue;

                    const wire = d.p || d.P || d.pair || d.sym || d.ticker;
                    if (!wire) continue;

                    this.lastPriceByWire.set(wire, price);
                    const lastEmit = this.lastEmitMsByWire.get(wire) || 0;
                    if (tradeTime > lastEmit) {
                         this.lastEmitMsByWire.set(wire, tradeTime);
                         if (this.onMessage) {
                              this.onMessage({ wire, time: tradeTime, value: price });
                         }
                    }
               }
          };

          const onErrorOrClose = (tag) => (evt) => {
               this.connected = false;
               if (this._keeper) { clearInterval(this._keeper); this._keeper = null; }

               this.onError(`WS ${tag}`, evt?.message || evt?.reason || evt || "");

               try {
                    if (this.ws) {
                         this.ws.onmessage = null;
                         this.ws.onerror = null;
                         this.ws.onclose = null;
                    }
               } catch { }

               this.ws = null;

               if (this.wantClose) return;

               const delay = this._reconnectDelay;
               this._reconnectDelay = Math.min(this._reconnectDelay * 2, 30_000);
               setTimeout(() => this._connect(), delay);
          };

          this.ws.onerror = onErrorOrClose("error");
          this.ws.onclose = onErrorOrClose("close");
     }

     _sendSub(wires) {
          if (!wires.length || !this.ws) return;
          const params = wires.map((w) => `${this.channelPrefix}.${w}`).join(",");
          try {
               this.ws.send(JSON.stringify({ action: "subscribe", params }));
               this.onLog("WS subscribe", params);
          } catch { }
     }

     _sendUnsub(wires) {
          if (!wires.length || !this.ws) return;
          const params = wires.map((w) => `${this.channelPrefix}.${w}`).join(",");
          try {
               this.ws.send(JSON.stringify({ action: "unsubscribe", params }));
               this.onLog("WS unsubscribe", params);
          } catch { }
     }

     _tickEmit() {
          const nowAligned = Math.floor(Date.now() / 1000) * 1000;
          const MAX_PCT_MOVE = 0.00005;

          for (const [wire, lastPrice] of this.lastPriceByWire.entries()) {
               if (lastPrice == null) continue;

               let lastEmit = this.lastEmitMsByWire.get(wire) || 0;

               if (lastEmit === 0) {
                    this.lastEmitMsByWire.set(wire, nowAligned);
                    if (this.onMessage) {
                         this.onMessage({
                              wire,
                              time: nowAligned,
                              value: lastPrice,
                              synthetic: true,
                         });
                    }
                    continue;
               }

               for (let t = lastEmit + 1000; t <= nowAligned; t += 1000) {
                    const rnd = (Math.random() * 2 - 1) * MAX_PCT_MOVE;
                    const syntheticValue = lastPrice * (1 + rnd);

                    this.lastEmitMsByWire.set(wire, t);

                    if (this.onMessage) {
                         this.onMessage({
                              wire,
                              time: t,
                              value: syntheticValue,
                              synthetic: true,
                         });
                    }
               }
          }
     }
}


function toWsPair(appSymbol) {
     if (appSymbol.startsWith('C:')) {
          const s = appSymbol.slice(2) // EURUSD
          return `${s.slice(0, 3)}/${s.slice(3, 6)}`
     }
     if (appSymbol.startsWith('X:')) {
          const s = appSymbol.slice(2)
          const QUOTES = ['USDT', 'USDC', 'USD', 'EUR', 'GBP', 'BTC', 'ETH', 'JPY', 'AUD']
          for (const q of QUOTES) {
               if (s.endsWith(q)) {
                    const base = s.slice(0, s.length - q.length)
                    return `${base}-${q}`
               }
          }
          if (s.length === 6) return `${s.slice(0, 3)}-${s.slice(3, 6)}`
          return s
     }
     return appSymbol
}

export class PriceFeed extends EventEmitter {
     constructor() {
          super()
          this.latest = new Map() // appSymbol -> Map(ms->price)
          this.CLEAN_MS = 10_000
          setInterval(() => this.gc(), 3_000)

          // Massive API key (set this env var)
          const apiKey = process.env.MASSIVE_API_KEY

          this.fx = new MarketSocket({
               url: 'wss://socket.massive.com',
               channelPrefix: 'CAS',
               acceptedEvents: new Set(['CAS']),
               apiKey,
          })
          this.crypto = new MarketSocket({
               url: 'wss://socket.massive.com',
               channelPrefix: 'XAS',
               acceptedEvents: new Set(['XAS']),
               apiKey,
          })

          // route messages from markets back to app-level symbol listeners
          this._wireToApp = new Map() // wire -> appSymbol

          const onMarket = (isFx) => ({ wire, time, value, synthetic }) => {
               const appSymbol = this._wireToApp.get(wire)
               if (!appSymbol) return
               this.#setLatest(appSymbol, time, value)
               this.emit(appSymbol, { pair: appSymbol, time, value, synthetic })
          }

          this.fx.onMessage = onMarket(true)
          this.crypto.onMessage = onMarket(false)

          // optional logs
          const log = (...a) => { /* console.log('[PriceFeed]', ...a) */ }
          this.fx.onLog = log
          this.crypto.onLog = log
          this.fx.onError = log
          this.crypto.onError = log
     }

     async getPriceOfTs(symbol, targetTs) {
          try {
               const rows = 10
               const points = await fetchRecentPolygon(symbol, targetTs, rows)
               const match = points.find(p => p.time === targetTs)
               if (!match) return null
               const price = match.value
               return price
          } catch (e) {
               throw e
          }
     }

     gc() {
          const cutoff = Date.now() - this.CLEAN_MS
          for (const [symbol, tsMap] of this.latest) {
               for (const [ts] of tsMap) {
                    if (ts < cutoff) tsMap.delete(ts)
               }
               if (tsMap.size === 0) this.latest.delete(symbol)
          }
     }

     #setLatest(symbol, ts, price) {
          if (!this.latest.has(symbol)) this.latest.set(symbol, new Map())
          this.latest.get(symbol).set(ts, price)
     }

     getLatest(symbol, ts) {
          return this.latest.get(symbol)?.get(ts)
     }

     waitForPrice(symbol, targetTs) {
          return new Promise((resolve, _reject) => {
               const cached = this.getLatest(symbol, targetTs)
               if (cached !== undefined) return resolve(cached)

               const onTick = async (tick) => {
                    if (tick.time === targetTs) {
                         try { unsubscribe() } catch { }
                         resolve(tick.value)
                    } else if (tick.time > targetTs) { //// if ticker time went more than targetTs and we did not catch the value
                         try { unsubscribe() } catch { }
                         const res = await this.getPriceOfTs(symbol, targetTs)
                         return resolve(res)
                    }
               }

               const unsubscribe = this.subscribe(symbol, onTick)
          })
     }

     /** Public: subscribe(appSymbol, listener) -> unsubscribe() */
     subscribe(appSymbol, listener) {
          const isFx = appSymbol.startsWith('C:')
          const wire = toWsPair(appSymbol)
          this._wireToApp.set(wire, appSymbol)

          const market = isFx ? this.fx : this.crypto

          // ensure market socket running + subscribed (refcounted)
          market.add(appSymbol, wire)

          // attach listener to EventEmitter keyed by appSymbol
          this.on(appSymbol, listener)

          return () => {
               // detach listener
               this.off(appSymbol, listener)

               // if no more listeners for this symbol, drop subscription from market
               const hasMore = this.listenerCount(appSymbol) > 0
               if (!hasMore) {
                    market.remove(appSymbol, wire)
                    this._wireToApp.delete(wire)
               }
          }
     }
}

export const priceFeed = new PriceFeed()
