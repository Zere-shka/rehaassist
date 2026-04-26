window.renderMotivation = function() {
    const container = document.createElement('div');
    container.className = 'motivation-container';

    const data = window.dataStore.getDisplayData();
    if (!data) return document.createElement('div');
    const lang = localStorage.getItem('lang') || 'ru';
    const streak = data.user ? (data.user.streak || 1) : (data.streak || 1);
    const diary = data.diary || [];
    const notes = data.notes || [];

    // Helper for recommendations
    const getRecommendations = () => {
        const recs = [];
        if (diary.length > 0) {
            const lastEntry = diary[diary.length - 1];
            if (lastEntry.pulse > 90) recs.push({ icon: 'fa-heartbeat', text: window.t('rec_pulse_high') });
            if (lastEntry.pain > 6) recs.push({ icon: 'fa-exclamation-triangle', text: window.t('rec_pain_high') });
        }
        
        const allMedsTaken = data.medications.every(m => m.status === 'taken');
        if (!allMedsTaken) recs.push({ icon: 'fa-pills', text: window.t('rec_meds_remind') });

        const allExercisesDone = data.exercises.every(e => e.completed);
        if (!allExercisesDone) recs.push({ icon: 'fa-dumbbell', text: window.t('rec_exercises_remind') });

        if (recs.length === 0) recs.push({ icon: 'fa-star', text: window.t('rec_doing_great') });
        
        return recs;
    };

    const recommendations = getRecommendations();

    container.innerHTML = `
        <div class="streak-banner" style="text-align: center; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: var(--radius-xl); box-shadow: var(--glass-shadow);">
            <i class="fas fa-fire" style="font-size: 48px; margin-bottom: 10px;"></i>
            <h1 style="font-size: 36px; margin: 0;">${streak}</h1>
            <p style="font-weight: 600; opacity: 0.9;" data-i18n="days_streak">${window.t('days_streak')}</p>
        </div>

        <div class="card">
            <h2 style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-smile" style="color: var(--primary);"></i>
                <span data-i18n="mood">${window.t('mood')}</span>
            </h2>
            <div style="height: 200px; margin-top: 15px;">
                <canvas id="moodChart"></canvas>
            </div>
        </div>

        <div class="card">
            <h2 style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-bolt" style="color: var(--secondary);"></i>
                <span data-i18n="energy_level">${window.t('energy_level')}</span>
            </h2>
            <div style="height: 200px; margin-top: 15px;">
                <canvas id="energyChart"></canvas>
            </div>
        </div>

        <div class="card">
            <h2 style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                <span data-i18n="exercise_progress">${window.t('exercise_progress')}</span>
            </h2>
            <div style="height: 200px; margin-top: 15px;">
                <canvas id="exerciseChart"></canvas>
            </div>
            <p style="text-align: center; font-weight: 600; margin-top: 10px;">
                ${data.exercises.filter(e => e.completed).length} / ${data.exercises.length} <span data-i18n="completed_short">${window.t('completed_short')}</span>
            </p>
        </div>

        <div class="card">
            <h2 style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-lightbulb" style="color: #FFD600;"></i>
                <span data-i18n="recommendations">${window.t('recommendations')}</span>
            </h2>
            <div class="recommendations-list">
                ${recommendations.map(r => `
                    <div style="display: flex; align-items: flex-start; gap: 15px; margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 12px; border-left: 4px solid var(--primary);">
                        <i class="fas ${r.icon}" style="color: var(--primary); margin-top: 3px;"></i>
                        <p style="font-size: 14px; line-height: 1.5; margin: 0;">${r.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <i class="fas fa-pen-fancy" style="color: var(--secondary);"></i>
                <span data-i18n="your_notes">${window.t('your_notes')}</span>
            </h2>
            <textarea id="note-input" data-i18n="how_was_day" placeholder="${window.t('how_was_day')}" style="width: 100%; height: 80px; padding: 15px; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; font-family: inherit; font-size: 14px; resize: none; margin-bottom: 15px;"></textarea>
            <button class="btn btn-secondary" id="save-note-btn">
                <i class="fas fa-save"></i> <span data-i18n="save">${window.t('save')}</span>
            </button>

            <div id="notes-history" style="margin-top: 25px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px;">
                ${notes.length === 0 ? `<p style="text-align: center; color: var(--text-muted); font-size: 14px;" data-i18n="no_notes">${window.t('no_notes')}</p>` : 
                    notes.slice(-3).reverse().map(n => `
                        <div style="margin-bottom: 15px; padding: 12px; background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.02);">
                            <p style="font-size: 14px; margin-bottom: 8px;">${n.text}</p>
                            <span style="font-size: 11px; color: var(--text-muted);">${new Date(n.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;

    // Initialize Charts
    setTimeout(() => {
        // 1. Mood Chart
        const moodCtx = document.getElementById('moodChart');
        if (moodCtx) {
            const moodMap = { 'great': 5, 'good': 4, 'okay': 3, 'bad': 2, 'very-bad': 1 };
            const labels = diary.slice(-7).map(e => new Date(e.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US', { day: 'numeric', month: 'short' }));
            const moodValues = diary.slice(-7).map(e => moodMap[e.mood] || 3);

            new Chart(moodCtx, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : [window.t('mon'), window.t('tue'), window.t('wed')],
                    datasets: [{
                        data: moodValues.length ? moodValues : [3, 4, 3],
                        borderColor: '#2dd4bf',
                        backgroundColor: 'rgba(45, 212, 191, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 1, max: 5, ticks: { stepSize: 1, font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                    }
                }
            });
        }

        // 2. Energy Chart
        const energyCtx = document.getElementById('energyChart');
        if (energyCtx) {
            const labels = diary.slice(-7).map(e => new Date(e.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US', { day: 'numeric', month: 'short' }));
            const energyValues = diary.slice(-7).map(e => e.energy || 5);

            new Chart(energyCtx, {
                type: 'bar',
                data: {
                    labels: labels.length ? labels : [window.t('mon'), window.t('tue'), window.t('wed')],
                    datasets: [{
                        data: energyValues.length ? energyValues : [5, 7, 6],
                        backgroundColor: '#6366f1',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 0, max: 10, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                    }
                }
            });
        }

        // 3. Exercise Chart
        const exCtx = document.getElementById('exerciseChart');
        if (exCtx) {
            const completed = data.exercises.filter(e => e.completed).length;
            const total = data.exercises.length;
            new Chart(exCtx, {
                type: 'doughnut',
                data: {
                    labels: [window.t('completed'), window.t('remains')],
                    datasets: [{
                        data: [completed, total - completed],
                        backgroundColor: ['#2dd4bf', 'rgba(0,0,0,0.05)'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { display: false } }
                }
            });
        }
    }, 150);

    // Save Note logic
    const saveNoteBtn = container.querySelector('#save-note-btn');
    const noteInput = container.querySelector('#note-input');
    
    saveNoteBtn.addEventListener('click', () => {
        const text = noteInput.value.trim();
        if (!text) {
            window.showToast(window.t('please_write_something'));
            return;
        }

        window.dataStore.addNote({ text });
        window.showToast(window.t('note_saved'));
        noteInput.value = '';
        
        // Refresh component
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '';
            mainContent.appendChild(window.renderMotivation());
        }
    });

    return container;
}

