import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import Court3D from '@/components/builder/Court3D';
import CourtPreview from '@/components/ui/CourtPreview';
import {
  ChevronUp, ChevronDown, Home, Menu, Upload, X, Info,
  Check, ChevronLeft, ChevronRight, Zap, ShieldCheck, Sun, Moon, Ruler
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Color swatches ──────────────────────────────────────────────────────────
const SWATCHES = [
  { name: 'Black',        hex: '#1a1a1a' },
  { name: 'Charcoal',     hex: '#3E464A' },
  { name: 'Gray',         hex: '#8D9498' },
  { name: 'Forest Green', hex: '#1B5E20' },
  { name: 'Green',        hex: '#2E7D32' },
  { name: 'Olive',        hex: '#556B2F' },
  { name: 'Purple',       hex: '#6B21A8' },
  { name: 'Royal Blue',   hex: '#0061A0' },
  { name: 'Sky Blue',     hex: '#4FC3F7' },
  { name: 'Red',          hex: '#CB2D3E' },
  { name: 'Maroon',       hex: '#7B1C2F' },
  { name: 'Tan',          hex: '#C4A882' },
  { name: 'Orange',       hex: '#E85D04' },
  { name: 'Yellow',       hex: '#FFCC00' },
  { name: 'White',        hex: '#F5F5F5' },
  { name: 'Light Blue',   hex: '#90CAF9' },
];

const TILE_OPTIONS = [
  { id: 'game_outdoor', label: 'Game Outdoor', img: '/tiles/game-outdoor.webp', desc: 'Star-lattice pattern' },
  { id: 'active',       label: 'Active',       img: '/tiles/active.webp',       desc: 'Ribbed grip grooves' },
  { id: 'boost',        label: 'Boost',        img: '/tiles/boost.webp',        desc: 'Open-mesh design'   },
  { id: 'complete',     label: 'Complete',     img: '/tiles/complete.webp',     desc: 'Asterisk drain'     },
  { id: 'wood_grain',   label: 'Wood Grain',   img: '/tiles/wood-grain.webp',   desc: 'Maple look indoor'  },
];

const HOOP_OPTIONS = [
  { id: 'megaslam60', label: 'MegaSlam 60', img: '/tiles/megaslam60.png', desc: '60" Pro glass board' },
  { id: 'megaslam72', label: 'MegaSlam 72', img: '/tiles/megaslam72.png', desc: '72" Elite glass board' },
];

// ft → m conversion
const toMetric = ft => (ft * 0.3048).toFixed(2);
const fromMetric = m => Math.round(m / 0.3048);

// ─── Collapsible Panel ────────────────────────────────────────────────────────
function Panel({ title, children, defaultOpen = false, checked, onCheck }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-md border-none bg-[#2472B3] hover:bg-[#1e63a0] transition-colors"
      >
        <div className="flex items-center gap-2">
          {onCheck !== undefined && (
            <span
              onClick={e => { e.stopPropagation(); onCheck(!checked); }}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                checked ? 'bg-white border-white' : 'border-white/60'
              )}
            >
              {checked && <Check className="h-3 w-3 text-[#2472B3]" />}
            </span>
          )}
          <span className="text-white font-semibold text-sm tracking-wide">{title}</span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-white/80 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-white/80 flex-shrink-0" />
        }
      </button>
      {open && <div className="bg-white px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

// ─── Swatch picker ────────────────────────────────────────────────────────────
function SwatchPicker({ label, value, onChange }) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <span className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: value }} />
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {SWATCHES.map(s => (
          <button
            key={s.hex}
            title={s.name}
            onClick={() => onChange(s.hex)}
            style={{ backgroundColor: s.hex }}
            className={cn(
              'w-7 h-7 rounded-full border-2 transition-all hover:scale-110',
              value?.toLowerCase() === s.hex.toLowerCase()
                ? 'border-[#2472B3] scale-110 shadow-lg ring-2 ring-[#2472B3]/30'
                : 'border-white shadow-sm'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Logo defaults ────────────────────────────────────────────────────────────
const DEFAULT_LOGO = { url: null, vertical: 50, horizontal: 50, scale: 3, rotate: 0 };

// ─── Logo upload ──────────────────────────────────────────────────────────────
function LogoZone({ url, onChange }) {
  const ref = useRef();
  const handle = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div
      onClick={() => !url && ref.current?.click()}
      className={cn(
        'relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-32 transition-colors',
        url
          ? 'border-[#2472B3] bg-blue-50 cursor-default'
          : 'border-gray-300 bg-gray-50 hover:border-[#2472B3] hover:bg-blue-50 cursor-pointer'
      )}
    >
      {url ? (
        <>
          <img src={url} alt="logo" className="max-h-24 max-w-full object-contain p-2" />
          <button onClick={() => onChange(null)} className="absolute top-1 right-1 bg-white rounded-full shadow p-0.5 hover:bg-red-50">
            <X className="h-3.5 w-3.5 text-red-500" />
          </button>
        </>
      ) : (
        <>
          <Upload className="h-7 w-7 text-gray-400 mb-1" />
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Drop your LOGO here<br />
            <span className="text-[#2472B3] underline">or upload an image</span>
          </p>
        </>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
}

// ─── Sport panel ──────────────────────────────────────────────────────────────
function SportPanel({ sport, config, onChange }) {
  const isBasketball = sport === 'basketball';
  return (
    <div className="space-y-4">
      {isBasketball && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">Court Size</p>
          <div className="flex gap-2">
            {[['half', 'Half Courts'], ['full', 'Full Courts']].map(([v, label]) => (
              <button
                key={v}
                onClick={() => onChange({ ...config, size: v })}
                className={cn(
                  'flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all',
                  config.size === v
                    ? 'bg-[#2472B3] text-white border-[#2472B3]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#2472B3]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2">Orientation</p>
        <div className="flex gap-2">
          {[
            ['portrait',  <><ChevronUp className="h-3 w-3" /><ChevronDown className="h-3 w-3" /></>],
            ['landscape', <><ChevronLeft className="h-3 w-3" /><ChevronRight className="h-3 w-3" /></>],
          ].map(([v, icon]) => (
            <button
              key={v}
              onClick={() => onChange({ ...config, orientation: v })}
              className={cn(
                'flex-1 py-2 flex items-center justify-center gap-1 text-xs font-medium rounded-lg border-2 transition-all',
                config.orientation === v
                  ? 'bg-[#2472B3] text-white border-[#2472B3]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#2472B3]'
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <SwatchPicker
        label="Line Color"
        value={config.lineColor || '#F5F5F5'}
        onChange={hex => onChange({ ...config, lineColor: hex })}
      />
    </div>
  );
}

// ─── Dimension slider (debounced: visual updates live, rebuild only on release) ─
function DimSlider({ label, value, min, max, onCommit, metric }) {
  const [local, setLocal] = useState(value);
  // Keep local in sync when value changes externally (e.g. preset buttons)
  React.useEffect(() => { setLocal(value); }, [value]);

  const display = metric ? `${toMetric(local)} m` : `${local}'`;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-bold text-[#2472B3]">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={1} value={local}
        onChange={e => setLocal(+e.target.value)}
        onMouseUp={e => onCommit(+e.target.value)}
        onTouchEnd={e => onCommit(+e.target.valueAsNumber)}
        className="w-full accent-[#2472B3] cursor-pointer"
        style={{ height: '4px' }}
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{metric ? `${toMetric(min)}m` : `${min}'`}</span>
        <span>{metric ? `${toMetric(max)}m` : `${max}'`}</span>
      </div>
    </div>
  );
}

// ─── Default state ─────────────────────────────────────────────────────────────
const DEFAULT_DESIGN = {
  surface:    'outdoor',
  tileType:   'game_outdoor',
  width:      30,
  length:     47,
  colors: {
    main:   '#0061A0',
    border: '#3E464A',
    accent: '#9CA3AF',
    line:   '#F5F5F5',
  },
  logos:       [ {...DEFAULT_LOGO}, {...DEFAULT_LOGO}, {...DEFAULT_LOGO} ],
  activeLogo:  0,
  hoopVariant: 'megaslam60',
  hoopOffset:  0,
  bothEnds:    false,
  accessories: { netProtect: false, gameLight: false },
  sports: {
    basketball: { enabled: true,  size: 'half',   orientation: 'portrait', lineColor: '#F5F5F5' },
    pickleball: { enabled: false, size: 'single', orientation: 'portrait', lineColor: '#F5F5F5' },
    tennis:     { enabled: false, size: 'single', orientation: 'portrait', lineColor: '#F5F5F5' },
  },
};

// Build the starting design based on the ?sport= URL param (from the Court Select page)
function buildInitialDesign(sport) {
  const d = JSON.parse(JSON.stringify(DEFAULT_DESIGN));
  if (sport === 'pickleball') {
    d.sports.basketball.enabled = false;
    d.sports.pickleball.enabled = true;
    d.width = 30; d.length = 60;               // 30×60 surface → 20×44 regulation play
    d.colors.main = '#2E5A9E';
  } else if (sport === 'basketball') {
    d.sports.basketball.enabled = true;
    d.sports.pickleball.enabled = false;
    d.width = 30; d.length = 30;               // half court 30'×30'
  } else if (sport === 'multi' || sport === 'multi_sport') {
    d.sports.basketball.enabled = true;
    d.sports.pickleball.enabled = true;
    d.width = 50; d.length = 84;
  }
  return d;
}

const DEFAULT_PRICING = { price_per_sqft_base: 4.75 };

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Builder() {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const { data: pricingConfigs = [] } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => base44.entities.PricingConfig.list(),
  });
  const pricing = pricingConfigs[0] || DEFAULT_PRICING;

  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode]       = useState('3d');
  const [design, setDesign]           = useState(() => buildInitialDesign(searchParams.get('sport')));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode]       = useState(false);
  const [metric, setMetric]           = useState(false);
  const [showRuler, setShowRuler]     = useState(false);
  const [localHoopOffset, setLocalHoopOffset] = useState(0);

  const bball  = design.sports.basketball;
  const pickle = design.sports.pickleball;
  let courtType = 'custom';
  if (bball.enabled && pickle.enabled) {
    courtType = bball.size === 'full'
      ? 'multi_sport_full_basketball_pickleball'
      : 'multi_sport_half_basketball_pickleball';
  } else if (bball.enabled) {
    courtType = bball.size === 'full' ? 'basketball_full' : 'basketball_half';
  } else if (pickle.enabled) {
    courtType = pickle.size === 'dual' ? 'pickleball_dual' : 'pickleball_single';
  }

  const linesConfig = {
    basketball: bball.enabled,
    pickleball: pickle.enabled,
    color:      design.colors.line,
    thickness:  'standard',
  };

  const sqft     = design.width * design.length;
  const sqm      = (sqft * 0.0929).toFixed(1);
  const estPrice = Math.round(sqft * pricing.price_per_sqft_base);

  const setC   = p  => setDesign(d => ({ ...d, colors: { ...d.colors, ...p } }));
  const setSp  = (sp, p) => setDesign(d => ({ ...d, sports: { ...d.sports, [sp]: { ...d.sports[sp], ...p } } }));
  const setAcc = p  => setDesign(d => ({ ...d, accessories: { ...d.accessories, ...p } }));
  const setLogoField = (i, patch) => setDesign(d => {
    const logos = d.logos.map((lg, idx) => idx === i ? { ...DEFAULT_LOGO, ...lg, ...patch } : lg);
    return { ...d, logos };
  });
  const setLogo = (i, url) => setLogoField(i, { url });

  // Only structural props in the key — colors/tileType/lines update in-place via split effects
  const court3DKey = `3d-${courtType}-${design.hoopVariant}-${design.hoopOffset}-${design.bothEnds}-${design.accessories.netProtect}-${design.accessories.gameLight}-${design.width}-${design.length}-${darkMode}`;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      <SEO
        title="3D Court Designer — Coast to Coast Courts"
        description="Design your custom basketball or pickleball court in 3D."
        canonical="/builder"
      />

      {/* Header */}
      <header className="h-12 bg-white flex items-center justify-between px-4 z-20 border-b border-gray-200 flex-shrink-0">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <Home className="h-5 w-5 text-[#2472B3]" />
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png"
            alt="logo" className="h-8 w-8 object-contain"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <span className="font-bold text-[#2472B3] text-sm hidden sm:block tracking-wide">COURT DESIGNER</span>
        </Link>
        <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden p-2 rounded hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Viewport */}
        <div className="flex-1 relative overflow-hidden">

          {/* 2D / 3D toggle + ruler */}
          <div className="absolute top-3 left-3 z-10 flex gap-2">
          <div className="flex rounded-lg overflow-hidden shadow-lg border border-white/10">
            {['2d', '3d'].map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={cn(
                  'px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors',
                  viewMode === m
                    ? 'bg-[#2472B3] text-white'
                    : darkMode
                      ? 'bg-black/60 text-gray-300 hover:bg-black/80 backdrop-blur-sm'
                      : 'bg-white/70 text-gray-600 hover:bg-white backdrop-blur-sm'
                )}
              >{m}</button>
            ))}
          </div>
          {/* Ruler toggle */}
          <button
            onClick={() => setShowRuler(v => !v)}
            title="Toggle ruler"
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md border transition-all',
              showRuler
                ? 'bg-[#2472B3] text-white border-[#2472B3]'
                : darkMode ? 'bg-black/60 text-white/70 border-white/10 hover:bg-black/80' : 'bg-white/70 text-gray-600 border-black/10 hover:bg-white'
            )}
          >
            <Ruler className="h-4 w-4" />
          </button>
          </div>

          {viewMode === '3d' ? (
            <Court3D
              key={court3DKey}
              width={design.width}
              length={design.length}
              colors={design.colors}
              linesConfig={linesConfig}
              courtType={courtType}
              tileType={design.tileType}
              hoopVariant={design.sports.basketball.enabled ? design.hoopVariant : 'none'}
              hoopOffset={design.hoopOffset}
              bothEnds={design.bothEnds}
              showNetProtect={design.accessories.netProtect}
              showGameLight={design.accessories.gameLight}
              darkMode={darkMode}
              showRuler={showRuler}
              metric={metric}
              logos={design.logos}
              activeLogo={design.activeLogo}
              onDarkModeToggle={() => setDarkMode(v => !v)}
              className="w-full h-full"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 transition-colors"
              style={{ backgroundColor: darkMode ? '#0d1f35' : '#eef2f5' }}
            >
              <CourtPreview
                width={design.width}
                length={design.length}
                colors={design.colors}
                linesConfig={linesConfig}
                logoUrl={design.logos[design.activeLogo]?.url}
                courtType={courtType}
                showGrid={false}
                className="max-w-2xl w-full"
              />
            </div>
          )}

          {/* Info bar */}
          <div className={cn(
            'absolute bottom-3 left-3 z-10 text-xs px-3 py-2 rounded-lg backdrop-blur-md',
            darkMode ? 'bg-black/55 text-white' : 'bg-white/70 text-gray-800'
          )}>
            {metric
              ? `${toMetric(design.width)}m × ${toMetric(design.length)}m • ${sqm} m²`
              : `${design.width}' × ${design.length}' • ${sqft.toLocaleString()} sq ft`
            }
            &nbsp;•&nbsp; Est.&nbsp;
            <strong className="text-yellow-400">${estPrice.toLocaleString()}</strong>
          </div>

          {/* Dark/Light badge (2D mode only — 3D has its own button) */}
          {viewMode === '2d' && (
            <button
              onClick={() => setDarkMode(v => !v)}
              className={cn(
                'absolute top-3 right-3 z-10 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md border transition-all',
                darkMode ? 'bg-black/60 text-white border-white/10' : 'bg-white/80 text-gray-800 border-black/10'
              )}
              title={darkMode ? 'Light background' : 'Dark background'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Sidebar */}
        <aside className={cn(
          'bg-white flex-col overflow-y-auto flex-shrink-0 transition-all p-3',
          sidebarOpen ? 'w-72 flex' : 'w-0 overflow-hidden hidden ',
          'lg:w-72 lg:flex'
        )}>

          {/* SURFACE */}
          <Panel title="Surface" defaultOpen>
            <div className="space-y-3">
              <select
                value={design.surface}
                onChange={e => setDesign(d => ({ ...d, surface: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2472B3]"
              >
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
                <option value="garage">Garage</option>
              </select>

              <p className="text-xs text-gray-500 font-medium">Tile Type</p>
              <div className="grid grid-cols-2 gap-2">
                {TILE_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setDesign(d => ({ ...d, tileType: t.id }))}
                    className={cn(
                      'relative rounded-xl border-2 overflow-hidden transition-all text-left',
                      design.tileType === t.id
                        ? 'border-[#2472B3] shadow-md'
                        : 'border-gray-200 hover:border-[#2472B3]/50'
                    )}
                  >
                    <img src={t.img} alt={t.label} className="w-full h-14 object-cover" />
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-gray-700 leading-tight">{t.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{t.desc}</p>
                    </div>
                    {design.tileType === t.id && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-[#2472B3] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* SIZE */}
          <Panel title="Size">
            <div className="space-y-4">
              {/* Metric / Imperial toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className={cn('text-xs font-semibold', !metric ? 'text-[#2472B3]' : 'text-gray-400')}>Imperial</span>
                <button
                  onClick={() => setMetric(v => !v)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors mx-2',
                    metric ? 'bg-[#2472B3]' : 'bg-gray-300'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    metric ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
                <span className={cn('text-xs font-semibold', metric ? 'text-[#2472B3]' : 'text-gray-400')}>Metric</span>
              </div>

              {/* Ruler / dimension annotations toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-600">Show Dimensions</span>
                </div>
                <button
                  onClick={() => setShowRuler(v => !v)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors',
                    showRuler ? 'bg-[#2472B3]' : 'bg-gray-300'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    showRuler ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>

              <DimSlider
                label="Width"
                value={design.width}
                min={10} max={150}
                onCommit={v => setDesign(d => ({ ...d, width: v }))}
                metric={metric}
              />
              <DimSlider
                label="Length"
                value={design.length}
                min={10} max={200}
                onCommit={v => setDesign(d => ({ ...d, length: v }))}
                metric={metric}
              />

              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-[#2472B3] flex items-start gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  {metric
                    ? `${sqm} m² • each tile = 0.09 m²`
                    : `${sqft.toLocaleString()} sq ft • each tile = 1 sq ft`
                  }
                </span>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Half Bball',  w: 30, l: 30  },
                  { label: 'Full Bball',  w: 50, l: 94  },
                  { label: 'Pickleball', w: 30, l: 60  },
                  { label: 'Multi-Sport', w: 50, l: 84  },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setDesign(d => ({ ...d, width: p.w, length: p.l }))}
                    className={cn(
                      'text-xs py-1.5 px-2 rounded-lg border leading-tight transition-colors',
                      design.width === p.w && design.length === p.l
                        ? 'bg-[#2472B3] text-white border-[#2472B3]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#2472B3]'
                    )}
                  >
                    {p.label}<br />
                    <span className="font-normal opacity-70">
                      {metric ? `${toMetric(p.w)}×${toMetric(p.l)}m` : `${p.w}×${p.l}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* COLORS */}
          <Panel title="Colors">
            <div className="space-y-4">
              <SwatchPicker label="Main Court"        value={design.colors.main}   onChange={hex => setC({ main: hex })} />
              <SwatchPicker label="Border / Surround" value={design.colors.border} onChange={hex => setC({ border: hex })} />
              <SwatchPicker label="Accent / Key Zone" value={design.colors.accent} onChange={hex => setC({ accent: hex })} />
              <SwatchPicker label="Line Color"        value={design.colors.line}   onChange={hex => setC({ line: hex })} />
              <div className="h-3 rounded-full overflow-hidden flex shadow-inner border border-gray-100">
                <div className="w-6" style={{ backgroundColor: design.colors.border }} />
                <div className="flex-1" style={{ backgroundColor: design.colors.main }} />
                <div className="w-6" style={{ backgroundColor: design.colors.accent }} />
                <div className="w-6" style={{ backgroundColor: design.colors.border }} />
              </div>
            </div>
          </Panel>

          {/* LOGO */}
          <Panel title="Logo">
            <div className="space-y-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <button
                    key={i}
                    onClick={() => setDesign(d => ({ ...d, activeLogo: i }))}
                    className={cn(
                      'flex-1 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all',
                      design.activeLogo === i
                        ? 'bg-[#2472B3] text-white border-[#2472B3]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#2472B3]'
                    )}
                  >
                    Logo {i + 1}
                  </button>
                ))}
              </div>
              <LogoZone
                url={design.logos[design.activeLogo]?.url}
                onChange={url => setLogo(design.activeLogo, url)}
              />
              <p className="text-xs text-gray-400 text-center">PNG / SVG with transparent background</p>

              {design.logos[design.activeLogo]?.url && (() => {
                const lg = design.logos[design.activeLogo];
                const set = patch => setLogoField(design.activeLogo, patch);
                const rows = [
                  { key: 'vertical',   label: 'Vertical',   suffix: '%', min: 0,   max: 100, step: 1   },
                  { key: 'horizontal', label: 'Horizontal', suffix: '%', min: 0,   max: 100, step: 1   },
                  { key: 'scale',      label: 'Scale',      suffix: '',  min: 0.5, max: 12,  step: 0.5 },
                  { key: 'rotate',     label: 'Rotate',     suffix: '°', min: 0,   max: 360, step: 1   },
                ];
                return (
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={() => set({ rotate: ((lg.rotate || 0) + 90) % 360 })}
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-[#2472B3] text-white hover:bg-[#1d5f96] transition-colors"
                    >
                      Rotate 90°
                    </button>
                    {rows.map(r => (
                      <div key={r.key}>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>{r.label}</span><span>{lg[r.key]}{r.suffix}</span>
                        </div>
                        <input
                          type="range" min={r.min} max={r.max} step={r.step} value={lg[r.key]}
                          onChange={e => set({ [r.key]: Number(e.target.value) })}
                          className="w-full accent-[#2472B3] cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </Panel>

          {/* BASKETBALL */}
          {/* <Panel title="Basketball" checked={design.sports.basketball.enabled} onCheck={v => setSp('basketball', { enabled: v })}>
            <SportPanel sport="basketball" config={design.sports.basketball} onChange={cfg => setSp('basketball', cfg)} />
          </Panel>

          <Panel title="Pickleball" checked={design.sports.pickleball.enabled} onCheck={v => setSp('pickleball', { enabled: v })}>
            <SportPanel sport="pickleball" config={design.sports.pickleball} onChange={cfg => setSp('pickleball', cfg)} />
          </Panel>

          <Panel title="Tennis" checked={design.sports.tennis.enabled} onCheck={v => setSp('tennis', { enabled: v })}>
            <SportPanel sport="tennis" config={design.sports.tennis} onChange={cfg => setSp('tennis', cfg)} />
          </Panel> */}

          {/* HOOP */}
          <Panel title="Hoop">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {HOOP_OPTIONS.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setDesign(d => ({ ...d, hoopVariant: d.hoopVariant === h.id ? 'none' : h.id }))}
                    className={cn(
                      'relative rounded-xl border-2 overflow-hidden transition-all text-left',
                      design.hoopVariant === h.id
                        ? 'border-[#2472B3] shadow-md'
                        : 'border-gray-200 hover:border-[#2472B3]/50'
                    )}
                  >
                    <img src={h.img} alt={h.label} className="w-full h-24 object-contain bg-gray-50 p-1" />
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-bold text-gray-800">{h.label}</p>
                      <p className="text-[10px] text-gray-400">{h.desc}</p>
                    </div>
                    {design.hoopVariant === h.id && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-[#2472B3] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {design.hoopVariant !== 'none' && (
                <>
                  <button
                    onClick={() => setDesign(d => ({ ...d, bothEnds: !d.bothEnds }))}
                    className={cn(
                      'w-full py-2 text-xs font-semibold rounded-lg border-2 transition-all',
                      design.bothEnds
                        ? 'bg-[#2472B3] text-white border-[#2472B3]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#2472B3]'
                    )}
                  >
                    {design.bothEnds ? '✓ Both Ends' : 'One End Only'}
                  </button>

                  {/* Hoop position slider */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Hoop Position</span>
                      <span className="text-xs font-bold text-[#2472B3]">
                        {localHoopOffset > 0 ? `+${localHoopOffset}` : localHoopOffset} ft
                      </span>
                    </div>
                    <input
                      type="range" min={-6} max={6} step={0.5}
                      value={localHoopOffset}
                      onChange={e => setLocalHoopOffset(+e.target.value)}
                      onMouseUp={e => setDesign(d => ({ ...d, hoopOffset: +e.target.value }))}
                      onTouchEnd={e => setDesign(d => ({ ...d, hoopOffset: +e.target.valueAsNumber }))}
                      className="w-full accent-[#2472B3] cursor-pointer"
                      style={{ height: '4px' }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>← Back</span>
                      <span>Forward →</span>
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={() => setDesign(d => ({ ...d, hoopVariant: 'none' }))}
                className={cn(
                  'w-full py-1.5 text-xs rounded-lg border transition-all',
                  design.hoopVariant === 'none'
                    ? 'bg-gray-100 text-gray-400 border-gray-200'
                    : 'bg-white text-red-500 border-red-200 hover:bg-red-50'
                )}
              >
                {design.hoopVariant === 'none' ? 'No hoop selected' : 'Deselect hoop'}
              </button>
            </div>
          </Panel>

          {/* ACCESSORIES */}
          <Panel title="Accessories">
            <div className="space-y-3">
              {[
                { key: 'netProtect', label: 'Net Protect', img: '/tiles/net-protect.jpg', desc: 'Ball containment system' },
                // Game Light option disabled per request — keep for future use:
                // { key: 'gameLight',  label: 'Game Light',  img: '/tiles/game-light.jpg',  desc: 'LED court floodlights'  },
              ].map(acc => (
                <button
                  key={acc.key}
                  onClick={() => setAcc({ [acc.key]: !design.accessories[acc.key] })}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border-2 overflow-hidden transition-all text-left',
                    design.accessories[acc.key]
                      ? 'border-[#2472B3] bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-[#2472B3]/50'
                  )}
                >
                  <img src={acc.img} alt={acc.label} className="w-16 h-16 object-cover flex-shrink-0" />
                  <div className="flex-1 py-2 pr-2">
                    <p className="text-sm font-bold text-gray-800">{acc.label}</p>
                    <p className="text-xs text-gray-400">{acc.desc}</p>
                  </div>
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 border-2',
                    design.accessories[acc.key] ? 'bg-[#2472B3] border-[#2472B3]' : 'border-gray-200'
                  )}>
                    {design.accessories[acc.key] && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          {/* CTA */}
          <div className="mt-auto p-4 flex flex-col gap-3 bg-white border-t border-gray-200">
            <button
              onClick={() => {
                const params = new URLSearchParams({ design: JSON.stringify({ ...design, courtType }) });
                window.location.href = createPageUrl('Summary') + '?' + params.toString();
              }}
              className="w-full bg-[#E8600A] hover:bg-[#d45508] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Submit Inquiry
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'court-design.json';
                a.click();
              }}
              className="w-full border-2 border-[#2472B3] text-[#2472B3] font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Save Design
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
