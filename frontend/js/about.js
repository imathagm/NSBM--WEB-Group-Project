(function(){
  const html = document.documentElement;
  const KEY = 'nsbm-theme';

  function setTheme(theme){
    html.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('.theme-button').forEach(btn=>{
      const choice = btn.getAttribute('data-theme-choice');
      btn.setAttribute('aria-pressed', choice === theme ? 'true' : 'false');
    });
  }

  const saved = localStorage.getItem(KEY) || 'dark';
  setTheme(saved);

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.theme-button');
    if(!btn) return;
    const choice = btn.getAttribute('data-theme-choice');
    if(choice) setTheme(choice);
  });

  console.log('✅ About page loaded - Home page same light/dark SVG icon working');
})();