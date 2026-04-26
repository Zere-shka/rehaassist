window.renderMedications = function() {
    const container = document.createElement('div');
    container.className = 'medications-container';

    const data = window.dataStore.getDisplayData();
    const medications = (data && data.medications) ? data.medications : [];
    const lang = localStorage.getItem('lang') || 'ru';

    // Группируем по времени суток
    const morningMeds = medications.filter(m => m.time === 'Утро');
    const dayMeds = medications.filter(m => m.time === 'День');
    const eveningMeds = medications.filter(m => m.time === 'Вечер');
    
    // Adherence Stats
    const totalToday = medications.length;
    const takenToday = medications.filter(m => m.status === 'taken').length;
    const missedToday = medications.filter(m => m.status === 'missed').length;
    const adherenceRate = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 100;

    function renderGroup(titleKey, meds, icon) {
        if (meds.length === 0) return '';
        
        let medsHtml = '';
        meds.forEach(med => {
            medsHtml += `
                <div class="med-item" style="${med.status === 'taken' ? 'opacity: 0.6;' : ''}">
                    <div style="flex: 1;">
                        <h3 style="font-size: 20px; margin-bottom: 4px; ${med.status === 'taken' ? 'text-decoration: line-through;' : ''}">${med.name}</h3>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            ${med.status === 'taken' ? 
                                `<span style="font-size: 13px; color: var(--secondary); font-weight: 600;"><i class="fas fa-check-circle"></i> ${window.t('taken')}</span>` : 
                                med.status === 'missed' ?
                                `<span style="font-size: 13px; color: var(--danger); font-weight: 600;"><i class="fas fa-times-circle"></i> ${window.t('missed')}</span>` :
                                `<span style="font-size: 13px; color: var(--text-muted); font-weight: 600;"><i class="fas fa-clock"></i> ${window.t('waiting')}</span>`
                            }
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="status-btn take-btn ${med.status === 'taken' ? 'active' : ''}" data-id="${med.id}" data-status="taken" title="${window.t('taken')}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="status-btn miss-btn ${med.status === 'missed' ? 'active' : ''}" data-id="${med.id}" data-status="missed" title="${window.t('missed')}">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="status-btn delete-med-btn" data-id="${med.id}" title="${window.t('delete_btn')}" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        return `
            <div class="card">
                <h2 style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas ${icon}" style="color: var(--accent);"></i> ${window.t(titleKey)}
                </h2>
                ${medsHtml}
            </div>
        `;
    }

    const dateLocale = lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU';
    const formattedDate = new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' });

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: var(--space-md);">
            <h2 style="margin-bottom: 5px;">${window.t('your_meds')}</h2>
            <p style="color: var(--text-muted); font-size: 18px;">${formattedDate}</p>
        </div>

        <div class="card" style="background: linear-gradient(135deg, #fff, #f0fdf4); border-left: 5px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 4px;">${window.t('adherence')}</p>
                    <h3 style="font-size: 28px; color: var(--primary);">${adherenceRate}%</h3>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 12px; color: var(--text-muted);">${takenToday} ${window.t('taken_count')} ${totalToday}</p>
                    ${missedToday > 0 ? `<p style="font-size: 12px; color: var(--danger);">${missedToday} ${window.t('missed_count')}</p>` : ''}
                </div>
            </div>
            <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin-top: 15px; overflow: hidden;">
                <div style="width: ${adherenceRate}%; height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.5s ease;"></div>
            </div>
        </div>

        ${medications.length === 0 ? 
            `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-pills" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>${window.t('no_meds_desc')}</p>
            </div>` : 
            `${renderGroup('morning', morningMeds, 'fa-sun')}
             ${renderGroup('day', dayMeds, 'fa-cloud-sun')}
             ${renderGroup('evening', eveningMeds, 'fa-moon')}`
        }

        <button class="btn" id="open-add-med-btn" style="margin-top: var(--space-md);">
            <i class="fas fa-plus"></i> ${window.t('add_med')}
        </button>

        <div id="add-med-modal" class="modal-overlay">
            <div class="modal-content">
                <h2>${window.t('new_med')}</h2>
                <div class="input-group">
                    <label>${window.t('med_name')}</label>
                    <input type="text" id="new-med-name" placeholder="${window.t('med_name_placeholder')}">
                </div>
                <div class="input-group">
                    <label>${window.t('med_time')}</label>
                    <select id="new-med-time">
                        <option value="Утро">${window.t('morning')}</option>
                        <option value="День">${window.t('day')}</option>
                        <option value="Вечер">${window.t('evening')}</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-secondary" id="cancel-med-btn" style="flex: 1;">${window.t('cancel')}</button>
                    <button class="btn" id="save-med-btn" style="flex: 1;">${window.t('save')}</button>
                </div>
            </div>
        </div>
    `;

    // Обработчики статусов
    const statusBtns = container.querySelectorAll('.status-btn:not(.delete-med-btn)');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const status = e.currentTarget.dataset.status;
            
            window.dataStore.toggleMedication(id, status);
            
            const parent = container.parentNode;
            if (parent) {
                parent.innerHTML = '';
                parent.appendChild(window.renderMedications());
            }
            
            if (status === 'taken') {
                window.showToast('Лекарство отмечено как принятое');
            } else {
                window.showToast('Отмечен пропуск лекарства', 'danger');
            }
        });
    });

    // Обработчик удаления
    const deleteBtns = container.querySelectorAll('.delete-med-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            if (confirm('Вы уверены, что хотите удалить это лекарство?')) {
                window.dataStore.deleteMedication(id);
                const parent = container.parentNode;
                if (parent) {
                    parent.innerHTML = '';
                    parent.appendChild(window.renderMedications());
                }
                window.showToast('Лекарство удалено', 'warning');
            }
        });
    });

    // Модалка
    const openBtn = container.querySelector('#open-add-med-btn');
    const modal = container.querySelector('#add-med-modal');
    const cancelBtn = container.querySelector('#cancel-med-btn');
    const saveBtn = container.querySelector('#save-med-btn');

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('show'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('show'));

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = container.querySelector('#new-med-name').value.trim();
            const time = container.querySelector('#new-med-time').value;

            if (!name) {
                window.showToast('Введите название');
                return;
            }

            window.dataStore.addCustomMedication({ name, time });
            modal.classList.remove('show');
            window.showToast('Добавлено!');

            setTimeout(() => {
                const parent = container.parentNode;
                if (parent) {
                    parent.innerHTML = '';
                    parent.appendChild(window.renderMedications());
                }
            }, 300);
        });
    }

    return container;
}
