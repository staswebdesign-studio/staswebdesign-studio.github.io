(function () {
  'use strict';
  var WA = 'https://wa.me/79141896999?text=';
  var root = document.documentElement;
  var fmt = function (n) { return n.toLocaleString('ru-RU').replace(/ |\s/g, ' ') + ' ₽'; };

  /* Плавная прокрутка */
  var lenis = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  var scrollToEl = function (el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -76, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  /* Запись в WhatsApp с готовым текстом */
  document.querySelectorAll('.js-book').forEach(function (a) {
    var msg = a.getAttribute('data-msg') || 'Здравствуйте! Хочу записаться в «Матрёшку».';
    a.href = WA + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* Шапка и меню */
  var hdr = document.querySelector('.hdr');
  var fab = document.querySelector('.fab');
  var finalSec = document.querySelector('.final');
  var onScroll = function () {
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 10);
    if (fab) {
      var fr = finalSec.getBoundingClientRect().top;
      fab.classList.toggle('is-hidden', y < 500 || fr < window.innerHeight);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  var setMenu = function (open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  };
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) {
        setMenu(false);
        setTimeout(function () { scrollToEl(el); }, 250);
      } else scrollToEl(el);
    });
  });

  /* Появление */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
    io.observe(el);
  });

  /* Подбор объёма: ресницы рисуются на глазу */
  var VOL = [
    { name: 'Стрелка', price: 1500, desc: '<b>Стрелка.</b> Ресницы удлиняются к внешнему уголку и вытягивают взгляд к виску.' },
    { name: '2D', price: 1900, desc: '<b>2D.</b> Две тонкие ресницы на одну свою: заметно, но естественно. Чаще берут на каждый день.' },
    { name: '3D', price: 2400, desc: '<b>3D.</b> Пушистый взгляд, с которым можно забыть о туши.' },
    { name: '4D', price: 2900, desc: '<b>4D.</b> Самый плотный объём для тех, кто любит эффектные глаза.' }
  ];
  var cur = 1;
  var lashG = document.querySelector('.eye__lashes');
  var desc = document.querySelector('.vol__desc');
  var totalEl = document.querySelector('.js-total');
  var volBtn = document.querySelector('.js-vol-book');
  var NS = 'http://www.w3.org/2000/svg';
  var bez = function (t) {
    var p0 = [30, 140], p1 = [110, 58], p2 = [290, 58], p3 = [370, 128];
    var u = 1 - t;
    var x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    var y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    var dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
    var dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
    var l = Math.hypot(dx, dy);
    return { x: x, y: y, nx: dy / l, ny: -dx / l };
  };
  var drawLashes = function (v) {
    while (lashG.firstChild) lashG.removeChild(lashG.firstChild);
    var count = [22, 30, 34, 38][v];
    var strands = [1, 2, 3, 4][v];
    var spread = [0, 7, 9, 11][v];
    var width = [2.2, 1.6, 1.35, 1.2][v];
    for (var i = 0; i < count; i++) {
      var t = 0.05 + 0.92 * (i / (count - 1));
      var b = bez(t);
      var len = v === 0 ? 16 + 56 * Math.pow(t, 2.2) : 26 + 20 * t + (v - 1) * 3;
      var lean = (t - 0.45) * 38; // ресницы смотрят в стороны от центра
      for (var s = 0; s < strands; s++) {
        var off = strands > 1 ? (s / (strands - 1) - 0.5) * 2 * spread : 0;
        var ang = (lean + off) * Math.PI / 180;
        var nx = b.nx * Math.cos(ang) - b.ny * Math.sin(ang);
        var ny = b.nx * Math.sin(ang) + b.ny * Math.cos(ang);
        var L = len * (1 - Math.abs(off) / 90);
        var ex = b.x + nx * L + 6, ey = b.y + ny * L + 4;
        var cx = b.x + nx * L * 0.62, cy = b.y + ny * L * 0.62 - 4;
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M' + b.x.toFixed(1) + ',' + b.y.toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + ex.toFixed(1) + ',' + ey.toFixed(1));
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#F4EDE4');
        p.setAttribute('stroke-width', width);
        p.setAttribute('stroke-linecap', 'round');
        p.style.opacity = 0;
        p.style.transition = 'opacity .5s ' + (i * 12) + 'ms';
        lashG.appendChild(p);
      }
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lashG.querySelectorAll('path').forEach(function (p) { p.style.opacity = 0.95; });
      });
    });
  };
  var adds = Array.prototype.slice.call(document.querySelectorAll('.chk input'));
  var update = function () {
    var sum = VOL[cur].price, extra = [];
    adds.forEach(function (c) { if (c.checked) { sum += +c.dataset.p; extra.push(c.dataset.add); } });
    totalEl.textContent = (extra.length ? 'от ' : '') + fmt(sum);
    var msg = 'Здравствуйте! Хочу записаться: наращивание ресниц, ' + VOL[cur].name + ' (' + fmt(VOL[cur].price).replace(/ /g, ' ') + ')';
    if (extra.length) msg += ' + ' + extra.join(', ');
    msg += '. Ориентир по сумме: ' + (extra.length ? 'от ' : '') + fmt(sum).replace(/ /g, ' ') + '. Подскажите свободное время.';
    volBtn.href = WA + encodeURIComponent(msg);
    volBtn.target = '_blank';
    volBtn.rel = 'noopener';
  };
  var setVol = function (v) {
    cur = v;
    document.querySelectorAll('.vol__doll').forEach(function (b) { b.setAttribute('aria-checked', +b.dataset.v === v ? 'true' : 'false'); });
    desc.innerHTML = VOL[v].desc;
    drawLashes(v);
    update();
  };
  document.querySelectorAll('.vol__doll').forEach(function (b) {
    b.addEventListener('click', function () { setVol(+b.dataset.v); });
  });
  adds.forEach(function (c) { c.addEventListener('change', update); });
  setVol(1);

  /* Вкладки цен */
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('is-on', x === t); });
      document.querySelectorAll('.plist').forEach(function (p) { p.classList.toggle('is-on', p.dataset.panel === t.dataset.tab); });
    });
  });

  /* Фильтр работ */
  document.querySelectorAll('.filter').forEach(function (f) {
    f.addEventListener('click', function () {
      document.querySelectorAll('.filter').forEach(function (x) { x.classList.toggle('is-on', x === f); });
      document.querySelectorAll('.work').forEach(function (w) {
        w.classList.toggle('is-hidden', f.dataset.f !== 'all' && w.dataset.c !== f.dataset.f);
      });
    });
  });

  /* Плавные аккордеоны */
  document.querySelectorAll('.acc__item').forEach(function (d) {
    var sum = d.querySelector('summary'), body = d.querySelector('.acc__body');
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      if (d.open) {
        var h = body.offsetHeight;
        var a = body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' });
        d.classList.add('is-closing');
        a.onfinish = function () { d.open = false; d.classList.remove('is-closing'); delete d.dataset.anim; };
      } else {
        d.open = true;
        var h2 = body.offsetHeight;
        var b = body.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.22,.8,.24,1)' });
        b.onfinish = function () { delete d.dataset.anim; };
      }
    });
  });

  /* Карта */
  var mapEl = document.getElementById('map');
  if (mapEl && window.L) {
    var ll = [48.417466, 135.107612];
    var map = L.map(mapEl, { center: window.innerWidth < 820 ? [48.4171, 135.1083] : [48.4174, 135.1092], zoom: 16, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    var icon = L.divIcon({ className: 'map-pin', html: '<svg viewBox="0 0 100 130"><use href="#dollShape"/></svg>', iconSize: [44, 57], iconAnchor: [22, 57] });
    L.marker(ll, { icon: icon, alt: 'Матрёшка' }).addTo(map);
    map.attributionControl.setPrefix(false);
  }

  /* Курсор */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var c = document.querySelector('.cursor');
    var dot = c.querySelector('.cursor__dot'), ring = c.querySelector('.cursor__ring');
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) {
      if (!e.clientX && !e.clientY) return;
      if (mx < -50) { rx = e.clientX; ry = e.clientY; } mx = e.clientX; my = e.clientY; c.classList.remove('is-off');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      var t = e.target;
      var link = t.closest && t.closest('a,button,label,summary');
      var photo = !link && t.closest && t.closest('.work,.svc__img,.team__photo,.chair__main,.chair__small,.gift__img,.nest');
      c.classList.toggle('is-link', !!link);
      c.classList.toggle('is-photo', !!photo);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { c.classList.add('is-off'); });
    document.addEventListener('mouseenter', function () { c.classList.remove('is-off'); });
    var loop = function () {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    };
    loop();
  }
})();
