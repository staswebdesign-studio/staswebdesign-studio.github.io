(function(){
  var b=document.querySelector('.burger'),n=document.querySelector('.nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open');b.setAttribute('aria-expanded',false)})});}
  document.querySelectorAll('img[data-fallback]').forEach(function(i){function h(){i.style.visibility='hidden'}if(i.complete&&!i.naturalWidth)h();else i.addEventListener('error',h)});
  var f=document.getElementById('book');
  if(f){f.addEventListener('click',function(e){
    var t=e.target.closest('[data-to]'); if(!t)return; e.preventDefault();
    var d=new FormData(f),parts=['Здравствуйте! Хочу записаться в «Матрёшку».'];
    if(d.get('service'))parts.push('Услуга: '+d.get('service')+'.');
    if(d.get('when'))parts.push('Удобно: '+d.get('when')+'.');
    if(d.get('name'))parts.push('Меня зовут '+d.get('name')+'.');
    var txt=encodeURIComponent(parts.join(' '));
    var url=t.dataset.to==='wa'?'https://wa.me/79141896999?text='+txt:'https://t.me/+79141896999?text='+txt;
    window.open(url,'_blank','noopener');
  });}
})();
