import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TILE_SIZE = 12; // pixels per tile in preview

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

    // Draw accent zone (key area for basketball)
    if (courtType?.includes('basketball') && colors?.accent) {
      const keyWidth = Math.min(width * 0.4, 12);
      const keyLength = Math.min(length * 0.35, 19);
      const keyX = (width - keyWidth) / 2 * TILE_SIZE;
      const keyY = canvas.height - borderWidth * TILE_SIZE - keyLength * TILE_SIZE;
      
      ctx.fillStyle = colors.accent;
      ctx.fillRect(keyX, keyY, keyWidth * TILE_SIZE, keyLength * TILE_SIZE);

      // Half court key
      if (courtType === 'basketball_full') {
        ctx.fillRect(keyX, borderWidth * TILE_SIZE, keyWidth * TILE_SIZE, keyLength * TILE_SIZE);
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
        // Court boundary
        ctx.strokeRect(inset, inset, courtW, courtH);
        
        // Key measurements (regulation)
        const keyW = 12 * TILE_SIZE;
        const keyH = 19 * TILE_SIZE;
        const threePointRadius = 23.75 * TILE_SIZE;
        const freeThrowRadius = 6 * TILE_SIZE;
        const centerCircleRadius = 6 * TILE_SIZE;

        // Function to draw one end
        const drawBasketballEnd = (topY, isTop = false) => {
          // Key rectangle
          const keyX = (canvas.width - keyW) / 2;
          ctx.strokeRect(keyX, topY, keyW, keyH);

          // Free throw circle (full)
          ctx.beginPath();
          ctx.arc(canvas.width / 2, topY + keyH, freeThrowRadius, isTop ? 0 : Math.PI, isTop ? Math.PI : 0, false);
          ctx.stroke();

          // Free throw circle (dashed - back half)
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, topY + keyH, freeThrowRadius, isTop ? Math.PI : 0, isTop ? 0 : Math.PI, false);
          ctx.stroke();
          ctx.setLineDash([]);

          // Three-point line
          const arcCenterY = topY + keyH;
          const radius = Math.min(threePointRadius, 23.75 * TILE_SIZE);
          ctx.beginPath();
          if (isTop) {
            ctx.arc(canvas.width / 2, arcCenterY, radius, Math.PI, 0, true);
          } else {
            ctx.arc(canvas.width / 2, arcCenterY, radius, Math.PI, 0, false);
          }
          ctx.stroke();
        };

        // Draw baseline ends
        drawBasketballEnd(canvas.height - inset - keyH, false); // Bottom
        
        if (courtType === 'basketball_full') {
          // Center line
          ctx.beginPath();
          ctx.moveTo(inset, canvas.height / 2);
          ctx.lineTo(canvas.width - inset, canvas.height / 2);
          ctx.stroke();

          // Center circle
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, centerCircleRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Top end
          drawBasketballEnd(inset, true);
        }
      }

      if (linesConfig.pickleball && courtType?.includes('pickleball')) {
        // Court boundary
        ctx.strokeRect(inset, inset, courtW, courtH);
        
        // Center line
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, inset);
        ctx.lineTo(canvas.width / 2, canvas.height - inset);
        ctx.stroke();

        // Kitchen (non-volley zone) lines
        const kitchenDepth = 7 * TILE_SIZE;
        ctx.beginPath();
        ctx.moveTo(inset, canvas.height / 2 - kitchenDepth / 2);
        ctx.lineTo(canvas.width - inset, canvas.height / 2 - kitchenDepth / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(inset, canvas.height / 2 + kitchenDepth / 2);
        ctx.lineTo(canvas.width - inset, canvas.height / 2 + kitchenDepth / 2);
        ctx.stroke();

        // Service line (center)
        ctx.beginPath();
        ctx.moveTo(inset, canvas.height / 2);
        ctx.lineTo(canvas.width - inset, canvas.height / 2);
        ctx.stroke();
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