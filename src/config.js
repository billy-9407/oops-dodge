// Gameplay, appearance and audio are configured here. All world distances use 400×600 coordinates.
const sprite=name=>`assets/sprites/${name}.webp`;
const item=(id,name)=>({id,name,asset:sprite(id)});
export const CONFIG={
  branding:{title:'OOPS (steam)',credit:'made by billy',button:'OOPS',name:'원터치 서바이벌'},
  world:{width:400,height:600,unit:10},
  player:{size:5,speed:160,y:540,edgeMargin:5,initialDirection:1,animationFPS:10,body:{width:.34,height:.72,offsetY:.06},frames:[0,1,2,3].map(n=>sprite(`run-${n}`))},
  survival:{initialChips:2,deathOnHit:3,invincibility:1.2},
  difficulty:{growth:1.1,period:30},
  spawning:{interval:.85,initialDelay:1.4,maxAngle:15,candidateAttempts:24,reactionTime:.3,arrivalWindow:.42,minimumGap:58},
  collision:{padding:1.5},
  maps:[{id:'erangel',name:'에란겔'},{id:'miramar',name:'미라마'},{id:'taego',name:'태이고'},{id:'sanhok',name:'사녹'},{id:'vikendi',name:'비켄디'},{id:'rondo',name:'론도'}].map(m=>({...m,asset:`assets/maps/${m.id}.webp`})),
  weather:{mapPeriod:60,stormStart:360,transition:.8,rainCount:42,rainOpacity:.23,dim:.19,thunderMin:9,thunderMax:18,lightningOpacity:.07},
  countdown:3,
  obstacles:[
    {id:'missile',name:'레드존 미사일',size:5,speed:155,weight:1,body:{width:.48,height:.83}},
    {id:'uaz',name:'UAZ',size:8,speed:140,weight:1,body:{width:.87,height:.76}},
    {id:'pony',name:'포니쿠페',size:7,speed:147,weight:1,body:{width:.88,height:.72}},
    {id:'coupe',name:'쿠페RB',size:6,speed:152,weight:1,body:{width:.87,height:.72}},
    {id:'mirado',name:'미라도',size:8,speed:142,weight:1,body:{width:.88,height:.72}},
    {id:'pickup',name:'픽업트럭',size:8,speed:140,weight:1,body:{width:.87,height:.74}},
    {id:'grenade',name:'수류탄',size:3,speed:158,weight:.8,body:{width:.72,height:.79}}
  ].map(o=>({...o,asset:sprite(o.id)})),
  equipment:{helmets:[item('helmet1','1뚝'),item('helmet2','2뚝'),item('helmet3','3뚝')],outfits:[item('vest1','1갑바'),item('vest2','2갑바'),item('vest3','3갑바'),item('ghillie','길리슈트')],guns:[item('aug','어그'),item('m416','엠포'),item('beryl','베릴'),item('mp5k','MP5K'),item('ace','에이스'),item('k2','K2'),item('scar','스카'),item('ump','움프'),item('dbs','떱배'),item('m24','M24'),item('awm','에땁'),item('lynx','링스')],defaults:{helmet:'helmet3',outfit:'vest2',gun:'m416'},layout:{ghillie:{x:-.03,y:-.06,width:.62,height:.65},helmet:{x:.14,y:-.38,width:.35,height:.28},outfit:{x:-.025,y:-.035,width:.42,height:.42},gun:{x:.08,y:.07,width:.75,height:.23}}},
  assets:{crate:sprite('crate')},
  audio:{master:.3,turn:.22,hit:.42,death:.42,record:.30,rain:.06,thunder:.12,frequencies:{turn:480,hit:110,death:85,record:720}},
  storageKey:'oops-dodge-v1'
};
