import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, DeviceEventEmitter, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getSocketByMode } from '../../config/env';
import { getModeAccent } from '../../theme/modeAccent';
import AnimatedLogoLoader from '../AnimatedLogoLoader';
import { addLiveData } from '../../store/slices/tradingRoomSlices/chartSlice';

const PREPEND_ANIM_DELAY_MS = 800;

export const buildHtml = (accentStrong: string, accentPrimary: string, accentSoft: string, watermarkUrl?: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body, #chartdiv {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #050912;
        overflow: hidden;
        position: relative;
      }
      body { position: relative; }
      #chartdiv {
        position: relative;
        z-index: 1;
        background-color: transparent;
      }
      #watermark {
        position: absolute;
        inset: 0;
        display: ${watermarkUrl ? 'block' : 'none'};
        background-image: ${watermarkUrl ? `url('${watermarkUrl}')` : 'none'};
        background-repeat: no-repeat;
        background-position: center;
        background-size: 180px auto;
        opacity: 0.062;
        pointer-events: none;
        z-index: 0;
      }
      #loading-left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 64px;
        display: none;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, rgba(11, 20, 36, 0.9) 0%, rgba(11, 20, 36, 0) 100%);
        color: #9ca3af;
        font-size: 12px;
        z-index: 999999;
        pointer-events: none;
      }
    </style>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
  </head>
  <body>
    <div id="watermark"></div>
    <div id="chartdiv"></div>
    <div id="loading-left">Loading...</div>
    <script>
      let root;
      let chart;
      let xAxis;
      let yAxis;
      let series;
      const CLOCK_ICON_SRC = 'data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${accentStrong}" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M9 1h6v2H9z"/><path d="M19.03 7.39l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61"/></svg>`)}';
      const FONT_SIZE_AXIS = 12;
      let autoFocusEnabled = true;
      let lastTimeValue = null;
      let rangeAheadDataItem;
      let rangeAhead;
      let rangeAheadBulletContainer;
      let counterLabel;
      let counterLabelBgDeactive;
      let timerSeconds = 5;
      const CHART_STROKE = '${accentStrong}';
      const CHART_FILL = '${accentSoft}';
      const CHART_BG = '#050912';
      const BULLET_COLOR = '${accentStrong}';
      const AHEAD_STROKE = '${accentStrong}';
      const ORDER_BUY_COLOR = '#10B981'; // match bullet BUY color
      const ORDER_SELL_COLOR = '#EF4444'; // match bullet SELL color
      const PAN_FUTURE_MS = (4 * 60 * 60 + 10) * 1000; // allow dragging ~4h10s to the right beyond last point
      const LEFT_BATCH_SECONDS = 10 * 60; // 10 minutes per fetch
      const LEFT_EDGE_BUFFER_MS = 5_000;
      let initialMinTime = null;
      let loadingLeft = false;
      let leftEdgeInterval;
      let leftLoadArmed = false;
      let lastLeftLoadMs = 0;
      const PREPEND_ANIM_DURATION_MS = 450;
      const NEAR_LATEST_BUFFER_MS = 2_000;
      const CLEANUP_DELAY_AFTER_CLOSE_MS = 15_000;
      const LEFT_LOAD_COOLDOWN_MS = 4000;
      let hasPrependedData = false;
      let aheadGuideLine = null;
      let pendingOrders = [];
      let pendingResults = [];
      let lastPulseDataItem = null;
      let lastPulseBullet = null;
      let closeLineRanges = [];
      const closeLineByKey = new Map();
      const orderBulletByKey = new Map();
      const resultBulletByKey = new Map();
      const cleanupTimerByKey = new Map();
      const tradeContainersByIndex = [];
      const tradePreferredViewByIndex = new Map();
      const TRADE_FRONT_BASE_Z = 1_000_002;
      let tradeFrontCounter = TRADE_FRONT_BASE_Z;

      function setWatermarkVisible(show) {
        const wm = document.getElementById('watermark');
        if (wm) {
          wm.style.opacity = show ? '0.08' : '0';
        }
      }

      function orderKey(obj) {
        if (!obj) return null;
        if (obj.tradeIndex != null) return 'idx-' + obj.tradeIndex;
        if (obj.closeTime != null) return 'ct-' + obj.closeTime;
        if (obj.time != null) return 't-' + obj.time;
        return null;
      }
      function resultKey(obj) {
        if (!obj) return null;
        if (obj.tradeIndex != null) return 'idx-' + obj.tradeIndex;
        if (obj.closeTime != null) return 'ct-' + obj.closeTime;
        return null;
      }
      function removeBulletFromDataItems(bullet) {
        if (!bullet || !series || !series.dataItems?.length) return;
        series.dataItems.forEach((di) => {
          if (!Array.isArray(di.bullets)) return;
          const keep = di.bullets.filter((existing) => existing !== bullet);
          if (keep.length !== di.bullets.length) {
            di.bullets = keep;
            di.set('bullets', keep);
          }
        });
      }
      function disposeBullet(map, key) {
        if (!key) return;
        const b = map.get(key);
        if (b) {
          removeBulletFromDataItems(b);
          if (typeof b.dispose === 'function') {
            try { b.dispose(); } catch (_) {}
          }
        }
        map.delete(key);
      }
      function removeCloseLine(key) {
        if (!key) return;
        const entry = closeLineByKey.get(key);
        if (entry?.range) {
          try { entry.range.dispose(); } catch (_) {}
        }
        if (entry?.value != null) {
          closeLineRanges = closeLineRanges.filter((r) => r.value !== entry.value);
        }
        closeLineByKey.delete(key);
      }

      function removeBullets(predicate) {
        if (!series || !series.dataItems?.length) return;
        series.dataItems.forEach((di) => {
          if (!Array.isArray(di.bullets)) return;
          const keep = [];
          di.bullets.forEach((b) => {
            if (predicate(b)) {
              try { b.dispose(); } catch (_) {}
            } else {
              keep.push(b);
            }
          });
          di.bullets = keep;
          di.set('bullets', keep);
        });
      }

      function tagBulletWithTrade(bullet, tradeIndex, closeMs) {
        if (!bullet) return;
        if (bullet.set) {
          bullet.set('customTradeIndex', tradeIndex);
          bullet.set('customClose', closeMs);
        }
        bullet.customTradeIndex = tradeIndex;
        bullet.customClose = closeMs;
      }

      function cleanupMarkersByTrade(tradeIndex, closeTime) {
        const closeMs = Number(closeTime);
        const matches = (b) => {
          const t = (b.get && b.get('customTradeIndex')) || b.customTradeIndex;
          const c = (b.get && b.get('customClose')) || b.customClose;
          return (tradeIndex != null && t === tradeIndex) || (Number.isFinite(closeMs) && c === closeMs);
        };
        if (series && series.dataItems?.length) {
          series.dataItems.forEach((di) => {
            if (!Array.isArray(di.bullets)) return;
            const keep = [];
            di.bullets.forEach((b) => {
              if (matches(b)) {
                try { b.dispose && b.dispose(); } catch (_) {}
              } else {
                keep.push(b);
              }
            });
            di.bullets = keep;
            di.set('bullets', keep);
          });
        }
        if (tradeIndex != null) {
          const key = 'idx-' + tradeIndex;
          disposeBullet(orderBulletByKey, key);
          disposeBullet(resultBulletByKey, key);
          removeCloseLine(key);
          disposeTradeContainers(tradeIndex);
        }
        if (Number.isFinite(closeMs)) {
          const ctKey = 'ct-' + closeMs;
          disposeBullet(orderBulletByKey, ctKey);
          disposeBullet(resultBulletByKey, ctKey);
          removeCloseLine(ctKey);
        }
      }

      function registerTradeContainer(tradeIndex, container, type) {
        if (tradeIndex == null || !container) return;
        if (!Array.isArray(tradeContainersByIndex[tradeIndex])) {
          tradeContainersByIndex[tradeIndex] = [];
        }
        tradeContainersByIndex[tradeIndex].push({ container, type });
      }

      function bindTradeFocus(container, tradeIndex, type) {
        if (!container || tradeIndex == null) return;
        const handler = () => setTradeViewPreference(tradeIndex, type);
        container.events.on('pointerdown', handler);
        container.events.on('click', handler);
      }

      function setTradeViewPreference(tradeIndex, type) {
        if (tradeIndex == null) return;
        tradePreferredViewByIndex.set(tradeIndex, type);
        bringTradeToFront(tradeIndex, type);
      }

      function ensureTradePreference(tradeIndex, type) {
        if (tradeIndex == null) return;
        if (!tradePreferredViewByIndex.has(tradeIndex)) {
          tradePreferredViewByIndex.set(tradeIndex, type);
        }
      }

      function bringTradeToFront(tradeIndex, preferredType) {
        if (tradeIndex == null) return;
        const pref = preferredType || tradePreferredViewByIndex.get(tradeIndex);
        tradeFrontCounter += 1;
        const baseZ = tradeFrontCounter;
        const items = [];
        const pushItem = (sprite, isPreferred) => {
          if (!sprite) return;
          items.push({ sprite, isPreferred });
        };
        const apply = (sprite, zDelta = 0) => {
          if (!sprite) return;
          const z = baseZ + zDelta;
          if (sprite.set) sprite.set('zIndex', z);
        };
        const applyToBullet = (bullet, zDelta = 0) => {
          if (!bullet) return;
          const sprite = bullet.get?.('sprite') || bullet.sprite || bullet;
          apply(sprite, zDelta);
          pushItem(sprite, zDelta > 0);
        };
        applyToBullet(orderBulletByKey.get('idx-' + tradeIndex), pref === 'order' ? 1 : 0);
        applyToBullet(resultBulletByKey.get('idx-' + tradeIndex), pref === 'result' ? 1 : 0);
        const containers = tradeContainersByIndex[tradeIndex];
        if (containers) {
          (Array.isArray(containers) ? containers : [containers]).forEach((entry) => {
            const container = entry?.container || entry;
            const type = entry?.type;
            const delta = pref && type === pref ? 1 : 0;
            apply(container, delta);
            pushItem(container, delta > 0);
          });
        }
        const closeEntry = closeLineByKey.get('idx-' + tradeIndex);
        if (closeEntry?.range) {
          const grid = closeEntry.range.get('grid');
          apply(grid);
          pushItem(grid, false);
          pushItem(closeEntry.range, false);
        }
        // bring all to front, non-preferred first, preferred last to sit on top
        items
          .sort((a, b) => {
            if (a.isPreferred === b.isPreferred) return 0;
            return a.isPreferred ? 1 : -1;
          })
          .forEach((it) => {
            if (it.sprite?.toFront) {
              try { it.sprite.toFront(); } catch (_) {}
            }
          });
      }

      function disposeTradeContainers(tradeIndex) {
        if (tradeIndex == null) return;
        const entry = tradeContainersByIndex[tradeIndex];
        if (!entry) return;
        const list = Array.isArray(entry) ? entry : [entry];
        list.forEach((item) => {
          const container = item?.container || item;
          if (container?.dispose) {
            try { container.dispose(); } catch (_) {}
          }
        });
        tradeContainersByIndex[tradeIndex] = [];
        tradePreferredViewByIndex.delete(tradeIndex);
      }

      function scheduleCleanup(tradeIndex, closeTime) {
        const closeMs = Number(closeTime);
        if (!Number.isFinite(closeMs)) return;
        const key = tradeIndex != null ? 'idx-' + tradeIndex : 'ct-' + closeMs;
        const existing = cleanupTimerByKey.get(key);
        if (existing) {
          clearTimeout(existing);
        }
        const delayUntilClose = Math.max(0, closeMs - Date.now());
        const timer = setTimeout(() => {
          cleanupMarkersByTrade(tradeIndex, closeMs);
          cleanupTimerByKey.delete(key);
        }, delayUntilClose + CLEANUP_DELAY_AFTER_CLOSE_MS);
        cleanupTimerByKey.set(key, timer);
      }

      function clearPulseBullets() {
        if (!series) return;
        series.dataItems.forEach((di) => {
          if (!Array.isArray(di.bullets) || !di.bullets.length) return;
          const keep = [];
          di.bullets.forEach((b) => {
            const isPulse = b.get && b.get('isPulse');
            if (isPulse) {
              try { b.dispose(); } catch (_) {}
            } else {
              keep.push(b);
            }
          });
          di.bullets = keep;
          di.set('bullets', di.bullets);
        });
        if (Array.isArray(series.bullets) && series.bullets.length) {
          series.bullets = series.bullets.filter((b) => {
            const isPulse = b.get && b.get('isPulse');
            if (isPulse) {
              try { b.dispose(); } catch (_) {}
              return false;
            }
            return true;
          });
        }
        lastPulseBullet = null;
        lastPulseDataItem = null;
      }

      function scheduleCleanupForClose() { }

      function applyPalette() {
        if (series) {
          const stroke = am5.color(CHART_STROKE);
          const fill = am5.color(CHART_FILL);
          series.setAll({ stroke, fill });
          series.strokes.template.setAll({
            stroke,
            strokeWidth: 1,
          });
          series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.12,
            fill,
          });
        }
        const grid = rangeAhead?.get('grid');
        if (grid) {
          grid.setAll({
            stroke: am5.color(AHEAD_STROKE),
            strokeOpacity: 1,
            forceHidden: false,
            visible: true,
            location: 0.5,
          });
          grid.toFront();
        }
        if (counterLabel) {
          counterLabel.set('fill', am5.color(AHEAD_STROKE));
        }
        if (aheadGuideLine) {
          aheadGuideLine.set('stroke', am5.color(AHEAD_STROKE));
        }
      }

      function initChart() {
        if (root) return;
        root = am5.Root.new('chartdiv');
        root.setThemes([am5themes_Animated.new(root)]);
        // no interval-based cleanup

        chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: true,
            panY: false,
            pinchZoomX: false,
            pinchZoomY: false,
            wheelX: 'none',
            wheelY: 'none',
          })
        );
        chart.setAll({ paddingRight: 0, paddingLeft: 0 });
        chart.zoomOutButton.setAll({ forceHidden: true, visible: false, opacity: 0 });
        chart.rightAxesContainer.setAll({ paddingLeft: 0, paddingRight: 0, marginRight: 0 });
        chart.plotContainer.setAll({ paddingRight: 0 });
        chart.plotContainer.events.on('pointerdown', () => {
          autoFocusEnabled = false;
          leftLoadArmed = true; // only fetch more left after user interaction
        });
        startLeftWatcher();
        // connectors disabled; no frameended hook needed
        window.addEventListener('message', (e) => handleMessage(e.data));
        document.addEventListener('message', (e) => handleMessage(e.data));

        xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: 'second', count: 1 },
            gridIntervals: [{ timeUnit: 'second', count: 30 }],
            renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
          })
        );
        xAxis.get('renderer').labels.template.setAll({ fill: am5.color('#d1d5db'), fontSize: 10 });

        yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
          })
        );
        yAxis.get('renderer').setAll({ opposite: true, inside: false, paddingRight: 0 });
        yAxis.get('renderer').labels.template.setAll({ fill: am5.color('#d1d5db'), fontSize: 10, textAlign: 'right', paddingRight: 0 });
        // connectors disabled; no boundschanged hooks needed

        series = chart.series.push(
          am5xy.SmoothedXLineSeries.new(root, {
            name: 'Price',
            xAxis,
            yAxis,
            valueYField: 'value',
            valueXField: 'time',
          maskBullets: false,
        })
      );
        series.setAll({
          interpolationDuration: 300,
          interpolationEasing: am5.ease.out(am5.ease.cubic),
          sequencedInterpolation: true,
        });
        series.strokes.template.setAll({
          stroke: am5.color(CHART_STROKE),
          strokeWidth: 1,
        });
        series.fills.template.setAll({
          visible: true,
          fillOpacity: 0.12,
          fill: am5.color(CHART_FILL),
        });
        applyPalette();
        // keep order bullets visible even when near plot edges and above all layers
        chart.plotContainer.set('maskContent', false);
        chart.seriesContainer.setAll({ maskContent: false, zIndex: 1000001 });
        series.bulletsContainer.setAll({ maskContent: false, zIndex: 1000003, isMeasured: false });
        series.bulletsContainer.toFront();
        series.bullets.push((root, series, dataItem) => {
          const ctx = dataItem.dataContext || {};
          if (!ctx._isLast) return undefined;
          const color = am5.color(BULLET_COLOR);
          const pulse = am5.Circle.new(root, { radius: 5, fill: color, strokeWidth: 0 });
          const core = am5.Circle.new(root, { radius: 2, fill: color, strokeWidth: 0 });
          pulse.animate({
            key: 'scale',
            from: 0.8,
            to: 1.6,
            duration: 2000,
            loops: Infinity,
            easing: am5.ease.yoyo(am5.ease.cubic),
          });
          pulse.animate({
            key: 'opacity',
            from: 1,
            to: 0.4,
            duration: 2000,
            loops: Infinity,
            easing: am5.ease.yoyo(am5.ease.cubic),
          });
          const container = am5.Container.new(root, {
            centerX: am5.percent(50),
            centerY: am5.percent(50),
          });
          container.children.push(pulse);
          container.children.push(core);
          const pulseBullet = am5.Bullet.new(root, { sprite: container });
          pulseBullet.set('isPulse', true);
          return pulseBullet;
        });
        ensureAheadRange();
      }

      function setData(data) {
        if (!root) initChart();
        if (!series) return;
        closeLineRanges = [];
        closeLineByKey.forEach((entry) => {
          if (entry?.range?.dispose) {
            try { entry.range.dispose(); } catch (_) {}
          }
        });
        closeLineByKey.clear();
        [orderBulletByKey, resultBulletByKey].forEach((map) => {
          map.forEach((b) => {
            if (b?.dispose) {
              try { b.dispose(); } catch (_) {}
            }
          });
          map.clear();
        });
        cleanupTimerByKey.forEach((t) => clearTimeout(t));
        cleanupTimerByKey.clear();
        tradeContainersByIndex.forEach((entry, idx) => disposeTradeContainers(idx));
        tradeContainersByIndex.length = 0;
        tradeFrontCounter = TRADE_FRONT_BASE_Z;
        tradePreferredViewByIndex.clear();
        pendingResults = [];
        series.setAll({
          interpolationDuration: 300,
          interpolationEasing: am5.ease.out(am5.ease.cubic),
        });
        clearPulseBullets();
        const tagged = (data || []).map((d, idx, arr) => ({
          ...d,
          _isLast: idx === arr.length - 1,
        }));
        initialMinTime = tagged[0]?.time ?? null;
        hasPrependedData = false;
        series.data.setAll(tagged);
        applyPalette();
        setLatestBullet();
        setWatermarkVisible(true);
        const last = tagged[tagged.length - 1];
        lastTimeValue = last?.time;
        extendAxisMax(lastTimeValue);
        updateAheadRange(lastTimeValue);
        attachPendingOrders();
        attachPendingResults();
        focusLatest();
        setLeftLoading(false);
      }

      function appendPoint(point) {
        if (!series) return;
        const dataItems = series.dataItems;
        if (dataItems?.length) {
          const prevLast = dataItems[dataItems.length - 1];
          if (prevLast?.dataContext) prevLast.dataContext._isLast = false;
        }
        const taggedPoint = { ...point, _isLast: true };
        series.data.push(taggedPoint);
        setLatestBullet();
        lastTimeValue = taggedPoint.time;
        extendAxisMax(lastTimeValue);
        updateAheadRange(lastTimeValue);
        attachPendingOrders();
        attachPendingResults();
        focusLatest();
      }

      function setLatestBullet() {
        if (!series) return;
        const items = series.dataItems;
        if (!items?.length) return;
        clearPulseBullets();
        // find _isLast, fallback to last item
        let last = null;
        items.forEach((it) => {
          if (it.dataContext && it.dataContext._isLast) {
            last = it;
          }
        });
        if (!last) {
          last = items[items.length - 1];
          if (!last) return;
        }
        // remove any existing pulse bullets (keep order bullets)
        clearPulseBullets();
        // skip adding a new pulsing bullet to avoid stray artifacts
        lastPulseBullet = null;
        lastPulseDataItem = null;
      }

      function formatSeconds(value) {
        const numeric = Number(value);
        const safeValue = Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
        return safeValue ? safeValue + 's' : '0s';
      }

      function formatClock(ms) {
        const numeric = Number(ms);
        if (!Number.isFinite(numeric)) return '--:--:--';
        const d = new Date(numeric);
        const pad = (v) => String(v).padStart(2, '0');
        return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      }

      function formatReadableNumber(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return '--';
        try {
          const fraction = Math.abs(numeric) >= 100 ? 2 : 4;
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: fraction,
          }).format(numeric);
        } catch (_) {
          return numeric.toFixed(Math.abs(numeric) >= 100 ? 0 : 2);
        }
      }

      function formatDurationSeconds(totalSeconds) {
        const numeric = Number(totalSeconds);
        const safe = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
        const hours = Math.floor(safe / 3600);
        const minutes = Math.floor((safe % 3600) / 60);
        const seconds = safe % 60;
        const pad = (v) => String(v).padStart(2, '0');
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
      }

      function formatWinAmount(value, isWin) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return '--';
        const sign = isWin ? '+' : '-';
        const abs = Math.abs(numeric);
        return sign + formatReadableNumber(abs);
      }

      function updateCounterLabel() {
        if (!counterLabel) return;
        counterLabel.set('text', formatSeconds(timerSeconds));
      }

      function ensureCloseLine(order) {
        if (!chart || !xAxis) return;
        const rawClose =
          order?.closeTime != null
            ? Number(order.closeTime)
            : order?.time != null
            ? Number(order.time) + timerSeconds * 1000
            : NaN;
        const closeValue = Number.isFinite(rawClose) ? rawClose : null;
        if (closeValue == null) return;
        const key = orderKey(order) || ('ct-' + closeValue);
        if (closeLineByKey.has(key)) return;
        extendAxisMax(closeValue);
        const dataItem = xAxis.makeDataItem({ value: closeValue });
        const range = xAxis.createAxisRange(dataItem);
        closeLineRanges.push({ value: closeValue, range });
        closeLineByKey.set(key, { value: closeValue, range });
        const grid = range.get('grid');
        if (grid) {
          const strokeColor = order?.side === 'SELL' ? ORDER_SELL_COLOR : ORDER_BUY_COLOR;
          grid.setAll({
            stroke: am5.color(strokeColor),
            strokeWidth: 1,
            strokeOpacity: 1,
            location: 0.5,
            isMeasured: false,
            zIndex: 1000002,
            visible: true,
            forceHidden: false,
          });
          grid.toFront();
        }
        range.get('label')?.setAll({ fill: am5.color(strokeColor), stroke: am5.color(strokeColor) });
      }


      function buildOrderBullet(order) {
        const color = order.side === 'SELL' ? '#EF4444' : '#10B981';
        const bgColor = order.side === 'SELL' ? '#7F1D1D' : '#064E3B';
        const circleRadius = 3; // smaller circle, easier to align precisely to the data point
        const openTimeMs = Number.isFinite(Number(order.openTime)) ? Number(order.openTime) : Number(order.time);
        const closeMs = Number.isFinite(Number(order.closeTime))
          ? Number(order.closeTime)
          : Number.isFinite(Number(order.time))
          ? Number(order.time) + timerSeconds * 1000
          : null;
        let remainingSeconds = Number.isFinite(order.timerSeconds) ? Number(order.timerSeconds) : timerSeconds;
        const container = am5.Container.new(root, {
          layout: root.horizontalLayout,
          centerX: am5.percent(100), // anchor on the right so circle stays on the data point
          centerY: am5.percent(50),
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          zIndex: 1000002,
          interactive: true,
          interactiveChildren: true,
        });
        container.set('x', -circleRadius); // shift back by radius so the circle center sits on the data point
        const labelBg = am5.RoundedRectangle.new(root, {
          cornerRadius: 6,
          fill: am5.color(bgColor),
          fillOpacity: 0.95,
          strokeWidth: 0,
        });
        const infoStack = am5.Container.new(root, {
          layout: root.verticalLayout,
          centerY: am5.percent(50),
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          spacing: 0, // use explicit margins on labels for tighter control
        });
        infoStack.set('background', labelBg);
        const formattedAmount = formatReadableNumber(order.amount);
        const amountLabel = am5.Label.new(root, {
          text: 'Amount: ' + formattedAmount,
          fontSize: 11,
          fontWeight: '700',
          fill: am5.color('#E5E7EB'),
          textAlign: 'left',
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginTop: 4,
          marginBottom: 4,
        });
        const priceLabel = am5.Label.new(root, {
          text: 'Price: ' + formatReadableNumber(order.price),
          fontSize: 11,
          fontWeight: '600',
          fill: am5.color('#E5E7EB'),
          textAlign: 'left',
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginBottom: 4,
        });
        const timeLabel = am5.Label.new(root, {
          text: 'Open time: ' + formatClock(openTimeMs),
          fontSize: 11,
          fontWeight: '600',
          fill: am5.color('#E5E7EB'),
          textAlign: 'left',
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginBottom: 4,
        });
        const counterLabel = am5.Label.new(root, {
          text: formatDurationSeconds(Math.max(0, Number.isFinite(closeMs) ? Math.round((closeMs - Date.now()) / 1000) : remainingSeconds)),
          fontSize: 14,
          fontWeight: '700',
          fill: am5.color(color),
          textAlign: 'left',
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginBottom: 0,
        });
        infoStack.children.push(amountLabel);
        infoStack.children.push(priceLabel);
        infoStack.children.push(timeLabel);
        infoStack.children.push(counterLabel);
        const arrow = am5.Triangle.new(root, {
          height: 10,
          width: 8,
          fill: am5.color(bgColor),
          strokeWidth: 0,
          rotation: 90, // point right toward the circle
          centerY: am5.percent(50),
          marginLeft: -1, // overlap to eliminate seam between bg and arrow
        });
        const labelStack = am5.Container.new(root, {
          layout: root.horizontalLayout,
          centerY: am5.percent(50),
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          spacing: 0,
          interactive: true,
          interactiveChildren: true,
        });
        labelStack.children.push(infoStack);
        labelStack.children.push(arrow);
        const circle = am5.Circle.new(root, {
          radius: circleRadius,
          fill: am5.color(CHART_BG),
          strokeWidth: 2,
          stroke: am5.color(color),
          centerY: am5.percent(50),
          centerX: am5.percent(50),
          marginLeft: 0,
          zIndex: 1,
        });
        container.children.push(labelStack);
        container.children.push(circle);
        const tickCounter = () => {
          const next = Number.isFinite(closeMs)
            ? Math.max(0, Math.round((closeMs - Date.now()) / 1000))
            : Math.max(0, remainingSeconds - 1);
          remainingSeconds = next;
          counterLabel.set('text', formatDurationSeconds(next));
          if (next <= 0) {
            clearInterval(interval);
          }
        };
        const interval = setInterval(tickCounter, 1000);
        tickCounter();
        container.events.on('disposed', () => {
          clearInterval(interval);
        });
        registerTradeContainer(order.tradeIndex, container, 'order');
        ensureTradePreference(order.tradeIndex, 'order');
        bindTradeFocus(container, order.tradeIndex, 'order');
        bindTradeFocus(labelStack, order.tradeIndex, 'order');
        bindTradeFocus(infoStack, order.tradeIndex, 'order');
        bindTradeFocus(circle, order.tradeIndex, 'order');
        bringTradeToFront(order.tradeIndex, tradePreferredViewByIndex.get(order.tradeIndex) || 'order');
        return am5.Bullet.new(root, {
          sprite: container,
          locationX: 0.5,
          locationY: 0.5,
          stacked: 'up',
        });
      }

      function attachPendingOrders() {
        if (!series || !series.dataItems?.length) return;
        const remaining = [];
        pendingOrders.forEach((ord) => {
          const match = series.dataItems.find((di) => Number(di.get('valueX')) === Number(ord.time));
          const target = match || series.dataItems[series.dataItems.length - 1];
          const key = orderKey(ord);
          if (target) {
            const filled = { ...ord };
            if (!Number.isFinite(Number(filled.price))) {
              const v = target.get('valueY');
              if (Number.isFinite(Number(v))) {
                filled.price = Number(v);
              }
            }
            if (key) disposeBullet(orderBulletByKey, key);
            const bullet = series.addBullet(target, buildOrderBullet(filled));
            if (bullet?.set) {
              if (key) bullet.set('customKey', key);
              if (Number.isFinite(filled.closeTime)) bullet.set('customClose', Number(filled.closeTime));
            }
            (bullet || {}).customKey = key;
            if (Number.isFinite(filled.closeTime)) (bullet || {}).customClose = Number(filled.closeTime);
            if (key) orderBulletByKey.set(key, bullet);
            ensureCloseLine(filled);
            tagBulletWithTrade(bullet, filled.tradeIndex);
            ensureTradePreference(filled.tradeIndex, 'order');
            const closeForCleanup = Number.isFinite(filled.closeTime)
              ? Number(filled.closeTime)
              : Number.isFinite(filled.time)
              ? Number(filled.time) + timerSeconds * 1000
              : null;
            scheduleCleanup(filled.tradeIndex, closeForCleanup);
            bringTradeToFront(filled.tradeIndex, tradePreferredViewByIndex.get(filled.tradeIndex) || 'order');
          } else {
            remaining.push(ord);
          }
        });
        pendingOrders = remaining;
      }

      function buildResultBullet(result) {
        const isWin = !!result.isWin;
        const color = isWin ? '#10B981' : '#EF4444';
        const bgColor = '#050912';
        const circleRadius = 3;
        const container = am5.Container.new(root, {
          layout: root.horizontalLayout,
          centerX: am5.percent(100),
          centerY: am5.percent(50),
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          zIndex: 1000002,
          interactive: true,
          interactiveChildren: true,
        });
        container.set('x', -circleRadius);
        const labelBg = am5.RoundedRectangle.new(root, {
          cornerRadius: 6,
          fill: am5.color(bgColor),
          fillOpacity: 0.92,
          strokeWidth: 1,
          stroke: am5.color(color),
        });
        const infoStack = am5.Container.new(root, {
          layout: root.verticalLayout,
          centerY: am5.percent(50),
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          spacing: 0,
        });
        infoStack.set('background', labelBg);
        const closeLabel = am5.Label.new(root, {
          text: 'Close: ' + formatClock(result.closeTime),
          fontSize: 11,
          fontWeight: '700',
          fill: am5.color(color),
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginTop: 4,
          marginBottom: 4,
          textAlign: 'left',
        });
        const priceLabel = am5.Label.new(root, {
          text: 'Final: ' + formatReadableNumber(result.finalPrice),
          fontSize: 11,
          fontWeight: '600',
          fill: am5.color(color),
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginBottom: 4,
          textAlign: 'left',
        });
        const winLabel = am5.Label.new(root, {
          text: 'P/L: ' + formatWinAmount(result.winAmount, isWin),
          fontSize: 12,
          fontWeight: '700',
          fill: am5.color(color),
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: 1,
          marginBottom: 0,
          textAlign: 'left',
        });
        infoStack.children.push(closeLabel);
        infoStack.children.push(priceLabel);
        infoStack.children.push(winLabel);
        const arrow = am5.Triangle.new(root, {
          height: 10,
          width: 8,
          fill: am5.color(color),
          strokeWidth: 0,
          rotation: 90,
          centerY: am5.percent(50),
          marginLeft: -1,
        });
        const labelStack = am5.Container.new(root, {
          layout: root.horizontalLayout,
          centerY: am5.percent(50),
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          spacing: 0,
          interactive: true,
          interactiveChildren: true,
        });
        labelStack.children.push(infoStack);
        labelStack.children.push(arrow);
        const circle = am5.Circle.new(root, {
          radius: circleRadius,
          fill: am5.color(CHART_BG),
          strokeWidth: 2,
          stroke: am5.color(color),
          centerY: am5.percent(50),
          centerX: am5.percent(50),
          zIndex: 1,
        });
        container.children.push(labelStack);
        container.children.push(circle);
        registerTradeContainer(result.tradeIndex, container, 'result');
        ensureTradePreference(result.tradeIndex, 'result');
        bindTradeFocus(container, result.tradeIndex, 'result');
        bindTradeFocus(labelStack, result.tradeIndex, 'result');
        bindTradeFocus(infoStack, result.tradeIndex, 'result');
        bindTradeFocus(circle, result.tradeIndex, 'result');
        bringTradeToFront(result.tradeIndex, 'result');
        return am5.Bullet.new(root, {
          sprite: container,
          locationX: 0.5,
          locationY: 0.5,
          stacked: 'up',
        });
      }

      function attachPendingResults() {
        if (!series || !series.dataItems?.length) return;
        const remaining = [];
        pendingResults.forEach((res) => {
          const match = series.dataItems.find((di) => Number(di.get('valueX')) === Number(res.closeTime));
          const target = match || series.dataItems[series.dataItems.length - 1];
          if (target) {
            const normalized = { ...res };
            if (!Number.isFinite(normalized.finalPrice)) {
              const v = target.get('valueY');
              if (Number.isFinite(Number(v))) normalized.finalPrice = Number(v);
            }
            const key = resultKey(normalized);
            if (key) disposeBullet(resultBulletByKey, key);
            const bullet = series.addBullet(target, buildResultBullet(normalized));
            if (bullet?.set) {
              if (key) bullet.set('customKey', key);
              if (Number.isFinite(normalized.closeTime)) bullet.set('customClose', Number(normalized.closeTime));
            }
            (bullet || {}).customKey = key;
            if (Number.isFinite(normalized.closeTime)) (bullet || {}).customClose = Number(normalized.closeTime);
            if (key) resultBulletByKey.set(key, bullet);
            tagBulletWithTrade(bullet, normalized.tradeIndex, normalized.closeTime);
            const closeForCleanup = Number.isFinite(normalized.closeTime)
              ? Number(normalized.closeTime)
              : Number.isFinite(normalized.time)
              ? Number(normalized.time) + timerSeconds * 1000
              : null;
            scheduleCleanup(normalized.tradeIndex, closeForCleanup);
            setTradeViewPreference(normalized.tradeIndex, 'result');
          } else {
            remaining.push(res);
          }
        });
        pendingResults = remaining;
      }

      function addResultMarker(result) {
        if (!result || !result.closeTime) return;
        const normalized = {
          closeTime: Number(result.closeTime),
          finalPrice: Number(result.finalPrice),
          isWin: !!result.isWin,
          winAmount: result.winAmount,
          tradeIndex: result.tradeIndex != null ? result.tradeIndex : undefined,
        };
        if (!series || !series.dataItems?.length) {
          pendingResults.push(normalized);
          return;
        }
        const match = series.dataItems.find((di) => Number(di.get('valueX')) === normalized.closeTime);
        const target = match || series.dataItems[series.dataItems.length - 1];
        if (target) {
          if (!Number.isFinite(normalized.finalPrice)) {
            const v = target.get('valueY');
            if (Number.isFinite(Number(v))) normalized.finalPrice = Number(v);
          }
          const key = resultKey(normalized);
          if (key) disposeBullet(resultBulletByKey, key);
          const bullet = series.addBullet(target, buildResultBullet(normalized));
          if (bullet?.set) {
            if (key) bullet.set('customKey', key);
            if (Number.isFinite(normalized.closeTime)) bullet.set('customClose', Number(normalized.closeTime));
          }
          (bullet || {}).customKey = key;
          if (Number.isFinite(normalized.closeTime)) (bullet || {}).customClose = Number(normalized.closeTime);
          if (key) resultBulletByKey.set(key, bullet);
          tagBulletWithTrade(bullet, normalized.tradeIndex, normalized.closeTime);
          const closeForCleanup = Number.isFinite(normalized.closeTime)
            ? Number(normalized.closeTime)
            : Number.isFinite(normalized.time)
            ? Number(normalized.time) + timerSeconds * 1000
            : null;
          scheduleCleanup(normalized.tradeIndex, closeForCleanup);
          setTradeViewPreference(normalized.tradeIndex, 'result');
        } else {
          pendingResults.push(normalized);
        }
      }

      function setTimerSeconds(nextTimer) {
        const numeric = Number(nextTimer);
        if (!isFinite(numeric)) return;
        timerSeconds = numeric;
        updateCounterLabel();
        if (lastTimeValue) updateAheadRange(lastTimeValue);
      }

      function ensureAheadRange() {
        if (!xAxis || rangeAhead) return;
        rangeAheadDataItem = xAxis.makeDataItem({ value: 0 });
        rangeAhead = xAxis.createAxisRange(rangeAheadDataItem);
        const grid = rangeAhead.get('grid');
        if (grid) {
          grid.setAll({
            stroke: am5.color(AHEAD_STROKE),
            strokeWidth: 1,
            strokeOpacity: 1,
            location: 0.5,
            forceHidden: false,
            visible: true,
            isMeasured: false,
            zIndex: 1000000,
          });
          grid.toFront();
        }
        
        const bulletContainer = am5.Container.new(root, {
          width: 150,
          height: 25,
        });
        const counterLabelBG = am5.Picture.new(root, {
          src: CLOCK_ICON_SRC,
          width: 16,
          height: 16,
          centerX: am5.percent(50),
          centerY: am5.percent(25),
        });
  
        counterLabel = am5.Label.new(root, {
          fontSize: FONT_SIZE_AXIS,
          fontWeight: 'bold',
          fill: am5.color(AHEAD_STROKE),
          centerX: am5.percent(50),
          centerY: am5.percent(85),
          fontFamily: 'Arial',
          text: formatSeconds(timerSeconds),
        });
        bulletContainer.children.push(counterLabelBG);
        bulletContainer.children.push(counterLabel);
        rangeAheadBulletContainer = bulletContainer;
        rangeAhead.set(
          'bullet',
          am5xy.AxisBullet.new(root, {
            sprite: bulletContainer,
          })
        );
      }

      function updateAheadRange(lastTime) {
        if (!lastTime || !xAxis || !chart) return;
        ensureAheadRange();
        if (!rangeAheadDataItem || !rangeAhead) return;
        const target = lastTime + timerSeconds * 1000;
        rangeAheadDataItem.set('value', target);
        updateCounterLabel();
        const grid = rangeAhead.get('grid');
        if (grid) {
          const { withinPlot } = getAheadCoord(target);
          grid.setAll({
            visible: !!withinPlot,
            forceHidden: false,
            strokeOpacity: 1,
            stroke: am5.color(AHEAD_STROKE),
            location: 0.5,
          });
          grid.toFront();
        }
        updateAheadGuideLine(target);
      }

      function pruneToInitialRange() {
        if (!series || initialMinTime == null) return;
        const current = series.data.values || [];
        const pruned = current
          .filter((d) => d?.time != null && d.time >= initialMinTime)
          .map((d) => ({ ...d, _isLast: false }));
        if (pruned.length) {
          pruned[pruned.length - 1]._isLast = true;
        }
        series.data.setAll(pruned);
        setLatestBullet();
        const last = pruned[pruned.length - 1];
        lastTimeValue = last?.time;
        hasPrependedData = false;
      }

      function prependData(points) {
        if (!series || !points?.length) {
          setLeftLoading(false);
          return;
        }
        hasPrependedData = true;
        const prevView = getCurrentViewRange();
        const incoming = points.map((p) => ({ ...p, _isLast: false }));
        const existing = series.data.values.map((d) => ({ ...d, _isLast: false }));
        const merged = [...incoming];
        if (incoming.length && existing.length) {
          const gapTime = (existing[0]?.time ?? incoming[incoming.length - 1].time) - 1;
          merged.push({ time: gapTime, value: null, _isLast: false, _isGap: true });
        }
        merged.push(...existing);
        const dedup = [];
        const seen = new Set();
        merged.forEach((d) => {
          if (d?.time == null) return;
          if (seen.has(d.time)) return;
          seen.add(d.time);
          dedup.push(d);
        });
        if (merged.length) {
          dedup[dedup.length - 1]._isLast = true;
        }
        series.data.setAll(dedup);
        setLatestBullet();
        const last = dedup[dedup.length - 1];
        lastTimeValue = last?.time;
        extendAxisMax(lastTimeValue);
        setLeftLoading(false);
        animateRevealLeft(prevView);
        attachPendingOrders();
        attachPendingResults();
      }

      function extendAxisMax(anchorTime) {
        if (!xAxis || !anchorTime) return;
        const targetMax = anchorTime + PAN_FUTURE_MS;
        const currentMax = xAxis.get('max');
        if (currentMax == null || targetMax > currentMax) {
          xAxis.set('max', targetMax);
        }
      }

      function checkLeftEdge() {
        if (!xAxis || !series || !series.data.values?.length) return;
        if (!leftLoadArmed || loadingLeft) return;
        const min = xAxis.getPrivate('min');
        if (min == null) return;
        const startPos = xAxis.get('start');
        if (startPos != null && startPos > 0.02) return; // not near left viewport edge
        const first = series.data.values[0];
        if (!first) return;
        if (!loadingLeft && min <= first.time + LEFT_EDGE_BUFFER_MS) {
          requestMoreLeft(first);
        }
      }

      function startLeftWatcher() {
        if (leftEdgeInterval) return;
        leftEdgeInterval = setInterval(() => {
          checkLeftEdge();
          checkNearLatest();
        }, 400);
      }

      function requestMoreLeft(first) {
        if (!first) return;
        if (loadingLeft) return; // guard: never double-fetch
        const now = Date.now();
        if (now - lastLeftLoadMs < LEFT_LOAD_COOLDOWN_MS) return;
        loadingLeft = true;
        leftLoadArmed = false;
        lastLeftLoadMs = now;
        setLeftLoading(true);
        try {
          const payload = { type: 'loadMoreLeft', payload: { firstTime: first.time, firstValue: first.value } };
          if (window.ReactNativeWebView?.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
        } catch (e) {
          loadingLeft = false;
          setLeftLoading(false);
        }
      }

      function setLeftLoading(flag) {
        loadingLeft = flag;
        const el = document.getElementById('loading-left');
        if (el) {
          el.style.display = flag ? 'flex' : 'none';
        }
        setWatermarkVisible(!flag);
      }

      function checkNearLatest() {
        if (!hasPrependedData || !lastTimeValue) return;
        const view = getCurrentViewRange();
        if (!view || view.end == null) return;
        if (view.end >= lastTimeValue - NEAR_LATEST_BUFFER_MS) {
          pruneToInitialRange();
        }
      }

      function getCurrentViewRange() {
        if (!xAxis) return null;
        const startPos = xAxis.get('start');
        const endPos = xAxis.get('end');
        const renderer = xAxis.get('renderer');
        if (renderer?.positionToValue && startPos != null && endPos != null) {
          const startVal = renderer.positionToValue(startPos);
          const endVal = renderer.positionToValue(endPos);
          if (isFinite(startVal) && isFinite(endVal)) {
            return { start: startVal, end: endVal };
          }
        }
        return null;
      }

      function ensureAheadGuideLine() {
        if (aheadGuideLine && !aheadGuideLine.isDisposed?.()) return aheadGuideLine;
        if (!chart || !root) return null;
        aheadGuideLine = chart.plotContainer.children.push(
          am5.Line.new(root, {
            stroke: am5.color(AHEAD_STROKE),
            strokeWidth: 1,
            strokeOpacity: 1,
            isMeasured: false,
            visible: false,
            zIndex: 1000001,
          })
        );
        return aheadGuideLine;
      }

      function addOrderMarker(order) {
        if (!order || !order.time) return;
        const normalized = {
          time: Number(order.time),
          side: order.side === 'SELL' ? 'SELL' : 'BUY',
          amount: order.amount,
          symbol: order.symbol,
          price: Number(order.price),
          openTime: order.openTime != null ? Number(order.openTime) : undefined,
          closeTime: order.closeTime != null ? Number(order.closeTime) : undefined,
          tradeIndex: order.tradeIndex != null ? order.tradeIndex : undefined,
        };
        const key = orderKey(normalized);
        if (!series || !series.dataItems?.length) {
          pendingOrders.push(normalized);
          return;
        }
        const match = series.dataItems.find((di) => Number(di.get('valueX')) === normalized.time);
        const target = match || series.dataItems[series.dataItems.length - 1];
        if (target) {
          if (!Number.isFinite(normalized.price)) {
            const v = target.get('valueY');
            if (Number.isFinite(Number(v))) {
              normalized.price = Number(v);
            }
          }
          if (key) disposeBullet(orderBulletByKey, key);
          const bullet = series.addBullet(target, buildOrderBullet(normalized));
          if (bullet?.set) {
            if (key) bullet.set('customKey', key);
            if (Number.isFinite(normalized.closeTime)) bullet.set('customClose', Number(normalized.closeTime));
          }
          (bullet || {}).customKey = key;
          if (Number.isFinite(normalized.closeTime)) (bullet || {}).customClose = Number(normalized.closeTime);
          if (key) orderBulletByKey.set(key, bullet);
          ensureCloseLine(normalized);
          tagBulletWithTrade(bullet, normalized.tradeIndex, normalized.closeTime);
          ensureTradePreference(normalized.tradeIndex, 'order');
          const closeForCleanup = Number.isFinite(normalized.closeTime)
            ? Number(normalized.closeTime)
            : Number.isFinite(normalized.time)
            ? Number(normalized.time) + timerSeconds * 1000
            : null;
          scheduleCleanup(normalized.tradeIndex, closeForCleanup);
          bringTradeToFront(normalized.tradeIndex, tradePreferredViewByIndex.get(normalized.tradeIndex) || 'order');
        } else {
          pendingOrders.push(normalized);
        }
      }

      function getAheadCoord(target) {
        if (!chart || !xAxis) return { coord: null, height: null, withinPlot: false };
        const pc = chart.plotContainer;
        const width = pc?.getPrivate('width');
        const height = pc?.getPrivate('height');
        const pos = xAxis.valueToPosition(target);
        const coord = xAxis.get('renderer')?.positionToCoordinate?.(pos ?? 0);
        const withinPlot =
          coord != null &&
          isFinite(coord) &&
          width != null &&
          height != null &&
          coord >= 0 &&
          coord <= width;
        return { coord, height, withinPlot, width };
      }

      function updateAheadGuideLine(target) {
        const line = ensureAheadGuideLine();
        if (!line) return;
        const { coord, height, withinPlot, width } = getAheadCoord(target);
        if (!withinPlot || coord == null || height == null || width == null || !isFinite(coord) || !isFinite(height)) {
          line.set('visible', false);
          return;
        }
        const clampedX = Math.min(Math.max(0, coord), width);
        line.setAll({
          visible: true,
          x1: clampedX,
          x2: clampedX,
          y1: 0,
          y2: height,
        });
        line.toFront();
      }

      function animateRevealLeft(prevView) {
        if (!xAxis) return;
        const view = prevView || getCurrentViewRange();
        if (!view || view.start == null || view.end == null) return;
        // keep the viewport anchored on the previous range to avoid sitting on the new far-left edge
        const targetStart = view.start;
        const targetEnd = view.end;
        xAxis.zoomToValues(targetStart, targetEnd, PREPEND_ANIM_DURATION_MS);
      
      }

    function focusLatest(force) {
      if (!force && !autoFocusEnabled) return;
      if (!xAxis || !series || !series.data.length) return;
        const last = series.data.getIndex(series.data.length - 1);
        const lastTime = last?.time;
        if (!lastTime) return;
        const start = lastTime - 120000;
        let end = lastTime + 20000; // keep ~20s head ahead of latest point
        xAxis.zoomToValues(start, end);
      }

      function handleMessage(raw) {
        try {
          const msg = JSON.parse(raw);
          if (msg.type === 'setData') {
            setData(msg.payload);
          } else if (msg.type === 'append') {
            appendPoint(msg.payload);
          } else if (msg.type === 'setTimer') {
            setTimerSeconds(msg.payload);
        } else if (msg.type === 'prepend') {
          prependData(msg.payload);
        } else if (msg.type === 'focus') {
          autoFocusEnabled = true;
          focusLatest(true);
        } else if (msg.type === 'order') {
          addOrderMarker(msg.payload);
        } else if (msg.type === 'result') {
          addResultMarker(msg.payload);
        }
        } catch (e) {
          console.warn('chart message error', e);
        }
      }

      window.addEventListener('message', (e) => handleMessage(e.data));
      document.addEventListener('message', (e) => handleMessage(e.data));
      initChart();
    </script>
  </body>
</html>
`;

const AmChart: React.FC = () => {
  const dispatch = useDispatch();
  const webRef = useRef<WebView>(null);
  const [webReady, setWebReady] = useState(false);
  const [loadingChart, setLoadingChart] = useState(true);
  const timer = useSelector((store: RootState) => store.trade.timer);
  const amount = useSelector((store: RootState) => store.trade.amount);
  const { activeTicker, activeTickerDemo, activeTickerBonus } = useSelector((s: RootState) => s.ticker);
  const mode = useSelector((s: RootState) => s.tradingRoom.mode);
  const selectedTicker =
    mode === 'demo' ? activeTickerDemo : mode === 'bonus' ? activeTickerBonus : activeTicker;
  const socket = getSocketByMode(mode);
  const accent = useMemo(() => getModeAccent(mode), [mode]);
  const chartLogoUri = useMemo(
    () => Image.resolveAssetSource(require('../../../assets/logo-t.png'))?.uri,
    []
  );
  const webKey = `${mode || 'mode'}-${selectedTicker?.symbol || 'pair'}-${accent.strong}-${accent.soft}`;
  const dataRef = useRef<{ time: number; value: number }[]>([]);
  const loadMorePendingRef = useRef(false);
  const pairRef = useRef<string | undefined>(selectedTicker?.symbol);

  const postToWeb = (message: unknown) => {
    if (!webReady) return;
    try {
      webRef.current?.postMessage(JSON.stringify(message));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!webReady) return;
    postToWeb({ type: 'setTimer', payload: timer });
  }, [timer, webReady]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('chart-trade', (payload: any) => {
      if (!payload) return;
      const side = payload.side;
      const amt = payload.amount ?? amount;
      const time = typeof payload.time === 'number' ? payload.time : Date.now();
      postToWeb({
        type: 'order',
        payload: {
          side,
          amount: amt,
          time,
          price: payload.price,
          openTime: payload.openTime,
          closeTime: payload.closeTime,
          tradeIndex: payload.tradeIndex,
        },
      });
    });
    const resSub = DeviceEventEmitter.addListener('chart-trade-result', (payload: any) => {
      if (!payload) return;
      const closeTime = typeof payload.closeTime === 'number' ? payload.closeTime : Date.now();
      const finalPrice = payload.finalPrice;
      const isWin = !!payload.isWin;
      const winAmount = payload.winAmount;
      postToWeb({
        type: 'result',
        payload: { closeTime, finalPrice, isWin, winAmount, tradeIndex: payload.tradeIndex },
      });
    });
    return () => {
      // @ts-ignore
      sub?.remove?.();
      // @ts-ignore
      resSub?.remove?.();
    };
  }, [amount, webReady]);

  useEffect(() => {
    if (!socket) return;
    if (!socket.connected) {
      socket.connect();
    }
    const handleDisconnect = () => {
      loadMorePendingRef.current = false;
    };
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!webReady || !selectedTicker || !socket) return;
    const pair = selectedTicker.symbol;
    const prevPair = pairRef.current;
    if (prevPair && prevPair !== pair) {
      socket.emit('unsubscribe', { pair: prevPair });
    }
    pairRef.current = pair;
    let cancelled = false;
    setLoadingChart(true);

    const mapPoint = (p: any) => ({
      time: Number(p.time),
      value: p.value,
    });
    socket.emit(
      'subscribe',
      { pair },
      (err: any, snapshot: any[]) => {
        if (cancelled) return;
        if (err) return;
        const mapped = (snapshot || [])
          .map(mapPoint)
          .filter((p) => Number.isFinite(p.time) && Number.isFinite(p.value))
          .sort((a, b) => a.time - b.time);
        dataRef.current = mapped;
        postToWeb({ type: 'setData', payload: mapped });
        setTimeout(() => { setLoadingChart(false); }, PREPEND_ANIM_DELAY_MS)
      }
    );

    socket.emit('startLive', { pair }, () => { });

    const onLiveData = (msg: any) => {
      const pt = mapPoint(msg);
      if (!Number.isFinite(pt.time) || !Number.isFinite(pt.value)) return;
      dataRef.current = [...dataRef.current, pt];
      dispatch(addLiveData(pt));
      postToWeb({ type: 'append', payload: pt });
    };
    socket.on('liveData', onLiveData);

    const onMoreKlines = (older: any[]) => {
      loadMorePendingRef.current = false;
      if (!older?.length) {
        postToWeb({ type: 'prepend', payload: [] });
        return;
      }
      dataRef.current = [...older, ...dataRef.current];
      postToWeb({ type: 'prepend', payload: older });
    };
    socket.on('moreKlines', onMoreKlines);

    return () => {
      cancelled = true;
      socket.off('liveData', onLiveData);
      socket.off('moreKlines', onMoreKlines);
      socket.emit('unsubscribe', { pair });
      setLoadingChart(true);
    };
  }, [webReady, selectedTicker?.symbol, socket]);

  return (
    <View style={styles.root}>
      {loadingChart && (
        <View style={styles.blockingOverlay}>
          <View style={styles.blockingCard}>
            <AnimatedLogoLoader size={180} />
          </View>
        </View>
      )}
      <WebView
        key={webKey}
        ref={webRef}
        originWhitelist={['*']}
        source={{ html: buildHtml(accent.strong, accent.primary, accent.soft, chartLogoUri) }}
        style={styles.chartArea}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data?.type === 'debug') {
              // eslint-disable-next-line no-console
              console.log(data.msg, data.value);
            } else if (data?.type === 'loadMoreLeft') {
              const firstTime = data?.payload?.firstTime;
              if (typeof firstTime === 'number' && selectedTicker?.symbol && !loadMorePendingRef.current) {
                loadMorePendingRef.current = true;
                socket.emit(
                  'loadMore',
                  { pair: selectedTicker.symbol, endTime: firstTime, rows: 600 },
                  (err: any) => {
                    if (err) {
                      loadMorePendingRef.current = false;
                      postToWeb({ type: 'prepend', payload: [] });
                    }
                  }
                );
              }
            }
          } catch {
            // ignore
          }
        }}
        onLoadEnd={() => {
          setWebReady(true);
        }}
      />
      <View style={styles.focusButtonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.focusButton,
            {
              backgroundColor: pressed ? `${accent.soft}55` : `${accent.soft}22`,
            },
          ]}
          onPress={() => postToWeb({ type: 'focus' })}
        >
          {({ pressed }) => (
            <View style={styles.focusIcon}>
              <View style={[styles.focusCornerTL, { borderColor: accent.strong }, pressed && styles.focusCornerPressed]} />
              <View style={[styles.focusCornerTR, { borderColor: accent.strong }, pressed && styles.focusCornerPressed]} />
              <View style={[styles.focusCornerBL, { borderColor: accent.strong }, pressed && styles.focusCornerPressed]} />
              <View style={[styles.focusCornerBR, { borderColor: accent.strong }, pressed && styles.focusCornerPressed]} />
              <View
                style={[
                  styles.focusDot,
                  pressed ? [styles.focusDotPressed, { backgroundColor: accent.strong }] : [styles.focusDotHollow, { borderColor: accent.strong }],
                ]}
              />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default AmChart;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0b1424',
  },
  chartArea: {
    flex: 1,
  },
  focusButtonWrapper: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -24 }],
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  focusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusDotHollow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  focusDotPressed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  focusCornerTL: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'transparent',
    top: 0,
    left: 0,
    borderRadius: 2,
  },
  focusCornerTR: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'transparent',
    top: 0,
    right: 0,
    borderRadius: 2,
  },
  focusCornerBL: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'transparent',
    bottom: 0,
    left: 0,
    borderRadius: 2,
  },
  focusCornerBR: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'transparent',
    bottom: 0,
    right: 0,
    borderRadius: 2,
  },
  focusCornerPressed: {
    transform: [{ scale: 0.85 }],
  },
  blockingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  blockingCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
  },
});
