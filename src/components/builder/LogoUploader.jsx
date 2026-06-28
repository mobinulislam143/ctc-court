import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, RotateCw, Move, ZoomIn, Loader2 } from 'lucide-react';

export default function LogoUploader({ 
  logoUrl,
  logoConfig,
  onLogoChange,
  onConfigChange,
  onEnableAddon,
  className 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const removeWhiteBackground = useCallback((file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(file);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const w = canvas.width;
          const h = canvas.height;

          // Sample background color from the 4 corners
          const cornerPixels = [
            [data[0], data[1], data[2]],           // top-left
            [data[(w - 1) * 4], data[(w - 1) * 4 + 1], data[(w - 1) * 4 + 2]],  // top-right
            [data[(h - 1) * w * 4], data[(h - 1) * w * 4 + 1], data[(h - 1) * w * 4 + 2]],  // bottom-left
            [data[((h - 1) * w + w - 1) * 4], data[((h - 1) * w + w - 1) * 4 + 1], data[((h - 1) * w + w - 1) * 4 + 2]], // bottom-right
          ];
          const bgR = Math.round(cornerPixels.reduce((s, p) => s + p[0], 0) / 4);
          const bgG = Math.round(cornerPixels.reduce((s, p) => s + p[1], 0) / 4);
          const bgB = Math.round(cornerPixels.reduce((s, p) => s + p[2], 0) / 4);

          // Flood-fill from corners using a tolerance-based approach
          const tolerance = 40;
          const visited = new Uint8Array(w * h);
          const queue = [];

          const colorMatch = (idx) => {
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            return Math.abs(r - bgR) <= tolerance && Math.abs(g - bgG) <= tolerance && Math.abs(b - bgB) <= tolerance;
          };

          // Seed from all 4 corners
          [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].forEach(([x, y]) => {
            const idx = y * w + x;
            if (!visited[idx]) { visited[idx] = 1; queue.push(idx); }
          });

          while (queue.length > 0) {
            const pos = queue.pop();
            const x = pos % w;
            const y = Math.floor(pos / w);
            const pixelIdx = pos * 4;

            if (!colorMatch(pixelIdx)) continue;
            data[pixelIdx + 3] = 0; // make transparent

            const neighbors = [];
            if (x > 0) neighbors.push(pos - 1);
            if (x < w - 1) neighbors.push(pos + 1);
            if (y > 0) neighbors.push(pos - w);
            if (y < h - 1) neighbors.push(pos + w);

            for (const n of neighbors) {
              if (!visited[n]) { visited[n] = 1; queue.push(n); }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          URL.revokeObjectURL(url);
          
          canvas.toBlob((blob) => resolve(blob || file), 'image/png');
        } catch (e) {
          URL.revokeObjectURL(url);
          resolve(file);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  }, []);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;
    
    const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, SVG, or JPG file.');
      return;
    }

    setIsUploading(true);
    try {
      // Try to remove white background, fall back to original file on any issue
      let fileToUpload = file;
      try {
        if (file.type !== 'image/svg+xml') {
          const processed = await removeWhiteBackground(file);
          // Wrap blob back into a File so the upload API accepts it
          if (processed instanceof Blob && !(processed instanceof File)) {
            fileToUpload = new File([processed], file.name, { type: 'image/png' });
          } else {
            fileToUpload = processed;
          }
        }
      } catch (bgError) {
        console.warn('Background removal failed, using original:', bgError);
        fileToUpload = file;
      }
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file: fileToUpload });
      onLogoChange(file_url);
      onConfigChange({
        position: 'center',
        scale: 50,
        rotation: 0,
      });
      if (onEnableAddon) {
        onEnableAddon(true);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onLogoChange, onConfigChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  }, [handleUpload]);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    handleUpload(file);
  };

  const removeLogo = () => {
    onLogoChange(null);
    onConfigChange(null);
    if (onEnableAddon) {
      onEnableAddon(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Zone */}
      {!logoUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
            dragOver 
              ? "border-[#3fb9ff] bg-[#3fb9ff]/5" 
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <input
            type="file"
            accept=".png,.svg,.jpg,.jpeg"
            onChange={handleFileInput}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            {isUploading ? (
              <Loader2 className="h-12 w-12 mx-auto text-[#3fb9ff] animate-spin mb-4" />
            ) : (
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
            )}
            <p className="font-semibold text-slate-800 mb-1">
              {isUploading ? 'Uploading...' : 'Drop your logo here'}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              PNG, SVG, or JPG • Transparent backgrounds work best
            </p>
            <Button variant="outline" className="pointer-events-none">
              <ImageIcon className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </label>
        </div>
      ) : (
        <>
          {/* Logo Preview */}
          <Card className="p-4 bg-slate-50 border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center">
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Logo Uploaded</p>
                  <p className="text-sm text-slate-500">Adjust position below</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={removeLogo}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Position */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Move className="h-4 w-4" />
              Position
            </Label>
            <RadioGroup
              value={logoConfig?.position || 'center'}
              onValueChange={(v) => onConfigChange({ ...logoConfig, position: v })}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { value: 'center', label: 'Center Court' },
                { value: 'baseline', label: 'Baseline' },
                { value: 'corner', label: 'Corner' },
              ].map((pos) => (
                <label
                  key={pos.value}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all border-2 text-center",
                    logoConfig?.position === pos.value
                      ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <RadioGroupItem value={pos.value} className="sr-only" />
                  <span className="text-sm font-medium">{pos.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Scale */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <ZoomIn className="h-4 w-4" />
              Size: {logoConfig?.scale || 50}%
            </Label>
            <Slider
              value={[logoConfig?.scale || 50]}
              min={10}
              max={100}
              step={5}
              onValueChange={([v]) => onConfigChange({ ...logoConfig, scale: v })}
            />
          </div>

          {/* Rotation */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              Rotation: {logoConfig?.rotation || 0}°
            </Label>
            <Slider
              value={[logoConfig?.rotation || 0]}
              min={0}
              max={360}
              step={15}
              onValueChange={([v]) => onConfigChange({ ...logoConfig, rotation: v })}
            />
          </div>
        </>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center italic">
        Logo prints/inlays are finalized after proof approval. Minor adjustments may be required for best results.
      </p>
    </div>
  );
}