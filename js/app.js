const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');

// Маппинг роутов на функции рендера и ключи перевода
const routes = {
    'diary': { render: window.renderDiary, titleKey: 'nav_diary' },
    'exercises': { render: window.renderExercises, titleKey: 'nav_exercises' },
    'medications': { render: window.renderMedications, titleKey: 'nav_medications' },
    'relatives': { render: window.renderRelatives, titleKey: 'nav_relatives' },
    'motivation': { render: window.renderMotivation, titleKey: 'nav_motivation' },
    'emergency': { render: window.renderEmergencyAdvice, titleKey: 'nav_emergency' },
    'nutrition': { render: window.renderNutrition, titleKey: 'nav_nutrition' },
    'settings': { render: window.renderSettings, titleKey: 'nav_settings' }
};

function navigateTo(target) {
    // Сохраняем текущую вкладку
    localStorage.setItem('currentTab', target);
    // Анимация скрытия
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(15px)';
    mainContent.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
        // Обновляем UI навигации
        navItems.forEach(item => {
            if (item.dataset.target === target) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Обновляем заголовок
        if (routes[target]) {
            pageTitle.textContent = window.t(routes[target].titleKey);
            pageTitle.setAttribute('data-i18n', routes[target].titleKey);
            // Рендерим нужный контент
            mainContent.innerHTML = '';
            mainContent.appendChild(routes[target].render());
        } else {
            mainContent.innerHTML = '<h2 data-i18n="in_development">В разработке</h2>';
        }
        
        // Анимация появления
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
            
            // Применяем перевод после рендера (для статического контента внутри модулей)
            if (window.translateUI) {
                const lang = localStorage.getItem('lang') || 'ru';
                window.translateUI(lang);
            }
        }, 50);
        
        // Скролл вверх при смене вкладки
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300); // Соответствует времени анимации
}

// Export for use in voice assistant and other modules
window.navigateTo = navigateTo;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Слушатели для меню
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            if (target && routes[target]) {
                navigateTo(target);
            }
        });
    });

    // Слушатель для кнопки настроек в хедере
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            navigateTo('settings');
        });
    }

    // Загружаем стартовую страницу
    const savedTab = localStorage.getItem('currentTab') || 'diary';
    navigateTo(savedTab);

    // Умные уведомления
    initSmartNotifications();
    
    // Initialize SOS button logic
    if (window.initEmergencyActions) {
        window.initEmergencyActions();
    }
});

function initSmartNotifications() {
    const data = window.dataStore.getData();
    if (!data) return;

    // 1. Проверка пропущенных лекарств
    const missedMeds = data.medications.filter(m => m.status === 'missed');
    if (missedMeds.length > 0) {
        setTimeout(() => {
            const msg = window.t('missed_meds_alert') || `Внимание: у вас ${missedMeds.length} пропущенных приема лекарств!`;
            window.showToast(msg, 'danger');
        }, 2000);
    }

    // 2. Напоминание о дневнике (если сегодня записей еще нет)
    const today = new Date().toLocaleDateString();
    const todayEntries = data.diary.filter(e => new Date(e.date).toLocaleDateString() === today);
    if (todayEntries.length === 0) {
        setTimeout(() => {
            const msg = window.t('diary_reminder') || 'Не забудьте заполнить дневник самочувствия!';
            window.showToast(msg, 'info');
        }, 5000);
    }
}

