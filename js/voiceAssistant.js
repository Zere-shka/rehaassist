// Голосовой помощник на базе Web Speech API

window.initVoiceAssistant = function() {
    const btn = document.getElementById('voice-assistant-btn');
    const modal = document.getElementById('voice-modal');
    const closeBtn = document.getElementById('close-voice-btn');
    const statusText = document.getElementById('voice-status');
    const responseText = document.getElementById('voice-response');
    const pulseRing = document.querySelector('.voice-pulse-ring');

    if (!btn || !modal) return;

    const lang = localStorage.getItem('lang') || 'ru';
    const speechLang = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';

    // Проверка поддержки браузером
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synth = window.speechSynthesis;

    if (!SpeechRecognition) {
        btn.style.display = 'none';
        console.warn('Speech Recognition API not supported in this browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isListening = false;

    // Открытие модалки и старт слушания
    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        startListening();
    });

    // Закрытие
    closeBtn.addEventListener('click', () => {
        stopListening();
        modal.classList.add('hidden');
        synth.cancel(); // Остановка речи
    });

    function startListening() {
        if (isListening) return;
        try {
            recognition.start();
            isListening = true;
            statusText.textContent = window.t('listening_dots');
            responseText.textContent = '';
            pulseRing.style.display = 'block';
        } catch (e) {
            console.error(e);
        }
    }

    function stopListening() {
        if (!isListening) return;
        recognition.stop();
        isListening = false;
        pulseRing.style.display = 'none';
    }

    // Обработка результата
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        statusText.textContent = `${window.t('you_said')}: "${transcript}"`;
        
        processIntent(transcript);
    };

    recognition.onspeechend = () => {
        stopListening();
    };

    recognition.onerror = (event) => {
        stopListening();
        if (event.error === 'no-speech') {
            statusText.textContent = window.t('voice_no_speech');
        } else {
            statusText.textContent = `${window.t('voice_error')}: ` + event.error;
        }
    };

    // Расширенная обработка интентов (Имитация ИИ)
    function processIntent(text) {
        const data = window.dataStore.getData();
        const lang = localStorage.getItem('lang') || 'ru';
        
        let answer = "";

        // База знаний для имитации ИИ
        const responses = {
            'ru': [
                { keywords: ['лекарств', 'таблетк', 'что принять', 'пить'], action: () => {
                    const unTakenMeds = data.medications.filter(m => m.status !== 'taken');
                    return unTakenMeds.length === 0 
                        ? window.t('voice_all_meds_taken') 
                        : `${window.t('voice_meds_left')}: ${unTakenMeds.map(m => m.name).join(', ')}.`;
                }},
                { keywords: ['я принял', 'выпил', 'готов'], action: () => {
                    const nextMed = data.medications.find(m => m.status !== 'taken');
                    if (nextMed) {
                        window.dataStore.toggleMedication(nextMed.id, 'taken');
                        return `${window.t('voice_med_noted')} ${nextMed.name}.`;
                    }
                    return window.t('voice_all_meds_already_taken');
                }},
                { keywords: ['запись', 'добавить', 'дневник'], action: () => {
                    setTimeout(() => window.navigateTo('diary'), 1500);
                    return window.t('voice_opening_diary');
                }},
                { keywords: ['упражнени', 'зарядк', 'тренировк', 'покажи'], action: () => {
                    const unDoneEx = data.exercises.filter(e => !e.completed);
                    setTimeout(() => window.navigateTo('exercises'), 1500);
                    return unDoneEx.length === 0 
                        ? window.t('voice_all_exercises_done') 
                        : `${window.t('voice_exercises_left', {count: unDoneEx.length})}. ${window.t('voice_opening_exercises')}`;
                }},
                { keywords: ['плохо', 'болит', 'голова', 'давление'], response: window.t('voice_feeling_bad') },
                { keywords: ['привет', 'здравствуй', 'хелло'], response: window.t('voice_hello') },
                { keywords: ['как дела', 'как сам'], response: window.t('voice_how_are_you') },
                { keywords: ['кто ты', 'что ты умеешь'], response: window.t('voice_who_are_you') },
                { keywords: ['спасибо', 'благодарю'], response: window.t('voice_thanks') }
            ],
            'kk': [
                { keywords: ['дәрі', 'ішу'], action: () => {
                    const unTakenMeds = data.medications.filter(m => m.status !== 'taken');
                    return unTakenMeds.length === 0 ? window.t('voice_all_meds_taken') : `${window.t('voice_meds_left')}: ${unTakenMeds.map(m => m.name).join(', ')}.`;
                }},
                { keywords: ['жаттығу', 'зарядка'], action: () => {
                    setTimeout(() => window.navigateTo('exercises'), 1500);
                    return window.t('voice_opening_exercises');
                }},
                { keywords: ['сәлем', 'қалайсың'], response: window.t('voice_hello') }
            ],
            'en': [
                { keywords: ['meds', 'pills', 'medicine'], action: () => {
                    const unTakenMeds = data.medications.filter(m => m.status !== 'taken');
                    return unTakenMeds.length === 0 ? window.t('voice_all_meds_taken') : `${window.t('voice_meds_left')}: ${unTakenMeds.map(m => m.name).join(', ')}.`;
                }},
                { keywords: ['exercise', 'workout'], action: () => {
                    setTimeout(() => window.navigateTo('exercises'), 1500);
                    return window.t('voice_opening_exercises');
                }},
                { keywords: ['hello', 'hi'], response: window.t('voice_hello') }
            ]
        };

        // Поиск совпадения
        const currentResponses = responses[lang] || responses['ru'];
        const match = currentResponses.find(r => r.keywords.some(k => text.includes(k)));

        if (match) {
            answer = match.action ? match.action() : match.response;
        } else {
            answer = window.t('voice_fallback');
        }

        responseText.textContent = answer;
        speak(answer);
    }

    // Синтез речи
    function speak(text) {
        if (synth.speaking) {
            synth.cancel();
        }
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = speechLang;
        utterThis.rate = 0.9; // Чуть медленнее для лучшего восприятия
        utterThis.pitch = 1;
        synth.speak(utterThis);
    }
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    window.initVoiceAssistant();
});

