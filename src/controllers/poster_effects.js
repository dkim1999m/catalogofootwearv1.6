// Efectos disponibles: bubbles, sparks, rain, thunder, rain-thunder, rocks, river, nature
let activeFrame = null;

export function ensureCanvas(host){
  if(!host) return null;
  host.style.position = host.style.position || "relative";
  let c = host.querySelector("canvas");
  if(!c){
    c = document.createElement("canvas");
    c.style.position = "absolute";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.pointerEvents = "none";
    host.appendChild(c);
  }
  return c;
}

export function playEffect(host, kind="bubbles"){
  if(!host) return;
  const c = ensureCanvas(host);
  const ctx = c.getContext("2d");

  const resize = () => {
    const r = host.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.max(1, Math.floor(r.width * dpr));
    c.height = Math.max(1, Math.floor(r.height * dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  resize();

  const parts = [];
  const W = () => host.clientWidth || 1;
  const H = () => host.clientHeight || 1;

  function seed(){
    parts.length = 0;
    if(kind === "sparks"){
      for(let i=0;i<70;i++) parts.push({ x: 70+Math.random()*260, y: H()*0.62+Math.random()*120, vx: 1.2+Math.random()*3.0, vy: -2.0-Math.random()*3.8, r: 1+Math.random()*2.2 });
    }else if(kind === "rain" || kind === "rain-thunder"){
      for(let i=0;i<90;i++) parts.push({ x: Math.random()*W(), y: -30-Math.random()*H(), vy: 7+Math.random()*10 });
    }else if(kind === "rocks"){
      for(let i=0;i<50;i++) parts.push({ x: Math.random()*W(), y: H()+Math.random()*120, vy: -1.4-Math.random()*2.5, r: 3+Math.random()*5 });
    }else if(kind === "river"){
      for(let i=0;i<60;i++) parts.push({ x: -20-Math.random()*W(), y: H()*0.45+Math.random()*H()*0.35, vx: 2+Math.random()*3, r: 3+Math.random()*4 });
    }else if(kind === "nature"){
      for(let i=0;i<55;i++) parts.push({ x: Math.random()*W(), y: H()+20+Math.random()*120, vy: -1.8-Math.random()*3.0, drift:(Math.random()-0.5)*1.4, r: 2+Math.random()*4 });
    }else{ // bubbles
      for(let i=0;i<60;i++) parts.push({ x: Math.random()*W(), y: H()+20+Math.random()*120, vy: -2.5-Math.random()*4.5, r: 2+Math.random()*3 });
    }
  }
  seed();

  const t0 = performance.now();
  const dur = 1500;
  if(activeFrame) cancelAnimationFrame(activeFrame);

  function frame(now){
    resize();
    const dt = now - t0;
    const alpha = 1 - Math.min(1, dt/dur);
    ctx.clearRect(0,0,W(),H());

    if(kind === "sparks"){
      ctx.globalAlpha = 0.9*alpha;
      ctx.fillStyle = "rgba(245,158,11,.95)";
      for(const p of parts){
        p.x += p.vx; p.y += p.vy; p.vy += 0.12;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
    }else if(kind === "rain" || kind === "rain-thunder"){
      ctx.globalAlpha = 0.55*alpha;
      ctx.strokeStyle = "rgba(14,165,233,.9)";
      ctx.lineWidth = 2;
      for(const d of parts){
        d.y += d.vy;
        if(d.y > H()+40){ d.y = -40; d.x = Math.random()*W(); }
        ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x+6,d.y+18); ctx.stroke();
      }
      if(kind === "rain-thunder" && Math.random() < 0.07){
        ctx.globalAlpha = 0.2*alpha;
        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.fillRect(0,0,W(),H());
        ctx.globalAlpha = 0.85*alpha;
        ctx.strokeStyle = "rgba(255,255,255,.95)";
        ctx.lineWidth = 3;
        let x = W()*0.72, y = 0;
        ctx.beginPath(); ctx.moveTo(x,y);
        for(let i=0;i<7;i++){ x += (Math.random()-0.5)*40; y += H()/7; ctx.lineTo(x,y); }
        ctx.stroke();
      }
    }else if(kind === "thunder"){
      ctx.globalAlpha = (0.12 + Math.random()*0.15) * alpha;
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.fillRect(0,0,W(),H());
      ctx.globalAlpha = 0.9*alpha;
      ctx.strokeStyle = "rgba(255,255,255,.95)";
      ctx.lineWidth = 4;
      let x = W()*0.5, y = 0;
      ctx.beginPath(); ctx.moveTo(x,y);
      for(let i=0;i<8;i++){ x += (Math.random()-0.5)*45; y += H()/8; ctx.lineTo(x,y); }
      ctx.stroke();
    }else if(kind === "rocks"){
      ctx.globalAlpha = 0.35*alpha;
      ctx.fillStyle = "rgba(120,113,108,.95)";
      for(const p of parts){
        p.y += p.vy;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
    }else if(kind === "river"){
      ctx.globalAlpha = 0.45*alpha;
      ctx.fillStyle = "rgba(56,189,248,.85)";
      for(const p of parts){
        p.x += p.vx;
        if(p.x > W()+30){ p.x = -30; p.y = H()*0.45+Math.random()*H()*0.35; }
        ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r*1.8,p.r,0,0,Math.PI*2); ctx.fill();
      }
    }else if(kind === "nature"){
      ctx.globalAlpha = 0.45*alpha;
      ctx.fillStyle = "rgba(34,197,94,.9)";
      for(const p of parts){
        p.y += p.vy; p.x += p.drift;
        ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*1.5,0,0,Math.PI*2); ctx.fill();
      }
    }else{
      ctx.globalAlpha = 0.35*alpha;
      ctx.fillStyle = "rgba(34,197,94,.9)";
      for(const b of parts){
        b.y += b.vy;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    if(dt < dur) activeFrame = requestAnimationFrame(frame);
    else ctx.clearRect(0,0,W(),H());
  }
  activeFrame = requestAnimationFrame(frame);
}