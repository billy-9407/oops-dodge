import {CONFIG} from './config.js';
export function sanitize(data={}){const result={best:Math.max(0,Number(data.best)||0),sound:data.sound!==false,tutorial:!!data.tutorial,loadout:{...CONFIG.equipment.defaults}};for(const [key,list]of [['helmet','helmets'],['outfit','outfits'],['gun','guns']])if(CONFIG.equipment[list].some(x=>x.id===data.loadout?.[key]))result.loadout[key]=data.loadout[key];return result;}
export function readSave(){try{return sanitize(JSON.parse(localStorage.getItem(CONFIG.storageKey)||'{}'));}catch{return sanitize();}}
export function writeSave(data){try{localStorage.setItem(CONFIG.storageKey,JSON.stringify(data));return true;}catch{return false;}}
