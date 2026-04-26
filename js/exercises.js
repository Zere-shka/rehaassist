window.renderExercises = function() {
    const container = document.createElement('div');
    container.className = 'exercises-container';

    const data = window.dataStore.getDisplayData();
    const exercises = (data && data.exercises) ? data.exercises : [];
    
    // Подсчет прогресса
    const completedCount = exercises.filter(e => e.completed).length;
    const progressPercent = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

    let html = `
        <div class="card">
            <h2 data-i18n="today_progress">${window.t('today_progress')}</h2>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <p style="text-align: center; color: var(--text-muted); font-weight: 600;">
                ${window.t('completed')} ${completedCount} ${window.t('from')} ${exercises.length}
            </p>
        </div>
        
        <h2 style="margin-top: var(--space-md);" data-i18n="workout_plan">${window.t('workout_plan')}</h2>
    `;

    if (exercises.length === 0) {
        html += `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-dumbbell" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p data-i18n="no_exercises_desc">${window.t('no_exercises_desc')}</p>
            </div>
        `;
    } else {
        exercises.forEach(ex => {
            const embedUrl = ex.embedUrl || 'https://www.youtube.com/embed/dspMFAWjkF4?rel=0'; 
            let mediaHtml = '';
            
            if (ex.previewImage) {
                mediaHtml = `
                    <div class="video-preview-wrapper" style="position: relative; cursor: pointer; background: #e2e8f0; border-radius: var(--radius-md); overflow: hidden;" onclick="this.innerHTML='<iframe class=\\'exercise-video\\' src=\\'${embedUrl}\\' frameborder=\\'0\\' allow=\\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\\' allowfullscreen></iframe>'">
                        <img src="${ex.previewImage}" class="exercise-video" style="object-fit: cover;" onerror="this.style.display='none'; this.parentElement.querySelector('.img-placeholder').style.display='flex';">
                        <div class="img-placeholder" style="display: none; height: 250px; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); text-align: center; padding: 20px;">
                            <i class="fas fa-image" style="font-size: 40px; margin-bottom: 10px;"></i>
                            <p style="font-size: 14px;">${window.t('tap_to_play')}<br><small>(изображение ${ex.previewImage} не найдено)</small></p>
                        </div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.6); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2;">
                            <i class="fas fa-play" style="color: white; font-size: 24px; margin-left: 5px;"></i>
                        </div>
                    </div>`;
            } else {
                mediaHtml = `<iframe class="exercise-video" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
            }

            html += `
                <div class="card exercise-card" style="${ex.completed ? 'opacity: 0.7;' : ''}">
                    <div class="exercise-video-container">
                        ${mediaHtml}
                        ${ex.completed ? `<div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(45, 212, 191, 0.3); display: flex; align-items:center; justify-content:center;"><i class="fas fa-check-circle" style="color: white; font-size: 48px;"></i></div>` : ''}
                    </div>
                    <div class="exercise-info">
                        <div>
                            <h3 style="font-size: 22px;">${ex.title}</h3>
                            <p style="color: var(--text-muted);"><i class="fas fa-tag"></i> ${ex.type}</p>
                        </div>
                        <button class="btn ${ex.completed ? 'btn-secondary' : ''} toggle-exercise-btn" data-id="${ex.id}" style="padding: 12px; width: auto; font-size: 16px; border-radius: 50px;">
                            ${ex.completed ? `<i class="fas fa-undo"></i> ${window.t('undo')}` : `<i class="fas fa-play"></i> ${window.t('done')}`}
                        </button>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    // Добавляем обработчики событий
    const buttons = container.querySelectorAll('.toggle-exercise-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            window.dataStore.toggleExercise(id);
            
            // Перерисовываем компонент
            const parent = container.parentNode;
            if (parent) {
                parent.innerHTML = '';
                parent.appendChild(window.renderExercises());
            }
            
            window.showToast(window.t('progress_updated'));
        });
    });

    return container;
}

