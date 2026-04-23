import React, { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import type { Office } from "@/data/offices";
import { ensureLeafletAssets } from "@/utils/leafletAssetCache";
import { getCachedTileBase64, fetchAndCacheTile } from "@/utils/tileCache";

interface LeafletMapProps {
  offices: Office[];
  userLocation?: { latitude: number; longitude: number } | null;
  markerColors: Record<string, string>;
  onFallback?: () => void;
  offlineTilesAvailable?: boolean;
}

interface LeafletInline {
  js: string | null;
  css: string | null;
}

const MARKER_COLORS: Record<string, string> = {
  collector: "#2d3e50",
  tehsildar: "#b07d2a",
  "legal-aid": "#2d7a4f",
  police: "#783232",
  "women-helpline": "#ef4444",
};

const getMapHTML = (
  offices: Office[],
  userLocation: { latitude: number; longitude: number } | null,
  markerColors: Record<string, string>,
  isNative: boolean,
  offlineTilesAvailable: boolean,
  inline: LeafletInline,
) => {
  const officesJSON = JSON.stringify(
    offices.map((o) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      address: o.address,
      phone: o.phone ?? "",
      lat: o.latitude,
      lng: o.longitude,
    })),
  );
  const userLocJSON = userLocation
    ? JSON.stringify({ lat: userLocation.latitude, lng: userLocation.longitude })
    : "null";
  const colorsJSON = JSON.stringify({ ...MARKER_COLORS, ...markerColors });
  const centerLat = userLocation?.latitude ?? 22.5;
  const centerLng = userLocation?.longitude ?? 82.5;
  const zoom = userLocation ? 9 : 5;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
${
  inline.css
    ? `<style>${inline.css}</style>`
    : `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>`
}
${
  inline.js
    ? `<script>${inline.js}</script>`
    : `<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>`
}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; background: #1b2c3e; overflow: hidden; }
#map { width: 100%; height: 100%; }
#loading {
  position: fixed; inset: 0; background: #1b2c3e;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 9999; color: #fff; gap: 12px;
}
#loading-text { font-family: sans-serif; font-size: 14px; color: rgba(255,255,255,0.7); }
#loading-spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
#error-msg {
  display: none; position: fixed; inset: 0; background: #1b2c3e;
  align-items: center; justify-content: center; flex-direction: column;
  z-index: 9999; color: #fff; gap: 12px; font-family: sans-serif;
  text-align: center; padding: 24px;
}
#error-msg p { color: rgba(255,255,255,0.6); font-size: 13px; }
#retry-btn {
  margin-top: 8px; padding: 10px 24px; background: #d4af37; color: #1b2c3e;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
}
.custom-popup .leaflet-popup-content-wrapper {
  background: #fff; border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35); border: none;
}
.custom-popup .leaflet-popup-tip { background: #fff; }
.custom-popup .leaflet-popup-content { margin: 0; }
.popup-content { padding: 14px 16px 12px; min-width: 240px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.popup-name { font-size: 15px; font-weight: 700; color: #1b2c3e; margin-bottom: 6px; line-height: 1.25; }
.popup-row { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: #555; margin-top: 4px; line-height: 1.35; }
.popup-row .ic { flex: 0 0 14px; padding-top: 1px; }
.popup-actions { display: flex; gap: 8px; margin-top: 12px; }
.popup-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 10px; border-radius: 8px; font-size: 13px; font-weight: 600;
  text-decoration: none; cursor: pointer; border: none; -webkit-tap-highlight-color: transparent;
}
.popup-btn-call { background: #2d7a4f; color: #fff; }
.popup-btn-call:hover { background: #246340; }
.popup-btn-call.disabled { background: #c9d1d8; color: #fff; cursor: not-allowed; }
.popup-btn-dir { background: #1b2c3e; color: #fff; }
.popup-btn-dir:hover { background: #0f1c2c; }
.leaflet-tile { image-rendering: auto; }
#offline-badge {
  display: none; position: fixed; bottom: 8px; left: 8px; z-index: 1000;
  background: rgba(27,44,62,0.88); color: #d4af37;
  font-family: sans-serif; font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;
  border: 1px solid rgba(212,175,55,0.5);
}
</style>
</head>
<body>
<div id="offline-badge">📶 Offline Tiles</div>
<div id="loading">
  <div id="loading-spinner"></div>
  <div id="loading-text">Loading map…</div>
</div>
<div id="error-msg">
  <div style="font-size:15px;font-weight:700">Map unavailable offline</div>
  <p>Connect to the internet to load the map, or download tiles for offline use.</p>
  <button id="retry-btn" onclick="initMap()">Retry</button>
</div>
<div id="map"></div>

<script>
var OFFICES = ${officesJSON};
var USER = ${userLocJSON};
var COLORS = ${colorsJSON};
var IS_NATIVE = ${isNative ? "true" : "false"};
var OFFLINE_TILES = ${offlineTilesAvailable ? "true" : "false"};
var pendingTiles = {};
if (OFFLINE_TILES) {
  var badge = document.getElementById('offline-badge');
  if (badge) badge.style.display = 'block';
}
var map = null;

function notify(data) {
  try {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  } catch(e) {}
}

function makeMarkerIcon(color) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">' +
    '<path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22S24 21 24 12C24 5.4 18.6 0 12 0z" fill="' + color + '" stroke="#fff" stroke-width="1.5"/>' +
    '<circle cx="12" cy="12" r="5" fill="#fff" opacity="0.9"/>' +
    '</svg>';
  return L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: [24, 34], iconAnchor: [12, 34], popupAnchor: [0, -34]
  });
}

function makeUserIcon() {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">' +
    '<circle cx="11" cy="11" r="11" fill="rgba(66,133,244,0.2)"/>' +
    '<circle cx="11" cy="11" r="7" fill="#4285F4" stroke="#fff" stroke-width="2"/>' +
    '</svg>';
  return L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -11]
  });
}

// Custom tile layer that bridges to native for caching
var CachedTileLayer = (typeof L !== 'undefined') ? L.TileLayer.extend({
  createTile: function(coords, done) {
    var img = document.createElement('img');
    img.setAttribute('role', 'presentation');
    img.setAttribute('crossorigin', 'anonymous');

    var key = coords.z + '/' + coords.x + '/' + coords.y;
    var url = 'https://tile.openstreetmap.org/' + key + '.png';

    if (IS_NATIVE) {
      pendingTiles[key] = { img: img, done: done };
      notify({ type: 'getTile', z: coords.z, x: coords.x, y: coords.y, url: url });
    } else {
      img.src = url;
      img.onload = function() { done(null, img); };
      img.onerror = function(e) { done(e, img); };
    }
    return img;
  }
}) : null;

window.receiveTile = function(key, dataUri) {
  var pending = pendingTiles[key];
  if (pending) {
    pending.img.src = dataUri;
    pending.img.onload = function() { pending.done(null, pending.img); };
    pending.img.onerror = function(e) { pending.done(e, pending.img); };
    delete pendingTiles[key];
  }
};

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }

window.popupCall = function(phone) {
  if (!phone) return;
  if (IS_NATIVE) {
    notify({ type: 'call', phone: phone });
  } else {
    window.location.href = 'tel:' + phone;
  }
};
window.popupDirections = function(lat, lng, name) {
  if (IS_NATIVE) {
    notify({ type: 'directions', lat: lat, lng: lng, name: name });
  } else {
    var url = 'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(lat + ',' + lng) +
      (name ? '&destination_place_id=' : '');
    window.open(url, '_blank');
  }
};

function buildPopupHTML(o) {
  var name = escapeHtml(o.name);
  var addr = escapeHtml(o.address);
  var phone = escapeHtml(o.phone);
  var phoneAttr = escapeAttr(o.phone || '');
  var nameAttr = escapeAttr(o.name);
  var phoneRow = o.phone
    ? '<div class="popup-row"><span class="ic">📞</span><span>' + phone + '</span></div>'
    : '';
  var callBtn = o.phone
    ? '<button type="button" class="popup-btn popup-btn-call" onclick="popupCall(\\'' + phoneAttr + '\\')" aria-label="Call ' + nameAttr + '">📞 Call</button>'
    : '<button type="button" class="popup-btn popup-btn-call disabled" disabled aria-label="No phone available">📞 No phone</button>';
  var dirBtn = '<button type="button" class="popup-btn popup-btn-dir" onclick="popupDirections(' +
    o.lat + ',' + o.lng + ',\\'' + nameAttr + '\\')" aria-label="Directions to ' + nameAttr + '">🧭 Directions</button>';
  return '<div class="popup-content">' +
    '<div class="popup-name">' + name + '</div>' +
    '<div class="popup-row"><span class="ic">📍</span><span>' + addr + '</span></div>' +
    phoneRow +
    '<div class="popup-actions">' + callBtn + dirBtn + '</div>' +
    '</div>';
}

function addOffices() {
  OFFICES.forEach(function(o) {
    var color = COLORS[o.type] || '#2d3e50';
    var icon = makeMarkerIcon(color);
    L.marker([o.lat, o.lng], { icon: icon })
      .bindPopup(buildPopupHTML(o), { className: 'custom-popup', maxWidth: 300, minWidth: 240 })
      .addTo(map);
  });
  if (USER) {
    L.marker([USER.lat, USER.lng], { icon: makeUserIcon() })
      .bindPopup('<div class="popup-content"><div class="popup-name">Your Location</div></div>',
        { className: 'custom-popup' })
      .addTo(map);
  }
}

function initMap() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('error-msg').style.display = 'none';

  try {
    if (typeof L === 'undefined') {
      throw new Error('Leaflet not loaded');
    }

    if (map) {
      map.remove();
      map = null;
    }

    map = L.map('map', {
      center: [${centerLat}, ${centerLng}],
      zoom: ${zoom},
      zoomControl: true,
      attributionControl: true
    });

    var tileLayer;
    if (IS_NATIVE && CachedTileLayer) {
      tileLayer = new CachedTileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18, tileSize: 256, crossOrigin: true
      });
    } else {
      tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18, crossOrigin: true
      });
    }

    tileLayer.addTo(map);

    tileLayer.on('load', function() {
      document.getElementById('loading').style.display = 'none';
      notify({ type: 'mapReady' });
    });

    tileLayer.on('tileerror', function() {
      // Individual tile errors are expected when offline, don't show error screen
    });

    // Hide loading after 3 seconds regardless
    setTimeout(function() {
      document.getElementById('loading').style.display = 'none';
    }, 3000);

    addOffices();

    if (OFFICES.length > 0 && !USER) {
      var group = L.featureGroup(
        OFFICES.map(function(o) { return L.marker([o.lat, o.lng]); })
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }

    map.invalidateSize();

  } catch(e) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-msg').style.display = 'flex';
    notify({ type: 'mapError', message: e.message });
  }
}

window.addEventListener('load', function() {
  if (typeof L !== 'undefined') {
    initMap();
  } else {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-msg').style.display = 'flex';
  }
});

window.addEventListener('error', function(e) {
  if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-msg').style.display = 'flex';
  }
}, true);
</script>
</body>
</html>`;
};

export function LeafletMap({
  offices,
  userLocation,
  markerColors,
  onFallback,
  offlineTilesAvailable = false,
}: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);
  const [inline, setInline] = useState<LeafletInline>({ js: null, css: null });

  // Cache Leaflet's JS/CSS to disk on first online use, then inline them into
  // the WebView HTML so the map keeps working when the device is offline and
  // can't reach the unpkg.com CDN.
  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;
    (async () => {
      const assets = await ensureLeafletAssets();
      if (cancelled) return;
      if (assets.js && assets.css) setInline(assets);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "getTile") {
          const { z, x, y } = data;
          const key = `${z}/${x}/${y}`;

          let dataUri = await getCachedTileBase64(z, x, y);
          if (!dataUri) {
            dataUri = await fetchAndCacheTile(z, x, y);
          }

          if (dataUri && webviewRef.current) {
            webviewRef.current.injectJavaScript(
              `window.receiveTile(${JSON.stringify(key)}, ${JSON.stringify(dataUri)}); void 0;`,
            );
          }
        } else if (data.type === "call" && data.phone) {
          const num = String(data.phone).replace(/[^+\d]/g, "");
          if (num) Linking.openURL(`tel:${num}`).catch(() => {});
        } else if (data.type === "directions") {
          const lat = Number(data.lat);
          const lng = Number(data.lng);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            const label = encodeURIComponent(String(data.name ?? "Destination"));
            const url =
              Platform.OS === "ios"
                ? `maps:0,0?q=${label}@${lat},${lng}`
                : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
            Linking.openURL(url).catch(() => {
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
              ).catch(() => {});
            });
          }
        } else if (data.type === "mapError") {
          onFallback?.();
        }
      } catch {}
    },
    [onFallback],
  );

  const html = getMapHTML(
    offices,
    userLocation ?? null,
    markerColors,
    Platform.OS !== "web",
    offlineTilesAvailable,
    inline,
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe srcDoc={html} style={WEB_IFRAME_STYLE} title="Map" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={inline.js && inline.css ? "leaflet-inline" : "leaflet-cdn"}
        ref={webviewRef}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
        mixedContentMode="always"
        onMessage={handleMessage}
        onError={() => onFallback?.()}
      />
    </View>
  );
}

const WEB_IFRAME_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  border: "none",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  } as any,
  webview: {
    flex: 1,
  },
});
