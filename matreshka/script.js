(function () {
  'use strict';
  var WA = '79141896999';
  var TG = 'https://t.me/+79141896999';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rub = function (n) { return n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽'; };
  var dur = function (m) {
    if (!m) return '0 мин';
    var h = Math.floor(m / 60), r = m % 60;
    return (h ? h + ' ч' : '') + (h && r ? ' ' : '') + (r ? r + ' мин' : '');
  };

  /* ---------- прайс: одна таблица на прайс и конструктор ---------- */
  var PRICE = [
    { cat: 'lash', group: 'Ресницы', items: [
      { id: 'classic', n: 'Наращивание, классика', short: 'Классика', p: 2000, t: 120, d: 'Одна искусственная ресничка на одну свою' },
      { id: 'd15', n: 'Наращивание 1,5D', short: '1,5D', p: 2300, t: 120, d: 'Через одну ресничку пучок из двух' },
      { id: 'd2', n: 'Наращивание 2D', short: '2D', p: 2500, t: 150, d: 'Два волоска на каждую свою, заметный объём' },
      { id: 'd3', n: 'Наращивание 3D', short: '3D', p: 2800, t: 150, d: 'Три тонких волоска, густой выразительный взгляд' },
      { id: 'wet', n: 'Мокрый эффект', short: 'Мокрый эффект', p: 2600, t: 150, d: 'Ресницы как после душа: лучики с острыми кончиками' },
      { id: 'corr', n: 'Коррекция наращивания', short: 'Коррекция', p: 1600, t: 90, d: 'До трёх недель после наращивания' },
      { id: 'lam', n: 'Ламинирование ресниц с окрашиванием', short: 'Ламинирование', p: 1800, t: 60, d: 'Изгиб и цвет своих ресниц на полтора месяца' },
      { id: 'botox', n: 'Ботокс для ресниц', short: 'Ботокс к ламинированию', p: 300, t: 10, d: 'Питание и блеск, делается вместе с ламинированием', add: true },
      { id: 'tint', n: 'Окрашивание ресниц', short: 'Окрашивание ресниц', p: 400, t: 20, d: 'Тёмные ресницы без туши на три или четыре недели', add: true },
      { id: 'remove', n: 'Снятие наращивания', short: 'Снятие старых ресниц', p: 300, t: 20, d: 'Бережно, специальным составом', add: true }
    ]},
    { cat: 'brow', group: 'Брови', items: [
      { id: 'b-corr', n: 'Коррекция формы бровей', short: 'Коррекция', p: 600, t: 30, d: 'Воск или пинцет, форма по чертам лица' },
      { id: 'b-tint', n: 'Окрашивание бровей краской', short: 'Окрашивание', p: 500, t: 20, d: 'Оттенок под цвет волос и кожи' },
      { id: 'b-arch', n: 'Архитектура бровей', short: 'Архитектура', p: 1000, t: 50, d: 'Коррекция и окрашивание за один визит' },
      { id: 'b-henna', n: 'Окрашивание бровей хной с коррекцией', short: 'Хна и коррекция', p: 1300, t: 60, d: 'Окрашивает и волоски, и кожу: брови выглядят гуще' },
      { id: 'b-lam', n: 'Долговременная укладка бровей', short: 'Долговременная укладка', p: 1600, t: 60, d: 'Волоски лежат как нужно до шести недель' },
      { id: 'b-full', n: 'Укладка, окрашивание и коррекция бровей', short: 'Укладка под ключ', p: 2000, t: 80, d: 'Полный уход за бровями за один визит' }
    ]}
  ];
  var BY = {};
  PRICE.forEach(function (g) { g.items.forEach(function (i) { i.cat = g.cat; BY[i.id] = i; }); });

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  function goTo(hash) {
    var el = $(hash);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var h = a.getAttribute('href');
      if (h.length < 2) return;
      e.preventDefault();
      closeMenu();
      var svc = a.getAttribute('data-service');
      if (svc) setService(svc);
      goTo(h);
    });
  });

  /* ---------- шапка и меню ---------- */
  var hdr = $('.hdr');
  var fab = $('.fab');
  var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 10); fab.classList.toggle('is-on', window.scrollY > 520); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  var burger = $('.burger');
  function closeMenu() {
    document.documentElement.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    $('.mnav').setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    var open = !document.documentElement.classList.contains('menu-open');
    if (!open) return closeMenu();
    document.documentElement.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    $('.mnav').setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  });
  window.addEventListener('resize', function () { if (innerWidth > 1180) closeMenu(); });

  /* ---------- появление ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- иллюстрации в карточках ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function line(g, x1, y1, x2, y2) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1));
    g.appendChild(p);
    return p;
  }
  function qpt(t, p0, c, p1) {
    var u = 1 - t;
    return { x: u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], y: u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
      dx: 2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), dy: 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]) };
  }
  $$('.a-lashes').forEach(function (g) {
    var ext = g.getAttribute('data-eye') === 'ext';
    var n = ext ? 34 : 22;
    for (var i = 0; i < n; i++) {
      var t = 0.04 + 0.92 * i / (n - 1);
      var q = qpt(t, [30, 78], [120, 18], [210, 78]);
      var L = Math.hypot(q.dx, q.dy), nx = q.dy / L, ny = -q.dx / L;
      if (ny > 0) { nx = -nx; ny = -ny; }
      var len = ext ? 16 + 20 * Math.pow(t, 1.3) : 13 + 6 * Math.sin(Math.PI * t);
      var bend = ext ? 7 + 7 * t : 9;
      var p = document.createElementNS(NS, 'path');
      var ex = q.x + nx * len + bend * 0.6, ey = q.y + ny * len;
      p.setAttribute('d', 'M' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + 'Q' + (q.x + nx * len * 0.6 - 2).toFixed(1) + ' ' + (q.y + ny * len * 0.7).toFixed(1) + ' ' + ex.toFixed(1) + ' ' + (ey + (ext ? 0 : 4)).toFixed(1));
      p.setAttribute('fill', 'none');
      g.appendChild(p);
    }
  });
  $$('.a-hairs').forEach(function (g) {
    var r = 7;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for (var i = 0; i < 70; i++) {
      var t = i / 69;
      var q = qpt(t, [38, 86], [120, 30], [204, 72]);
      var w = 14 * Math.sin(Math.PI * Math.min(1, t * 1.15)) + 3;
      var off = (rnd() - 0.3) * w;
      var x = q.x, y = q.y + off;
      var ang = t < 0.25 ? -1.35 : (t < 0.7 ? -0.55 : 0.25);
      var len = 9 + rnd() * 6;
      line(g, x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    }
  });

  /* ---------- конструктор визита ---------- */
  var state = { lash: null, brow: null, add: {} };
  var LASH_OPTS = ['classic', 'd2', 'd3', 'wet', 'lam', 'corr'];
  var BROW_OPTS = ['b-corr', 'b-arch', 'b-henna', 'b-lam', 'b-full'];
  var ADD_OPTS = ['remove', 'botox', 'tint'];
  function chip(id, multi) {
    var it = BY[id], b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.id = id;
    b.setAttribute(multi ? 'aria-pressed' : 'aria-checked', 'false');
    if (!multi) b.setAttribute('role', 'radio');
    b.innerHTML = '<span>' + it.short + '</span><small>' + rub(it.p) + '</small>';
    return b;
  }
  var lashBox = $('[data-layer="lash"] .chips'), browBox = $('[data-layer="brow"] .chips'), addBox = $('[data-layer="add"] .chips');
  if (lashBox) {
    LASH_OPTS.forEach(function (id) { lashBox.appendChild(chip(id)); });
    BROW_OPTS.forEach(function (id) { browBox.appendChild(chip(id)); });
    ADD_OPTS.forEach(function (id) { addBox.appendChild(chip(id, true)); });
    lashBox.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      state.lash = state.lash === b.dataset.id ? null : b.dataset.id; render();
    });
    browBox.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      state.brow = state.brow === b.dataset.id ? null : b.dataset.id; render();
    });
    addBox.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      var id = b.dataset.id; state.add[id] = !state.add[id]; render();
    });
    state.lash = 'classic'; state.brow = 'b-arch';
    render();
  }
  function isExt(id) { return ['classic', 'd15', 'd2', 'd3', 'wet', 'corr'].indexOf(id) > -1; }
  function allowed(id) {
    if (id === 'botox') return state.lash === 'lam';
    if (id === 'tint') return !state.lash;
    if (id === 'remove') return isExt(state.lash) && state.lash !== 'corr';
    return true;
  }
  function picked() {
    var out = [];
    if (state.lash) out.push(BY[state.lash]);
    if (state.brow) out.push(BY[state.brow]);
    ADD_OPTS.forEach(function (id) { if (state.add[id] && allowed(id)) out.push(BY[id]); });
    return out;
  }
  function render() {
    ADD_OPTS.forEach(function (id) { if (!allowed(id)) state.add[id] = false; });
    $$('.chip', lashBox).forEach(function (b) { var on = b.dataset.id === state.lash; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
    $$('.chip', browBox).forEach(function (b) { var on = b.dataset.id === state.brow; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
    $$('.chip', addBox).forEach(function (b) {
      var id = b.dataset.id, ok = allowed(id);
      b.disabled = !ok; b.classList.toggle('is-on', !!state.add[id] && ok); b.setAttribute('aria-pressed', !!state.add[id] && ok);
    });
    var list = picked(), sum = 0, time = 0;
    var ul = $('.sum__list'); ul.innerHTML = '';
    list.forEach(function (it) {
      sum += it.p; time += it.t;
      var li = document.createElement('li');
      li.innerHTML = '<span>' + it.n + '</span><span>' + rub(it.p) + '</span>';
      ul.appendChild(li);
    });
    if (!list.length) ul.innerHTML = '<li class="empty">Выберите хотя бы одну услугу</li>';
    $('.sum__price').innerHTML = (list.length ? 'от ' : '') + rub(sum);
    $('.sum__time').textContent = dur(time);
    $('.nl--lash').classList.toggle('is-on', !!state.lash);
    $('.nl--brow').classList.toggle('is-on', !!state.brow);
    $('.nl--add').classList.toggle('is-on', list.some(function (i) { return i.add; }));
    var wa = $('.sum__wa');
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(builderText(list, sum, time));
    wa.setAttribute('aria-disabled', list.length ? 'false' : 'true');
    $('.sum__tg').setAttribute('aria-disabled', list.length ? 'false' : 'true');
  }
  function builderText(list, sum, time) {
    return 'Здравствуйте! Хочу записаться в «Матрёшку»: ' + list.map(function (i) { return i.n.charAt(0).toLowerCase() + i.n.slice(1); }).join(', ') +
      '. По сайту выходит от ' + sum.toLocaleString('ru-RU') + ' ₽, около ' + dur(time) + '. Подскажите свободное время?';
  }
  var tgBtn = $('.sum__tg');
  if (tgBtn) tgBtn.addEventListener('click', function () {
    var list = picked(), sum = 0, time = 0;
    list.forEach(function (i) { sum += i.p; time += i.t; });
    toTelegram(builderText(list, sum, time));
  });

  /* ---------- Telegram: копируем текст и открываем чат ---------- */
  var toastEl = $('.toast'), tt;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600);
  }
  function toTelegram(text) {
    var done = function () { toast('Текст заявки скопирован, вставьте его в чат Telegram'); };
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    } catch (e) { done(); }
    window.open(TG, '_blank', 'noopener');
  }

  /* ---------- карта длин ресниц ---------- */
  var FX = {
    nat: { f: function (t) { return 8 + 3.2 * t; }, d: 'Плавно удлиняется к внешнему уголку, как свои ресницы, только гуще. Подходит почти всем и не требует макияжа.' },
    fox: { f: function (t) { return 7 + 6.2 * Math.pow(t, 1.8); }, d: 'Короткие у внутреннего уголка и длинные у внешнего: взгляд вытягивается, как со стрелкой. Красиво на миндалевидных глазах.' },
    doll: { f: function (t) { return 9 + 4 * Math.sin(Math.PI * t); }, d: 'Самые длинные ресницы в центре: глаз кажется круглее и больше. Хорош для узкого или глубоко посаженного разреза.' },
    squ: { f: function (t) { return 8 + 5 * Math.exp(-Math.pow((t - 0.74) / 0.18, 2)); }, d: 'Пик длины ближе к внешнему краю, но не в самом уголке. Приподнимает взгляд, когда уголки глаз опущены.' }
  };
  var fxG = $('.fx__lashes'), fxM = $('.fx__marks'), fxPaths = [], N = 46, cur = [], target = [];
  if (fxG) {
    for (var i = 0; i < N; i++) { var p = document.createElementNS(NS, 'path'); fxG.appendChild(p); fxPaths.push(p); cur.push(FX.nat.f(i / (N - 1))); }
    var marks = [0.02, 0.26, 0.5, 0.74, 0.98];
    marks.forEach(function (t) {
      var tx = document.createElementNS(NS, 'text'); fxM.appendChild(tx); tx.dataset.t = t;
    });
    target = cur.slice();
    drawFx();
    $$('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.tab').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
        var fx = FX[b.dataset.fx];
        target = []; for (var i = 0; i < N; i++) target.push(fx.f(i / (N - 1)));
        var d = $('.fx__desc'); d.style.opacity = 0;
        setTimeout(function () { d.textContent = fx.d; d.style.opacity = 1; }, 220);
        animateFx();
      });
    });
  }
  function drawFx() {
    for (var i = 0; i < N; i++) {
      var t = 0.03 + 0.94 * i / (N - 1);
      var q = qpt(t, [60, 200], [280, 60], [500, 200]);
      var L = Math.hypot(q.dx, q.dy), nx = q.dy / L, ny = -q.dx / L;
      if (ny > 0) { nx = -nx; ny = -ny; }
      var len = cur[i] * 9.5;
      var sway = (t - 0.5) * 26;
      var ex = q.x + nx * len + sway, ey = q.y + ny * len;
      var cx = q.x + nx * len * 0.55, cy = q.y + ny * len * 0.55;
      fxPaths[i].setAttribute('d', 'M' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1));
    }
    $$('text', fxM).forEach(function (tx) {
      var idx = Math.round(+tx.dataset.t * (N - 1)), t = 0.03 + 0.94 * idx / (N - 1);
      var q = qpt(t, [60, 200], [280, 60], [500, 200]);
      var L = Math.hypot(q.dx, q.dy), nx = q.dy / L, ny = -q.dx / L;
      if (ny > 0) { nx = -nx; ny = -ny; }
      var len = cur[idx] * 9.5 + 22, sway = (t - 0.5) * 26;
      tx.setAttribute('x', (q.x + nx * len + sway * 1.2).toFixed(1));
      tx.setAttribute('y', (q.y + ny * len).toFixed(1));
      tx.textContent = Math.round(cur[idx]) + ' мм';
    });
  }
  var fxRaf;
  function animateFx() {
    cancelAnimationFrame(fxRaf);
    var from = cur.slice(), t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      for (var i = 0; i < N; i++) cur[i] = from[i] + (target[i] - from[i]) * e;
      drawFx();
      if (k < 1) fxRaf = requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- прайс ---------- */
  var plist = $('.plist');
  if (plist) {
    PRICE.forEach(function (g) {
      var wrap = document.createElement('div'); wrap.className = 'pgroup'; wrap.dataset.cat = g.cat;
      var h = document.createElement('h3'); h.textContent = g.group; wrap.appendChild(h);
      g.items.forEach(function (it) {
        var r = document.createElement('div'); r.className = 'prow'; r.dataset.cat = g.cat;
        r.dataset.q = (it.n + ' ' + it.d).toLowerCase();
        r.innerHTML = '<span class="prow__n">' + it.n + '</span><span class="prow__p">от ' + rub(it.p) + '</span><span class="prow__d">' + it.d + ' · ' + dur(it.t) + '</span>';
        wrap.appendChild(r);
      });
      plist.appendChild(wrap);
    });
    var cat = 'all', q = '';
    var filter = function () {
      var shown = 0;
      $$('.pgroup', plist).forEach(function (g) {
        var any = 0;
        $$('.prow', g).forEach(function (r) {
          var ok = (cat === 'all' || r.dataset.cat === cat) && (!q || r.dataset.q.indexOf(q) > -1);
          r.classList.toggle('is-hidden', !ok); if (ok) any++;
        });
        $('h3', g).style.display = any ? '' : 'none';
        shown += any;
      });
      $('.pempty').hidden = shown > 0;
    };
    $$('.ptab').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.ptab').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        cat = b.dataset.cat; filter();
      });
    });
    $('.search input').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); filter(); });
  }

  /* ---------- аккордеоны с плавным открытием ---------- */
  $$('.acc__i').forEach(function (d) {
    var s = $('summary', d), b = $('.acc__b', d), busy = false;
    s.addEventListener('click', function (e) {
      e.preventDefault();
      if (busy) return; busy = true;
      if (d.open) {
        var h = b.scrollHeight;
        b.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' })
          .onfinish = function () { d.open = false; busy = false; };
      } else {
        d.open = true;
        var h2 = b.scrollHeight;
        b.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.22,.8,.24,1)' })
          .onfinish = function () { busy = false; };
      }
    });
  });

  /* ---------- форма записи ---------- */
  var sel = $('.sel'), selBtn = $('.sel__btn'), selList = $('.sel__list'), selInput = $('input[name="service"]');
  var OPTS = ['Пока не знаю, нужна консультация', 'Наращивание ресниц', 'Коррекция наращивания', 'Ламинирование ресниц', 'Брови', 'Ресницы и брови за один визит'];
  OPTS.forEach(function (o, i) {
    var li = document.createElement('li'); li.setAttribute('role', 'option'); li.textContent = o;
    li.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); selList.appendChild(li);
  });
  function setService(v) {
    if (OPTS.indexOf(v) < 0) v = OPTS[1];
    selInput.value = v; selBtn.textContent = v;
    $$('li', selList).forEach(function (li) { li.setAttribute('aria-selected', li.textContent === v); });
  }
  selBtn.addEventListener('click', function () {
    var o = !sel.classList.contains('is-open'); sel.classList.toggle('is-open', o); selBtn.setAttribute('aria-expanded', o);
  });
  selList.addEventListener('click', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    setService(li.textContent); sel.classList.remove('is-open'); selBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', function (e) { if (!sel.contains(e.target)) sel.classList.remove('is-open'); });
  selList.addEventListener('wheel', function (e) { e.stopPropagation(); }, { passive: true });
  selList.setAttribute('data-lenis-prevent', '');

  $('#book').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, name = f.name.value.trim(), when = f.when.value.trim();
    var text = 'Здравствуйте!' + (name ? ' Меня зовут ' + name + '.' : '') + ' Хочу записаться в «Матрёшку»: ' + selInput.value.toLowerCase() + '.' + (when ? ' Удобно: ' + when + '.' : '') + ' Подскажите свободное время?';
    if (f.ch.value === 'tg') toTelegram(text);
    else window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  /* ---------- карта OpenStreetMap ---------- */
  if (window.L && $('#map')) {
    var ll = [48.417466, 135.107612];
    var map = L.map('map', { center: ll, zoom: 16, scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    var icon = L.divIcon({ className: '', iconSize: [46, 58], iconAnchor: [23, 56],
      html: '<svg class="pin" viewBox="0 0 46 58"><path d="M23 2C11.4 2 2 11.2 2 22.6 2 38 23 56 23 56s21-18 21-33.4C44 11.2 34.6 2 23 2z" fill="#9B2335"/><circle cx="23" cy="22" r="8" fill="#F7F1E8"/></svg>' });
    L.marker(ll, { icon: icon, keyboard: false }).addTo(map).bindPopup('<b>Матрёшка</b><br>Краснореченская, 139');
    map.attributionControl.setPrefix(false);
  }

  /* ---------- курсор ---------- */
  var cur$ = $('.cursor');
  if (cur$ && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cur$.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      cur$.classList.add('is-on');
      var t = e.target;
      cur$.classList.toggle('is-link', !!t.closest('a,button,summary,.chip,label'));
      cur$.classList.toggle('is-dark', !!t.closest('.lashmap__art,.card__art'));
    });
    document.addEventListener('mouseleave', function () { cur$.classList.remove('is-on'); });
  }
})();
