window.renderRelatives = function() {
    const container = document.createElement('div');
    container.className = 'relatives-container';

    const data = window.dataStore.getDisplayData();
    if (!data) return document.createElement('div');
    const lang = localStorage.getItem('lang') || 'ru';
    
    // Статистика для отчета
    const medTaken = data.medications.filter(m => m.status === 'taken').length;
    const medTotal = data.medications.length;
    const exCompleted = data.exercises.filter(e => e.completed).length;
    const exTotal = data.exercises.length;

    container.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color: white;">
            <h2 data-i18n="relative_access_title">${window.t('relative_access_title')}</h2>
            <p style="font-size: 18px; margin-bottom: 20px;" data-i18n="relative_access_desc">${window.t('relative_access_desc')}</p>
            <div style="background: white; padding: 20px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=StrokeAssistant_User_${data.id || '847291'}" alt="QR Code" style="width: 150px; height: 150px;">
                <span style="font-weight: 800; font-size: 24px; color: #333;">ID: ${data.id ? data.id.toString().slice(-6) : '847-291'}</span>
            </div>
        </div>

        <!-- Активность -->
        <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 style="margin-bottom: 5px;" data-i18n="activity">${window.t('activity')}</h2>
                <div style="font-size: 32px; font-weight: 800; color: var(--primary);">
                    <i class="fas fa-walking"></i> ${data.steps || 0} <span style="font-size: 14px; font-weight: 400; color: var(--text-muted);" data-i18n="steps">${window.t('steps')}</span>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 14px; color: var(--text-muted);" data-i18n="activity_level">${window.t('activity_level')}</div>
                <div style="font-weight: 700; color: var(--secondary);">${window.t('activity_' + (data.activityLevel || 'Medium').toLowerCase())}</div>
            </div>
        </div>

        <div class="card">
            <h2 data-i18n="today_summary">${window.t('today_summary')}</h2>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;"><i class="fas fa-pills" style="color: var(--secondary);"></i> <span data-i18n="nav_medications">${window.t('nav_medications')}</span></span>
                    <span>${medTaken} / ${medTotal}</span>
                </div>
                <div class="progress-container" style="height: 12px; margin: 0;">
                    <div class="progress-bar" style="width: ${medTotal ? (medTaken/medTotal)*100 : 0}%; background: var(--secondary);"></div>
                </div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;"><i class="fas fa-dumbbell" style="color: var(--accent);"></i> <span data-i18n="nav_exercises">${window.t('nav_exercises')}</span></span>
                    <span>${exCompleted} / ${exTotal}</span>
                </div>
                <div class="progress-container" style="height: 12px; margin: 0;">
                    <div class="progress-bar" style="width: ${exTotal ? (exCompleted/exTotal)*100 : 0}%; background: var(--accent);"></div>
                </div>
            </div>
        </div>

        <!-- Голосовой чат с близкими -->
        <div class="card" style="border: 2px solid var(--secondary);">
            <h2 data-i18n="say_to_relatives"><i class="fas fa-comment-dots"></i> ${window.t('say_to_relatives')}</h2>
            <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 15px;" data-i18n="say_to_relatives_desc">${window.t('say_to_relatives_desc')}</p>
            
            <div id="voice-chat-container" style="display: flex; flex-direction: column; gap: 15px;">
                <div id="chat-history" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;">
                    ${(data.voiceMessages || []).length === 0 ? 
                        `<p style="text-align: center; color: var(--text-muted); font-style: italic; font-size: 14px;" data-i18n="no_messages">${window.t('no_messages')}</p>` : 
                        data.voiceMessages.slice(-5).map(m => `
                            <div style="background: #f1f5f9; padding: 10px 15px; border-radius: 15px; align-self: flex-end; max-width: 85%;">
                                <div style="font-size: 14px; margin-bottom: 4px;">${m.text}</div>
                                <div style="font-size: 10px; color: var(--text-muted); text-align: right;">${m.time}</div>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button id="start-voice-msg-btn" class="voice-btn-small" style="background: var(--secondary); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <div id="voice-status-text" style="font-size: 14px; color: var(--text-muted); flex: 1;" data-i18n="tap_to_record">${window.t('tap_to_record')}</div>
                </div>
            </div>
        </div>

        <button class="btn" id="send-report-btn" style="background: var(--secondary); margin-top: 20px;">
            <i class="fas fa-paper-plane"></i> <span data-i18n="send_report_btn">${window.t('send_report_btn')}</span>
        </button>
    `;

    const sendBtn = container.querySelector('#send-report-btn');
    const startVoiceBtn = container.querySelector('#start-voice-msg-btn');
    const voiceStatus = container.querySelector('#voice-status-text');
    
    // Логика голосового ввода
    if (startVoiceBtn) {
        let isRecording = false;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                isRecording = true;
                startVoiceBtn.style.background = 'var(--danger)';
                startVoiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
                voiceStatus.textContent = window.t('listening');
            };
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                window.dataStore.addVoiceMessage(text);
                window.showToast(window.t('message_sent'));
                
                // Перерисовываем для обновления чата
                const parent = container.parentNode;
                if (parent) {
                    parent.innerHTML = '';
                    parent.appendChild(window.renderRelatives());
                }
            };
            
            recognition.onerror = () => {
                voiceStatus.textContent = window.t('record_error');
                resetBtn();
            };
            
            recognition.onend = () => {
                resetBtn();
            };
            
            function resetBtn() {
                isRecording = false;
                startVoiceBtn.style.background = 'var(--secondary)';
                startVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceStatus.textContent = window.t('tap_to_record');
            }
            
            startVoiceBtn.addEventListener('click', () => {
                if (!isRecording) {
                    recognition.start();
                } else {
                    recognition.stop();
                }
            });
        } else {
            startVoiceBtn.style.opacity = '0.5';
            voiceStatus.textContent = window.t('voice_not_supported');
        }
    }

    sendBtn.addEventListener('click', () => {
        // Симуляция отправки отчета
        const originalContent = sendBtn.innerHTML;
        sendBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${window.t('sending')}`;
        sendBtn.disabled = true;

        setTimeout(() => {
            sendBtn.innerHTML = `<i class="fas fa-check"></i> ${window.t('sent')}`;
            sendBtn.style.background = 'var(--primary)';
            window.showToast(window.t('report_sent_success'));
            
            setTimeout(() => {
                sendBtn.innerHTML = originalContent;
                sendBtn.style.background = 'var(--secondary)';
                sendBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    return container;
}

