window.togglePassword = function(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
};

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

window.initAuth = function() {
    const authScreen = document.getElementById('auth-screen');
    const appContainer = document.getElementById('app');
    
    // Вкладки
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Кнопки форм
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleRegisterBtn = document.getElementById('google-register-btn');

    // Симуляция Google Auth
    [googleLoginBtn, googleRegisterBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                window.showToast(window.t('google_sim_msg') || 'Симуляция Google Auth: Выполняется вход...', 'info');
                setTimeout(() => {
                    const user = window.dataStore.loginWithGoogle();
                    doAuthTransition(user.name);
                }, 1500);
            });
        }
    });
    
    // Выбор роли
    let selectedRole = 'patient';
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            roleBtns.forEach(b => {
                b.classList.remove('active');
                // Clear any lingering inline styles
                b.style.background = '';
                b.style.color = '';
                b.style.borderColor = '';
            });
            btn.classList.add('active');
            selectedRole = btn.getAttribute('data-role');
            
            // Show/hide patient ID field
            const patientIdGroup = document.getElementById('patient-id-group');
            if (patientIdGroup) {
                if (selectedRole === 'relative') {
                    patientIdGroup.classList.remove('hidden');
                } else {
                    patientIdGroup.classList.add('hidden');
                }
            }
        });
    });

    // Переключение вкладок
    if (loginTab && registerTab) {
        loginTab.onclick = () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        };
        registerTab.onclick = () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        };
    }

    function checkSession() {
        const currentUser = window.dataStore.getCurrentUser();
        if (currentUser) {
            authScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            // Обновляем дату входа
            window.dataStore.updateUser({ lastLogin: new Date().toISOString() });
            
            updateUserProfile(currentUser.name);
            return true;
        } else {
            authScreen.classList.remove('hidden');
            appContainer.classList.add('hidden');
            
            // Перевод экрана входа при необходимости
            if (window.translateUI) {
                const lang = localStorage.getItem('lang') || 'ru';
                window.translateUI(lang);
            }
            return false;
        }
    }

    checkSession();

    function doAuthTransition(name) {
        authScreen.style.opacity = '0';
        setTimeout(() => {
            authScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            appContainer.style.opacity = '0';
            appContainer.style.transform = 'translateY(20px)';
            setTimeout(() => {
                appContainer.style.transition = 'all 0.5s ease';
                appContainer.style.opacity = '1';
                appContainer.style.transform = 'translateY(0)';
                
                // Re-apply translations to the now-visible app UI (nav, modals, etc.)
                if (window.translateUI) {
                    const lang = localStorage.getItem('lang') || 'ru';
                    window.translateUI(lang);
                }
            }, 50);

            updateUserProfile(name);
            const welcomeMsg = window.t('welcome_name') ? window.t('welcome_name').replace('{name}', name) : `${window.t('welcome')}, ${name}!`;
            window.showToast(welcomeMsg);
        }, 300);
    }

    // Вход
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            if (!email || !pass) {
                window.showToast(window.t('fill_fields'), 'warning');
                return;
            }
            if (!isValidEmail(email)) {
                window.showToast(window.t('invalid_email'), 'warning');
                return;
            }
            const result = window.dataStore.loginUser(email, pass);
            if (result.success) {
                const user = window.dataStore.getCurrentUser();
                doAuthTransition(user.name);
            } else {
                window.showToast(result.error);
            }
        });
    }

    // Регистрация
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('register-name');
            const emailInput = document.getElementById('register-email');
            const passInput = document.getElementById('register-password');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const pass = passInput.value;
            
            const patientIdInput = document.getElementById('register-patient-id');
            const patientId = patientIdInput ? patientIdInput.value.trim() : '';

            if (!name || !email || !pass) {
                window.showToast(window.t('fill_fields'), 'warning');
                return;
            }
            
            if (!isValidEmail(email)) {
                window.showToast(window.t('invalid_email'), 'danger');
                return;
            }
            if (selectedRole === 'relative' && !patientId) {
                window.showToast(window.t('enter_patient_id'), 'warning');
                return;
            }
            if (pass.length < 6) {
                window.showToast(window.t('pass_short'), 'warning');
                return;
            }

            const result = window.dataStore.registerUser(name, email, pass, selectedRole, patientId);
            
            if (result && result.success) {
                doAuthTransition(name);
            } else {
                window.showToast(result.error || window.t('reg_error'), 'danger');
            }
        });
    }

    // Выход
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.dataStore.logoutUser();
            window.location.reload();
        });
    }

};

function updateUserProfile(name) {
    const avatarImg = document.querySelector('.avatar');
    const nameDisplay = document.getElementById('user-name-display');
    
    if (nameDisplay) {
        nameDisplay.textContent = name;
    }

    if (avatarImg && name) {
        const firstLetter = name.charAt(0).toUpperCase();
        avatarImg.src = `https://ui-avatars.com/api/?name=${firstLetter}&background=2dd4bf&color=fff&size=64`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.initAuth();
});
