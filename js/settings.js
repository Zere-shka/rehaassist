window.renderSettings = function() {
    const container = document.createElement('div');
    container.className = 'settings-container';

    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentLang = localStorage.getItem('lang') || 'ru';

    container.innerHTML = `
        <div class="card">
            <h2 data-i18n="settings_title">${window.t('settings_title')}</h2>
            
            <div class="input-group">
                <label data-i18n="app_theme">${window.t('app_theme')}</label>
                <div class="theme-toggle-group" style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn btn-secondary theme-btn ${currentTheme === 'light' ? 'active-theme' : ''}" data-theme="light" style="flex: 1; height: 50px; font-size: 16px;">
                        <i class="fas fa-sun"></i> <span data-i18n="theme_light">${window.t('theme_light')}</span>
                    </button>
                    <button class="btn btn-secondary theme-btn ${currentTheme === 'dark' ? 'active-theme' : ''}" data-theme="dark" style="flex: 1; height: 50px; font-size: 16px;">
                        <i class="fas fa-moon"></i> <span data-i18n="theme_dark">${window.t('theme_dark')}</span>
                    </button>
                </div>
            </div>

            <div class="input-group">
                <label data-i18n="app_lang">${window.t('app_lang')}</label>
                <select id="lang-select" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: white; font-size: 16px;">
                    <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>Русский</option>
                    <option value="kk" ${currentLang === 'kk' ? 'selected' : ''}>Қазақша</option>
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="about_app">${window.t('about_app')}</h2>
            <p style="color: var(--text-muted); margin-bottom: 5px;" data-i18n="version">${window.t('version')}</p>
            <p style="color: var(--text-muted);" data-i18n="app_desc">${window.t('app_desc')}</p>
        </div>
    `;

    // Theme logic
    const themeBtns = container.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            themeBtns.forEach(b => b.classList.remove('active-theme'));
            btn.classList.add('active-theme');
        });
    });

    // Language logic
    const langSelect = container.querySelector('#lang-select');
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        applyLanguage(lang);
    });

    return container;
}

function applyTheme(theme) {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function applyLanguage(lang) {
    localStorage.setItem('lang', lang);
    // Full page reload for a clean translation of all modules
    location.reload();
}

window.translateUI = function(lang) {
    if (!window.translations || !window.translations[lang]) return;
    const dict = window.translations[lang];

    // Update <html lang> attribute for accessibility
    document.documentElement.lang = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = dict[key];
        if (!translation) return;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // For inputs/textareas - update placeholder
            el.placeholder = translation;
        } else {
            // For other elements - replace only text nodes, preserving icon elements (<i>, <img>, <span>)
            let textNodeFound = false;
            for (let node of el.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    node.textContent = translation;
                    textNodeFound = true;
                    break;
                }
            }
            // If no text node found and element has no children, set textContent
            if (!textNodeFound && el.children.length === 0) {
                el.textContent = translation;
            }
            // If element has children but no text node, append a text node
            if (!textNodeFound && el.children.length > 0) {
                // Try appending translated text at end (safe for buttons with icons)
                const lastChild = el.lastChild;
                if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
                    lastChild.textContent = ' ' + translation;
                }
            }
        }
    });
};


// Global initialization - runs after full DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');

    const lang = localStorage.getItem('lang') || 'ru';
    // Always apply translation so page is fully localized after reload
    window.translateUI(lang);

    // Show app after translation
    document.body.classList.remove('loading-app');
});

// Also apply theme immediately (before DOMContentLoaded) to prevent flash
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
})();
