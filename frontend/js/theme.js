(function () {
  var KEY = 'nsbm-theme';
  var buttons = document.querySelectorAll('[data-theme-choice]');
  if (!buttons.length) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-choice') === theme);
    });

    try {
      localStorage.setItem(KEY, theme);
    } catch (error) {
      console.warn('Unable to save the selected color theme.', error);
    }
  }

  var initialTheme = 'light';
  try {
    var savedTheme = localStorage.getItem(KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') initialTheme = savedTheme;
  } catch (error) {
    console.warn('Unable to load the saved color theme.', error);
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(button.getAttribute('data-theme-choice'));
    });
  });

  applyTheme(initialTheme);
})();
