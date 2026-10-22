(function(){
  var cur=document.getElementById('cur'),pv=document.getElementById('pv');
  var mx=0,my=0,cx=0,cy=0,px=0,py=0;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
  (function loop(){cx+=(mx-cx)*.2;cy+=(my-cy)*.2;px+=(mx-px)*.1;py+=(my-py)*.1;
    cur.style.left=cx+'px';cur.style.top=cy+'px';pv.style.left=px+'px';pv.style.top=py+'px';requestAnimationFrame(loop)})();
  var de=document.documentElement,C="AF93,AL355,DZ213,AS1684,AD376,AO244,AI1264,AG1268,AR54,AM374,AW297,AU61,AT43,AZ994,BS1242,BH973,BD880,BB1246,BY375,BE32,BZ501,BJ229,BM1441,BT975,BO591,BA387,BW267,BR55,IO246,VG1284,BN673,BG359,BF226,BI257,KH855,CM237,CA1,CV238,KY1345,CF236,TD235,CL56,CN86,CO57,KM269,CK682,CR506,HR385,CU53,CW599,CY357,CZ420,CD243,DK45,DJ253,DM1767,DO1809,TL670,EC593,EG20,SV503,GQ240,ER291,EE372,SZ268,ET251,FK500,FO298,FJ679,FI358,FR33,PF689,GA241,GM220,GE995,DE49,GH233,GI350,GR30,GL299,GD1473,GU1671,GT502,GG44,GN224,GW245,GY592,HT509,HN504,HK852,HU36,IS354,IN91,ID62,IR98,IQ964,IE353,IM44,IL972,IT39,CI225,JM1876,JP81,JE44,JO962,KZ7,KE254,KI686,XK383,KW965,KG996,LA856,LV371,LB961,LS266,LR231,LY218,LI423,LT370,LU352,MO853,MG261,MW265,MY60,MV960,ML223,MT356,MH692,MR222,MU230,MX52,FM691,MD373,MC377,MN976,ME382,MS1664,MA212,MZ258,MM95,NA264,NR674,NP977,NL31,NC687,NZ64,NI505,NE227,NG234,NU683,KP850,MK389,MP1670,NO47,OM968,PK92,PW680,PS970,PA507,PG675,PY595,PE51,PH63,PL48,PT351,PR1787,QA974,CG242,RO40,RU7,RW250,WS685,SM378,ST239,SA966,SN221,RS381,SC248,SL232,SG65,SX1721,SK421,SI386,SB677,SO252,ZA27,KR82,SS211,ES34,LK94,SD249,SR597,SE46,CH41,SY963,TW886,TJ992,TZ255,TH66,TG228,TK690,TO676,TT1868,TN216,TR90,TM993,TC1649,TV688,VI1340,UG256,UA380,AE971,GB44,US1,UY598,UZ998,VU678,VA379,VE58,VN84,YE967,ZM260,ZW263,MQ596,GP590,RE262,YT262,BL590,MF590,PM508,WF681,EH212,AX358,BQ599,GF594,SJ47",dn;
  try{dn=new Intl.DisplayNames(['en'],{type:'region'})}catch(e){}
  var sel=document.getElementById('cc'),reg=((navigator.language||'').split('-')[1]||'US').toUpperCase();
  C.split(',').map(function(s){var cc=s.slice(0,2),n=cc;try{n=dn.of(cc)||cc}catch(e){}return{cc:cc,n:n,d:s.slice(2)}}).sort(function(a,b){return a.n.localeCompare(b.n)}).forEach(function(c){var o=document.createElement('option');o.value=c.d;o.textContent=c.n+' (+'+c.d+')';if(c.cc===reg)o.selected=true;sel.appendChild(o)});
  var tf=document.getElementById('tf'),ok=document.getElementById('ok'),er=document.getElementById('err');
  function ot(o){de.classList.toggle('talk-open',o);if(o){tf.reset();tf.hidden=false;ok.hidden=true;er.textContent='';de.classList.remove('menu-open')}if(window.__l){o?window.__l.stop():window.__l.start()}}
  document.querySelectorAll('#talk,.talk').forEach(function(t){t.addEventListener('click',function(e){e.preventDefault();ot(true)})});
  document.getElementById('tx').addEventListener('click',function(){ot(false)});
  document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)ot(false)});
  addEventListener('keydown',function(e){if(e.key==='Escape')ot(false)});
  tf.addEventListener('submit',function(e){e.preventDefault();
    var n=tf.n.value.trim(),em=tf.e.value.trim(),ph=tf.p.value.replace(/[\s\-().]/g,''),m=tf.m.value.trim();
    if(!n||!/^\S+@\S+\.\S+$/.test(em)||!/^\d{4,14}$/.test(ph)||!m){er.textContent='Please fill in every field with a valid email and phone number.';return}
    er.textContent='';
    var b='Name: '+n+'\nEmail: '+em+'\nPhone: +'+tf.c.value+ph+'\n\n'+m;
    tf.hidden=true;ok.hidden=false;
    location.href='mailto:hello@example.com?subject='+encodeURIComponent('New message from '+n)+'&body='+encodeURIComponent(b)});
  var root=document.documentElement,bg=document.getElementById('burger');
  function tog(o){root.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o);document.getElementById('bl').textContent=o?'Close':'Menu';if(window.__l){o?window.__l.stop():window.__l.start()}}
  bg.addEventListener('click',function(){tog(!root.classList.contains('menu-open'))});
  document.querySelectorAll('.gp a').forEach(function(a){a.addEventListener('click',function(){tog(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});
  document.addEventListener('mouseover',function(e){var t=e.target.closest&&e.target.closest('.card,.work a,a,button,summary'),k='';if(t){if(t.matches('.card')){k='big';cur.dataset.l='View'}else if(t.matches('.work a')){k='big';cur.dataset.l='Open'}else k='sm'}cur.className=k});
  var cv=document.getElementById('gl'),g=cv&&cv.getContext('webgl');
  if(g){var FS=`precision mediump float;uniform vec2 r,m;uniform float t,s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r*2.-1.;float d=length(uv);vec2 q=uv+(m-.5)*.5;
float w=fb(q*2.+vec2(t*.2,-t*.15)+fb(q*3.-t*.1+s)*1.6);
vec3 bl=vec3(.19,.2,.23),og=vec3(.839,1.,.239),dk=vec3(.047,.051,.063);
vec3 c=mix(dk,bl,smoothstep(.2,.6,w));c=mix(c,og,smoothstep(.55,.85,w+(1.-d)*.25));
float e=smoothstep(1.,.97,d);float l=pow(max(0.,1.-d),.6);
gl_FragColor=vec4(c*(.7+.5*l)*e,e);}`;
    var sh=function(ty,src){var o=g.createShader(ty);g.shaderSource(o,src);g.compileShader(o);return o};
    var pr=g.createProgram();g.attachShader(pr,sh(g.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));g.attachShader(pr,sh(g.FRAGMENT_SHADER,FS));g.linkProgram(pr);
    if(g.getProgramParameter(pr,g.LINK_STATUS)){
      document.getElementById('orb').classList.add('gl');g.useProgram(pr);
      g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),g.STATIC_DRAW);
      var al=g.getAttribLocation(pr,'a');g.enableVertexAttribArray(al);g.vertexAttribPointer(al,2,g.FLOAT,false,0,0);
      var ur=g.getUniformLocation(pr,'r'),um=g.getUniformLocation(pr,'m'),ut=g.getUniformLocation(pr,'t'),us=g.getUniformLocation(pr,'s');
      var gx=.5,gy=.5,tx=.5,ty=.5;
      addEventListener('mousemove',function(e){tx=e.clientX/innerWidth;ty=1-e.clientY/innerHeight});
      var rs=function(){var d=Math.min(devicePixelRatio||1,2);cv.width=cv.clientWidth*d;cv.height=cv.clientHeight*d;g.viewport(0,0,cv.width,cv.height)};rs();addEventListener('resize',rs);
      g.clearColor(0,0,0,0);
      (function f(t){requestAnimationFrame(f);if(scrollY>innerHeight*1.3)return;gx+=(tx-gx)*.05;gy+=(ty-gy)*.05;
        g.uniform2f(ur,cv.width,cv.height);g.uniform2f(um,gx,gy);g.uniform1f(ut,t*.001);g.uniform1f(us,scrollY*.002);
        g.clear(g.COLOR_BUFFER_BIT);g.drawArrays(g.TRIANGLE_STRIP,0,4)})(0);
    }}
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){var l=window.__l=new Lenis({lerp:.09});l.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(function(t){l.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
  var o={v:0},lc=document.getElementById('ldc');
  gsap.timeline().to(o,{v:100,duration:1.6,ease:'power2.inOut',onUpdate:function(){lc.textContent=Math.round(o.v)}}).to('#ld',{yPercent:-100,duration:.9,ease:'power4.inOut'},'+=.15').set('#ld',{display:'none'});
  gsap.from('.hero .line span',{yPercent:110,duration:1.3,stagger:.12,ease:'power4.out',delay:2.2});
  gsap.from('.meta,.orb,.tag,.intro',{opacity:0,y:30,duration:1,delay:2.8,stagger:.12});
  gsap.to('.orb',{yPercent:60,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.utils.toArray('.work a,[data-reveal],.contact .big,.faq details').forEach(function(el){
    gsap.from(el,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}})});
  gsap.utils.toArray('[data-split]').forEach(function(el){el.innerHTML=el.textContent.trim().split(/\s+/).map(function(x){return '<span class="w'+(x.toLowerCase().replace(/[^a-z]/g,'')===(el.dataset.em||'#')?' em':'')+'"><span>'+x+'</span></span>'}).join(' ');
    gsap.from(el.querySelectorAll('.w>span'),{yPercent:110,rotate:6,duration:1,stagger:.06,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}})});
  gsap.utils.toArray('.burger,.send,.contact .big,.x,.soc a,.pill').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.3,duration:.4,ease:'power2.out'})});
    b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.8,ease:'elastic.out(1,.4)'})})});
  var wp=document.getElementById('wipe');
  document.querySelectorAll('.gp a,.logo').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
    gsap.timeline().to(wp,{yPercent:-100,duration:.55,ease:'power3.in'}).add(function(){tog(false);if(window.__l)window.__l.scrollTo(t,{immediate:true,force:true});else t.scrollIntoView()}).to(wp,{yPercent:-200,duration:.6,ease:'power3.out'}).set(wp,{yPercent:0})})});
  gsap.to('#prog',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}});
  var tr=document.getElementById('track'),bar=document.querySelector('.bar i'),cards=gsap.utils.toArray('.card');
  if(tr){tr.style.overflow='visible';
    gsap.to(tr,{x:function(){return -(tr.scrollWidth-tr.clientWidth)},ease:'none',scrollTrigger:{trigger:'#samples',start:'top top',end:function(){return '+='+(tr.scrollWidth-tr.clientWidth+innerHeight*.4)},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,onUpdate:function(s){gsap.set(bar,{scaleX:s.progress})}}});
    gsap.from(cards,{y:80,opacity:0,rotate:4,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#samples',start:'top 70%'}});}
  var sk=0,tg=0;
  ScrollTrigger.create({onUpdate:function(s){tg=gsap.utils.clamp(-8,8,s.getVelocity()/-300)}});
  gsap.ticker.add(function(){tg*=.92;sk+=(tg-sk)*.1;cards.forEach(function(c){gsap.set(c,{skewX:sk})})});
  cards.forEach(function(c){var a=c.querySelector('.art');
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(a,{rotateY:x*18,rotateX:-y*18,scale:1.05,duration:.5,ease:'power2.out',transformPerspective:700})});
    c.addEventListener('mouseleave',function(){gsap.to(a,{rotateY:0,rotateX:0,scale:1,duration:.8,ease:'elastic.out(1,.5)'})})});
})();
