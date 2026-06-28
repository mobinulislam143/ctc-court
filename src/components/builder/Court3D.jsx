import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, Lock, Unlock, ZoomIn, ZoomOut, Sun, Moon, Ruler } from 'lucide-react';

const CTC_LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png';

// ── Tile canvas (procedural, grayscale) ───────────────────────────────────────
function makeTileCanvas(tileType, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const T = size, g = Math.max(4, Math.round(T * 0.055));
  const cx = T/2, cy = T/2, i1 = g, i2 = T - g;
  ctx.fillStyle = '#484848'; ctx.fillRect(0,0,T,T);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(i1,i1,i2-i1,i2-i1);
  ctx.strokeStyle = '#484848';
  ctx.lineWidth = Math.max(2, g*0.9); ctx.lineCap = 'round';
  if (tileType === 'game_outdoor') {
    [[cx,i1],[i2,i1],[i2,cy],[i2,i2],[cx,i2],[i1,i2],[i1,cy],[i1,i1]].forEach(([tx,ty])=>{
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(tx,ty); ctx.stroke();
    });
  } else if (tileType === 'active') {
    for(let k=1;k<5;k++){const y=i1+(i2-i1)*k/5;ctx.beginPath();ctx.moveTo(i1,y);ctx.lineTo(i2,y);ctx.stroke();}
  } else if (tileType === 'boost') {
    const st=(i2-i1)/3;
    for(let k=1;k<3;k++){const p=i1+st*k;ctx.beginPath();ctx.moveTo(p,i1);ctx.lineTo(p,i2);ctx.stroke();ctx.beginPath();ctx.moveTo(i1,p);ctx.lineTo(i2,p);ctx.stroke();}
    ctx.fillStyle='#484848';
    [i1+st,i1+st*2].forEach(px=>[i1+st,i1+st*2].forEach(py=>{ctx.beginPath();ctx.arc(px,py,T*0.045,0,Math.PI*2);ctx.fill();}));
  } else if (tileType === 'complete') {
    for(let k=0;k<6;k++){const a=(k/6)*Math.PI*2-Math.PI/6;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*(T/2-g),cy+Math.sin(a)*(T/2-g));ctx.stroke();}
    ctx.fillStyle='#484848';ctx.beginPath();ctx.arc(cx,cy,T*0.1,0,Math.PI*2);ctx.fill();
  } else if (tileType === 'wood_grain') {
    for(let k=1;k<4;k++){const y=i1+(i2-i1)*k/4;ctx.beginPath();ctx.moveTo(i1,y);ctx.lineTo(i2,y);ctx.stroke();}
    ctx.setLineDash([T*0.2,T*0.8]);ctx.beginPath();ctx.moveTo(cx+T*0.18,i1);ctx.lineTo(cx+T*0.18,i2);ctx.stroke();ctx.setLineDash([]);
  }
  return c;
}

function makeTileTexture(tileType, cW, cH, renderer) {
  const canvas = makeTileCanvas(tileType, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(Math.max(0.1, cW/1.5), Math.max(0.1, cH/1.5));
  tex.anisotropy = renderer ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16) : 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// ── Lines canvas ──────────────────────────────────────────────────────────────
function drawLinesCanvas(width, length, colors, linesConfig, courtType) {
  const T = 32;
  const canvas = document.createElement('canvas');
  canvas.width  = Math.round(width  * T);
  canvas.height = Math.round(length * T);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = linesConfig?.color || colors?.line || '#ffffff';
  ctx.lineWidth = Math.max(2, T*0.09);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (courtType && courtType.includes('basketball')) {
    const kW = Math.min(12, width*0.28)*T, kH = Math.min(19, length*0.27)*T;
    const kx = (W-kW)/2, ftR = 6*T, tpR = Math.min(23.75*T, W*0.46);
    ctx.strokeRect(2,2,W-4,H-4);
    ctx.strokeRect(kx,H-kH,kW,kH);
    ctx.beginPath();ctx.arc(W/2,H-kH,ftR,Math.PI,0);ctx.stroke();
    ctx.setLineDash([T*0.7,T*0.45]);
    ctx.beginPath();ctx.arc(W/2,H-kH,ftR,0,Math.PI);ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(W/2,H,tpR,-Math.PI,0);ctx.stroke();
    ctx.beginPath();ctx.arc(W/2,H-5.25*T,0.75*T,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(W/2,H-5.25*T,4*T,-Math.PI,0);ctx.stroke();
    if (courtType === 'basketball_full') {
      ctx.beginPath();ctx.moveTo(2,H/2);ctx.lineTo(W-2,H/2);ctx.stroke();
      ctx.beginPath();ctx.arc(W/2,H/2,6*T,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(W/2,H/2,2*T,0,Math.PI*2);ctx.stroke();
      ctx.strokeRect(kx,0,kW,kH);
      ctx.beginPath();ctx.arc(W/2,kH,ftR,0,Math.PI);ctx.stroke();
      ctx.setLineDash([T*0.7,T*0.45]);
      ctx.beginPath();ctx.arc(W/2,kH,ftR,Math.PI,0);ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(W/2,0,tpR,0,Math.PI,true);ctx.stroke();
      ctx.beginPath();ctx.arc(W/2,5.25*T,0.75*T,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(W/2,5.25*T,4*T,0,Math.PI,true);ctx.stroke();
    }
  }
  if (courtType && courtType.includes('pickleball')) {
    ctx.strokeRect(2,2,W-4,H-4);
    const nY=H/2;
    [[2,nY-7*T,W-2,nY-7*T],[2,nY+7*T,W-2,nY+7*T],[2,nY,W-2,nY],[W/2,nY-7*T,W/2,2],[W/2,nY+7*T,W/2,H-2]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    });
  }
  return canvas;
}

// ── Net canvas (fine grid for net-protect mesh) ───────────────────────────────
function makeNetCanvas(cellsX = 30, cellsY = 20) {
  const W = 512, H = 340;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = 'rgba(100,100,100,0.95)';
  ctx.lineWidth = 1.5;
  for (let i=0; i<=cellsX; i++) { const x=i/cellsX*W; ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
  for (let i=0; i<=cellsY; i++) { const y=i/cellsY*H; ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
  return c;
}

// ── 3D Geometry helpers ───────────────────────────────────────────────────────
function makePipe(parent, mat, from, to, radius = 0.1) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  if (len < 0.01) return;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 8, 1), mat);
  mesh.position.copy(from).lerp(to, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize());
  mesh.castShadow = true;
  parent.add(mesh);
}

function makeBox(parent, mat, w, h, d, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
  m.position.set(x,y,z); m.castShadow = true; parent.add(m);
  return m;
}

// ── Basketball net ────────────────────────────────────────────────────────────
function createNet(rimRadius = 0.75) {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({color:0xdddddd, transparent:true, opacity:0.85});
  const V=14, H=7, height=1.7, botR=rimRadius*0.28;
  for(let i=0;i<V;i++){
    const a=(i/V)*Math.PI*2, pts=[];
    for(let h=0;h<=H;h++){const t=h/H,r=rimRadius*(1-t)+botR*t,bow=Math.sin(t*Math.PI)*0.1;pts.push(new THREE.Vector3(Math.cos(a)*(r+bow),-t*height,Math.sin(a)*(r+bow)));}
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));
  }
  for(let h=0;h<=H;h++){
    const t=h/H,r=rimRadius*(1-t)+botR*t,bow=Math.sin(t*Math.PI)*0.1,y=-t*height,pts=[];
    for(let i=0;i<=32;i++){const a=(i/32)*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*(r+bow),y,Math.sin(a)*(r+bow)));}
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));
  }
  return g;
}

// ── Professional basketball hoop (double-arm parallelogram design) ────────────
// Matches real Megaslam/in-ground systems:
//   TWO parallel horizontal arms from pole → vertical board bracket.
//   No diagonal brace — the parallelogram linkage is self-rigid.
function buildHoop(scene, zPos, D, hoopOffset = 0, variant = 60) {
  const S = variant === 72 ? 1.1 : 1.0;
  const g = new THREE.Group();

  const matPole  = new THREE.MeshStandardMaterial({color:0x0e0e0e, roughness:0.12, metalness:0.95, envMapIntensity:1.2});
  const matRim   = new THREE.MeshStandardMaterial({color:0xdd2200, roughness:0.45, metalness:0.35});
  const matGlass = new THREE.MeshStandardMaterial({color:0xc4d8ee, transparent:true, opacity:0.20, roughness:0.02, side:THREE.DoubleSide});
  const matWhite = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.92, side:THREE.DoubleSide});

  // ── Pole ──────────────────────────────────────────────────────────────────
  const PW = 0.38*S;   // pole width — thick square post
  const PH = 14.5;     // total pole height (ft)

  // Wide base plate at ground
  makeBox(g, matPole, PW*4.2, 0.22, PW*4.2, 0, 0.11, 0);
  // Thicker base collar (first 2 ft)
  makeBox(g, matPole, PW*1.75, 2.0, PW*1.75, 0, 1.0, 0);
  // Main shaft (above collar to top)
  makeBox(g, matPole, PW, PH-2.0, PW, 0, 2.0+(PH-2.0)/2, 0);
  // Pole cap
  makeBox(g, matPole, PW*1.25, 0.18, PW*1.25, 0, PH+0.09, 0);

  // ── Double-arm parallelogram system ───────────────────────────────────────
  //
  //  POLE ──────────── UPPER ARM ──────────── [BOARD BRACKET]
  //       ──────────── LOWER ARM ────────────
  //
  // Both arms are IDENTICAL length, PERFECTLY HORIZONTAL, PARALLEL.
  // No diagonal brace — the bracket at the board end closes the parallelogram.

  const ARM_W   = PW * 0.88;  // arm cross-section (square tubing)
  const ARM_LEN = 4.8;        // arm length (ft, how far arm reaches toward court)
  const ARM_Z   = D * ARM_LEN;// arm tip Z (local group space)

  // Upper arm — exits near top of pole
  const UA_Y = PH - 1.0;     // upper arm center Y
  makeBox(g, matPole, ARM_W, ARM_W, ARM_LEN, 0, UA_Y, D*ARM_LEN/2);

  // Lower arm — exits ~2.8 ft below upper arm
  const LA_Y = UA_Y - 2.8;   // lower arm center Y
  makeBox(g, matPole, ARM_W, ARM_W, ARM_LEN, 0, LA_Y, D*ARM_LEN/2);

  // Pole-side connection plates (horizontal gussets where arms bolt to pole)
  makeBox(g, matPole, PW*1.7, 0.18, ARM_W*1.0, 0, UA_Y, D*0.28);
  makeBox(g, matPole, PW*1.7, 0.18, ARM_W*1.0, 0, LA_Y, D*0.28);
  // Side bolt nubs (cosmetic, visible on pole face)
  [-PW*0.7, PW*0.7].forEach(x => {
    makeBox(g, matPole, 0.10, 0.10, 0.10, x, UA_Y, D*0.28);
    makeBox(g, matPole, 0.10, 0.10, 0.10, x, LA_Y, D*0.28);
  });

  // ── Board bracket (vertical column at arm tips) ───────────────────────────
  // Connects upper arm tip to lower arm tip — closes the parallelogram.
  const BB_H = (UA_Y + ARM_W/2) - (LA_Y - ARM_W/2); // full span incl. arm thickness
  makeBox(g, matPole, ARM_W*0.95, BB_H, ARM_W*0.95, 0, (UA_Y+LA_Y)/2, ARM_Z);

  // Small end caps where arms meet bracket
  makeBox(g, matPole, ARM_W*1.3, 0.18, ARM_W*1.3, 0, UA_Y, ARM_Z);
  makeBox(g, matPole, ARM_W*1.3, 0.18, ARM_W*1.3, 0, LA_Y, ARM_Z);

  // ── Backboard ─────────────────────────────────────────────────────────────
  const RIM_H = 10.0;          // standard 10 ft rim height
  const BH = 3.5*S, BW = 6.0*S;
  const BY = RIM_H + BH/2 + 0.1; // board center Y ≈ 11.85 ft
  const BZ = ARM_Z;              // board sits at arm tip (same Z as bracket)

  // Backboard glass panel
  const board = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, 0.07), matGlass);
  board.position.set(0, BY, BZ); g.add(board);

  // Board outer frame (4 rectangular black bars)
  const FW = 0.10;
  [[BW+FW, FW,    FW,    0,     BY+BH/2, BZ],
   [BW+FW, FW,    FW,    0,     BY-BH/2, BZ],
   [FW,    BH+FW, FW,    -BW/2, BY,      BZ],
   [FW,    BH+FW, FW,     BW/2, BY,      BZ]].forEach(([w,h,d,x,y,z]) =>
    makeBox(g, matPole, w,h,d, x,y,z));

  // White target rectangle (24"×18" inner box, inset from frame)
  const TW=2.0*S, TH=1.5*S, TY=BY-0.06, TZ=BZ+0.04*D;
  [[TW, FW, FW, 0,     TY+TH/2, TZ],
   [TW, FW, FW, 0,     TY-TH/2, TZ],
   [FW, TH, FW, -TW/2, TY,      TZ],
   [FW, TH, FW,  TW/2, TY,      TZ]].forEach(([w,h,d,x,y,z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), matWhite);
    m.position.set(x,y,z); g.add(m);
  });

  // ── Rim assembly ──────────────────────────────────────────────────────────
  const RIM_R = 0.75;             // 18" standard
  const RIM_Z = BZ + D * 1.5;    // rim extends from board FRONT face toward court

  // J-bracket: horizontal bar from board front face to rim
  makeBox(g, matPole, PW*0.85, 0.15, 1.6, 0, RIM_H+0.08, BZ+D*0.82);
  // Upright tab at board front face
  makeBox(g, matPole, PW*0.65, 0.55, PW*0.65, 0, RIM_H+0.36, BZ+D*0.04);

  // Rim torus — standard 18" diameter, 1.5" round tube
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RIM_R, 0.055, 12, 48), matRim);
  rim.rotation.x = Math.PI/2; rim.position.set(0, RIM_H, RIM_Z); g.add(rim);

  // Animated net
  const net = createNet(RIM_R);
  net.position.set(0, RIM_H, RIM_Z); g.add(net);

  g.position.set(0, 0, zPos + D*hoopOffset);
  scene.add(g);
  return net;
}

// ── Net protect (backdrop cage behind hoop) ───────────────────────────────────
function buildNetProtect(scene, zPos, D, courtWidth) {
  const g = new THREE.Group();
  const matPole = new THREE.MeshStandardMaterial({color:0x1e1e1e, roughness:0.3, metalness:0.7});

  const NET_H = 12;        // height (ft)
  const NET_W = courtWidth + 8; // wider than court
  const POLE_R = 0.22;

  // Two outer poles
  [-NET_W/2, NET_W/2].forEach(x => {
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R, POLE_R*1.2, NET_H+0.5, 10), matPole);
    pole.position.set(x, (NET_H+0.5)/2, 0); pole.castShadow = true; g.add(pole);
    // Base plate
    makeBox(g, matPole, POLE_R*5, 0.3, POLE_R*5, x, 0.15, 0);
  });

  // Top horizontal bar (tube)
  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R*0.7, POLE_R*0.7, NET_W, 8), matPole);
  topBar.rotation.z = Math.PI/2; topBar.position.set(0, NET_H+0.25, 0); topBar.castShadow = true; g.add(topBar);

  // Net mesh (two panels, split at center pole hole)
  const netCanvas = makeNetCanvas(40, 26);
  const netTex = new THREE.CanvasTexture(netCanvas);
  netTex.wrapS = netTex.wrapT = THREE.RepeatWrapping;

  // One continuous net
  const matNet = new THREE.MeshBasicMaterial({map: netTex, transparent: true, side: THREE.DoubleSide, alphaTest:0.01});
  const netMesh = new THREE.Mesh(new THREE.PlaneGeometry(NET_W, NET_H), matNet);
  netMesh.position.set(0, NET_H/2, 0); g.add(netMesh);

  // Bottom ground bar
  const botBar = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R*0.5, POLE_R*0.5, NET_W, 8), matPole);
  botBar.rotation.z = Math.PI/2; botBar.position.set(0, 0.2, 0); g.add(botBar);

  // Position net group: it sits behind the hoop (D*2 feet further back from end line)
  g.position.set(0, 0, zPos - D*1.8);
  scene.add(g);
}

// ── LED Game light (bracket-mount floodlight) ─────────────────────────────────
function buildGameLight(scene, x, z) {
  const g = new THREE.Group();
  const matDark  = new THREE.MeshStandardMaterial({color:0x1a1a1a, roughness:0.25, metalness:0.85});
  const matLight = new THREE.MeshStandardMaterial({color:0xffffff, emissive:new THREE.Color(0xffffee), emissiveIntensity:2.5, roughness:0.3});
  const matLens  = new THREE.MeshStandardMaterial({color:0xeeeeff, emissive:new THREE.Color(0xffffff), emissiveIntensity:4.0, roughness:0.0});

  // Pole
  const PH = 18;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, PH, 10), matDark);
  pole.position.set(0, PH/2, 0); pole.castShadow = true; g.add(pole);
  // Base
  makeBox(g, matDark, 0.8, 0.25, 0.8, 0, 0.12, 0);

  // Horizontal mounting rail (extends from pole top toward court)
  const railLen = 2.8;
  makeBox(g, matDark, railLen, 0.16, 0.16, -railLen/2+0.08, PH-0.1, 0);

  // Diagonal V-brace (two arms of the V)
  const braceTop = new THREE.Vector3(0, PH-0.1, 0);
  const braceBotA = new THREE.Vector3(-railLen+0.2, PH-3.5, 0);
  const braceBotB = new THREE.Vector3(-railLen+0.4, PH-2.2, 0);
  makePipe(g, matDark, braceTop, braceBotA, 0.07);
  makePipe(g, matDark, braceTop, braceBotB, 0.07);

  // Pivot block at tip of rail
  makeBox(g, matDark, 0.32, 0.35, 0.28, -railLen+0.16, PH-0.25, 0);

  // LED fixture head (wider flat box, slightly angled downward ~15°)
  const headGroup = new THREE.Group();
  // Outer housing
  makeBox(headGroup, matDark, 1.55, 0.28, 0.95, 0, 0, 0);
  // LED panel (emissive white)
  makeBox(headGroup, matLens, 1.25, 0.05, 0.7, 0, -0.12, 0);
  // Housing rim / bezel
  [[1.6,0.06,0.06,0,0.11,0.485],[1.6,0.06,0.06,0,0.11,-0.485],[0.06,0.06,1.0,0.785,0.11,0],[0.06,0.06,1.0,-0.785,0.11,0]].forEach(([w,h,d,px,py,pz])=>{
    makeBox(headGroup, matDark, w,h,d, px,py,pz);
  });
  headGroup.rotation.x = Math.PI * 0.08; // slight tilt (faces down toward court)
  headGroup.position.set(-railLen+0.15, PH-0.65, 0);
  g.add(headGroup);

  // Light cone (very subtle)
  const coneMat = new THREE.MeshBasicMaterial({color:0xffffee, transparent:true, opacity:0.04, side:THREE.DoubleSide});
  const cone = new THREE.Mesh(new THREE.ConeGeometry(4.5, 10, 16, 1, true), coneMat);
  cone.rotation.x = Math.PI; cone.position.set(-railLen+0.15, PH-5.5, 0); g.add(cone);

  // SpotLight
  const spot = new THREE.SpotLight(0xfff8e0, 1.0, 40, Math.PI/6, 0.5);
  spot.position.set(-railLen+0.15, PH-0.65, 0);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0, 0);
  g.add(spot); g.add(spotTarget); spot.target = spotTarget;

  g.position.set(x, 0, z);
  scene.add(g);
}

// ── Ruler overlay component ───────────────────────────────────────────────────
function RulerOverlay({ width, length, metric, darkMode }) {
  const toM  = ft => (ft * 0.3048).toFixed(1);
  const wLabel = metric ? `${toM(width)} m`  : `${width}'`;
  const lLabel = metric ? `${toM(length)} m` : `${length}'`;
  const tc = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)';
  const lc = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)';
  const style = {
    position:'absolute', pointerEvents:'none', fontFamily:'monospace',
    fontSize:11, fontWeight:700, letterSpacing:'0.04em',
  };
  const arrowStyle = (horiz) => ({
    position:'absolute', display:'flex', alignItems:'center', justifyContent:'center',
    gap:4, color: tc,
    ...(horiz ? {bottom:36,left:'50%',transform:'translateX(-50%)',flexDirection:'row'}
              : {left:6,top:'50%',transform:'translateY(-50%) rotate(-90deg)',flexDirection:'row'}),
  });
  const lineStyle = (horiz) => ({
    ...(horiz ? {width:80,height:1} : {width:60,height:1}),
    background: lc, position:'relative',
  });
  const capStyle = {
    position:'absolute', top:-4, height:9, width:1, background:lc,
  };
  return (
    <div style={{...style, inset:0, zIndex:9}}>
      {/* Width ruler — bottom */}
      <div style={arrowStyle(true)}>
        <div style={lineStyle(true)}>
          <span style={{...capStyle, left:0}}/>
          <span style={{...capStyle, right:0}}/>
        </div>
        <span>{wLabel}</span>
        <div style={lineStyle(true)}>
          <span style={{...capStyle, left:0}}/>
          <span style={{...capStyle, right:0}}/>
        </div>
      </div>
      {/* Length ruler — left */}
      <div style={arrowStyle(false)}>
        <div style={lineStyle(false)}>
          <span style={{...capStyle, left:0}}/>
          <span style={{...capStyle, right:0}}/>
        </div>
        <span>{lLabel}</span>
        <div style={lineStyle(false)}>
          <span style={{...capStyle, left:0}}/>
          <span style={{...capStyle, right:0}}/>
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

  // Fast: color update only
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.courtMat) return;
    s.courtMat.color.set(colors?.main || '#0061A0'); s.courtMat.needsUpdate = true;
    if (s.sideMat) { s.sideMat.color.set(new THREE.Color(colors?.main||'#0061A0').multiplyScalar(0.5)); s.sideMat.needsUpdate = true; }
    if (s.accentMeshes) s.accentMeshes.forEach(m => { m.material.color.set(colors?.accent||'#CB2D3E'); m.material.needsUpdate = true; });
    if (s.borderMat)  { s.borderMat.color.set(colors?.border||'#3E464A'); s.borderMat.needsUpdate = true; }
  }, [colors?.main, colors?.accent, colors?.border]);

  // Fast: tile update only
  useEffect(() => {
    const s = sceneRef.current;
    if (!s.courtMat || !s.renderer) return;
    const newTex = makeTileTexture(tileType, width, length, s.renderer);
    if (s.courtMat.map) s.courtMat.map.dispose();
    s.courtMat.map = newTex; s.courtMat.needsUpdate = true;
    if (s.accentMeshes) s.accentMeshes.forEach(m => {
      const t2 = makeTileTexture(tileType, width, length, s.renderer);
      if (m.material.map) m.material.map.dispose();
      m.material.map = t2; m.material.needsUpdate = true;
    });
  }, [tileType]);

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
      catch(err) { console.error('[Court3D]', err); setIsLoading(false); }
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
  }, [width, length, courtType, hoopVariant, hoopOffset, bothEnds, showNetProtect, showGameLight, darkMode]);

  function buildScene(mount) {
    const cW = Math.max(mount.clientWidth  || 0, 400);
    const cH = Math.max(mount.clientHeight || 0, 300);
    const bg  = darkMode ? 0x0d1117 : 0xcde5f5;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.FogExp2(bg, 0.0016);

    const camera = new THREE.PerspectiveCamera(40, cW/cH, 0.1, 2000);
    const cd = Math.max(width, length) * 1.5;
    camera.position.set(cd*0.5, cd*0.5, cd*0.85);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
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
    controls.minPolarAngle = 0.05; controls.maxPolarAngle = Math.PI/2.05;
    controls.minDistance = 8; controls.maxDistance = cd*4;
    controls.autoRotate = autoRotate; controls.autoRotateSpeed = 1.5;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, darkMode ? 0.38 : 0.82));
    const sun = new THREE.DirectionalLight(darkMode ? 0xfff0cc : 0xfff8f0, darkMode ? 1.35 : 1.7);
    sun.position.set(80,140,100); sun.castShadow = true;
    sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.near=1; sun.shadow.camera.far=600;
    sun.shadow.camera.left=-160; sun.shadow.camera.right=160; sun.shadow.camera.top=160; sun.shadow.camera.bottom=-160;
    sun.shadow.bias=-0.001; scene.add(sun);
    const fill = new THREE.DirectionalLight(darkMode ? 0x3355aa : 0x99bbff, 0.3);
    fill.position.set(-80,80,-100); scene.add(fill);
    if (!darkMode) scene.add(new THREE.HemisphereLight(0x87ceeb,0x4a7c59,0.4));

    // Ground
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(1500,1500), new THREE.MeshLambertMaterial({color:darkMode?0x080c10:0x6a9e6a}));
    gnd.rotation.x=-Math.PI/2; gnd.position.y=-0.86; gnd.receiveShadow=true; scene.add(gnd);

    // Border
    const borderMat = new THREE.MeshStandardMaterial({color:new THREE.Color(colors?.border||'#3E464A'), roughness:0.9});
    const border = new THREE.Mesh(new THREE.BoxGeometry(width+18,0.86,length+18), borderMat);
    border.position.y=-0.43; border.receiveShadow=true; scene.add(border);
    [[width+18,0.26,1.5,0,0.13,(length+9)/2+0.6],[width+18,0.26,1.5,0,0.13,-(length+9)/2-0.6],
     [1.5,0.26,length+18,(width+9)/2+0.6,0.13,0],[1.5,0.26,length+18,-(width+9)/2-0.6,0.13,0]].forEach(([w,h,d,x,y,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),borderMat); m.position.set(x,y,z); scene.add(m);
    });

    // Court surface
    const tileTex = makeTileTexture(tileType, width, length, renderer);
    const courtMat = new THREE.MeshStandardMaterial({map:tileTex, color:new THREE.Color(colors?.main||'#0061A0'), roughness:0.82, metalness:0});
    const sideCol  = new THREE.Color(colors?.main||'#0061A0').multiplyScalar(0.5);
    const sideMat  = new THREE.MeshStandardMaterial({color:sideCol, roughness:0.9});
    const court = new THREE.Mesh(new THREE.BoxGeometry(width,0.38,length), [sideMat,sideMat,courtMat,sideMat,sideMat,sideMat]);
    court.position.y=0.19; court.receiveShadow=true; scene.add(court);

    // Accent zones
    const accentMeshes = [];
    if (courtType && courtType.includes('basketball')) {
      const kW=Math.min(12,width*0.28), kH=Math.min(19,length*0.27);
      const mkAccent = (zOff) => {
        const acTex=makeTileTexture(tileType,kW,kH,renderer);
        const mat=new THREE.MeshStandardMaterial({map:acTex,color:new THREE.Color(colors?.accent||'#CB2D3E'),roughness:0.82,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
        const m=new THREE.Mesh(new THREE.PlaneGeometry(kW,kH),mat);
        m.rotation.x=-Math.PI/2; m.position.set(0,0.383,zOff); scene.add(m); accentMeshes.push(m);
      };
      mkAccent(-(length/2-kH/2));
      if (courtType==='basketball_full') mkAccent(length/2-kH/2);
    }

    // Lines overlay
    const linesCanvas = drawLinesCanvas(width, length, colors, linesConfig, courtType);
    const linesTex = new THREE.CanvasTexture(linesCanvas);
    linesTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const linesMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      new THREE.MeshBasicMaterial({map:linesTex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-2})
    );
    linesMesh.rotation.x=-Math.PI/2; linesMesh.position.y=0.386; scene.add(linesMesh);

    // Hoops
    const nets = [];
    const isBball = courtType && courtType.includes('basketball');
    const showHoop = hoopVariant && hoopVariant!=='none' && isBball;
    if (showHoop) {
      const v = hoopVariant==='megaslam72' ? 72 : 60;
      nets.push(buildHoop(scene, -(length/2)-3.8,  1, hoopOffset, v));
      if (courtType==='basketball_full'||bothEnds) nets.push(buildHoop(scene, (length/2)+3.8, -1, hoopOffset, v));
    }

    // Pickleball net
    if (courtType && courtType.includes('pickleball')) {
      const pMat = new THREE.MeshStandardMaterial({color:0x888888, roughness:0.7});
      [-width/2-0.5, width/2+0.5].forEach(x => {
        const p=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,3.5,8),pMat);
        p.position.set(x,1.75,0); p.castShadow=true; scene.add(p);
      });
      const pbNet=new THREE.Mesh(new THREE.BoxGeometry(width+1,3,0.05),new THREE.MeshLambertMaterial({color:0xbbbbbb,transparent:true,opacity:0.3,wireframe:true}));
      pbNet.position.set(0,1.8,0); scene.add(pbNet);
    }

    // Net protect
    if (showNetProtect && isBball) {
      buildNetProtect(scene, -(length/2)-3.8,  1, width);
      if (courtType==='basketball_full'||bothEnds) buildNetProtect(scene, (length/2)+3.8, -1, width);
    }

    // Game lights (corner poles)
    if (showGameLight) {
      buildGameLight(scene, -(width/2)-4.5, -(length/2)+1);
      buildGameLight(scene,  (width/2)+4.5, -(length/2)+1);
      if (courtType==='basketball_full') {
        buildGameLight(scene, -(width/2)-4.5, (length/2)-1);
        buildGameLight(scene,  (width/2)+4.5, (length/2)-1);
      }
    }

    // Resize observer
    const ro = new ResizeObserver(() => {
      const w=mount.clientWidth, h=mount.clientHeight;
      if(!w||!h) return;
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
    });
    ro.observe(mount);

    // Render loop
    let animId;
    const t0 = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      sceneRef.current.animId = animId;
      const t = (performance.now()-t0)*0.001;
      nets.forEach((net,i) => {
        if(!net)return;
        net.rotation.z = Math.sin(t*0.55+i*1.4)*0.038;
        net.rotation.x = Math.sin(t*0.42+i*0.9)*0.022;
      });
      controls.update();
      renderer.render(scene,camera);
    };
    animate();

    sceneRef.current = {scene,camera,renderer,controls,ro,animId,courtMat,sideMat,borderMat,linesMesh,accentMeshes};
    setIsLoading(false);
  }

  const toggleFullscreen = useCallback(() => {
    const el = mountRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.(); else document.exitFullscreen?.();
  }, []);
  const zoom = useCallback(dir => {
    const cam = sceneRef.current?.camera; if(!cam)return;
    cam.position.multiplyScalar(dir>0?0.82:1.22); sceneRef.current?.controls?.update();
  }, []);

  const dk = darkMode;
  const btnCls = `w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 border ${dk?'bg-black/60 hover:bg-black/80 text-white border-white/10':'bg-white/80 hover:bg-white text-gray-800 border-black/10'}`;

  return (
    <div ref={mountRef} className={`relative overflow-hidden ${className}`} style={{width:'100%',height:'100%'}}>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{background:dk?'#0d1117':'#cde5f5'}}>
          <div style={{position:'relative',width:88,height:88,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'3px solid transparent',borderTopColor:'#2472B3',animation:'c3d-spin 1s linear infinite'}}/>
            <img src={CTC_LOGO} alt="" style={{width:52,height:52,objectFit:'contain',animation:'c3d-pulse 1.5s ease-in-out infinite'}} onError={e=>{e.target.style.display='none';}}/>
          </div>
          <p style={{color:dk?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.45)',fontSize:13,marginTop:16,letterSpacing:'0.08em',fontFamily:'sans-serif'}}>
            Building your court…
          </p>
          <style>{`@keyframes c3d-spin{to{transform:rotate(360deg)}}@keyframes c3d-pulse{0%,100%{opacity:.4;transform:scale(.9)}50%{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}

      {/* Ruler overlay */}
      {showRuler && !isLoading && <RulerOverlay width={width} length={length} metric={metric} darkMode={darkMode}/>}

      {/* Top-right controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button onClick={toggleFullscreen} className={btnCls} title="Fullscreen">
          {isFullscreen ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
        </button>
        <button onClick={()=>zoom(1)}  className={btnCls} title="Zoom in"><ZoomIn  className="h-4 w-4"/></button>
        <button onClick={()=>zoom(-1)} className={btnCls} title="Zoom out"><ZoomOut className="h-4 w-4"/></button>
        {onDarkModeToggle && (
          <button onClick={onDarkModeToggle} className={btnCls} title={dk?'Light':'Dark'}>
            {dk?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}
          </button>
        )}
      </div>

      {/* Bottom-left: auto-rotate */}
      <div className="absolute bottom-10 left-3 z-10">
        <button
          onClick={()=>setAutoRotate(v=>!v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-md border transition-all ${autoRotate?'bg-[#2472B3] text-white border-[#2472B3]':dk?'bg-black/60 text-white/80 border-white/10 hover:bg-black/80':'bg-white/80 text-gray-700 border-black/10 hover:bg-white'}`}
        >
          {autoRotate?<Unlock className="h-3.5 w-3.5"/>:<Lock className="h-3.5 w-3.5"/>}
          {autoRotate?'Auto':'Lock'}
        </button>
      </div>

      <div className={`absolute bottom-3 right-3 z-10 text-xs px-2 py-1 rounded hidden md:block pointer-events-none ${dk?'text-white/30 bg-black/20':'text-black/35 bg-white/35'}`}>
        Drag · Scroll · Pinch
      </div>
    </div>
  );
}
