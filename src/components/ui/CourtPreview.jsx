import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TILE_SIZE = 12; // pixels per tile in preview

// Key (paint) dimensions from the VersaCourt reference:
// width 3444.9 mm ≈ 11'4", baseline → free-throw line 5710.6 mm ≈ 18'9"
const KEY_W_FT = 3444.9 / 304.8;
const KEY_H_FT = 5710.6 / 304.8;

// Pickleball court center offsets (ft from court center, along the width).
// Dual and multi-sport layouts place two 20'-wide courts side by side when
// the surface is wide enough; otherwise a single centered court.
function pickleCenters(courtType, width) {
  const twoCourts = (courtType || '').includes('dual') || (courtType || '').includes('multi_sport');
  if (twoCourts && width >= 42) {
    const gap = (width - 40) / 3;
    return [-(10 + gap / 2), 10 + gap / 2];
  }
  return [0];
}

export default function CourtPreview({ 
  width, 
  length, 
  colors, 
  linesConfig, 
  logoUrl, 
  logoConfig,
  courtType,
  showGrid = true,
  className 
}) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [showTileGrid, setShowTileGrid] = useState(showGrid);

  const scale = Math.min(600 / (width * TILE_SIZE), 400 / (length * TILE_SIZE), 1) * zoom;
  const canvasWidth = width * TILE_SIZE * scale;
  const canvasHeight = length * TILE_SIZE * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = width * TILE_SIZE;
    canvas.height = length * TILE_SIZE;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base court color
    ctx.fillStyle = colors?.main || '#3B82F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    const borderWidth = Math.min(width, length) * 0.08;
    ctx.fillStyle = colors?.border || '#1E3A8A';
    ctx.fillRect(0, 0, canvas.width, borderWidth * TILE_SIZE);
    ctx.fillRect(0, canvas.height - borderWidth * TILE_SIZE, canvas.width, borderWidth * TILE_SIZE);
    ctx.fillRect(0, 0, borderWidth * TILE_SIZE, canvas.height);
    ctx.fillRect(canvas.width - borderWidth * TILE_SIZE, 0, borderWidth * TILE_SIZE, canvas.height);

    // Draw accent zone (paint / key) — regulation 12'×19', border-aware, aligned
    // with the white key outline drawn later so the gray paint sits exactly under it.
    if (courtType?.includes('basketball') && colors?.accent) {
      const inset = borderWidth * TILE_SIZE;
      const playWft = (canvas.width - inset * 2) / TILE_SIZE;
      const playHft = (canvas.height - inset * 2) / TILE_SIZE;
      const keyW = Math.min(KEY_W_FT, playWft - 2) * TILE_SIZE;
      const keyH = Math.min(KEY_H_FT, playHft - 2) * TILE_SIZE;
      const keyX = (canvas.width - keyW) / 2;

      ctx.fillStyle = colors.accent;
      // Near (bottom) key — always present
      ctx.fillRect(keyX, canvas.height - inset - keyH, keyW, keyH);
      // Far (top) key — full court only
      if (courtType === 'basketball_full' || courtType?.includes('full_basketball')) {
        ctx.fillRect(keyX, inset, keyW, keyH);
      }
    }

    // Draw pickleball kitchen
    if (courtType?.includes('pickleball') && colors?.kitchen) {
      const kitchenDepth = 7;
      const courtInset = borderWidth * TILE_SIZE;
      const innerWidth = canvas.width - courtInset * 2;
      const innerHeight = canvas.height - courtInset * 2;
      
      ctx.fillStyle = colors.kitchen || colors.accent;
      ctx.fillRect(courtInset, innerHeight / 2 - kitchenDepth * TILE_SIZE / 2 + courtInset, innerWidth, kitchenDepth * TILE_SIZE);
    }

    // Draw tile grid
    if (showTileGrid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * TILE_SIZE, 0);
        ctx.lineTo(x * TILE_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE_SIZE);
        ctx.lineTo(canvas.width, y * TILE_SIZE);
        ctx.stroke();
      }
    }

    // Draw lines
    if (linesConfig) {
      ctx.strokeStyle = linesConfig.color || '#FFFFFF';
      ctx.lineWidth = linesConfig.thickness === 'bold' ? 4 : 2;
      ctx.lineCap = 'round';

      const inset = borderWidth * TILE_SIZE;
      const courtW = canvas.width - inset * 2;
      const courtH = canvas.height - inset * 2;

      if (linesConfig.basketball && courtType?.includes('basketball')) {
        // Regulation line work — identical geometry to the 3D Court3D view so the
        // 2D preview and the 3D render always match. Half court = near (bottom)
        // end only (image 2); full court = both ends + center line & double
        // center circle (image 1).
        const T = TILE_SIZE;
        const W = canvas.width, H = canvas.height;
        const playW = courtW, playH = courtH;   // area inside the colored border

        // Key (paint), free-throw circle, basket offset
        const keyW = Math.min(KEY_W_FT, playW / T - 2) * T;   // 11'4" lane
        const keyH = Math.min(KEY_H_FT, playH / T - 2) * T;   // 18'9" baseline → FT line
        const keyX = (W - keyW) / 2;
        const ftRadius = keyW / 2;                       // dome spans key width
        const baskFromBase = 5.25 * T;                   // rim center from baseline

        // Three-point geometry — same as the 3D view: the arc is tangent to the
        // free-throw dome at the apex, so the two lines MERGE into one at the top
        // and split apart off-center. Straight vertical corner lines run from the
        // baseline into the arc.
        const domeApex = keyH + ftRadius;                       // px from baseline
        const tpR = Math.min(domeApex - baskFromBase, playW / 2 - 0.5 * T);
        const cornerD = Math.min(19 * T, tpR - 0.35 * T);
        const joinFromBase = baskFromBase + Math.sqrt(Math.max(0, tpR * tpR - cornerD * cornerD));

        // Lane markers: wide block at 7', thin ticks above (reference spacing)
        const laneMarks = [7, 11, 14.5, 18];
        const tickLen = 0.55 * T;

        // baseY = canvas y of this end's baseline; dir = +1 drawing downward (top
        // end), -1 upward (bottom end)
        const drawBasketballEnd = (baseY, dir) => {
          const y = d => baseY + dir * d;
          const baskY = y(baskFromBase);
          const ftY = y(keyH);

          // Key / paint outline
          ctx.strokeRect(keyX, dir > 0 ? baseY : baseY - keyH, keyW, keyH);

          // Lane markers (both sides of the lane)
          laneMarks.forEach((d, i) => {
            if (d * T >= keyH) return;
            const ty = y(d * T);
            ctx.save();
            ctx.lineWidth = i === 0 ? 0.75 * T : 1.5;
            ctx.beginPath(); ctx.moveTo(keyX, ty); ctx.lineTo(keyX - tickLen, ty); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(keyX + keyW, ty); ctx.lineTo(keyX + keyW + tickLen, ty); ctx.stroke();
            ctx.restore();
          });

          // Free-throw dome — solid half toward the court only
          ctx.beginPath();
          ctx.arc(W / 2, ftY, ftRadius, dir > 0 ? 0 : Math.PI, dir > 0 ? Math.PI : 0);
          ctx.stroke();

          // Three-point line: straight vertical corner segments from the baseline to the arc
          const yJoin = y(joinFromBase);
          ctx.beginPath(); ctx.moveTo(W / 2 - cornerD, baseY); ctx.lineTo(W / 2 - cornerD, yJoin); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W / 2 + cornerD, baseY); ctx.lineTo(W / 2 + cornerD, yJoin); ctx.stroke();
          // Arc centered on the basket, between the two junctions (through the apex)
          const dyA = yJoin - baskY;
          const aL = Math.atan2(dyA, -cornerD), aR = Math.atan2(dyA, cornerD);
          ctx.beginPath();
          ctx.arc(W / 2, baskY, tpR, dir > 0 ? aR : aL, dir > 0 ? aL : aR);
          ctx.stroke();
        };

        // Bottom end (half court default → image 2)
        drawBasketballEnd(H - inset, -1);

        // Full court adds the top end + center line & circles (→ image 1)
        if (courtType === 'basketball_full' || courtType?.includes('full_basketball')) {
          drawBasketballEnd(inset, 1);
          ctx.beginPath();
          ctx.moveTo(inset, H / 2);
          ctx.lineTo(W - inset, H / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, 6 * T, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, 2 * T, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (linesConfig.pickleball && courtType?.includes('pickleball')) {
        // Regulation 20'×44' playing area per court, same geometry as the 3D
        // view. Dual / multi-sport layouts draw two courts side by side.
        const T = TILE_SIZE;
        const playW = Math.min(20, width) * T;
        const playH = Math.min(44, length) * T;
        const py = (canvas.height - playH) / 2;
        const nY = py + playH / 2;           // net / center line
        pickleCenters(courtType, width).forEach(cxFt => {
          const px = canvas.width / 2 + cxFt * T - playW / 2;
          const mx = px + playW / 2;
          // Outer playing boundary
          ctx.strokeRect(px, py, playW, playH);
          // Net center line
          ctx.beginPath(); ctx.moveTo(px, nY); ctx.lineTo(px + playW, nY); ctx.stroke();
          // Non-volley (kitchen) lines: 7' each side of net
          ctx.beginPath(); ctx.moveTo(px, nY - 7 * T); ctx.lineTo(px + playW, nY - 7 * T); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, nY + 7 * T); ctx.lineTo(px + playW, nY + 7 * T); ctx.stroke();
          // Center service line per half (not through the kitchen)
          ctx.beginPath(); ctx.moveTo(mx, py); ctx.lineTo(mx, nY - 7 * T); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(mx, nY + 7 * T); ctx.lineTo(mx, py + playH); ctx.stroke();
        });
      }

      if (linesConfig.multiSport && courtType === 'multi_sport') {
        // Draw both sets of lines
        ctx.strokeStyle = linesConfig.basketballColor || '#FFFFFF';
        // Simplified basketball lines
        ctx.strokeRect(inset, inset, courtW, courtH);
        const threePointRadius = Math.min(width * 0.35, 20) * TILE_SIZE;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height - inset, threePointRadius, Math.PI, 0, true);
        ctx.stroke();

        // Pickleball lines in different color
        ctx.strokeStyle = linesConfig.pickleballColor || '#FFD700';
        const kitchenDepth = 7 * TILE_SIZE;
        ctx.beginPath();
        ctx.moveTo(inset + courtW * 0.1, canvas.height / 2 - kitchenDepth / 2);
        ctx.lineTo(canvas.width - inset - courtW * 0.1, canvas.height / 2 - kitchenDepth / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(inset + courtW * 0.1, canvas.height / 2 + kitchenDepth / 2);
        ctx.lineTo(canvas.width - inset - courtW * 0.1, canvas.height / 2 + kitchenDepth / 2);
        ctx.stroke();
      }
    }

    // Draw logo
    if (logoUrl && logoConfig) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoScale = (logoConfig.scale || 50) / 100;
        const logoSize = Math.min(canvas.width, canvas.height) * 0.3 * logoScale;
        
        let logoX, logoY;
        switch (logoConfig.position) {
          case 'center':
            logoX = (canvas.width - logoSize) / 2;
            logoY = (canvas.height - logoSize) / 2;
            break;
          case 'baseline':
            logoX = (canvas.width - logoSize) / 2;
            logoY = canvas.height - logoSize - borderWidth * TILE_SIZE * 2;
            break;
          case 'corner':
            logoX = borderWidth * TILE_SIZE * 2;
            logoY = borderWidth * TILE_SIZE * 2;
            break;
          default:
            logoX = logoConfig.x || (canvas.width - logoSize) / 2;
            logoY = logoConfig.y || (canvas.height - logoSize) / 2;
        }

        ctx.save();
        ctx.translate(logoX + logoSize / 2, logoY + logoSize / 2);
        ctx.rotate((logoConfig.rotation || 0) * Math.PI / 180);
        ctx.drawImage(img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        ctx.restore();
      };
      img.src = logoUrl;
    }
  }, [width, length, colors, linesConfig, logoUrl, logoConfig, showTileGrid, courtType]);

  return (
    <div className={cn("relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 overflow-hidden", className)}>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm"
          onClick={() => setShowTileGrid(!showTileGrid)}
        >
          <Grid3X3 className={cn("h-4 w-4", showTileGrid && "text-[#3fb9ff]")} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm"
          onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm"
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm"
          onClick={() => setZoom(1)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-center min-h-[400px] overflow-auto">
        <div 
          className="relative shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
          style={{ 
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-xs text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {width}' × {length}' • {width * length} sq ft • {showTileGrid ? 'Grid ON' : 'Grid OFF'}
      </div>
    </div>
  );
}