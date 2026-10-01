import {CONFIG as C} from './config.js';
export const multiplier=t=>C.difficulty.growth**(t/C.difficulty.period);
export function travel(t,dt){const k=Math.log(C.difficulty.growth)/C.difficulty.period;return Math.abs(k)<1e-10?dt:multiplier(t)*Math.expm1(k*dt)/k;}
export function mapState(t){return {index:Math.floor(t/C.weather.mapPeriod)%C.maps.length,storm:t>=C.weather.stormStart};}
export function sweptCollision(px,py,npx,npy,ox,oy,nox,noy,halfW,halfH){
  const x=ox-px,y=oy-py,dx=(nox-ox)-(npx-px),dy=(noy-oy)-(npy-py);let lo=0,hi=1;
  for(const [p,d,h]of [[x,dx,halfW],[y,dy,halfH]]){if(Math.abs(d)<1e-9){if(Math.abs(p)>h)return false;}else{let a=(-h-p)/d,b=(h-p)/d;if(a>b)[a,b]=[b,a];lo=Math.max(lo,a);hi=Math.min(hi,b);if(lo>hi)return false;}}return true;
}
export class Engine{
  constructor(rng=Math.random){this.rng=rng;this.reset();}
  reset(){this.elapsed=0;this.x=C.world.width/2;this.dir=C.player.initialDirection;this.chips=C.survival.initialChips;this.hits=0;this.invincibleUntil=0;this.obstacles=[];this.nextSpawn=C.spawning.initialDelay;this.status='ready';this.events=[];this.map=0;this.storm=false;this.hitFlash=0;this.nextThunder=C.weather.stormStart+C.weather.thunderMin;this.lightning=0;this.id=0;}
  start(){this.reset();this.status='playing';}
  bounds(){const half=C.player.size*C.world.unit/2;return [half+C.player.edgeMargin,C.world.width-half-C.player.edgeMargin];}
  flip(){if(this.status!=='playing')return false;this.dir*=-1;this.events.push({type:'turn'});return true;}
  pause(){if(this.status==='playing')this.status='paused';}
  resume(){if(this.status==='paused')this.status='playing';}
  damage(){if(this.status!=='playing'||this.elapsed<this.invincibleUntil)return false;this.hits++;this.chips=Math.max(0,C.survival.initialChips-this.hits);this.hitFlash=.18;this.events.push({type:'hit'});if(this.hits>=C.survival.deathOnHit){this.status='dead';this.events.push({type:'death'});}else this.invincibleUntil=this.elapsed+C.survival.invincibility;return true;}
  dimensions(o){return {w:o.w||C.world.unit*o.spec.size,h:o.h||C.world.unit*o.spec.size*.55};}
  arrival(o){const {h}=this.dimensions(o),dy=C.player.y-o.y;if(dy< -h)return null;const v=o.spec.speed*Math.cos(o.angle),k=Math.log(C.difficulty.growth)/C.difficulty.period;const dt=Math.log(1+Math.max(0,dy)*k/(v*multiplier(this.elapsed)))/k;return {dt,x:o.x+Math.tan(o.angle)*Math.max(0,dy),width:this.dimensions(o).w*o.spec.body.width};}
  fair(candidate){const a=this.arrival(candidate);if(!a)return true;const [left,right]=this.bounds(),half=C.player.size*C.world.unit*C.player.body.width/2;const spans=[candidate,...this.obstacles].map(o=>this.arrival(o)).filter(b=>b&&Math.abs(b.dt-a.dt)<C.spawning.arrivalWindow).map(b=>[Math.max(left,b.x-b.width/2-half),Math.min(right,b.x+b.width/2+half)]).filter(([l,r])=>l<r).sort((a,b)=>a[0]-b[0]);let p=left;const gaps=[];for(const [l,r]of spans){if(l>p)gaps.push([p,l]);p=Math.max(p,r);}if(p<right)gaps.push([p,right]);const reach=Math.max(0,a.dt-C.spawning.reactionTime)*C.player.speed;return gaps.some(([l,r])=>r-l>=C.spawning.minimumGap&&r>=this.x-reach&&l<=this.x+reach);}
  spawn(){const total=C.obstacles.reduce((s,o)=>s+o.weight,0);let pick=this.rng()*total,spec=C.obstacles.at(-1);for(const o of C.obstacles){pick-=o.weight;if(pick<=0){spec=o;break;}}const {width,height}=this.assetSizes?.[spec.id]||{width:100,height:55};const scale=C.world.unit*spec.size/Math.max(width,height),w=width*scale,h=height*scale;
    for(let i=0;i<C.spawning.candidateAttempts;i++){const angle=(this.rng()*2-1)*C.spawning.maxAngle*Math.PI/180;const o={id:++this.id,spec,x:w/2+this.rng()*(C.world.width-w),y:-h/2-2,w,h,angle};if(this.fair(o)){this.obstacles.push(o);return true;}}return false;
  }
  step(dt){if(this.status!=='playing'||!Number.isFinite(dt)||dt<=0)return; // substeps make boundary clamping and input paths consistent across refresh rates
    let remaining=dt;while(remaining>1e-8&&this.status==='playing'){const delta=Math.min(remaining,1/120);this.tick(delta);remaining-=delta;}
  }
  tick(dt){const oldTime=this.elapsed,ds=travel(oldTime,dt);this.elapsed+=dt;const [l,r]=this.bounds(),oldX=this.x;this.x=Math.min(r,Math.max(l,this.x+this.dir*C.player.speed*dt));this.hitFlash=Math.max(0,this.hitFlash-dt);this.lightning=Math.max(0,this.lightning-dt);
    while(this.elapsed+1e-8>=this.nextSpawn){this.spawn();this.nextSpawn+=C.spawning.interval;}
    const size=C.player.size*C.world.unit,ph=size*C.player.body.height/2-C.collision.padding,pw=size*C.player.body.width/2-C.collision.padding,py=C.player.y+size*C.player.body.offsetY;
    const survivors=[];for(const o of this.obstacles){const oldOX=o.x,oldOY=o.y;o.x+=Math.sin(o.angle)*o.spec.speed*ds;o.y+=Math.cos(o.angle)*o.spec.speed*ds;const {w,h}=this.dimensions(o);
      if(this.elapsed>=this.invincibleUntil&&sweptCollision(oldX,py,this.x,py,oldOX,oldOY,o.x,o.y,pw+w*o.spec.body.width/2-C.collision.padding,ph+h*o.spec.body.height/2-C.collision.padding)){this.damage();continue;}
      if(o.y-h/2<=C.world.height&&o.x+w/2>=0&&o.x-w/2<=C.world.width)survivors.push(o);
    }this.obstacles=survivors;const m=mapState(this.elapsed);if(m.index!==this.map||m.storm!==this.storm){this.map=m.index;this.storm=m.storm;this.events.push({type:'map',...m});}
    if(this.storm&&this.elapsed>=this.nextThunder){this.lightning=.22;this.events.push({type:'thunder'});this.nextThunder=this.elapsed+C.weather.thunderMin+this.rng()*(C.weather.thunderMax-C.weather.thunderMin);}
  }
  consumeEvents(){return this.events.splice(0);}
}
