window.renderEmergencyAdvice = function() {
    const container = document.createElement('div');
    container.className = 'emergency-container';

    container.innerHTML = `
        <div class="card emergency-header-card" style="background: linear-gradient(135deg, #fee2e2, #fecaca); border: 2px solid #ef4444;">
            <h2 style="color: #b91c1c; margin-bottom: 10px;"><i class="fas fa-exclamation-triangle"></i> <span data-i18n="important_to_know">${window.t('important_to_know')}</span></h2>
            <p style="color: #7f1d1d; font-weight: 600;" data-i18n="emergency_call_now">${window.t('emergency_call_now')}</p>
        </div>

        <div class="card">
            <h2 data-i18n="fast_test_title">${window.t('fast_test_title')}</h2>
            <div class="fast-test-grid">
                <div class="fast-item">
                    <div class="fast-icon">😊</div>
                    <div class="fast-text">
                        <strong data-i18n="fast_u">${window.t('fast_u')}</strong>
                        <p data-i18n="fast_u_desc">${window.t('fast_u_desc')}</p>
                    </div>
                </div>
                <div class="fast-item">
                    <div class="fast-icon">💪</div>
                    <div class="fast-text">
                        <strong data-i18n="fast_z">${window.t('fast_z')}</strong>
                        <p data-i18n="fast_z_desc">${window.t('fast_z_desc')}</p>
                    </div>
                </div>
                <div class="fast-item">
                    <div class="fast-icon">🗣️</div>
                    <div class="fast-text">
                        <strong data-i18n="fast_p">${window.t('fast_p')}</strong>
                        <p data-i18n="fast_p_desc">${window.t('fast_p_desc')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="prevention_and_advice">${window.t('prevention_and_advice')}</h2>
            <div class="advice-list">
                <div class="advice-item">
                    <i class="fas fa-heartbeat"></i>
                    <div>
                        <strong data-i18n="pressure_control">${window.t('pressure_control')}</strong>
                        <p data-i18n="pressure_control_desc">${window.t('pressure_control_desc')}</p>
                    </div>
                </div>
                <div class="advice-item">
                    <i class="fas fa-apple-alt"></i>
                    <div>
                        <strong data-i18n="nutrition_title">${window.t('nutrition_title')}</strong>
                        <p data-i18n="nutrition_advice_desc">${window.t('nutrition_advice_desc')}</p>
                    </div>
                </div>
                <div class="advice-item">
                    <i class="fas fa-walking"></i>
                    <div>
                        <strong data-i18n="movement">${window.t('movement')}</strong>
                        <p data-i18n="movement_desc">${window.t('movement_desc')}</p>
                    </div>
                </div>
                <div class="advice-item">
                    <i class="fas fa-no-smoking"></i>
                    <div>
                        <strong data-i18n="no_bad_habits">${window.t('no_bad_habits')}</strong>
                        <p data-i18n="no_bad_habits_desc">${window.t('no_bad_habits_desc')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="first_aid">${window.t('first_aid')}</h2>
            <ul style="padding-left: 20px; color: var(--text-main);">
                <li data-i18n="first_aid_1">${window.t('first_aid_1')}</li>
                <li data-i18n="first_aid_2">${window.t('first_aid_2')}</li>
                <li data-i18n="first_aid_3"><strong data-i18n="dont_text">${window.t('dont_text')}</strong> ${window.t('first_aid_3_rest')}</li>
                <li data-i18n="first_aid_4">${window.t('first_aid_4')}</li>
            </ul>
        </div>
    `;

    return container;
};

window.initEmergencyActions = function() {
    const sosBtn = document.getElementById('sos-btn');
    const sosModal = document.getElementById('sos-modal');
    const closeSos = document.getElementById('close-sos-btn');
    const confirmSos = document.getElementById('confirm-sos-btn');

    if (sosBtn) {
        sosBtn.onclick = () => {
            sosModal.classList.remove('hidden');
        };
    }

    if (closeSos) {
        closeSos.onclick = () => {
            sosModal.classList.add('hidden');
        };
    }

    if (confirmSos) {
        confirmSos.onclick = () => {
            window.location.href = 'tel:103';
            sosModal.classList.add('hidden');
        };
    }
};

