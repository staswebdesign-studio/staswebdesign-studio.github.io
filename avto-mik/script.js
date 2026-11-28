(function(){
  var WA='79841530037';
  var wa=function(t){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(t)};
  var fmt=function(n){return n.toLocaleString('ru-RU').replace(/ | /g,' ')+' ₽'};
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- hero opens ---------- */
  var hero=$('#hero');
  var img=$('.opening img');
  var open=function(){requestAnimationFrame(function(){hero.classList.add('is-open')})};
  if(img.complete) open(); else {img.addEventListener('load',open);img.addEventListener('error',open);setTimeout(open,1600)}

  /* ---------- smooth scroll ---------- */
  var lenis=null;
  if(window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    lenis=new Lenis({duration:1.1,smoothWheel:true});
    var raf=function(t){lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  }
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href');if(id.length<2)return;
      var el=$(id);if(!el)return;e.preventDefault();closeMenu();
      if(lenis) lenis.scrollTo(el,{offset:id==='#top'?0:-70}); else el.scrollIntoView({behavior:'smooth'});
    });
  });

  /* ---------- header ---------- */
  var hdr=$('#hdr');
  var fab=$('#fab');
  var onScroll=function(){hdr.classList.toggle('is-solid',window.scrollY>hero.offsetHeight-90);fab.classList.toggle('show',window.scrollY>hero.offsetHeight*.6)};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- mobile menu ---------- */
  var burger=$('#burger'),mm=$('#mmenu');
  function closeMenu(){document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');mm.setAttribute('aria-hidden','true');if(lenis)lenis.start()}
  burger.addEventListener('click',function(){
    var on=!document.body.classList.contains('menu-open');
    if(!on){closeMenu();return}
    document.body.classList.add('menu-open');burger.setAttribute('aria-expanded','true');mm.setAttribute('aria-hidden','false');if(lenis)lenis.stop();
  });
  addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

  /* ---------- catalog ---------- */
  var CAT=[
    {f:'tech',tag:'Трактор',img:'mini-traktor',alt:'Красный компактный трактор с кабиной',h:'Мини-трактор',p:'До 35 л.с., кабина. Для огорода, фермы и уборки снега.',pr:690000},
    {f:'tech',tag:'Трактор',img:'traktor-sinij',alt:'Синий трактор с кабиной, вид сбоку',h:'Трактор с кабиной',p:'От 50 л.с., полный привод, кабина с отоплением для работы круглый год.',pr:1250000},
    {f:'tech',tag:'Трактор',img:'traktor-oranzh',alt:'Оранжевый трактор с большой кабиной в цеху',h:'Мощный трактор',p:'От 90 л.с. Для больших полей и тяжёлого навесного оборудования.',pr:2350000},
    {f:'tech',tag:'Трактор + КУН',img:'pogruzchik',alt:'Синий трактор с фронтальным погрузчиком и ковшом',h:'Трактор с погрузчиком',p:'Ковш или вилы спереди, навеска сзади. Грузить, чистить, копать.',pr:1510000},
    {f:'tech',tag:'Спецтехника',img:'samosval',alt:'Жёлтый мини-самосвал с кабиной',h:'Мини-самосвал',p:'Думпер с самосвальным кузовом для стройки, фермы и карьера.',pr:790000},
    {f:'nav',tag:'Навесное',img:'freza',alt:'Красная почвофреза на складе',h:'Почвофреза',p:'Рыхлит и перемешивает почву за один проход. Под разную ширину захвата.',pr:95000},
    {f:'nav',tag:'Навесное',img:'plug',alt:'Синие оборотные плуги на складе',h:'Плуг оборотный',p:'Пашет туда и обратно без холостых заходов, ровная пахота без свальных гребней.',pr:160000},
    {f:'nav',tag:'Навесное',img:'borona',alt:'Ротационная борона с жёлтой рамой',h:'Ротационная борона',p:'Готовит почву под посев: дробит комья и выравнивает поле.',pr:210000},
    {f:'nav',tag:'Навесное',img:'otval',alt:'Чёрный трактор с отвалом для снега',h:'Отвал',p:'Снег зимой, грунт и щебень летом. Ставится на передний или задний навес.',pr:75000},
    {f:'nav',tag:'Для КУН',img:'zahvat',alt:'Захват-вилы на стреле погрузчика',h:'Вилы с захватом',p:'Для сена, рулонов, веток и навоза. Ставятся на погрузчик КУН.',pr:45000}
  ];
  var cat=$('#cat');
  var navHead='<div class="cat-sub reveal">Навесное оборудование<span>подбираем под мощность и навеску вашего трактора</span></div>';
  cat.innerHTML=CAT.map(function(c,i){
    return (i===5?navHead:'')+'<article class="item reveal'+(i<2?' big':c.f==='nav'?' sm':'')+'" data-f="'+c.f+'"><div class="item__ph"><img src="img/'+c.img+'.webp" alt="'+c.alt+'" loading="lazy" width="1100" height="825"><span class="item__tag">'+c.tag+'</span></div>'+
    '<div class="item__b"><h3>'+c.h+'</h3><p>'+c.p+'</p><div class="item__f"><span class="price"><small>от</small>'+fmt(c.pr)+'</span>'+
    '<a href="'+wa('Здравствуйте! Интересует '+c.h.toLowerCase()+', на сайте цена от '+fmt(c.pr)+'. Подберёте варианты?')+'" target="_blank" rel="noopener">Подобрать<svg><use href="#i-arr"/></svg></a></div></div></article>';
  }).join('');
  $$('.tab').forEach(function(t){
    t.addEventListener('click',function(){
      $$('.tab').forEach(function(x){x.classList.toggle('is-on',x===t);x.setAttribute('aria-selected',x===t)});
      var f=t.dataset.f;
      cat.className='cat f-'+f;
      $$('.item',cat).forEach(function(it){var show=f==='all'||it.dataset.f===f;it.classList.toggle('is-hidden',!show);if(show)it.classList.add('in')});
      var sub=$('.cat-sub',cat);sub.classList.toggle('is-hidden',f==='tech');sub.classList.add('in');
    });
  });

  /* ---------- calculator ---------- */
  var TYPES=[
    {id:'mini',n:'Мини-трактор',s:'до 35 л.с.',p:690000,att:true},
    {id:'mid',n:'Трактор с кабиной',s:'от 50 л.с.',p:1250000,att:true},
    {id:'big',n:'Мощный трактор',s:'от 90 л.с.',p:2350000,att:true},
    {id:'dump',n:'Мини-самосвал',s:'думпер',p:790000,att:false},
    {id:'exc',n:'Мини-экскаватор',s:'под заказ',p:750000,att:false}
  ];
  var ATT=[
    {id:'freza',n:'Почвофреза',p:95000},
    {id:'plug',n:'Плуг оборотный',p:160000},
    {id:'borona',n:'Ротационная борона',p:210000},
    {id:'kun',n:'Погрузчик КУН с ковшом',p:260000},
    {id:'otval',n:'Отвал',p:75000},
    {id:'vily',n:'Вилы с захватом',p:45000,needs:'kun'}
  ];
  var CITY=[
    {n:'Владивосток, забрать со склада',c:'ВДК',p:0},
    {n:'По Приморью',c:'ПК',p:25000},
    {n:'Хабаровск',c:'ХБР',p:55000},
    {n:'Благовещенск',c:'БЛГ',p:85000},
    {n:'Иркутск',c:'ИРК',p:150000},
    {n:'Новосибирск',c:'НСК',p:175000},
    {n:'Екатеринбург',c:'ЕКБ',p:230000},
    {n:'Москва',c:'МСК',p:290000}
  ];
  var chk='<span class="opt__chk"><svg viewBox="0 0 24 24"><use href="#i-chk"/></svg></span>';
  $('#c-type').innerHTML=TYPES.map(function(t,i){return '<label class="opt"><input type="radio" name="ctype" value="'+t.id+'"'+(i===1?' checked':'')+'><span class="opt__in"><b>'+t.n+'</b><small>'+t.s+' · от '+fmt(t.p)+'</small></span>'+chk+'</label>'}).join('');
  $('#c-att').innerHTML=ATT.map(function(a,i){return '<label class="opt"><input type="checkbox" name="catt" value="'+a.id+'"'+(i===0?' checked':'')+'><span class="opt__in"><b>'+a.n+'</b><small>от '+fmt(a.p)+(a.needs?' · к КУН':'')+'</small></span>'+chk+'</label>'}).join('');
  var sel=$('#c-city');
  sel.innerHTML=CITY.map(function(c,i){return '<option value="'+i+'">'+c.n+(c.p?' · доставка от '+fmt(c.p):' · бесплатно')+'</option>'}).join('');
  function calc(){
    var t=TYPES.find(function(x){return x.id===$('input[name=ctype]:checked').value});
    var boxes=$$('input[name=catt]');
    var kunOn=$('input[value=kun]').checked;
    boxes.forEach(function(b){
      var a=ATT.find(function(x){return x.id===b.value});
      var dis=!t.att||(a.needs==='kun'&&!kunOn);
      b.disabled=dis;if(dis)b.checked=false;
    });
    $('#c-att-hint').hidden=t.att;
    var atts=boxes.filter(function(b){return b.checked}).map(function(b){return ATT.find(function(x){return x.id===b.value})});
    var city=CITY[+sel.value];
    var rows=[[t.n+' ('+t.s+')',t.p]];
    atts.forEach(function(a){rows.push([a.n,a.p])});
    rows.push(['Доставка: '+city.n.replace(', забрать со склада',''),city.p]);
    var sum=rows.reduce(function(s,r){return s+r[1]},0);
    $('#wb-rows').innerHTML=rows.map(function(r){return '<li><span>'+r[0]+'</span><b>'+(r[1]?fmt(r[1]):'0 ₽')+'</b></li>'}).join('');
    $('#wb-city').textContent=city.c;var far=city.p>0;$('#wb-city').hidden=!far;$('#wb-i2').hidden=!far;
    tween($('#wb-total'),sum);
    var txt='Здравствуйте! Посчитал на сайте:\n'+rows.map(function(r){return '• '+r[0]+': '+fmt(r[1])}).join('\n')+'\nИтого от '+fmt(sum)+'. Подберёте варианты?';
    $('#wb-send').href=wa(txt);
  }
  var cur=0,anim;
  function tween(el,to){
    cancelAnimationFrame(anim);var from=cur,st=performance.now(),d=500;
    (function step(n){var k=Math.min(1,(n-st)/d);k=1-Math.pow(1-k,3);var v=Math.round((from+(to-from)*k)/1000)*1000;el.textContent=fmt(k===1?to:v);if(k<1)anim=requestAnimationFrame(step);else cur=to})(st);
  }
  $('.calc__form').addEventListener('change',calc);calc();

  /* ---------- inspection ---------- */
  var ins=$$('.ins'),insImg=$$('#insp-view img');
  ins.forEach(function(b){b.addEventListener('click',function(){
    var i=+b.dataset.i;
    ins.forEach(function(x){x.classList.toggle('is-on',x===b)});
    insImg.forEach(function(im,j){im.classList.toggle('is-on',j===i)});
    $('#insp-n').textContent='0'+(i+1)+' / 06';
  })});

  /* ---------- auction grades ---------- */
  var G=[
    {g:'R',t:'После ремонта',p:'Машина была в серьёзном ДТП и восстановлена. Берём только по просьбе клиента и с полным разбором, что меняли.',m:12},
    {g:'RA',t:'Мелкий ремонт кузова',p:'Меняли или чинили деталь кузова без вреда для силовой части. Бывает хорошим вариантом по цене.',m:30},
    {g:'3',t:'Требует вложений',p:'Заметные вмятины, ржавчина или следы износа салона. Цена ниже, но на ремонт нужно закладывать бюджет.',m:40},
    {g:'3.5',t:'Обычная машина с пробегом',p:'Царапины и мелкие вмятины, салон с признаками использования. Частый выбор для бюджетной покупки.',m:55},
    {g:'4',t:'Хорошее состояние',p:'Мелкие царапины, которые часто убираются полировкой. Пробег обычно небольшой, салон аккуратный.',m:70},
    {g:'4.5',t:'Отличное состояние',p:'Минимальные следы эксплуатации и небольшой пробег. Самая популярная оценка у наших клиентов: лучший баланс цены и состояния.',m:85},
    {g:'5',t:'Почти новая',p:'Очень маленький пробег, без следов использования. Стоит заметно дороже машин с оценкой 4.5.',m:94},
    {g:'S',t:'Новая машина',p:'Новый автомобиль с пробегом до нескольких сотен километров. Редкость на аукционе, и цена соответствующая.',m:100}
  ];
  var gw=$('#grades');
  gw.innerHTML=G.map(function(x,i){return '<button class="grade'+(x.g==='4.5'?' is-on':'')+'" data-i="'+i+'">'+x.g+'</button>'}).join('');
  function showG(i){var x=G[i];$('#g-big').textContent=x.g;$('#g-t').textContent=x.t;$('#g-p').textContent=x.p;$('#g-m').style.width=x.m+'%';$$('.grade',gw).forEach(function(b,j){b.classList.toggle('is-on',j===i)})}
  $$('.grade',gw).forEach(function(b){b.addEventListener('click',function(){showG(+b.dataset.i)})});
  showG(5);

  /* ---------- faq ---------- */
  $$('.qa').forEach(function(q){var b=$('button',q);b.addEventListener('click',function(){var on=!q.classList.contains('is-on');$$('.qa').forEach(function(x){x.classList.remove('is-on');$('button',x).setAttribute('aria-expanded','false')});if(on){q.classList.add('is-on');b.setAttribute('aria-expanded','true')}})});
  $('.qa').classList.add('is-on');$('.qa button').setAttribute('aria-expanded','true');

  /* ---------- order form ---------- */
  $$('[data-pick]').forEach(function(a){a.addEventListener('click',function(){var v=a.dataset.pick;var r=$('#f-what input[value="'+v+'"]');if(r)r.checked=true})});
  $('#form').addEventListener('submit',function(e){
    e.preventDefault();
    var what=$('input[name=what]:checked').value,task=$('#f-task').value.trim(),name=$('#f-name').value.trim(),city=$('#f-city').value.trim();
    var t='Здравствуйте! Заявка с сайта.\nНужно: '+what+(task?'\nЗадача: '+task:'')+(city?'\nГород: '+city:'')+(name?'\nИмя: '+name:'');
    window.open(wa(t),'_blank','noopener');
  });

  /* ---------- reveal ---------- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    $$('.reveal').forEach(function(el){io.observe(el)});
  } else $$('.reveal').forEach(function(el){el.classList.add('in')});

  /* ---------- map ---------- */
  var mapEl=$('#map'),mapDone=false;
  function initMap(){
    if(mapDone||!window.L)return;mapDone=true;
    var ll=[43.218789,131.955049];
    var m=L.map(mapEl,{scrollWheelZoom:false,zoomControl:false,attributionControl:true}).setView([43.2196,131.9535],16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(m);
    L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="pin"><i></i></div>',iconSize:[52,52],iconAnchor:[26,26]})}).addTo(m);
    m.attributionControl.setPrefix(false);L.control.zoom({position:'bottomright'}).addTo(m);
  }
  if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){initMap();o.disconnect()}},{rootMargin:'400px'}).observe(mapEl)} else initMap();

  /* ---------- cursor ---------- */
  var c=$('#cur');
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    var x=0,y=0,cx=0,cy=0;
    addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;c.classList.add('on');
      var t=e.target;
      c.classList.toggle('btn-h',!!t.closest('a,button,label,select,input,textarea'));
      c.classList.toggle('ph',!t.closest('a,button')&&!!t.closest('.item__ph,.route__ph figure,.why__ph,.insp__view,.rv--photo img,.opening'));
    },{passive:true});
    document.addEventListener('mouseleave',function(){c.classList.remove('on')});
    (function loop(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;c.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
  }
})();
