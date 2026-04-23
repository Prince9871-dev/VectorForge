import React, { useEffect, useRef } from 'react';
import { useVectorDB } from '../context/VectorDBContext';

const COL = { cs:'#b3b3b3', math:'#cccccc', food:'#e6e6e6', sports:'#ffffff', doc:'#ffffff', default:'#888888' };

export default function VectorCanvas() {
  const canvasRef = useRef(null);
  const { pcaPoints, bounds, queryPt, hitIds, hoverItem, setHoverItem } = useVectorDB();
  const reqRef = useRef(null);
  const pulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    };
    
    resize();
    window.addEventListener('resize', resize);

    const w2c = (wx, wy) => {
      const P = 70, W = canvas.width, H = canvas.height;
      const rx = bounds.maxX - bounds.minX || 1;
      const ry = bounds.maxY - bounds.minY || 1;
      return [
        P + ((wx - bounds.minX) / rx) * (W - 2 * P), 
        H - P - ((wy - bounds.minY) / ry) * (H - 2 * P)
      ];
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0a0a0a'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1a1a1a'; 
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 8; i++) {
        const tx = 70 + (i / 8) * (canvas.width - 140);
        const ty = 70 + (i / 8) * (canvas.height - 140);
        ctx.beginPath(); ctx.moveTo(tx, 70); ctx.lineTo(tx, canvas.height - 70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, ty); ctx.lineTo(canvas.width - 70, ty); ctx.stroke();
      }
      
      ctx.fillStyle = '#444444'; 
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('PC₁ →', canvas.width / 2 - 40, canvas.height - 18);
      ctx.save();
      ctx.translate(18, canvas.height / 2 + 50);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('PC₂ →', 0, 0);
      ctx.restore();
      
      ctx.fillStyle = '#666666'; 
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText('2D PCA Projection  •  Semantic Space', 80, 28);

      if (queryPt && hitIds.size > 0) {
        const [qx, qy] = w2c(queryPt.x, queryPt.y);
        for (const pt of pcaPoints) {
          if (!hitIds.has(pt.item.id)) continue;
          const [px, py] = w2c(pt.x, pt.y);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'; 
          ctx.lineWidth = 1.5; 
          ctx.setLineDash([4, 6]);
          ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      for (const pt of pcaPoints) {
        const [cx, cy] = w2c(pt.x, pt.y);
        const isHit = hitIds.has(pt.item.id);
        
        // Base Dot Size
        const baseRadius = isHit ? 8 : 4;
        const glowRadius = isHit ? 24 : 12;
        const color = isHit ? '255,255,255' : '220,220,220'; // Bright white or light gray

        ctx.beginPath();
        if (queryPt && !isHit) {
            // Dim non-hits when query is active
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
            ctx.shadowBlur = 0;
            ctx.fill();
        } else {
            // Cinematic Bloom / Halo
            const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
            grd.addColorStop(0, `rgba(${color}, ${isHit ? 0.8 : 0.4})`);
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Core Dot
            ctx.fillStyle = `rgb(${color})`;
            ctx.beginPath();
            ctx.arc(cx, cy, baseRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Inner Hotspot for hits
            if (isHit) {
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(cx, cy, baseRadius / 2, 0, 2 * Math.PI);
              ctx.fill();
            }
        }
        
        if (hoverItem && hoverItem.id === pt.item.id) {
          ctx.beginPath(); ctx.arc(cx, cy, baseRadius + 4, 0, 2 * Math.PI); 
          ctx.strokeStyle = '#ffffff'; 
          ctx.lineWidth = 2; 
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;

      if (queryPt) {
        const [qx, qy] = w2c(queryPt.x, queryPt.y);
        ctx.save(); ctx.translate(qx, qy);
        
        // Query Bloom
        const qGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        qGrd.addColorStop(0, 'rgba(255,255,255,0.9)');
        qGrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = qGrd;
        ctx.beginPath(); ctx.arc(0, 0, 30, 0, 2*Math.PI); ctx.fill();

        ctx.shadowColor = '#fff'; ctx.shadowBlur = 20;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = (i * Math.PI / 5) - Math.PI / 2;
          const rr = i % 2 === 0 ? 15 : 6;
          if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
          else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); 
        ctx.fillStyle = '#fff'; 
        ctx.fill();
        ctx.shadowBlur = 0; 
        ctx.restore();
        ctx.fillStyle = '#ffffff'; 
        ctx.font = '10px "Inter", sans-serif'; 
        ctx.fillText('query', qx + 18, qy + 4);
      }

      if (!pcaPoints.length) {
        ctx.fillStyle = '#555555'; 
        ctx.font = '13px "Inter", sans-serif'; 
        ctx.textAlign = 'center';
        ctx.fillText('Connecting to VectorDB...', canvas.width / 2, canvas.height / 2); 
        ctx.textAlign = 'left';
      }

      pulseRef.current += 0.05;
      reqRef.current = requestAnimationFrame(drawFrame);
    };

    reqRef.current = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(reqRef.current);
    };
  }, [pcaPoints, bounds, queryPt, hitIds, hoverItem]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    const w2c = (wx, wy) => {
      const P = 70, W = canvas.width, H = canvas.height;
      const rx = bounds.maxX - bounds.minX || 1;
      const ry = bounds.maxY - bounds.minY || 1;
      return [
        P + ((wx - bounds.minX) / rx) * (W - 2 * P), 
        H - P - ((wy - bounds.minY) / ry) * (H - 2 * P)
      ];
    };

    let newHover = null;
    let best = 18;
    
    for (const pt of pcaPoints) {
      const [cx, cy] = w2c(pt.x, pt.y);
      const d = Math.hypot(mx - cx, my - cy);
      if (d < best) {
        best = d;
        newHover = pt.item;
      }
    }
    
    setHoverItem(newHover);
  };

  const handleMouseLeave = () => {
    setHoverItem(null);
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        id="scatter" 
        style={{ display: 'block', width: '100%', height: '100%' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoverItem && (
        <div id="tip" style={{
          position: 'fixed',
          display: 'block',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '7px 11px',
          fontSize: '11px',
          pointerEvents: 'none',
          maxWidth: '220px',
          zIndex: 200,
          lineHeight: 1.5,
          left: hoverItem ? hoverItem.mouseX : 0, // In standard react it's better to manage via state but we'll use CSS hover directly.
        }}>
          {/* We'll handle absolute positioning via a document mouse move if needed, or simple ref. */}
        </div>
      )}
    </>
  );
}
