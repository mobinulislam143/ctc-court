import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, Lock, Unlock, ZoomIn, ZoomOut, Sun, Moon, Ruler } from 'lucide-react';

const CTC_LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png';

// ── Tile canvas (procedural, grayscale) ───────────────────────────────────────

// ── Tile canvas (procedural, grayscale) ───────────────────────────────────────
function makeTileCanvas(tileType, size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const T = size, g = Math.max(4, Math.round(T * 0.055));
  const cx = T / 2, cy = T / 2, i1 = g, i2 = T - g;

  // ── game_outdoor / pickleball_performance: Star-lattice tile ──────────────────
  if (tileType === 'game_outdoor' || tileType === 'pickleball_performance') {
    const CELLS = 8;                          // 8×8 cells per 1ft tile
    const PADDING = Math.round(T * 0.006);    // thin gap to the tile edge
    const inner = T - PADDING * 2;
    const cell = inner / CELLS;
    const RIB = Math.max(2, cell * 0.14);   // rib thickness

    // Recessed triangular voids (darker)
    ctx.fillStyle = '#6f6f6f';
    ctx.fillRect(0, 0, T, T);

    // Raised ribs (lighter)
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    ctx.strokeStyle = '#d6d6d6';
    ctx.lineWidth = RIB;
    for (let row = 0; row < CELLS; row++) {
      for (let col = 0; col < CELLS; col++) {
        const x0 = PADDING + col * cell, y0 = PADDING + row * cell;
        const x1 = x0 + cell, y1 = y0 + cell;
        const midX = x0 + cell / 2, midY = y0 + cell / 2;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();       // '\' diagonal
        ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x0, y1); ctx.stroke();       // '/' diagonal
        ctx.beginPath(); ctx.moveTo(midX, y0); ctx.lineTo(midX, y1); ctx.stroke();   // vertical
        ctx.beginPath(); ctx.moveTo(x0, midY); ctx.lineTo(x1, midY); ctx.stroke();   // horizontal
      }
    }
    // Cell grid lines
    for (let i = 0; i <= CELLS; i++) {
      const p = PADDING + i * cell;
      ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, PADDING + inner); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(PADDING + inner, p); ctx.stroke();
    }
    // Tile seam around the 1ft border
    ctx.strokeStyle = '#5f5f5f';
    ctx.lineWidth = Math.max(1, T * 0.006);
    ctx.strokeRect(0, 0, T, T);

    return c;
  }

  // ── boost: dense open-mesh — concentric squares + radial star-bursts ─────────
  // Recolours with the court colour (dark recessed voids + light raised ribs,
  // multiplied by the material colour, exactly like game_outdoor).
  if (tileType === 'boost') {
    const CELLS = 4;
    const PADDING = Math.round(T * 0.006);
    const inner = T - PADDING * 2;
    const cell = inner / CELLS;

    ctx.fillStyle = '#6f6f6f'; ctx.fillRect(0, 0, T, T);   // recessed voids
    ctx.strokeStyle = '#d6d6d6';                            // raised ribs
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.lineWidth = Math.max(1, cell * 0.018);

    const seg = (x0, y0, x1, y1) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); };
    const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;

    // radial burst clipped to the cell rect; used at centers AND corners
    const burst = (cx, cy, R, n, bx0, by0, bx1, by1, off) => {
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + off;
        seg(cx, cy, clamp(cx + Math.cos(a) * R, bx0, bx1), clamp(cy + Math.sin(a) * R, by0, by1));
      }
    };

    for (let row = 0; row < CELLS; row++) {
      for (let col = 0; col < CELLS; col++) {
        const x0 = PADDING + col * cell, y0 = PADDING + row * cell;
        const x1 = x0 + cell, y1 = y0 + cell;
        const mx = x0 + cell / 2, my = y0 + cell / 2;

        // frame + X diagonals + center cross
        ctx.strokeRect(x0, y0, cell, cell);
        seg(x0, y0, x1, y1); seg(x1, y0, x0, y1);
        seg(mx, y0, mx, y1); seg(x0, my, x1, my);

        // center burst (dense fan)
        burst(mx, my, cell * 0.5, 32, x0, y0, x1, y1, Math.PI / 32);

        // corner quarter-bursts — 4 cells share a corner → merge into full sunbursts
        // this is what produces the 2× super-period / interlocked look
        burst(x0, y0, cell * 0.5, 32, x0, y0, x1, y1, 0);
        burst(x1, y0, cell * 0.5, 32, x0, y0, x1, y1, 0);
        burst(x0, y1, cell * 0.5, 32, x0, y0, x1, y1, 0);
        burst(x1, y1, cell * 0.5, 32, x0, y0, x1, y1, 0);

        // nested axis-aligned squares
        [0.90, 0.72, 0.54, 0.36, 0.18].forEach(f => {
          const s = cell * f / 2; ctx.strokeRect(mx - s, my - s, s * 2, s * 2);
        });

        // nested rotated diamonds
        [0.86, 0.5, 0.28].forEach(f => {
          const d = cell * f / 2;
          ctx.beginPath();
          ctx.moveTo(mx, my - d); ctx.lineTo(mx + d, my); ctx.lineTo(mx, my + d); ctx.lineTo(mx - d, my);
          ctx.closePath(); ctx.stroke();
        });
      }
    }

    // tile seam
    ctx.strokeStyle = '#565656'; ctx.lineWidth = Math.max(1, T * 0.008); ctx.strokeRect(0, 0, T, T);
    return c;
  }

  // ── Base for all other tile types ────────────────────────────────────────────
  ctx.fillStyle = '#484848'; ctx.fillRect(0, 0, T, T);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(i1, i1, i2 - i1, i2 - i1);
  ctx.strokeStyle = '#484848';
  ctx.lineWidth = Math.max(2, g * 0.9); ctx.lineCap = 'round';

  if (false) {
  }
  else if (tileType === 'active') {
    // Active: near-continuous "\" diagonal dashed grip. Dashes butt end-to-end
    // along each diagonal line (measured ~0.87 of pitch, ~4px gap). White base
    // so dashes multiply against the chosen court colour.
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, T, T);

    // Rhombic lattice. Basis chosen so i*A and j*B land exactly on (T,0)/(0,T)
    // => the T×T bitmap tiles seamlessly with zero seam bookkeeping.
    const I = 4;                    // dashes per T along the "\" direction  (pitch = T·√2/(2·4) ≈ 0.177T)
    const J = 6;                    // diagonal lines per T perpendicular    (spacing ≈ 0.118T)
    const Ax = T / (2 * I), Ay = T / (2 * I);   // along-diagonal step  (1,1)
    const Bx = T / (2 * J), By = -T / (2 * J);  // perpendicular step   (1,-1)

    const alongPitch = Math.hypot(Ax, Ay);
    const dLen = 0.874 * alongPitch;            // dash length (87% of pitch)
    const ux = Math.SQRT1_2, uy = Math.SQRT1_2; // unit "\" direction
    const hx = ux * dLen / 2, hy = uy * dLen / 2;

    ctx.strokeStyle = '#8a8a8a';   // multiplies court colour to ~0.55× in dash areas
    ctx.lineCap = 'butt';
    ctx.lineWidth = Math.max(2, T * 0.030);

    // Iterate lattice points; margin of ±1 tile covers all dashes crossing edges.
    const aMax = 2 * I + J, bMax = 2 * J + I;
    ctx.beginPath();
    for (let a = -J; a <= aMax; a++) {
      for (let b = -I; b <= bMax; b++) {
        const cx = a * Ax + b * Bx;
        const cy = a * Ay + b * By;
        if (cx < -dLen || cx > T + dLen || cy < -dLen || cy > T + dLen) continue;
        ctx.moveTo(cx - hx, cy - hy);
        ctx.lineTo(cx + hx, cy + hy);
      }
    }
    ctx.stroke();

    // thin tile seam
    ctx.strokeStyle = '#565656';
    ctx.lineWidth = Math.max(1, T * 0.006);
    ctx.strokeRect(0, 0, T, T);
  }
  else if (tileType === 'complete') {
    // ── Compete Indoor: seamless 5×5 perforation-burst pattern ──────────────
    // White base so the tile multiplies with the chosen court colour.
    // Each node carries an 8-dash burst: top/bottom = vertical dash pairs,
    // left/right = horizontal dash pairs, around an open centre.
    // Nodes run 0..CELLS INCLUDING edges, so edge half-bursts and corner
    // quarter-bursts complete across tile seams — no clipped squares.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, T, T);

    ctx.strokeStyle = '#8a8a8a';        // ~0.53 of court colour after multiply
    ctx.lineCap = 'round';

    const CELLS = 5;
    const PAD = 4;                    // 2px plain border
    const span = T - 2 * PAD;          // drawable area
    const cell = span / CELLS;
    const s = cell * 0.069;            // small (cross-axis) offset
    const b = cell * 0.199;            // big (along-axis) offset
    const hl = cell * 0.024;            // dash half-length
    ctx.lineWidth = Math.max(2, cell * 0.030);

    const vDash = (x, y) => {           // vertical dash centred at (x,y)
      ctx.beginPath();
      ctx.moveTo(x, y - hl);
      ctx.lineTo(x, y + hl);
      ctx.stroke();
    };
    const hDash = (x, y) => {           // horizontal dash centred at (x,y)
      ctx.beginPath();
      ctx.moveTo(x - hl, y);
      ctx.lineTo(x + hl, y);
      ctx.stroke();
    };

    for (let row = 0; row <= CELLS; row++) {
      for (let col = 0; col <= CELLS; col++) {
        const bx = col * cell, by = row * cell;
        // top & bottom pairs → vertical dashes
        vDash(bx - s, by - b); vDash(bx + s, by - b);
        vDash(bx - s, by + b); vDash(bx + s, by + b);
        // left & right pairs → horizontal dashes
        hDash(bx - b, by - s); hDash(bx - b, by + s);
        hDash(bx + b, by - s); hDash(bx + b, by + s);
      }
    }

    // faint tile seam
    ctx.strokeStyle = '#99a7a6';
    ctx.lineWidth = Math.max(1, T * 0.004);
    ctx.strokeRect(0, 0, T, T);
  }
  else if (tileType === 'wood_grain') {
    for (let k = 1; k < 4; k++) { const y = i1 + (i2 - i1) * k / 4; ctx.beginPath(); ctx.moveTo(i1, y); ctx.lineTo(i2, y); ctx.stroke(); }
    ctx.setLineDash([T * 0.2, T * 0.8]); ctx.beginPath(); ctx.moveTo(cx + T * 0.18, i1); ctx.lineTo(cx + T * 0.18, i2); ctx.stroke(); ctx.setLineDash([]);
  }

  return c;
}


// Wood-Grain uses a real photographic tile image instead of a drawn pattern.
// It carries its own colour, so the material tinting it must be white (see below).
const WOOD_IMAGE_SRC = '/wood.png';
let _woodLoader = null;

function makeTileTexture(tileType, cW, cH, renderer) {
  const repeatX = Math.max(0.1, cW / 1.0);
  const repeatY = Math.max(0.1, cH / 1.0);
  const aniso = renderer ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16) : 8;

  if (tileType === 'wood_grain') {
    _woodLoader = _woodLoader || new THREE.TextureLoader();
    const tex = _woodLoader.load(WOOD_IMAGE_SRC);   // one tile image per 1ft
    tex.colorSpace = THREE.SRGBColorSpace;           // show true maple colour
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = aniso;
    return tex;
  }

  const canvas = makeTileCanvas(tileType, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = aniso;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// its real colour), otherwise the caller's chosen court colour.
const tintFor = (tileType, hex) => (tileType === 'wood_grain' ? '#ffffff' : hex);

// Full-length basketball court (also matches multi-sport full types).
const isFullBasketball = ct => ct === 'basketball_full' || (ct || '').includes('full_basketball');

// Key (paint) dimensions taken from the VersaCourt reference:
// width 3444.9 mm ≈ 11'4", baseline → free-throw line 5710.6 mm ≈ 18'9"
const KEY_W_FT = 3444.9 / 304.8;
const KEY_H_FT = 5710.6 / 304.8;

// ── Lines canvas ──────────────────────────────────────────────────────────────
function drawLinesCanvas(width, length, colors, linesConfig, courtType) {
  const T = 32;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * T);
  canvas.height = Math.round(length * T);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = linesConfig?.color || colors?.line || '#ffffff';
  ctx.lineWidth = Math.max(2, T * 0.09);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  if (courtType && courtType.includes('basketball')) {
    // VersaCourt-style line work: key + solid free-throw dome + basket-centered
    // 3-point arc with straight corner lines. No painted boundary, basket circle,
    // restricted arc or backboard mark — the tile edge / 3D hoop provide those.
    const kW = Math.min(KEY_W_FT, width - 2) * T, kH = Math.min(KEY_H_FT, length - 2) * T;
    const kx = (W - kW) / 2;
    const ftR = kW / 2;                 // dome spans the key width exactly
    const baskFromBase = 5.25 * T;      // basket center distance from baseline

    // 3-point geometry — the arc is tangent to the free-throw dome at the apex,
    // so the two lines MERGE into one at the top and split apart off-center
    // (reference look). Straight vertical corner lines run from the baseline up
    // into the arc, keeping the bottom squared-off.
    const domeApex = kH + ftR;                                  // px from baseline
    const tpR = Math.min(domeApex - baskFromBase, W / 2 - 0.5 * T);
    const cornerD = Math.min(19 * T, tpR - 0.35 * T);
    const joinFromBase = baskFromBase + Math.sqrt(Math.max(0, tpR * tpR - cornerD * cornerD));

    // Lane markers from baseline: wide block at 7', thin ticks above (reference spacing)
    const laneMarks = [7, 11, 14.5, 18];
    const tickLen = 0.55 * T;

    // Draw one basketball end. top=false → near baseline (y = H), top=true → far baseline (y = 0)
    const drawEnd = (top) => {
      const y = d => (top ? d : H - d);   // px-from-this-baseline → canvas y
      const baskY = y(baskFromBase);
      const ftY = y(kH);                  // free-throw line

      // Key / paint outline
      ctx.strokeRect(kx, top ? 0 : H - kH, kW, kH);

      // Lane markers (outside the lane, both sides)
      laneMarks.forEach((d, i) => {
        if (d * T >= kH) return;
        const ty = y(d * T);
        ctx.save();
        ctx.lineWidth = i === 0 ? Math.max(3, T * 0.75) : Math.max(1.5, T * 0.09);
        ctx.beginPath(); ctx.moveTo(kx, ty); ctx.lineTo(kx - tickLen, ty); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(kx + kW, ty); ctx.lineTo(kx + kW + tickLen, ty); ctx.stroke();
        ctx.restore();
      });

      // Free-throw dome — solid half toward the court only
      ctx.beginPath();
      ctx.arc(W / 2, ftY, ftR, top ? 0 : Math.PI, top ? Math.PI : 0);
      ctx.stroke();

      // 3-point line: straight vertical corner segments from the baseline to the arc
      const yJoin = y(joinFromBase);
      ctx.beginPath(); ctx.moveTo(W / 2 - cornerD, y(0)); ctx.lineTo(W / 2 - cornerD, yJoin); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 + cornerD, y(0)); ctx.lineTo(W / 2 + cornerD, yJoin); ctx.stroke();
      // Arc centered on the basket, between the two junctions (through the apex)
      const dy = yJoin - baskY;
      const aL = Math.atan2(dy, -cornerD), aR = Math.atan2(dy, cornerD);
      ctx.beginPath();
      ctx.arc(W / 2, baskY, tpR, top ? aR : aL, top ? aL : aR);
      ctx.stroke();
    };

    drawEnd(false);

    if (isFullBasketball(courtType)) {
      drawEnd(true);
      // Center line (full width) + center circles
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(W / 2, H / 2, 6 * T, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(W / 2, H / 2, 2 * T, 0, Math.PI * 2); ctx.stroke();
    }
  }

  if (courtType && courtType.includes('pickleball')) {
    // Regulation playing area: 20' wide × 44' long, centered in the surface
    const playW = Math.min(20, width) * T;
    const playH = Math.min(44, length) * T;
    const px = (W - playW) / 2, py = (H - playH) / 2;
    const nY = py + playH / 2;            // net / center line
    // Outer playing boundary
    ctx.strokeRect(px, py, playW, playH);
    // Net center line (full width)
    ctx.beginPath(); ctx.moveTo(px, nY); ctx.lineTo(px + playW, nY); ctx.stroke();
    // Non-volley (kitchen) lines: 7' each side of net
    ctx.beginPath(); ctx.moveTo(px, nY - 7 * T); ctx.lineTo(px + playW, nY - 7 * T); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, nY + 7 * T); ctx.lineTo(px + playW, nY + 7 * T); ctx.stroke();
    // Center service line: from kitchen line to baseline on each half (not through kitchen)
    ctx.beginPath(); ctx.moveTo(W / 2, py); ctx.lineTo(W / 2, nY - 7 * T); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2, nY + 7 * T); ctx.lineTo(W / 2, py + playH); ctx.stroke();
  }
  return canvas;
}

// ── Net canvas (fine grid for net-protect mesh) ───────────────────────────────
function makeNetCanvas(cellsX = 30, cellsY = 20) {
  const W = 512, H = 340;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(100,100,100,0.95)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= cellsX; i++) { const x = i / cellsX * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let i = 0; i <= cellsY; i++) { const y = i / cellsY * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  return c;
}

// ── Lattice cell canvas (single asterisk/star cell, repeated over logos) ──────
let _latticeCanvas = null;
function getLatticeCellCanvas() {
  if (_latticeCanvas) return _latticeCanvas;
  const px = 96;
  const c = document.createElement('canvas'); c.width = c.height = px;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, px, px);
  // Step 1: fill the whole cell with the DARK recess tint (the triangular notches).
  ctx.fillStyle = 'rgba(35,40,50,0.42)';
  ctx.fillRect(0, 0, px, px);
  // Step 2: punch the RAISED RIB surface transparent so the logo shows through it
  //         (the ribs = the light "white space" of the tile → becomes the logo surface).
  ctx.globalCompositeOperation = 'destination-out';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.lineJoin = 'miter'; ctx.lineCap = 'square';
  ctx.lineWidth = Math.max(2, px * 0.16);
  ctx.strokeRect(0, 0, px, px);                                   // cell border rib
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(px, px); ctx.moveTo(px, 0); ctx.lineTo(0, px); ctx.stroke();  // X ribs
  ctx.beginPath(); ctx.moveTo(px / 2, 0); ctx.lineTo(px / 2, px); ctx.moveTo(0, px / 2); ctx.lineTo(px, px / 2); ctx.stroke(); // + ribs
  ctx.globalCompositeOperation = 'source-over';
  _latticeCanvas = c;
  return c;
}

// ── Pickleball net canvas (fine black mesh + white top tape) ──────────────────
function makePickleNetCanvas(cellsX = 120, cellsY = 20) {
  const W = 1024, H = 180;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  // Diamond/square mesh grid
  ctx.strokeStyle = 'rgba(15,15,15,0.92)';
  ctx.lineWidth = 1.4;
  const tapeH = H * 0.13;                     // top tape band height
  for (let i = 0; i <= cellsX; i++) { const x = i / cellsX * W; ctx.beginPath(); ctx.moveTo(x, tapeH); ctx.lineTo(x, H); ctx.stroke(); }
  for (let i = 0; i <= cellsY; i++) { const y = tapeH + i / cellsY * (H - tapeH); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // White top tape band with thin dark edges
  ctx.fillStyle = '#f2f2f2'; ctx.fillRect(0, 0, W, tapeH);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, tapeH); ctx.lineTo(W, tapeH); ctx.stroke();
  return c;
}

// ── 3D Geometry helpers ───────────────────────────────────────────────────────
function makePipe(parent, mat, from, to, radius = 0.1) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  if (len < 0.01) return;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 8, 1), mat);
  mesh.position.copy(from).lerp(to, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  mesh.castShadow = true;
  parent.add(mesh);
}

function makeBox(parent, mat, w, h, d, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = true; parent.add(m);
  return m;
}

// ── Basketball net ────────────────────────────────────────────────────────────
function createNet(rimRadius = 0.75) {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.85 });
  const V = 14, H = 7, height = 1.7, botR = rimRadius * 0.28;
  for (let i = 0; i < V; i++) {
    const a = (i / V) * Math.PI * 2, pts = [];
    for (let h = 0; h <= H; h++) { const t = h / H, r = rimRadius * (1 - t) + botR * t, bow = Math.sin(t * Math.PI) * 0.1; pts.push(new THREE.Vector3(Math.cos(a) * (r + bow), -t * height, Math.sin(a) * (r + bow))); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }
  for (let h = 0; h <= H; h++) {
    const t = h / H, r = rimRadius * (1 - t) + botR * t, bow = Math.sin(t * Math.PI) * 0.1, y = -t * height, pts = [];
    for (let i = 0; i <= 32; i++) { const a = (i / 32) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * (r + bow), y, Math.sin(a) * (r + bow))); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }
  return g;
}

// ── Professional basketball hoop (single-arm pole-mount design) ───────────────
// One horizontal arm from near the pole top to the board, braced by a
// diagonal tube down to the pole — matches slim in-ground court systems.
function buildHoop(scene, zPos, D, hoopOffset = 0, variant = 60) {
  const S = variant === 72 ? 1.1 : 1.0;
  const g = new THREE.Group();

  const matPole = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.12, metalness: 0.95, envMapIntensity: 1.2 });
  const matRim = new THREE.MeshStandardMaterial({ color: 0xdd2200, roughness: 0.45, metalness: 0.35 });
  const matGlass = new THREE.MeshStandardMaterial({ color: 0xc4d8ee, transparent: true, opacity: 0.20, roughness: 0.02, side: THREE.DoubleSide });
  const matWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92, side: THREE.DoubleSide });

  // ── Pole ──────────────────────────────────────────────────────────────────
  const PW = 0.38 * S;   // pole width — thick square post
  const PH = 14.5;     // total pole height (ft)

  // Wide base plate at ground
  makeBox(g, matPole, PW * 4.2, 0.22, PW * 4.2, 0, 0.11, 0);
  // Thicker base collar (first 2 ft)
  makeBox(g, matPole, PW * 1.75, 2.0, PW * 1.75, 0, 1.0, 0);
  // Main shaft (above collar to top)
  makeBox(g, matPole, PW, PH - 2.0, PW, 0, 2.0 + (PH - 2.0) / 2, 0);
  // Pole cap
  makeBox(g, matPole, PW * 1.25, 0.18, PW * 1.25, 0, PH + 0.09, 0);

  // ── Double-arm parallelogram + diagonal brace ─────────────────────────────
  //   Upper arm + lower arm (parallel, identical length) from pole to board
  //   bracket. Diagonal pipe brace from lower pole to upper-arm tip.
  const ARM_W = PW * 0.72;
  const ARM_LEN = 4.8;
  const ARM_Z = D * ARM_LEN;
  const UA_Y = PH - 1.8;        // upper arm center Y (near pole top)
  const LA_Y = UA_Y - 2.5;      // lower arm center Y

  // Upper arm
  makeBox(g, matPole, ARM_W, ARM_W, ARM_LEN, 0, UA_Y, D * ARM_LEN / 2);
  // Lower arm
  makeBox(g, matPole, ARM_W, ARM_W, ARM_LEN, 0, LA_Y, D * ARM_LEN / 2);
  // Diagonal cable brace: lower pole → upper arm tip
  makePipe(g, matPole,
    new THREE.Vector3(0, LA_Y - 2.2, 0),
    new THREE.Vector3(0, UA_Y, ARM_Z),
    ARM_W * 0.30);
  // Pole-side gussets
  makeBox(g, matPole, PW * 1.5, 0.14, ARM_W, 0, UA_Y, D * 0.25);
  makeBox(g, matPole, PW * 1.5, 0.14, ARM_W, 0, LA_Y, D * 0.25);

  // ── Board bracket (vertical column connecting both arm tips) ─────────────
  const BB_H = (UA_Y + ARM_W / 2) - (LA_Y - ARM_W / 2);
  makeBox(g, matPole, ARM_W * 0.9, BB_H, ARM_W * 0.9, 0, (UA_Y + LA_Y) / 2, ARM_Z);
  makeBox(g, matPole, ARM_W * 1.2, 0.14, ARM_W * 1.2, 0, UA_Y, ARM_Z);
  makeBox(g, matPole, ARM_W * 1.2, 0.14, ARM_W * 1.2, 0, LA_Y, ARM_Z);

  // ── Camera / light nub at very top of pole ───────────────────────────────
  makeBox(g, matPole, PW * 0.6, 0.6, PW * 0.6, 0, PH + 0.4, 0);
  makeBox(g, matPole, PW * 1.2, 0.22, PW * 1.6, 0, PH + 0.82, 0);

  // ── Backboard ─────────────────────────────────────────────────────────────
  const RIM_H = 10.0;          // standard 10 ft rim height
  const BH = 3.5 * S, BW = 6.0 * S;
  const BY = RIM_H + BH / 2 + 0.1; // board center Y ≈ 11.85 ft
  const BZ = ARM_Z;              // board sits at arm tip (same Z as bracket)

  // Backboard glass panel
  const board = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, 0.07), matGlass);
  board.position.set(0, BY, BZ); g.add(board);

  // Board outer frame (4 rectangular black bars)
  const FW = 0.10;
  [[BW + FW, FW, FW, 0, BY + BH / 2, BZ],
  [BW + FW, FW, FW, 0, BY - BH / 2, BZ],
  [FW, BH + FW, FW, -BW / 2, BY, BZ],
  [FW, BH + FW, FW, BW / 2, BY, BZ]].forEach(([w, h, d, x, y, z]) =>
    makeBox(g, matPole, w, h, d, x, y, z));

  // White target rectangle (24"×18" inner box, inset from frame)
  const TW = 2.0 * S, TH = 1.5 * S, TY = BY - 0.06, TZ = BZ + 0.04 * D;
  [[TW, FW, FW, 0, TY + TH / 2, TZ],
  [TW, FW, FW, 0, TY - TH / 2, TZ],
  [FW, TH, FW, -TW / 2, TY, TZ],
  [FW, TH, FW, TW / 2, TY, TZ]].forEach(([w, h, d, x, y, z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWhite);
    m.position.set(x, y, z); g.add(m);
  });

  // ── Rim assembly ──────────────────────────────────────────────────────────
  const RIM_R = 0.55;             // reduced rim radius
  const RIM_Z = BZ + D * 2.2;    // rim extends from board FRONT face toward court

  // J-bracket: horizontal bar from board front face to rim
  makeBox(g, matPole, PW * 0.85, 0.15, 1.6, 0, RIM_H + 0.08, BZ + D * 0.82);
  // Upright tab at board front face
  makeBox(g, matPole, PW * 0.65, 0.55, PW * 0.65, 0, RIM_H + 0.36, BZ + D * 0.04);

  // Rim torus — standard 18" diameter, 1.5" round tube
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RIM_R, 0.055, 12, 48), matRim);
  rim.rotation.x = Math.PI / 2; rim.position.set(0, RIM_H, RIM_Z); g.add(rim);

  // Animated net
  const net = createNet(RIM_R);
  net.position.set(0, RIM_H, RIM_Z); g.add(net);

  g.position.set(0, 0, zPos + D * hoopOffset);
  scene.add(g);
  return net;
}

// ── Net protect (backdrop cage behind hoop) ───────────────────────────────────
function buildNetProtect(scene, zPos, D, courtWidth) {
  const g = new THREE.Group();
  const matPole = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.3, metalness: 0.7 });

  const NET_H = 12;        // height (ft)
  const NET_W = 8;         // fixed width (ft)
  const POLE_R = 0.22;

  // Two outer poles
  [-NET_W / 2, NET_W / 2].forEach(x => {
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R, POLE_R * 1.2, NET_H + 0.5, 10), matPole);
    pole.position.set(x, (NET_H + 0.5) / 2, 0); pole.castShadow = true; g.add(pole);
    // Base plate
    makeBox(g, matPole, POLE_R * 5, 0.3, POLE_R * 5, x, 0.15, 0);
  });

  // Top horizontal bar (tube)
  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R * 0.7, POLE_R * 0.7, NET_W, 8), matPole);
  topBar.rotation.z = Math.PI / 2; topBar.position.set(0, NET_H + 0.25, 0); topBar.castShadow = true; g.add(topBar);

  // Net mesh (two panels, split at center pole hole)
  const netCanvas = makeNetCanvas(40, 26);
  const netTex = new THREE.CanvasTexture(netCanvas);
  netTex.wrapS = netTex.wrapT = THREE.RepeatWrapping;

  // One continuous net
  const matNet = new THREE.MeshBasicMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.01 });
  const netMesh = new THREE.Mesh(new THREE.PlaneGeometry(NET_W, NET_H), matNet);
  netMesh.position.set(0, NET_H / 2, 0); g.add(netMesh);

  // Bottom ground bar
  const botBar = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R * 0.5, POLE_R * 0.5, NET_W, 8), matPole);
  botBar.rotation.z = Math.PI / 2; botBar.position.set(0, 0.2, 0); g.add(botBar);

  // Position net group: it sits behind the hoop (D*2 feet further back from end line)
  g.position.set(0, 0, zPos - D * 1.8);
  scene.add(g);
}

// ── LED Game light (bracket-mount floodlight) ─────────────────────────────────
function buildGameLight(scene, x, z) {
  const g = new THREE.Group();
  const matDark = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25, metalness: 0.85 });
  const matLight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0xffffee), emissiveIntensity: 2.5, roughness: 0.3 });
  const matLens = new THREE.MeshStandardMaterial({ color: 0xeeeeff, emissive: new THREE.Color(0xffffff), emissiveIntensity: 4.0, roughness: 0.0 });

  // Pole
  const PH = 18;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, PH, 10), matDark);
  pole.position.set(0, PH / 2, 0); pole.castShadow = true; g.add(pole);
  // Base
  makeBox(g, matDark, 0.8, 0.25, 0.8, 0, 0.12, 0);

  // Horizontal mounting rail (extends from pole top toward court)
  const railLen = 2.8;
  makeBox(g, matDark, railLen, 0.16, 0.16, -railLen / 2 + 0.08, PH - 0.1, 0);

  // Diagonal V-brace (two arms of the V)
  const braceTop = new THREE.Vector3(0, PH - 0.1, 0);
  const braceBotA = new THREE.Vector3(-railLen + 0.2, PH - 3.5, 0);
  const braceBotB = new THREE.Vector3(-railLen + 0.4, PH - 2.2, 0);
  makePipe(g, matDark, braceTop, braceBotA, 0.07);
  makePipe(g, matDark, braceTop, braceBotB, 0.07);

  // Pivot block at tip of rail
  makeBox(g, matDark, 0.32, 0.35, 0.28, -railLen + 0.16, PH - 0.25, 0);

  // LED fixture head (wider flat box, slightly angled downward ~15°)
  const headGroup = new THREE.Group();
  // Outer housing
  makeBox(headGroup, matDark, 1.55, 0.28, 0.95, 0, 0, 0);
  // LED panel (emissive white)
  makeBox(headGroup, matLens, 1.25, 0.05, 0.7, 0, -0.12, 0);
  // Housing rim / bezel
  [[1.6, 0.06, 0.06, 0, 0.11, 0.485], [1.6, 0.06, 0.06, 0, 0.11, -0.485], [0.06, 0.06, 1.0, 0.785, 0.11, 0], [0.06, 0.06, 1.0, -0.785, 0.11, 0]].forEach(([w, h, d, px, py, pz]) => {
    makeBox(headGroup, matDark, w, h, d, px, py, pz);
  });
  headGroup.rotation.x = Math.PI * 0.08; // slight tilt (faces down toward court)
  headGroup.position.set(-railLen + 0.15, PH - 0.65, 0);
  g.add(headGroup);

  // Light cone (very subtle)
  const coneMat = new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(4.5, 10, 16, 1, true), coneMat);
  cone.rotation.x = Math.PI; cone.position.set(-railLen + 0.15, PH - 5.5, 0); g.add(cone);

  // SpotLight
  const spot = new THREE.SpotLight(0xfff8e0, 1.0, 40, Math.PI / 6, 0.5);
  spot.position.set(-railLen + 0.15, PH - 0.65, 0);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0, 0);
  g.add(spot); g.add(spotTarget); spot.target = spotTarget;

  g.position.set(x, 0, z);
  scene.add(g);
}

// ── Dimension annotation system ───────────────────────────────────────────────
function makeDimLabel(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = 26;
  ctx.font = `bold ${fontSize}px monospace`;
  const tw = Math.ceil(ctx.measureText(text).width);
  const px = 12, py = 7;
  canvas.width = tw + px * 2;
  canvas.height = fontSize + py * 2;
  // White pill background
  ctx.fillStyle = 'rgba(255,255,255,0.93)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0.75, 0.75, canvas.width - 1.5, canvas.height - 1.5);
  // Text
  ctx.fillStyle = '#111111';
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
  const sp = new THREE.Sprite(mat);
  sp.renderOrder = 999;
  const aspect = canvas.width / canvas.height;
  sp.scale.set(aspect * 2.5, 2.5, 1);
  return sp;
}

function makeDimAnnotation(group, pA, pB, label, perpAxis, offsetDist) {
  const lmat = new THREE.LineBasicMaterial({ color: 0x111111, depthTest: false, transparent: true, opacity: 0.88 });
  const perp = perpAxis.clone().normalize().multiplyScalar(offsetDist);
  const dA = pA.clone().add(perp);
  const dB = pB.clone().add(perp);

  const seg = (a, b) => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([a.clone(), b.clone()]), lmat
    );
    line.renderOrder = 998;
    group.add(line);
  };

  // Extension lines (small gap, then run from measurement point to dim line)
  const extDir = perpAxis.clone().normalize();
  seg(pA.clone().addScaledVector(extDir, offsetDist * 0.08), dA);
  seg(pB.clone().addScaledVector(extDir, offsetDist * 0.08), dB);

  // Main dimension line
  seg(dA, dB);

  // Tick marks at endpoints (perpendicular to direction)
  const mainDir = new THREE.Vector3().subVectors(dB, dA).normalize();
  const tickPerp = new THREE.Vector3(-mainDir.z, 0, mainDir.x).multiplyScalar(0.38);
  [dA, dB].forEach(pt => seg(pt.clone().sub(tickPerp), pt.clone().add(tickPerp)));

  // Arrow heads (V pointing inward, toward center)
  const upa = new THREE.Vector3(0, 1, 0);
  const arrowLen = 0.48;
  const makeArrow = (pos, dir) => {
    const v1 = dir.clone().applyAxisAngle(upa, 0.38).multiplyScalar(arrowLen);
    const v2 = dir.clone().applyAxisAngle(upa, -0.38).multiplyScalar(arrowLen);
    seg(pos, pos.clone().add(v1));
    seg(pos, pos.clone().add(v2));
  };
  makeArrow(dA, mainDir.clone());           // at dA, pointing toward dB
  makeArrow(dB, mainDir.clone().negate());  // at dB, pointing toward dA

  // Label sprite at midpoint, pushed slightly further out
  const mid = dA.clone().lerp(dB, 0.5);
  mid.addScaledVector(perpAxis.clone().normalize(), 0.7).setY(mid.y + 0.25);
  const sp = makeDimLabel(label);
  sp.position.copy(mid);
  group.add(sp);
}

function buildDimensionAnnotations(scene, width, length, courtType, metric) {
  const g = new THREE.Group();
  const y = 0.46; // just above court surface

  const fmt = (ft) => {
    if (metric) return `${(ft * 0.3048).toFixed(1)}m`;
    const f = Math.floor(ft);
    const i = Math.round((ft - f) * 12);
    return i === 0 ? `${f}'` : `${f}' ${i}"`;
  };

  const W = width, L = length;

  // ── Overall court perimeter ─────────────────────────────────────────────
  // Width (along near baseline, offset outward in -Z)
  makeDimAnnotation(g,
    new THREE.Vector3(-W / 2, y, -L / 2),
    new THREE.Vector3(W / 2, y, -L / 2),
    fmt(W), new THREE.Vector3(0, 0, -1), 5.2
  );
  // Length (along right sideline, offset outward in +X)
  makeDimAnnotation(g,
    new THREE.Vector3(W / 2, y, -L / 2),
    new THREE.Vector3(W / 2, y, L / 2),
    fmt(L), new THREE.Vector3(1, 0, 0), 5.2
  );

  if (courtType && courtType.includes('basketball')) {
    const kW = Math.min(KEY_W_FT, W - 2);
    const kH = Math.min(KEY_H_FT, L - 2);
    const z0 = -L / 2;  // baseline Z
    const ftR = kW / 2; // free-throw dome radius (spans the key width)
    const tpR = Math.min(kH + kW / 2 - 5.25, W / 2 - 0.5); // 3-point radius (matches painted lines)

    // Key width at top of paint
    makeDimAnnotation(g,
      new THREE.Vector3(-kW / 2, y, z0 + kH),
      new THREE.Vector3(kW / 2, y, z0 + kH),
      fmt(kW), new THREE.Vector3(0, 0, 1), 2.5
    );
    // Key height (paint length)
    makeDimAnnotation(g,
      new THREE.Vector3(kW / 2, y, z0),
      new THREE.Vector3(kW / 2, y, z0 + kH),
      fmt(kH), new THREE.Vector3(1, 0, 0), 2.5
    );
    // Free throw distance from baseline (key height + ft radius = ft line)
    makeDimAnnotation(g,
      new THREE.Vector3(-kW / 2 - 1.5, y, z0),
      new THREE.Vector3(-kW / 2 - 1.5, y, z0 + kH + ftR),
      fmt(kH + ftR), new THREE.Vector3(-1, 0, 0), 1.2
    );

    // 3-point arc label (positioned along the arc)
    const tpSp = makeDimLabel(`3pt: ${fmt(tpR)}`);
    tpSp.position.set(-tpR * 0.68, y + 0.4, z0 + 5.25 + tpR * 0.65);
    g.add(tpSp);

    // Basket height label
    const rimSp = makeDimLabel(`Rim ht: 10'`);
    rimSp.position.set(0, y + 0.4, z0 - 2.2);
    g.add(rimSp);

    // Backboard overhang from baseline (1219.2 mm = 4')
    const ovSp = makeDimLabel(`Overhang: 4'`);
    ovSp.position.set(kW / 2 + 3.2, y + 0.4, z0 + 0.5);
    g.add(ovSp);

    // Corner 3-point distance (straight corner lines from center)
    const cornerDist = Math.min(19, W / 2 - 3);
    const cSp = makeDimLabel(`Corner: ${fmt(cornerDist)}`);
    cSp.position.set(-W / 2 + 3.5, y + 0.4, z0 + 1.5);
    g.add(cSp);

    if (isFullBasketball(courtType)) {
      // Center circle label
      const ccSp = makeDimLabel(`Center circle: ${fmt(6)} R`);
      ccSp.position.set(W / 2 + 4.5, y + 0.4, 0);
      g.add(ccSp);
    }
  }

  if (courtType && courtType.includes('pickleball')) {
    const z0 = -L / 2;
    const kitSp = makeDimLabel(`Kitchen: 7'`);
    kitSp.position.set(W / 2 + 3.5, y + 0.4, z0 + 7);
    g.add(kitSp);
    makeDimAnnotation(g,
      new THREE.Vector3(W / 2, y, z0),
      new THREE.Vector3(W / 2, y, 0),
      fmt(L / 2), new THREE.Vector3(1, 0, 0), 4
    );
  }

  g.visible = false;
  scene.add(g);
  return g;
}

// ── Ruler overlay component ───────────────────────────────────────────────────
function RulerOverlay({ width, length, metric, darkMode }) {
  const toM = ft => (ft * 0.3048).toFixed(1);
  const wLabel = metric ? `${toM(width)} m` : `${width}'`;
  const lLabel = metric ? `${toM(length)} m` : `${length}'`;
  const tc = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)';
  const lc = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)';
  const style = {
    position: 'absolute', pointerEvents: 'none', fontFamily: 'monospace',
    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
  };
  const arrowStyle = (horiz) => ({
    position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 4, color: tc,
    ...(horiz ? { bottom: 36, left: '50%', transform: 'translateX(-50%)', flexDirection: 'row' }
      : { left: 6, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', flexDirection: 'row' }),
  });
  const lineStyle = (horiz) => ({
    ...(horiz ? { width: 80, height: 1 } : { width: 60, height: 1 }),
    background: lc, position: 'relative',
  });
  const capStyle = {
    position: 'absolute', top: -4, height: 9, width: 1, background: lc,
  };
  return (
    <div style={{ ...style, inset: 0, zIndex: 9 }}>
      {/* Width ruler — bottom */}
      <div style={arrowStyle(true)}>
        <div style={lineStyle(true)}>
          <span style={{ ...capStyle, left: 0 }} />
          <span style={{ ...capStyle, right: 0 }} />
        </div>
        <span>{wLabel}</span>
        <div style={lineStyle(true)}>
          <span style={{ ...capStyle, left: 0 }} />
          <span style={{ ...capStyle, right: 0 }} />
        </div>
      </div>
      {/* Length ruler — left */}
      <div style={arrowStyle(false)}>
        <div style={lineStyle(false)}>
          <span style={{ ...capStyle, left: 0 }} />
          <span style={{ ...capStyle, right: 0 }} />
        </div>
        <span>{lLabel}</span>
        <div style={lineStyle(false)}>
          <span style={{ ...capStyle, left: 0 }} />
          <span style={{ ...capStyle, right: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main Court3D component ────────────────────────────────────────────────────
export default function Court3D({
  width = 30, length = 47,
  colors, linesConfig, courtType,
  tileType = 'game_outdoor',
  hoopVariant = 'megaslam60',
  hoopOffset = 0,
  bothEnds = false,
  showNetProtect = false,
  showGameLight = false,
  darkMode = true,
  showRuler = false,
  metric = false,
  logos = [],
  activeLogo = 0,
  onDarkModeToggle,
  className = '',
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (sceneRef.current.controls) sceneRef.current.controls.autoRotate = autoRotate; }, [autoRotate]);
  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn); return () => document.removeEventListener('fullscreenchange', fn);
  }, []);

  // Fast: color update (also re-tints when the tile flips to/from wood-grain)
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.courtMat) return;
    const wood = tileType === 'wood_grain';
    s.courtMat.color.set(tintFor(tileType, colors?.main || '#0061A0')); s.courtMat.needsUpdate = true;
    if (s.sideMat) {
      s.sideMat.color.set(wood ? new THREE.Color('#6b4f34') : new THREE.Color(colors?.main || '#0061A0').multiplyScalar(0.5));
      s.sideMat.needsUpdate = true;
    }
    if (s.accentMeshes) s.accentMeshes.forEach(m => {
      if (m.userData.fixedColor) {
        // pickleball kitchen/service zones keep their fixed colour, but go white (true wood) for wood-grain
        m.material.color.set(wood ? '#ffffff' : (m.userData.baseColor || '#9CA3AF'));
      } else {
        m.material.color.set(tintFor(tileType, colors?.accent || '#9CA3AF'));
      }
      m.material.needsUpdate = true;
    });
    if (s.borderMat) { s.borderMat.color.set(colors?.border || '#3E464A'); s.borderMat.needsUpdate = true; }
  }, [colors?.main, colors?.accent, colors?.border, tileType]);

  // Fast: tile update only
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.courtMat || !s.renderer) return;
    const newTex = makeTileTexture(tileType, width, length, s.renderer);
    if (s.courtMat.map) s.courtMat.map.dispose();
    s.courtMat.map = newTex; s.courtMat.needsUpdate = true;
    if (s.accentMeshes) s.accentMeshes.forEach(m => {
      // Use each accent mesh's OWN size so its tiles stay 1ft × 1ft (not the court size)
      const tw = m.userData.tileW || width, th = m.userData.tileH || length;
      const t2 = makeTileTexture(tileType, tw, th, s.renderer);
      if (m.material.map) m.material.map.dispose();
      m.material.map = t2; m.material.needsUpdate = true;
    });
  }, [tileType]);

  // Fast: ruler / dimension annotations toggle
  useEffect(() => {
    const s = sceneRef.current;
    if (s.dimGroup) s.dimGroup.visible = showRuler;
  }, [showRuler]);

  // Fast: court logos (position / scale / rotate)
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.scene) return;
    if (!s.logoGroup) { s.logoGroup = new THREE.Group(); s.scene.add(s.logoGroup); }
    if (!s.logoTexCache) s.logoTexCache = new Map();
    const loader = s.logoLoader || (s.logoLoader = new THREE.TextureLoader());
    // Clear previous logo meshes
    while (s.logoGroup.children.length) {
      const m = s.logoGroup.children.pop();
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        if (m.userData.disposeMap && m.material.map) m.material.map.dispose(); // ruler labels only, not cached logo textures
        m.material.dispose();
      }
    }
    const fmtFt = ft => { const f = Math.round(ft * 12) / 12; const w = Math.floor(f); const inch = Math.round((f - w) * 12); return inch ? `${w}'${inch}"` : `${w}'`; };
    (logos || []).forEach((lg, idx) => {
      if (!lg || !lg.url) return;
      const size = lg.scale || 3;
      const mat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = ((lg.rotate || 0) * Math.PI) / 180;
      m.scale.set(size, size, 1);
      const x = (((lg.horizontal ?? 50) / 100) - 0.5) * width;
      const z = (((lg.vertical ?? 50) / 100) - 0.5) * length;
      m.position.set(x, 0.4, z);
      s.logoGroup.add(m);

      // Tile-lattice overlay so the logo looks printed onto the court tiles
      const ovTex = new THREE.CanvasTexture(getLatticeCellCanvas());
      ovTex.wrapS = ovTex.wrapT = THREE.RepeatWrapping;
      const ovMat = new THREE.MeshBasicMaterial({ map: ovTex, transparent: true, opacity: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
      const ov = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ovMat);
      ov.rotation.x = -Math.PI / 2;
      ov.rotation.z = ((lg.rotate || 0) * Math.PI) / 180;
      ov.position.set(x, 0.41, z);
      ov.userData.disposeMap = true;
      s.logoGroup.add(ov);

      const applyAspect = t => {
        const aspect = (t.image && t.image.width) ? t.image.width / t.image.height : 1;
        const wFeet = size * aspect, hFeet = size;
        m.scale.set(wFeet, hFeet, 1);
        ov.scale.set(wFeet, hFeet, 1);
        // 8 cells per foot — matches the court tile's 8×8 cells-per-foot so logo cells = court cells
        ovTex.repeat.set(Math.max(1, wFeet * 8), Math.max(1, hFeet * 8)); ovTex.needsUpdate = true;
        if (s.renderer && s.camera) s.renderer.render(s.scene, s.camera);
      };
      let tex = s.logoTexCache.get(lg.url);
      if (tex) { mat.map = tex; mat.needsUpdate = true; applyAspect(tex); }
      else {
        tex = loader.load(lg.url, t => { t.colorSpace = THREE.SRGBColorSpace; mat.map = t; mat.needsUpdate = true; applyAspect(t); });
        s.logoTexCache.set(lg.url, tex);
      }
    });
    if (s.renderer && s.camera) s.renderer.render(s.scene, s.camera);
  }, [logos, activeLogo, width, length]);

  // Fast: lines update only
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.linesMesh) return;
    const canvas = drawLinesCanvas(width, length, colors, linesConfig, courtType);
    const tex = new THREE.CanvasTexture(canvas);
    if (s.linesMesh.material.map) s.linesMesh.material.map.dispose();
    s.linesMesh.material.map = tex; s.linesMesh.material.needsUpdate = true;
  }, [colors?.line, linesConfig?.color, linesConfig?.thickness]);

  // Structural: full rebuild
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    setIsLoading(true);
    const prev = sceneRef.current;
    if (prev.animId) cancelAnimationFrame(prev.animId);
    if (prev.ro) prev.ro.disconnect();
    if (prev.controls) prev.controls.dispose();
    if (prev.renderer) { prev.renderer.dispose(); if (mount.contains(prev.renderer.domElement)) mount.removeChild(prev.renderer.domElement); }
    sceneRef.current = {};
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      try { buildScene(mount); }
      catch (err) { console.error('[Court3D]', err); setIsLoading(false); }
    });
    return () => {
      cancelled = true; cancelAnimationFrame(raf);
      const s = sceneRef.current;
      if (s.animId) cancelAnimationFrame(s.animId);
      if (s.ro) s.ro.disconnect();
      if (s.controls) s.controls.dispose();
      if (s.renderer) { s.renderer.dispose(); if (mount.contains(s.renderer.domElement)) mount.removeChild(s.renderer.domElement); }
      sceneRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, length, courtType, hoopVariant, hoopOffset, bothEnds, showNetProtect, showGameLight, darkMode, metric]);

  function buildScene(mount) {
    const cW = Math.max(mount.clientWidth || 0, 400);
    const cH = Math.max(mount.clientHeight || 0, 300);
    const bg = darkMode ? 0x0d1117 : 0xeef2f5;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.FogExp2(bg, 0.0016);

    const camera = new THREE.PerspectiveCamera(40, cW / cH, 0.1, 2000);
    const cd = Math.max(width, length) * 1.5;
    camera.position.set(cd * 0.5, cd * 0.5, cd * 0.85);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(cW, cH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = darkMode ? 1.1 : 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0); controls.enableDamping = true; controls.dampingFactor = 0.06;
    controls.minPolarAngle = 0.05; controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 1; controls.maxDistance = cd * 4;
    controls.autoRotate = autoRotate; controls.autoRotateSpeed = 1.5;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, darkMode ? 0.38 : 0.82));
    const sun = new THREE.DirectionalLight(darkMode ? 0xfff0cc : 0xfff8f0, darkMode ? 1.35 : 1.7);
    sun.position.set(80, 140, 100); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.near = 1; sun.shadow.camera.far = 600;
    sun.shadow.camera.left = -160; sun.shadow.camera.right = 160; sun.shadow.camera.top = 160; sun.shadow.camera.bottom = -160;
    sun.shadow.bias = -0.001; scene.add(sun);
    const fill = new THREE.DirectionalLight(darkMode ? 0x3355aa : 0x99bbff, 0.3);
    fill.position.set(-80, 80, -100); scene.add(fill);
    if (!darkMode) scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4a7c59, 0.4));

    // Ground
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1500), new THREE.MeshLambertMaterial({ color: darkMode ? 0x080c10 : 0xc8ccc8 }));
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -0.86; gnd.receiveShadow = true; scene.add(gnd);

    // Flat ground surround (no raised border frame — boundary is the painted court line)
    const borderMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colors?.border || '#3E464A'), roughness: 0.9 });
    const apronMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(darkMode ? 0x12181d : 0xd4d4cc), roughness: 0.95 });
    const apron = new THREE.Mesh(new THREE.BoxGeometry(width + 14, 0.18, length + 14), apronMat);
    apron.position.y = -0.09; apron.receiveShadow = true; scene.add(apron);

    // Court surface
    const tileTex = makeTileTexture(tileType, width, length, renderer);
    const courtMat = new THREE.MeshStandardMaterial({ map: tileTex, color: new THREE.Color(tintFor(tileType, colors?.main || '#0061A0')), roughness: 0.82, metalness: 0 });
    const sideCol = tileType === 'wood_grain'
      ? new THREE.Color('#6b4f34')                                            // wood edge
      : new THREE.Color(colors?.main || '#0061A0').multiplyScalar(0.5);
    const sideMat = new THREE.MeshStandardMaterial({ color: sideCol, roughness: 0.9 });
    const court = new THREE.Mesh(new THREE.BoxGeometry(width, 0.38, length), [sideMat, sideMat, courtMat, sideMat, sideMat, sideMat]);
    court.position.y = 0.19; court.receiveShadow = true; scene.add(court);

    // Accent zones
    const accentMeshes = [];
    if (courtType && courtType.includes('basketball')) {
      const kW = Math.min(KEY_W_FT, width - 2), kH = Math.min(KEY_H_FT, length - 2);
      const mkAccent = (zOff) => {
        const acTex = makeTileTexture(tileType, kW, kH, renderer);
        const baseHex = colors?.accent || '#9CA3AF';
        const mat = new THREE.MeshStandardMaterial({ map: acTex, color: new THREE.Color(tintFor(tileType, baseHex)), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        const m = new THREE.Mesh(new THREE.PlaneGeometry(kW, kH), mat);
        m.rotation.x = -Math.PI / 2; m.position.set(0, 0.383, zOff);
        m.userData.tileW = kW; m.userData.tileH = kH;   // for correct 1ft repeat on tile change
        scene.add(m); accentMeshes.push(m);
      };
      mkAccent(-(length / 2 - kH / 2));
      if (isFullBasketball(courtType)) mkAccent(length / 2 - kH / 2);
    }

    // Pickleball zones: gray kitchen (center) + black service boxes (corners)
    if (courtType && courtType.includes('pickleball')) {
      const playW = Math.min(20, width), playH = Math.min(44, length);
      const KITCHEN = 14;           // 7ft each side of net
      const halfBox = (playH - KITCHEN) / 2;   // 15ft service-box depth
      const boxZc = KITCHEN / 2 + halfBox / 2;   // center of each service box
      const mkZone = (w, h, x, z, hex) => {
        const tex = makeTileTexture(tileType, w, h, renderer);
        const mat = new THREE.MeshStandardMaterial({ map: tex, color: new THREE.Color(tintFor(tileType, hex)), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        m.rotation.x = -Math.PI / 2; m.position.set(x, 0.383, z);
        m.userData.fixedColor = true; m.userData.baseColor = hex;
        m.userData.tileW = w; m.userData.tileH = h;     // for correct 1ft repeat on tile change
        scene.add(m); accentMeshes.push(m);
      };
      // Kitchen (gray) — full playing width, 14ft deep, centered on net
      mkZone(playW, KITCHEN, 0, 0, '#9CA3AF');
      // Four service boxes (black) — 10ft wide × 15ft deep
      [-boxZc, boxZc].forEach(z => {
        mkZone(playW / 2, halfBox, -playW / 4, z, '#2b2b2b');
        mkZone(playW / 2, halfBox, playW / 4, z, '#2b2b2b');
      });
    }

    // Lines overlay
    const linesCanvas = drawLinesCanvas(width, length, colors, linesConfig, courtType);
    const linesTex = new THREE.CanvasTexture(linesCanvas);
    linesTex.repeat.set(1, -1); linesTex.offset.set(0, 1);
    linesTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const linesMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      new THREE.MeshBasicMaterial({ map: linesTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
    );
    linesMesh.rotation.x = -Math.PI / 2; linesMesh.position.y = 0.386; scene.add(linesMesh);

    // Hoops
    const nets = [];
    const isBball = courtType && courtType.includes('basketball');
    const showHoop = hoopVariant && hoopVariant !== 'none' && isBball;
    if (showHoop) {
      const v = hoopVariant === 'megaslam72' ? 72 : 60;
      nets.push(buildHoop(scene, -(length / 2) - 3.8, 1, hoopOffset, v));
      if (isFullBasketball(courtType) || bothEnds) nets.push(buildHoop(scene, (length / 2) + 3.8, -1, hoopOffset, v));
    }

    // Pickleball net — realistic mesh with white top tape, black posts, center strap
    if (courtType && courtType.includes('pickleball')) {
      const playW = Math.min(20, width);
      const NET_H = 3;                 // 36" at posts
      const postX = playW / 2 + 0.4;
      const matPost = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.35, metalness: 0.6 });

      // Posts with rounded caps
      [-postX, postX].forEach(x => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, NET_H + 0.3, 12), matPost);
        p.position.set(x, (NET_H + 0.3) / 2, 0); p.castShadow = true; scene.add(p);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), matPost);
        cap.position.set(x, NET_H + 0.3, 0); scene.add(cap);
      });

      // Net mesh with fine-grid texture
      const pnCanvas = makePickleNetCanvas();
      const pnTex = new THREE.CanvasTexture(pnCanvas);
      pnTex.wrapS = THREE.RepeatWrapping; pnTex.repeat.set(1, 1);
      pnTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      const matNet = new THREE.MeshBasicMaterial({ map: pnTex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.02, depthWrite: false });
      const pbNet = new THREE.Mesh(new THREE.PlaneGeometry(playW, NET_H), matNet);
      pbNet.position.set(0, NET_H / 2, 0); scene.add(pbNet);

      // Center vertical strap (white)
      const strap = new THREE.Mesh(new THREE.PlaneGeometry(0.12, NET_H), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
      strap.position.set(0, NET_H / 2, 0.01); scene.add(strap);
    }

    // Net protect
    if (showNetProtect && isBball) {
      buildNetProtect(scene, -(length / 2) - 3.8, 1, width);
      if (isFullBasketball(courtType) || bothEnds) buildNetProtect(scene, (length / 2) + 3.8, -1, width);
    }

    // Game light — single pole centered behind the hoop
    if (showGameLight) {
      buildGameLight(scene, 0, -(length / 2) - 2);
      if (isFullBasketball(courtType)) buildGameLight(scene, 0, (length / 2) + 2);
    }

    // Dimension annotations
    const dimGroup = buildDimensionAnnotations(scene, width, length, courtType, metric);
    dimGroup.visible = showRuler;

    // Resize observer
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
    ro.observe(mount);

    // Render loop
    let animId;
    const t0 = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      sceneRef.current.animId = animId;
      const t = (performance.now() - t0) * 0.001;
      nets.forEach((net, i) => {
        if (!net) return;
        net.rotation.z = Math.sin(t * 0.55 + i * 1.4) * 0.038;
        net.rotation.x = Math.sin(t * 0.42 + i * 0.9) * 0.022;
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { scene, camera, renderer, controls, ro, animId, courtMat, sideMat, borderMat, linesMesh, accentMeshes, dimGroup };
    setIsLoading(false);
  }

  const toggleFullscreen = useCallback(() => {
    const el = mountRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.(); else document.exitFullscreen?.();
  }, []);
  const zoom = useCallback(dir => {
    const cam = sceneRef.current?.camera; if (!cam) return;
    cam.position.multiplyScalar(dir > 0 ? 0.82 : 1.22); sceneRef.current?.controls?.update();
  }, []);

  const dk = darkMode;
  const btnCls = `w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 border ${dk ? 'bg-black/60 hover:bg-black/80 text-white border-white/10' : 'bg-white/80 hover:bg-white text-gray-800 border-black/10'}`;

  return (
    <div ref={mountRef} className={`relative overflow-hidden ${className}`} style={{ width: '100%', height: '100%' }}>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{ background: dk ? '#0d1117' : '#cde5f5' }}>
          <div style={{ position: 'relative', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#2472B3', animation: 'c3d-spin 1s linear infinite' }} />
            <img src={CTC_LOGO} alt="" style={{ width: 52, height: 52, objectFit: 'contain', animation: 'c3d-pulse 1.5s ease-in-out infinite' }} onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <p style={{ color: dk ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', fontSize: 13, marginTop: 16, letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>
            Building your court…
          </p>
          <style>{`@keyframes c3d-spin{to{transform:rotate(360deg)}}@keyframes c3d-pulse{0%,100%{opacity:.4;transform:scale(.9)}50%{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}

      {/* Ruler overlay */}
      {showRuler && !isLoading && <RulerOverlay width={width} length={length} metric={metric} darkMode={darkMode} />}

      {/* Top-right controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button onClick={toggleFullscreen} className={btnCls} title="Fullscreen">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        <button onClick={() => zoom(1)} className={btnCls} title="Zoom in"><ZoomIn className="h-4 w-4" /></button>
        <button onClick={() => zoom(-1)} className={btnCls} title="Zoom out"><ZoomOut className="h-4 w-4" /></button>
        {onDarkModeToggle && (
          <button onClick={onDarkModeToggle} className={btnCls} title={dk ? 'Light' : 'Dark'}>
            {dk ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Bottom-left: auto-rotate */}
      <div className="absolute bottom-10 left-3 z-10">
        <button
          onClick={() => setAutoRotate(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-md border transition-all ${autoRotate ? 'bg-[#2472B3] text-white border-[#2472B3]' : dk ? 'bg-black/60 text-white/80 border-white/10 hover:bg-black/80' : 'bg-white/80 text-gray-700 border-black/10 hover:bg-white'}`}
        >
          {autoRotate ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {autoRotate ? 'Auto' : 'Lock'}
        </button>
      </div>

      <div className={`absolute bottom-3 right-3 z-10 text-xs px-2 py-1 rounded hidden md:block pointer-events-none ${dk ? 'text-white/30 bg-black/20' : 'text-black/35 bg-white/35'}`}>
        Drag · Scroll · Pinch
      </div>
    </div>
  );
}
