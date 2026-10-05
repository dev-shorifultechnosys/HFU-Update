/* ========================================================================== 
   HFU Enterprise — Vanilla JavaScript
   Navigation, motion, FAQ, fleet selector, live quote estimator and forms.
   ========================================================================== */
(() => {
  'use strict';
  const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];

  // Header state
  const header=qs('.site-header');
  const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>38);
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Mobile nav
  const toggle=qs('.menu-toggle'),nav=qs('.nav');
  if(toggle&&nav){const setMenu=o=>{nav.classList.toggle('open',o);toggle.setAttribute('aria-expanded',String(o));toggle.setAttribute('aria-label',o?'Close navigation':'Open navigation')};toggle.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));qsa('a',nav).forEach(a=>a.addEventListener('click',()=>setMenu(false)))}

  // Hero video graceful fallback to animated image deck
  const hero=qs('.hero'),heroVideo=qs('.hero-media video');
  if(hero&&heroVideo){heroVideo.addEventListener('error',()=>hero.classList.add('video-failed'));setTimeout(()=>{if(heroVideo.readyState<2) hero.classList.add('video-failed')},5000)}

  // Animated trust counters in the homepage hero.
  const statEls=qsa('.hero-stat strong');
  if(statEls.length){
    const targets=[{value:200,suffix:'+'},{value:7,suffix:'+ Years'},{value:10000,suffix:'+'},{value:24,suffix:'/7'}];
    const animateCount=(el,target)=>{
      if(el.dataset.counted)return;el.dataset.counted='1';el.closest('.hero-stat')?.classList.add('is-counting');
      const duration=1200,start=performance.now();
      const tick=now=>{const p=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-p,3);const val=Math.round(target.value*eased);
        el.textContent=target.value>=1000?`${Math.max(0,Math.round(val/1000))}K${target.suffix}`:`${val}${target.suffix}`;
        if(p<1)requestAnimationFrame(tick);else el.textContent=target.value===10000?`10K+`:`${target.value}${target.suffix}`;};requestAnimationFrame(tick);
    };
    if('IntersectionObserver'in window){const cob=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){statEls.forEach((el,i)=>targets[i]&&animateCount(el,targets[i]));cob.disconnect()}}),{threshold:.35});const stats=qs('.hero-stats');if(stats)cob.observe(stats)}else statEls.forEach((el,i)=>targets[i]&&animateCount(el,targets[i]));
  }

  // Reveal animations
  const reveal=qsa('.reveal');
  if('IntersectionObserver'in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.12});reveal.forEach(el=>ob.observe(el))}else reveal.forEach(el=>el.classList.add('visible'));

  // FAQ
  qsa('.faq-item').forEach(item=>{const b=qs('.faq-question',item),a=qs('.faq-answer',item);if(!b||!a)return;b.addEventListener('click',()=>{const o=item.classList.toggle('open');b.setAttribute('aria-expanded',String(o));a.style.maxHeight=o?`${a.scrollHeight}px`:'0px'})});

  // Homepage fleet selector
  const fleetData={
    small:{name:'Small Van',code:'SV',payload:'450 kg',pallets:'1 UK pallet',size:'120 × 100 × 100 cm',copy:'Best for urgent documents, samples, boxes and smaller same-day consignments.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/swv.png'},
    swb:{name:'Short Wheel Base Van',code:'SWB',payload:'800 kg',pallets:'2 UK pallets',size:'240 × 100 × 120 cm',copy:'Ideal for stock transfers, multiple parcels and compact commercial loads.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/swbv.png'},
    lwb:{name:'Long Wheel Base Van',code:'LWB',payload:'1,200 kg',pallets:'3 UK pallets',size:'340 × 120 × 180 cm',copy:'Extra room for larger commercial consignments without moving up to a truck.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/lwb.png'},
    xlwb:{name:'Extra-Long Wheel Base Van',code:'XLWB',payload:'1,000 kg',pallets:'4 UK pallets',size:'420 × 120 × 180 cm',copy:'Longer cargo capacity for bulky commercial goods and route work.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/elwb.png'},
    luton:{name:'Luton Van',code:'LV',payload:'1,000 kg',pallets:'6 UK pallets',size:'400 × 200 × 200 cm',copy:'Box, curtain and tail-lift options for larger or easier-access loading.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/Luton-van.png'},
    t75:{name:'7.5 Tonne',code:'7.5T',payload:'2,500 kg',pallets:'10 UK pallets',size:'600 × 240 × 220 cm',copy:'Commercial capacity for palletised goods and heavier distribution work.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/7-5-tonnes-1.png'},
    t18:{name:'18 Tonne',code:'18T',payload:'9,000 kg',pallets:'14 UK pallets',size:'700 × 240 × 250 cm',copy:'Heavy-duty transport for larger pallet movements and business freight.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/18-tonne.png'},
    t26:{name:'26 Tonne',code:'26T',payload:'15,000 kg',pallets:'16 UK pallets',size:'800 × 240 × 250 cm',copy:'High-capacity vehicle for substantial commercial loads and distribution.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/26-Tonne.png'},
    artic:{name:'Articulated Truck',code:'ARTIC',payload:'26,000 kg',pallets:'26 UK pallets',size:'1,360 × 250 × 260 cm',copy:'Maximum capacity for full-load freight, distribution centres and major movements.',image:'https://hfuenterprise.com/wp-content/uploads/2025/09/Artic-2.png'}
  };
  const updateFleet=key=>{const d=fleetData[key];if(!d)return;const m={'[data-fleet-name]':d.name,'[data-fleet-code]':d.code,'[data-fleet-payload]':d.payload,'[data-fleet-pallets]':d.pallets,'[data-fleet-size]':d.size,'[data-fleet-copy]':d.copy};Object.entries(m).forEach(([s,v])=>{const e=qs(s);if(e)e.textContent=v});const im=qs('[data-fleet-image]');if(im){im.src=d.image;im.alt=`${d.name} logistics vehicle`}};
  qsa('.fleet-tab').forEach(b=>b.addEventListener('click',()=>{qsa('.fleet-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');updateFleet(b.dataset.vehicle)}));

  // Live indicative estimator (front-end only — intentionally transparent)
  const rates={small:48,swb:62,lwb:78,xlwb:86,luton:92,t75:145,t18:210,t26:270,artic:330};
  const distanceFactor={'0-25':1,'25-50':1.35,'50-100':1.85,'100-200':2.65,'200+':3.8};
  const serviceFactor={same:1.35,scheduled:1,overnight:1.15,pallet:1.18,home:1.1};
  const recommendVehicle=p=>p<=1?'small':p<=2?'swb':p<=3?'lwb':p<=4?'xlwb':p<=6?'luton':p<=10?'t75':p<=14?'t18':p<=16?'t26':'artic';
  const pretty={small:'Small Van',swb:'SWB Van',lwb:'LWB Van',xlwb:'XLWB Van',luton:'Luton Van',t75:'7.5 Tonne',t18:'18 Tonne',t26:'26 Tonne',artic:'Articulated Truck'};
  const estimator=qs('[data-estimator]');
  if(estimator){const calc=()=>{const pallets=Number(qs('[name="est-pallets"]',estimator)?.value||1),distance=qs('[name="est-distance"]',estimator)?.value||'0-25',service=qs('[name="est-service"]',estimator)?.value||'scheduled',chosen=qs('[name="est-vehicle"]',estimator)?.value||'auto';const vehicle=chosen==='auto'?recommendVehicle(pallets):chosen;let low=Math.round(rates[vehicle]*distanceFactor[distance]*serviceFactor[service]);let high=Math.round(low*1.22);const price=qs('[data-est-price]'),veh=qs('[data-est-vehicle]'),bar=qs('[data-est-bar]');if(price)price.textContent=`£${low}–£${high}`;if(veh)veh.textContent=pretty[vehicle];if(bar)bar.style.width=`${Math.min(92,24+(Object.keys(rates).indexOf(vehicle)+1)*9)}%`};qsa('input,select',estimator).forEach(i=>i.addEventListener('input',calc));calc()}

  // Compact quick calculator result
  const quickCalc=qs('[data-quick-calc]');
  if(quickCalc){quickCalc.addEventListener('submit',e=>{e.preventDefault();if(!quickCalc.checkValidity()){quickCalc.reportValidity();return}const vehicle=qs('[name="vehicle"]',quickCalc)?.value||'small',distance=qs('[name="distance"]',quickCalc)?.value||'0-25';const base=rates[vehicle]*distanceFactor[distance];const card=qs('[data-quick-result]');qs('[data-quick-price]').textContent=`£${Math.round(base)}–£${Math.round(base*1.25)}`;qs('[data-quick-vehicle]').textContent=pretty[vehicle];card?.classList.add('show')})}

  // Toast + demo form feedback
  const toast=qs('.toast');const showToast=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(window.__hfuToast);window.__hfuToast=setTimeout(()=>toast.classList.remove('show'),3500)};
  qsa('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}showToast('Thanks — this front-end form is ready to connect to HFU’s CRM, email or booking system.')}));

  // Minimum selectable date = today
  qsa('input[type="date"]').forEach(input=>{const t=new Date();input.min=new Date(t.getTime()-t.getTimezoneOffset()*60000).toISOString().split('T')[0]});
})();
