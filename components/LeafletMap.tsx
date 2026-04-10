import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import type { Office } from "@/data/offices";

interface LeafletMapProps {
  offices: Office[];
  userLocation?: { latitude: number; longitude: number } | null;
  markerColors: Record<string, string>;
  onFallback?: () => void;
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
  markerColors: Record<string, string>
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
    }))
  );
  const userLocJSON = userLocation
    ? JSON.stringify({ lat: userLocation.latitude, lng: userLocation.longitude })
    : "null";
  const colorsJSON = JSON.stringify({ ...MARKER_COLORS, ...markerColors });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#1b2c3e;font-family:sans-serif;height:100vh;overflow:hidden;touch-action:none;}
canvas{display:block;cursor:pointer;}
#popup{display:none;position:fixed;bottom:72px;left:12px;right:12px;background:#fff;border-radius:14px;padding:14px 16px 12px;z-index:100;box-shadow:0 8px 32px rgba(0,0,0,0.35);}
#popup-close{position:absolute;top:10px;right:13px;font-size:20px;cursor:pointer;color:#aaa;line-height:1;}
#popup-name{font-size:14px;font-weight:700;color:#1b2c3e;margin-right:24px;margin-bottom:4px;}
#popup-addr{font-size:12px;color:#666;}
#popup-phone{font-size:12px;color:#2d7a4f;margin-top:3px;}
#legend{position:fixed;top:10px;right:10px;background:rgba(15,29,43,0.92);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:9px 11px;}
.li{display:flex;align-items:center;gap:7px;margin:3px 0;color:rgba(255,255,255,0.75);font-size:11px;}
.ld{width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.4);}
#count{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);border-radius:20px;padding:6px 14px;font-size:12px;font-weight:600;color:#fff;white-space:nowrap;}
#zoom-btns{position:fixed;bottom:52px;right:10px;display:flex;flex-direction:column;gap:4px;}
.zbtn{width:34px;height:34px;background:rgba(15,29,43,0.92);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;line-height:1;}
</style>
</head>
<body>
<canvas id="map"></canvas>
<div id="legend">
  <div class="li"><div class="ld" style="background:#2d3e50"></div>Collector</div>
  <div class="li"><div class="ld" style="background:#b07d2a"></div>Tehsildar</div>
  <div class="li"><div class="ld" style="background:#2d7a4f"></div>Legal Aid</div>
  <div class="li"><div class="ld" style="background:#783232"></div>Police</div>
  <div class="li"><div class="ld" style="background:#ef4444"></div>Women's</div>
</div>
<div id="popup">
  <div id="popup-close" onclick="closePopup()">&#x2715;</div>
  <div id="popup-name"></div>
  <div id="popup-addr"></div>
  <div id="popup-phone"></div>
</div>
<div id="count"></div>
<div id="zoom-btns">
  <div class="zbtn" id="zin">+</div>
  <div class="zbtn" id="zout">−</div>
</div>
<script>
var OFFICES = ${officesJSON};
var USER = ${userLocJSON};
var COLORS = ${colorsJSON};

// India bounding box
var LAT_MIN = 6.5, LAT_MAX = 37.5, LNG_MIN = 67.0, LNG_MAX = 99.0;
var BASE_PADDING = 28;

var canvas = document.getElementById('map');
var ctx = canvas.getContext('2d');
var W, H;
var markers = [];
var activeIdx = -1;

// Pan & zoom state
var scale = 1.0;
var panX = 0, panY = 0;
var MIN_SCALE = 0.7, MAX_SCALE = 5.0;

// Simplified Indian state boundary polygons [lat, lng]
var STATES = [
  { name:'J&K', cx:34.2, cy:76.3, pts:[[37.1,73.8],[36.8,74.5],[35.5,74.2],[34.6,75.7],[34.8,76.7],[35.0,77.8],[34.2,79.4],[33.7,78.4],[32.5,79.7],[31.8,78.7],[30.8,78.2],[31.1,77.4],[31.8,76.5],[31.5,76.0],[31.0,75.4],[31.8,74.5],[32.3,73.8],[33.0,73.2],[34.5,73.0],[37.1,73.8]] },
  { name:'Himachal\nPradesh', cx:31.8, cy:77.5, pts:[[32.5,79.7],[31.8,78.7],[30.8,78.2],[31.1,77.4],[31.8,76.5],[31.5,76.0],[31.0,75.4],[30.2,74.3],[29.8,75.2],[30.5,76.5],[29.8,78.5],[30.5,78.8],[31.0,79.5],[32.5,79.7]] },
  { name:'Punjab', cx:31.0, cy:74.8, pts:[[32.3,73.8],[31.8,74.5],[31.5,76.0],[31.0,75.4],[30.2,74.3],[29.1,73.3],[29.8,71.5],[30.5,72.0],[31.5,73.0],[32.3,73.8]] },
  { name:'Haryana', cx:29.1, cy:76.1, pts:[[31.0,75.4],[31.5,76.0],[31.8,77.0],[30.8,78.2],[29.8,78.5],[28.5,77.5],[28.0,76.8],[28.0,76.0],[28.5,75.5],[29.1,73.3],[30.2,74.3],[31.0,75.4]] },
  { name:'Delhi', cx:28.65, cy:77.1, pts:[[28.9,76.8],[29.2,77.35],[28.8,77.6],[28.4,77.5],[28.1,77.0],[28.9,76.8]] },
  { name:'Uttarakhand', cx:30.0, cy:79.5, pts:[[31.8,77.0],[30.8,78.2],[29.8,78.5],[30.5,78.8],[31.0,79.5],[32.5,79.7],[34.2,79.4],[33.7,78.4],[33.0,77.8],[32.4,77.1],[31.8,77.0]] },
  { name:'UP', cx:27.0, cy:80.5, pts:[[31.8,77.0],[30.8,77.5],[29.8,78.5],[28.5,77.5],[28.0,76.8],[27.0,77.5],[26.5,77.0],[26.0,81.0],[25.5,83.5],[25.0,84.5],[25.2,85.5],[26.0,86.0],[26.5,84.0],[27.5,84.0],[28.0,83.0],[28.5,83.5],[29.4,81.0],[29.5,79.5],[30.8,78.2],[31.8,77.0]] },
  { name:'Rajasthan', cx:26.5, cy:73.5, pts:[[30.2,69.5],[30.0,70.0],[29.8,71.0],[30.0,72.5],[29.1,73.3],[28.5,72.2],[28.0,72.5],[27.2,70.3],[26.3,68.9],[25.6,68.5],[24.4,68.8],[23.5,68.1],[23.0,70.0],[22.5,72.0],[23.0,74.5],[24.0,76.5],[25.5,77.5],[26.5,77.0],[27.0,77.5],[28.0,76.8],[28.5,75.5],[29.1,73.3],[30.2,74.3],[30.2,69.5]] },
  { name:'Gujarat', cx:22.5, cy:71.0, pts:[[24.5,68.1],[24.0,68.8],[22.5,69.5],[22.4,70.9],[21.9,72.1],[20.6,72.9],[19.2,73.1],[18.9,72.8],[20.9,72.8],[21.5,72.5],[22.8,72.1],[22.4,69.7],[23.1,68.4],[24.5,68.1]] },
  { name:'MP', cx:23.5, cy:78.5, pts:[[26.5,77.0],[26.0,81.0],[25.5,83.5],[24.5,82.5],[24.0,81.0],[22.5,81.5],[21.5,80.5],[20.5,80.5],[20.0,79.0],[21.0,78.0],[21.5,76.5],[22.0,74.5],[23.0,74.5],[24.5,77.5],[25.5,77.5],[26.5,77.0]] },
  { name:'Chhattisgarh', cx:21.0, cy:81.8, pts:[[25.5,83.5],[25.0,84.5],[24.5,82.5],[24.0,81.0],[22.5,81.5],[21.5,80.5],[20.5,80.5],[19.5,80.5],[19.0,82.5],[19.5,84.0],[20.3,84.5],[20.5,84.5],[21.0,84.0],[22.0,83.5],[22.5,83.0],[22.5,82.5],[23.5,82.5],[25.5,83.5]] },
  { name:'Bihar', cx:25.5, cy:85.5, pts:[[27.5,84.0],[26.5,84.0],[26.0,86.0],[25.2,85.5],[25.0,84.5],[24.5,82.5],[25.5,83.5],[26.0,87.5],[27.0,87.0],[27.5,84.0]] },
  { name:'Jharkhand', cx:23.5, cy:85.5, pts:[[25.0,84.5],[24.5,82.5],[23.5,82.5],[22.5,83.0],[22.0,83.5],[21.5,85.5],[22.0,87.0],[22.5,87.5],[23.5,87.5],[24.5,87.5],[25.2,85.5],[25.0,84.5]] },
  { name:'West\nBengal', cx:23.5, cy:87.5, pts:[[27.5,88.8],[27.0,87.0],[26.0,87.5],[25.5,88.0],[24.5,87.5],[23.5,87.5],[22.5,87.5],[22.0,87.0],[21.5,87.5],[22.3,88.3],[23.6,88.1],[24.3,88.4],[24.9,88.0],[25.4,88.9],[26.6,89.2],[27.5,88.8]] },
  { name:'Sikkim', cx:27.5, cy:88.5, pts:[[28.0,88.4],[28.5,88.1],[29.4,88.8],[28.5,88.8],[27.5,88.8],[28.0,88.4]] },
  { name:'Assam', cx:26.2, cy:92.5, pts:[[27.5,88.8],[26.6,89.2],[25.4,88.9],[24.9,89.8],[24.1,91.4],[23.3,91.8],[23.1,92.6],[24.2,93.0],[25.1,94.7],[27.3,96.2],[27.1,91.6],[28.5,88.1],[28.0,88.4],[27.5,88.8]] },
  { name:'Meghalaya', cx:25.5, cy:91.4, pts:[[26.6,89.2],[25.4,88.9],[24.9,89.8],[24.1,91.4],[23.3,91.8],[24.5,92.0],[25.5,91.8],[26.5,91.0],[26.6,89.2]] },
  { name:'Arunachal', cx:28.0, cy:94.0, pts:[[29.4,97.4],[28.5,96.7],[27.7,95.1],[27.0,92.2],[27.1,91.6],[27.3,96.2],[29.4,97.4]] },
  { name:'Nagaland', cx:26.2, cy:94.5, pts:[[27.3,96.2],[25.1,94.7],[24.2,93.0],[25.5,93.5],[26.5,94.5],[27.3,96.2]] },
  { name:'Manipur', cx:24.7, cy:93.8, pts:[[25.5,93.5],[24.2,93.0],[23.1,92.6],[23.3,91.8],[24.2,93.5],[24.7,94.5],[25.5,93.5]] },
  { name:'Mizoram', cx:23.3, cy:92.7, pts:[[23.3,91.8],[23.1,92.6],[22.5,92.5],[22.0,92.0],[22.0,93.0],[23.0,93.5],[24.2,93.0],[23.3,91.8]] },
  { name:'Tripura', cx:23.8, cy:91.5, pts:[[24.5,92.0],[23.5,91.5],[23.0,91.0],[22.5,91.5],[23.0,92.5],[23.5,92.5],[24.5,92.0]] },
  { name:'Odisha', cx:20.5, cy:84.5, pts:[[22.5,87.5],[22.0,87.0],[21.5,87.5],[20.5,86.5],[19.5,85.0],[19.0,84.0],[19.5,80.5],[20.5,80.5],[21.5,80.5],[22.5,81.5],[22.0,83.5],[22.5,83.0],[23.5,82.5],[22.5,87.5]] },
  { name:'Maharashtra', cx:19.5, cy:76.0, pts:[[22.0,74.5],[21.5,76.5],[21.0,78.0],[20.0,79.0],[20.5,80.5],[19.5,80.5],[19.0,80.5],[18.5,83.5],[17.9,83.2],[17.8,82.2],[17.2,82.2],[16.5,81.1],[15.9,80.5],[15.5,80.2],[15.7,79.0],[16.0,78.5],[16.8,77.5],[17.0,76.5],[18.0,75.5],[18.9,72.8],[19.2,73.1],[20.6,72.9],[21.5,72.5],[22.5,72.5],[22.0,74.5]] },
  { name:'Goa', cx:15.35, cy:74.0, pts:[[15.8,73.9],[14.9,74.1],[15.0,74.4],[15.8,74.1],[15.8,73.9]] },
  { name:'Karnataka', cx:14.5, cy:76.5, pts:[[18.0,75.5],[17.0,76.5],[16.8,77.5],[16.0,78.5],[15.7,79.0],[15.5,80.2],[14.5,79.9],[13.6,80.3],[12.6,80.2],[11.8,79.9],[11.5,77.5],[12.3,74.9],[14.0,74.4],[15.7,73.9],[16.7,73.5],[18.0,75.5]] },
  { name:'Telangana', cx:17.8, cy:79.5, pts:[[19.9,77.5],[19.0,78.5],[18.5,79.5],[18.5,83.5],[17.9,83.2],[17.8,82.2],[17.2,82.2],[16.5,81.1],[16.5,80.0],[17.5,79.0],[18.0,78.5],[19.9,77.5]] },
  { name:'Andhra\nPradesh', cx:15.5, cy:80.0, pts:[[19.9,77.5],[18.0,78.5],[17.5,79.0],[16.5,80.0],[16.5,81.1],[15.9,80.5],[16.7,82.3],[18.5,83.5],[18.4,83.5],[17.9,83.2],[17.2,82.2],[16.5,81.1],[15.9,80.5],[15.5,80.2],[15.0,80.4],[14.5,79.9],[13.6,80.3],[12.6,80.2],[13.1,80.3],[14.1,80.1],[15.0,80.4],[16.7,82.3],[18.2,83.8],[18.5,84.4],[19.3,84.7],[19.9,77.5]] },
  { name:'Tamil Nadu', cx:10.5, cy:78.5, pts:[[13.5,80.2],[12.6,80.2],[11.8,79.9],[10.5,79.7],[9.6,78.2],[8.8,77.5],[8.5,77.1],[9.1,76.6],[10.5,76.2],[11.5,75.8],[12.3,74.9],[11.8,79.9],[13.6,80.3],[13.5,80.2]] },
  { name:'Kerala', cx:10.5, cy:76.5, pts:[[12.3,74.9],[11.5,75.8],[10.5,76.2],[9.1,76.6],[8.5,77.1],[8.4,76.9],[8.1,77.0],[8.4,78.0],[9.6,78.2],[10.5,76.2],[11.5,77.5],[12.3,74.9]] },
];

// State label centroids
var STATE_LABELS = STATES.map(function(s) { return { name: s.name, cx: s.cx, cy: s.cy }; });

function worldToScreen(lat, lng) {
  var pw = W;
  var ph = H;
  var bw = LNG_MAX - LNG_MIN;
  var bh = LAT_MAX - LAT_MIN;
  var aspect = pw / ph;
  var bAspect = bw / bh;
  var drawW, drawH, offX, offY;
  if (bAspect > aspect) {
    drawW = pw - BASE_PADDING * 2;
    drawH = drawW / bAspect;
    offX = BASE_PADDING;
    offY = (ph - drawH) / 2;
  } else {
    drawH = ph - BASE_PADDING * 2;
    drawW = drawH * bAspect;
    offX = (pw - drawW) / 2;
    offY = BASE_PADDING;
  }
  var sx = offX + (lng - LNG_MIN) / bw * drawW;
  var sy = offY + (1 - (lat - LAT_MIN) / bh) * drawH;
  // Apply scale & pan (scale around center)
  var cx = W / 2, cy = H / 2;
  return [cx + (sx - cx) * scale + panX, cy + (sy - cy) * scale + panY];
}

function drawStates() {
  STATES.forEach(function(state) {
    if (!state.pts || state.pts.length < 2) return;
    ctx.beginPath();
    var first = worldToScreen(state.pts[0][0], state.pts[0][1]);
    ctx.moveTo(first[0], first[1]);
    for (var i = 1; i < state.pts.length; i++) {
      var p = worldToScreen(state.pts[i][0], state.pts[i][1]);
      ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(45,110,160,0.13)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,200,220,0.28)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });
}

function drawStateLabels() {
  if (scale < 1.4) return;
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  STATES.forEach(function(state) {
    var p = worldToScreen(state.cx, state.cy);
    var lines = state.name.split('\n');
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    lines.forEach(function(line, i) {
      var offset = (i - (lines.length - 1) / 2) * 11;
      ctx.fillText(line, p[0], p[1] + offset);
    });
  });
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (var lat = 10; lat <= 35; lat += 5) {
    var p1 = worldToScreen(lat, LNG_MIN);
    var p2 = worldToScreen(lat, LNG_MAX);
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
  }
  for (var lng = 70; lng <= 98; lng += 5) {
    var q1 = worldToScreen(LAT_MIN, lng);
    var q2 = worldToScreen(LAT_MAX, lng);
    ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
  }
}

function drawIndiaOutline() {
  var pts = [
    [37.1,73.8],[36.8,74.5],[34.7,78.5],[34.2,79.4],[32.5,79.7],
    [31.8,78.7],[30.8,78.2],[31.1,77.4],[30.5,76.5],[29.8,75.2],
    [29.3,73.5],[27.8,72.1],[27.2,70.3],[24.5,68.1],[23.1,68.4],
    [22.4,69.7],[22.8,72.1],[20.9,72.8],[18.9,72.8],[16.8,73.2],
    [14.8,74.1],[12.1,74.8],[8.4,76.9],[8.1,77.5],[8.4,78.2],
    [9.2,79.1],[10.9,79.8],[11.8,79.8],[13.1,80.3],[14.1,80.1],
    [15.0,80.4],[16.7,82.3],[18.2,83.8],[18.5,84.4],[19.3,84.7],
    [20.3,86.8],[21.2,87.5],[22.3,88.3],[23.6,88.1],[24.3,88.4],
    [24.9,88.0],[25.4,88.9],[26.6,89.2],[27.5,88.8],[28.0,88.4],
    [28.5,88.1],[29.4,88.8],[27.1,91.6],[27.0,92.2],[27.7,95.1],
    [28.5,96.7],[29.4,97.4],[27.3,96.2],[25.1,94.7],[24.2,93.0],
    [23.1,92.6],[23.3,91.8],[24.1,91.4],[24.9,89.8],[24.4,88.2],
    [21.9,86.2],[20.7,85.9],[19.8,85.1],[18.4,83.5],[17.8,83.2],
    [17.2,82.2],[16.5,81.1],[15.9,80.5],[15.5,80.2],[14.5,79.9],
    [13.6,80.3],[12.6,80.2],[11.8,79.9],[10.5,79.7],[9.6,78.2],
    [8.8,77.5],[8.5,77.1],[9.1,76.6],[10.5,76.2],[11.5,75.8],
    [12.3,74.9],[14.0,74.4],[15.7,73.9],[17.9,73.2],[19.2,73.1],
    [20.6,72.9],[21.5,72.6],[21.9,72.1],[22.4,70.9],[22.5,69.7],
    [22.0,68.9],[23.5,68.1],[24.4,68.8],[25.6,68.5],[26.3,68.9],
    [27.2,70.0],[27.7,70.9],[28.3,72.1],[29.1,73.3],[30.2,74.3],
    [31.0,75.4],[31.8,76.5],[32.4,77.1],[33.0,77.8],[33.7,78.4],
    [34.2,79.4],[35.0,77.8],[34.8,76.7],[34.6,75.7],[35.5,74.2],
    [36.2,73.9],[37.1,73.8]
  ];
  ctx.beginPath();
  var first = worldToScreen(pts[0][0], pts[0][1]);
  ctx.moveTo(first[0], first[1]);
  for (var i = 1; i < pts.length; i++) {
    var p = worldToScreen(pts[i][0], pts[i][1]);
    ctx.lineTo(p[0], p[1]);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(30,55,80,0.6)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212,175,55,0.55)';
  ctx.lineWidth = 1.8 / scale;
  ctx.stroke();
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f1d2b';
  ctx.fillRect(0, 0, W, H);
  drawGrid();
  drawIndiaOutline();
  drawStates();
  drawStateLabels();

  markers = [];
  OFFICES.forEach(function(o, i) {
    var pos = worldToScreen(o.lat, o.lng);
    var x = pos[0], y = pos[1];
    var r = Math.max(6, 9 * Math.min(scale, 1.5) / 1.5);
    markers.push({ x: x, y: y, r: r, idx: i });
    var color = COLORS[o.type] || '#2d3e50';
    var isActive = i === activeIdx;
    if (isActive) {
      ctx.beginPath();
      ctx.arc(x, y, r + 5, 0, Math.PI * 2);
      ctx.fillStyle = color + '44';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = isActive ? '#d4af37' : '#fff';
    ctx.lineWidth = isActive ? 2.5 : 1.8;
    ctx.stroke();
  });

  if (USER) {
    var up = worldToScreen(USER.lat, USER.lng);
    ctx.beginPath(); ctx.arc(up[0], up[1], 13, 0, Math.PI * 2); ctx.fillStyle = 'rgba(66,133,244,0.2)'; ctx.fill();
    ctx.beginPath(); ctx.arc(up[0], up[1], 7, 0, Math.PI * 2); ctx.fillStyle = '#4285F4'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  document.getElementById('count').textContent = OFFICES.length + ' office' + (OFFICES.length !== 1 ? 's' : '') + ' in your region';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  activeIdx = -1;
  draw();
}

function showPopup(o) {
  var p = document.getElementById('popup');
  document.getElementById('popup-name').textContent = o.name;
  document.getElementById('popup-addr').textContent = o.address;
  var ph = document.getElementById('popup-phone');
  ph.textContent = o.phone ? '📞 ' + o.phone : '';
  p.style.display = 'block';
}

function getCanvasPoint(e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var clientX = e.touches ? e.touches[0].clientX : e.clientX;
  var clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

var dragStart = null, panStart = null, lastTouchDist = null, tapStartTime = 0, tapStartPos = null;

function applyZoom(delta, cx, cy) {
  var prev = scale;
  scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * delta));
  var ratio = scale / prev;
  panX = cx + (panX - cx) * ratio;
  panY = cy + (panY - cy) * ratio;
  draw();
}

canvas.addEventListener('mousedown', function(e) {
  dragStart = { x: e.clientX, y: e.clientY };
  panStart = { x: panX, y: panY };
  tapStartTime = Date.now();
  tapStartPos = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('mousemove', function(e) {
  if (!dragStart) return;
  panX = panStart.x + (e.clientX - dragStart.x);
  panY = panStart.y + (e.clientY - dragStart.y);
  draw();
});
canvas.addEventListener('mouseup', function(e) {
  var moved = dragStart && (Math.abs(e.clientX - tapStartPos.x) > 5 || Math.abs(e.clientY - tapStartPos.y) > 5);
  dragStart = null;
  if (!moved) { handleTap(e); }
});
canvas.addEventListener('wheel', function(e) {
  e.preventDefault();
  applyZoom(e.deltaY < 0 ? 1.12 : 0.88, e.clientX, e.clientY);
}, { passive: false });

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  } else {
    dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    panStart = { x: panX, y: panY };
    tapStartTime = Date.now();
    tapStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    var dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    if (lastTouchDist) {
      var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      var cy2 = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      applyZoom(dist / lastTouchDist, cx, cy2);
    }
    lastTouchDist = dist;
  } else if (dragStart && e.touches.length === 1) {
    panX = panStart.x + (e.touches[0].clientX - dragStart.x);
    panY = panStart.y + (e.touches[0].clientY - dragStart.y);
    draw();
  }
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
  lastTouchDist = null;
  if (e.changedTouches.length === 1 && tapStartPos) {
    var dx = e.changedTouches[0].clientX - tapStartPos.x;
    var dy = e.changedTouches[0].clientY - tapStartPos.y;
    var dt = Date.now() - tapStartTime;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && dt < 300) {
      handleTap({ clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY });
    }
  }
  dragStart = null;
}, { passive: false });

function handleTap(e) {
  var pt = getCanvasPoint(e);
  var hit = -1;
  for (var i = markers.length - 1; i >= 0; i--) {
    var m = markers[i];
    var dx = pt.x - m.x, dy = pt.y - m.y;
    if (Math.sqrt(dx*dx + dy*dy) <= m.r + 8) { hit = m.idx; break; }
  }
  if (hit >= 0) {
    if (activeIdx === hit) { closePopup(); } else { activeIdx = hit; draw(); showPopup(OFFICES[hit]); }
  } else { closePopup(); }
}

document.getElementById('zin').addEventListener('click', function() { applyZoom(1.25, W/2, H/2); });
document.getElementById('zout').addEventListener('click', function() { applyZoom(0.80, W/2, H/2); });

window.addEventListener('resize', resize);
resize();
</script>
</body>
</html>`;
};

export function LeafletMap({ offices, userLocation, markerColors, onFallback }: LeafletMapProps) {
  const html = getMapHTML(offices, userLocation ?? null, markerColors);

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          srcDoc={html}
          style={{ width: "100%", height: "100%", border: "none" } as React.CSSProperties}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
