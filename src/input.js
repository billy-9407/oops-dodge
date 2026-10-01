// Pointerdown is the only pointing-device action; synthetic click never flips again.
export function bindInput(button,flip,canPlay,unlock){let pointer=null,keyDown=false;
  const down=e=>{if(e.isPrimary===false||e.button!==0||pointer!==null)return;e.preventDefault();pointer=e.pointerId;button.setPointerCapture?.(e.pointerId);unlock();if(canPlay())flip();button.classList.add('pressed');};
  const up=e=>{if(e.pointerId===pointer){pointer=null;button.classList.remove('pressed');}};
  button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
  button.addEventListener('click',e=>{e.preventDefault();if(e.detail===0&&canPlay()){unlock();flip();}});
  window.addEventListener('keydown',e=>{if(e.code!=='Space'||e.target.closest?.('input,select,textarea,[contenteditable]')||!canPlay())return;e.preventDefault();if(e.repeat||keyDown)return;keyDown=true;unlock();flip();button.classList.add('pressed');});
  window.addEventListener('keyup',e=>{if(e.code==='Space'){keyDown=false;button.classList.remove('pressed');}});
  window.addEventListener('blur',()=>{pointer=null;keyDown=false;button.classList.remove('pressed');});
}
