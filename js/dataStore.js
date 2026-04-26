// Простая симуляция базы данных с помощью localStorage
const STORAGE_KEY = 'stroke_assistant_users';
const CURRENT_USER_KEY = 'stroke_assistant_session';

const defaultUserData = {
    diary: [],
    medications: [
        { id: 1, name: 'Аспирин (Кардио)', time: 'Утро', status: 'pending', taken: false, timeTaken: null },
        { id: 2, name: 'Глицин', time: 'День', status: 'pending', taken: false, timeTaken: null },
        { id: 3, name: 'Аторвастатин', time: 'Вечер', status: 'pending', taken: false, timeTaken: null }
    ],
    exercises: [
        { id: 1, title: 'Комплекс ЛФК', type: 'Общее', completed: false, embedUrl: 'https://www.youtube.com/embed/e1OPF5_mijc?si=3gdlAWQtLF6LQbg_&amp;start=1', previewImage: '1.png' },
        { id: 2, title: 'Мелкая моторика', type: 'Моторика', completed: false, embedUrl: 'https://www.youtube.com/embed/oCTAxHgJdW8?si=IQlBUpISPZjZN8Ga&amp;start=1', previewImage: '2.png' },
        { id: 3, title: 'Речевая гимнастика', type: 'Речь', completed: false, embedUrl: 'https://www.youtube.com/embed/LvTfeTnL-90?si=MuCeRo7ha3JxiSBe&amp;start=3', previewImage: '3.png' },
        { id: 4, title: 'Ходьба с опорой и тростью', type: 'Нижние конечности', completed: false, embedUrl: 'https://www.youtube.com/embed/DAzV2XXaO60?si=qvcViTqMr3NWAaSf', previewImage: '4.png' }
    ],
    notes: [],
    streak: 1,
    steps: 2450,
    activityLevel: 'Средняя',
    voiceMessages: []
};

window.dataStore = {
    addVoiceMessage(text) {
        const data = this.getData();
        if (!data.voiceMessages) data.voiceMessages = [];
        data.voiceMessages.push({
            id: Date.now(),
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString()
        });
        this.saveData(data);
    },
    updateActivity(steps, level) {
        const data = this.getData();
        data.steps = steps;
        data.activityLevel = level;
        this.saveData(data);
    },
    addNote(note) {
        const data = this.getData();
        if (!data.notes) data.notes = [];
        data.notes.push({ ...note, date: new Date().toISOString() });
        this.saveData(data);
    },
    getAllUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    saveAllUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    },
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    },
    registerUser(name, email, pass, role = 'patient', patientId = '') {
        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Пользователь с таким Email уже существует' };
        }
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: pass,
            role,
            patientId,
            lastLogin: new Date().toISOString(),
            ...JSON.parse(JSON.stringify(defaultUserData))
        };
        users.push(newUser);
        this.saveAllUsers(users);
        this.setCurrentUser(newUser);
        return { success: true };
    },
    loginUser(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.setCurrentUser(user);
            return { success: true };
        }
        return { error: 'Неверный email или пароль' };
    },
    logoutUser() {
        this.setCurrentUser(null);
    },
    
    getData() {
        let user = this.getCurrentUser();
        if (user) {
            let changed = false;
            // Проверяем наличие всех обязательных полей
            if (!user.exercises || user.exercises.length < 4) {
                user.exercises = [...defaultUserData.exercises];
                changed = true;
            }
            if (!user.medications || user.medications.length === 0) {
                user.medications = [...defaultUserData.medications];
                changed = true;
            }
            if (user.steps === undefined) {
                user.steps = defaultUserData.steps;
                changed = true;
            }
            if (!user.activityLevel) {
                user.activityLevel = defaultUserData.activityLevel;
                changed = true;
            }
            if (!user.diary) {
                user.diary = [];
                changed = true;
            }
            if (!user.notes) {
                user.notes = [];
                changed = true;
            }
            if (!user.voiceMessages) {
                user.voiceMessages = [];
                changed = true;
            }
            if (user.streak === undefined) {
                user.streak = 1;
                changed = true;
            }
            
            if (changed) {
                this.saveData(user);
            }
        }
        return user;
    },
    
    loginWithGoogle() {
        const users = this.getAllUsers();
        let googleUser = users.find(u => u.email === 'google_user@example.com');
        
        if (!googleUser) {
            googleUser = {
                id: Date.now(),
                name: 'Пользователь Google',
                email: 'google_user@example.com',
                password: 'google_dummy_password',
                role: 'patient',
                patientId: '',
                lastLogin: new Date().toISOString(),
                ...JSON.parse(JSON.stringify(defaultUserData))
            };
            users.push(googleUser);
            this.saveAllUsers(users);
        }
        
        this.setCurrentUser(googleUser);
        return googleUser;
    },
    // Получить данные для отображения (если это близкий - данные пациента)
    getDisplayData() {
        const user = this.getData();
        if (!user) return null;
        
        if (user.role === 'relative' && user.patientId) {
            const allUsers = this.getAllUsers();
            // Ищем пациента по ID. ID в системе - это Date.now(), но мы отображаем последние 6 цифр.
            // Поэтому ищем по полному ID или по совпадению последних цифр (для удобства).
            const patient = allUsers.find(u => 
                u.role === 'patient' && 
                (u.id.toString() === user.patientId || u.id.toString().slice(-6) === user.patientId)
            );
            if (patient) return patient;
        }
        return user;
    },
    saveData(userData) {
        this.setCurrentUser(userData);
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userData.id);
        if (index !== -1) {
            users[index] = userData;
            this.saveAllUsers(users);
        }
    },

    updateUser(updates) {
        const data = this.getData();
        Object.assign(data, updates);
        this.saveData(data);
    },
    addDiaryEntry(entry) {
        const data = this.getData();
        data.diary.push({ 
            ...entry, 
            date: new Date().toISOString(),
            pain: entry.pain || 0,
            energy: entry.energy || 5
        });
        this.saveData(data);
    },
    toggleMedication(id, status = 'taken') {
        const data = this.getData();
        const med = data.medications.find(m => m.id === id);
        if (med) {
            med.status = status; // 'taken', 'missed', 'pending'
            med.timeTaken = status === 'taken' ? new Date().toISOString() : null;
            med.taken = status === 'taken';
            this.saveData(data);
        }
        return data.medications;
    },
    toggleExercise(id) {
        const data = this.getData();
        const ex = data.exercises.find(e => e.id === id);
        if (ex) {
            ex.completed = !ex.completed;
            this.saveData(data);
        }
        return data.exercises;
    },
    addCustomMedication(med) {
        const data = this.getData();
        const newId = data.medications.length > 0 ? Math.max(...data.medications.map(m => m.id)) + 1 : 1;
        data.medications.push({
            id: newId,
            name: med.name,
            time: med.time,
            status: 'pending',
            taken: false,
            timeTaken: null
        });
        this.saveData(data);
    },
    deleteMedication(id) {
        const data = this.getData();
        data.medications = data.medications.filter(m => m.id !== id);
        this.saveData(data);
        return data.medications;
    },
    resetDailyTasks() {
        const data = this.getData();
        data.medications.forEach(m => { 
            m.taken = false; 
            m.status = 'pending';
            m.timeTaken = null; 
        });
        data.exercises.forEach(e => e.completed = false);
        this.saveData(data);
    }
};

window.showToast = function(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;
    
    // Сброс стилей
    toast.style.background = 'var(--primary)';
    if (type === 'danger') toast.style.background = 'var(--danger-color)';
    if (type === 'warning') toast.style.background = '#f59e0b';
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 500);
    }, 3500);
};
