/**
 * Authenticatie Systeem - Werkt volledig zelfstandig
 * GEEN app.html aanpassingen nodig
 */

const auth = {
    // Basis functies
    isLoggedIn: function() {
        return localStorage.getItem('userEmail') !== null;
    },
    
    isAdmin: function() {
        return localStorage.getItem('isAdmin') === 'true';
    },
    
    getCurrentUser: function() {
        if (!this.isLoggedIn()) return null;
        
        return {
            email: localStorage.getItem('userEmail'),
            id: localStorage.getItem('userId'),
            username: localStorage.getItem('userEmail')?.split('@')[0] || 'Gebruiker',
            role: this.isAdmin() ? 'admin' : 'user'
        };
    },
    
    // Login (gebruikt door index.html)
    login: function(email, password) {
        // Test accounts voor nu
        const users = {
            'leoneurasier@gmail.com': { password: 'admin1903', isAdmin: true },
            'admin@honden.nl': { password: 'Admin123!', isAdmin: true },
            'user@honden.nl': { password: 'User123!', isAdmin: false }
        };
        
        const user = users[email];
        
        if (user && user.password === password) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', 'user-' + Date.now());
            localStorage.setItem('isAdmin', user.isAdmin.toString());
            
            return { success: true, user: { email: email, role: user.isAdmin ? 'admin' : 'user' } };
        }
        
        return { success: false, error: 'Ongeldige inloggegevens' };
    },
    
    // UITLOGGEN - De belangrijke functie
    logout: function() {
        console.log('Auth: Uitloggen gestart...');
        
        // Verwijder ALLE login data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimestamp');
        
        console.log('Auth: Login data verwijderd');
        
        // Naar login pagina
        window.location.href = 'index.html';
    },
    
    // Update user display in navbar
    updateUserDisplay: function() {
        const userDisplay = document.getElementById('currentUser');
        if (userDisplay) {
            const user = this.getCurrentUser();
            if (user) {
                userDisplay.innerHTML = `
                    ${user.email}
                    ${this.isAdmin() ? '<span class="badge bg-warning ms-1">Admin</span>' : 
                                      '<span class="badge bg-info ms-1">Gebruiker</span>'}
                `;
            }
        }
    },
    
    // Automatische logout knop setup
    setupLogoutButtons: function() {
        console.log('Auth: Setup logout buttons...');
        
        // Zoek ALLE uitlogknoppen
        const logoutButtons = [
            'logoutBtn',           // Desktop knop
            'logoutBtnMobile',     // Mobiele knop
            'logoutBtnSidebar',    // Eventuele sidebar knop
            'btn-logout'           // Andere mogelijke IDs
        ];
        
        logoutButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                console.log(`Auth: Vond logout knop: ${btnId}`);
                
                // Verwijder eerst alle bestaande event listeners
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // Voeg nieuwe event listener toe
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Auth: Logout knop ${btnId} geklikt`);
                    this.logout();
                });
                
                // Ook voor onclick (oude methode)
                newBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logout();
                    return false;
                };
            }
        });
        
        // Ook zoek op klasse
        const logoutByClass = document.querySelectorAll('.btn-logout, .logout-btn, [data-action="logout"]');
        logoutByClass.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Auth: Logout via klasse geklikt');
                this.logout();
            });
        });
    },
    
    // Controleer sessie
    checkSession: function() {
        if (!this.isLoggedIn() && window.location.pathname.includes('app.html')) {
            console.log('Auth: Niet ingelogd, redirect naar login');
            window.location.href = 'index.html';
        }
    },
    
    // Initialiseer alles
    init: function() {
        console.log('Auth: Initialiseren...');
        
        // Controleer sessie
        this.checkSession();
        
        // Update user display
        this.updateUserDisplay();
        
        // Setup logout buttons (na korte delay zodat DOM geladen is)
        setTimeout(() => {
            this.setupLogoutButtons();
        }, 500);
        
        // Voeg ook global logout functie toe voor het geval dat
        window.globalLogout = () => this.logout();
        
        console.log('Auth: Initialisatie voltooid. User:', this.getCurrentUser());
    }
};

// Maak globaal beschikbaar
window.auth = auth;

// Automatisch initialiseren wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    // Kleine delay om zeker te zijn dat alles geladen is
    setTimeout(() => {
        auth.init();
    }, 300);
});

// Ook direct beschikbaar voor inline onclick (oudere methodes)
window.logoutUser = function() {
    auth.logout();
    return false;
};

// Voor maximum compatibiliteit
window.handleLogout = function() {
    auth.logout();
};