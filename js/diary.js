window.renderDiary = function() {
    const container = document.createElement('div');
    container.className = 'diary-container';

    // Заголовок карточки
    container.innerHTML = `
        <div class="card">
            <h2 data-i18n="mood_question">${window.t('mood_question')}</h2>
            <div class="mood-selector" id="mood-selector">
                <button class="mood-btn" data-mood="great" aria-label="😃">😃</button>
                <button class="mood-btn" data-mood="good" aria-label="🙂">🙂</button>
                <button class="mood-btn" data-mood="okay" aria-label="😐">😐</button>
                <button class="mood-btn" data-mood="bad" aria-label="😟">😟</button>
                <button class="mood-btn" data-mood="very-bad" aria-label="😢">😢</button>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="metrics">${window.t('metrics')}</h2>
            <div class="input-group">
                <div style="display: flex; justify-content: space-between;">
                    <label data-i18n="pain_level">${window.t('pain_level')}</label>
                    <span id="pain-val" style="font-weight: 800; color: var(--primary);">0</span>
                </div>
                <input type="range" id="pain-slider" min="0" max="10" value="0" style="width: 100%; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
                    <span data-i18n="no_pain">${window.t('no_pain')}</span>
                    <span data-i18n="strong_pain">${window.t('strong_pain')}</span>
                </div>
            </div>

            <div class="input-group" style="margin-top: 25px;">
                <div style="display: flex; justify-content: space-between;">
                    <label data-i18n="energy_level">${window.t('energy_level')}</label>
                    <span id="energy-val" style="font-weight: 800; color: var(--secondary);">5</span>
                </div>
                <input type="range" id="energy-slider" min="1" max="10" value="5" style="width: 100%; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
                    <span data-i18n="weakness">${window.t('weakness')}</span>
                    <span data-i18n="full_energy">${window.t('full_energy')}</span>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="your_stats">${window.t('your_stats')}</h2>
            <div class="input-group">
                <label for="pressure-input" data-i18n="pressure">${window.t('pressure')}</label>
                <input type="text" id="pressure-input" placeholder="120/80">
            </div>
            <div class="input-group">
                <label for="pulse-input" data-i18n="pulse">${window.t('pulse')}</label>
                <input type="number" id="pulse-input" placeholder="70">
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="notes">${window.t('notes')}</h2>
            <div class="input-group">
                <textarea id="diary-notes" data-i18n="notes_placeholder" placeholder="${window.t('notes_placeholder')}" style="width: 100%; min-height: 120px; padding: 15px; border-radius: var(--radius-lg); border: 2px solid transparent; background: rgba(255,255,255,0.9); font-size: 16px; resize: vertical;"></textarea>
            </div>
        </div>

        <button class="btn" id="save-diary-btn">
            <i class="fas fa-save"></i> <span data-i18n="save_entry">${window.t('save_entry')}</span>
        </button>
    `;

    // Логика выбора настроения
    const moodBtns = container.querySelectorAll('.mood-btn');
    let selectedMood = null;

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;
        });
    });

    // Динамическое обновление значений слайдеров
    const painSlider = container.querySelector('#pain-slider');
    const energySlider = container.querySelector('#energy-slider');
    const painVal = container.querySelector('#pain-val');
    const energyVal = container.querySelector('#energy-val');

    painSlider.addEventListener('input', (e) => painVal.textContent = e.target.value);
    energySlider.addEventListener('input', (e) => energyVal.textContent = e.target.value);

    // Логика сохранения
    const saveBtn = container.querySelector('#save-diary-btn');
    saveBtn.addEventListener('click', () => {
        const pressure = container.querySelector('#pressure-input').value;
        const pulse = container.querySelector('#pulse-input').value;
        const notes = container.querySelector('#diary-notes').value;
        const pain = painSlider.value;
        const energy = energySlider.value;

        if (!selectedMood && !pressure && !pulse && !notes) {
            window.showToast(window.t('fill_fields'));
            return;
        }

        window.dataStore.addDiaryEntry({
            mood: selectedMood,
            pressure: pressure,
            pulse: pulse,
            notes: notes,
            pain: parseInt(pain),
            energy: parseInt(energy)
        });

        window.showToast(window.t('save_success'));
        
        // Очистка формы
        moodBtns.forEach(b => b.classList.remove('selected'));
        selectedMood = null;
        container.querySelector('#pressure-input').value = '';
        container.querySelector('#pulse-input').value = '';
        container.querySelector('#diary-notes').value = '';
    });

    return container;
}

