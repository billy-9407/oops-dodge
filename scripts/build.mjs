import {cp,mkdir,rm,readFile,access} from 'node:fs/promises';
import {CONFIG} from '../src/config.js';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['index.html','src','assets']) await cp(path,`dist/${path}`,{recursive:true});
const paths=[...CONFIG.obstacles.map(o=>o.asset),...CONFIG.maps.map(m=>m.asset),...CONFIG.equipment.helmets,...CONFIG.equipment.outfits,...CONFIG.equipment.guns].map(x=>typeof x==='string'?x:x.asset);
for(const path of [...paths,...CONFIG.player.frames,CONFIG.assets.crate]) await access(path);
JSON.parse(await readFile('vercel.json','utf8'));
console.log('Build OK: dist/ · all configured assets found');
