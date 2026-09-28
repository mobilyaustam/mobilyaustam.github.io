// Google Analytics 4 loader and simple event wiring
(function(){
  var MID = 'G-FMZFYTMPS2';
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MID);
  (document.head || document.documentElement).appendChild(s);
  gtag('js', new Date());
  gtag('config', MID, { anonymize_ip: true });

  // Auto-track tel: clicks
  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    try {
      gtag('event','phone_click',{
        href: a.getAttribute('href') || '',
        text: (a.textContent || '').trim(),
        page: location.pathname
      });
    } catch(e) {}
  }, { capture: true });

  // Auto-track WhatsApp clicks (wa.me or api.whatsapp.com)
  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com/send"]') : null;
    if (!a) return;
    try {
      gtag('event','whatsapp_click',{
        href: a.getAttribute('href') || '',
        text: (a.textContent || '').trim(),
        page: location.pathname
      });
    } catch(e) {}
  }, { capture: true });
})();
