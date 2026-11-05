
(function(){
  const KEY = 'nsbm-theme';
  const html = document.documentElement;
  function setTheme(theme){
    html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('.theme-button').forEach(btn=>{
      btn.setAttribute('aria-pressed', btn.dataset.themeChoice === theme ? 'true' : 'false');
    });
  }
  const saved = localStorage.getItem(KEY) || 'dark';
  setTheme(saved);
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.theme-button');
    if(!btn) return;
    const choice = btn.dataset.themeChoice;
    if(choice) setTheme(choice);
  });


  const form = document.getElementById('loginForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Login successful! (Demo) - GROUP-28');
      window.location.href = './index.html';
    });
  }
})();