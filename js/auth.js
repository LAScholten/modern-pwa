/**
 * Simpele Authenticatie voor Hondendatabase
 * Gebruikt localStorage voor sessie management
 */

const auth = {
    // Controleer of ingelogd
    isLoggedIn: function() {
        return localStorage.getItem('userEmail') !== null;
    },
    
    // Controleer of admin
    isAdmin: function() {
        return localStorage.getItem('isAdmin') === 'true';
    },
    
    // Haal huidige gebruiker op
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
        // Hardcoded test accounts
        const users = {
            'leoneurasier@gmail.com': {
                password: 'admin1903',
                isAdmin: true
            },
            'admin@honden.nl': {
                password: 'Admin123!',
                isAdmin: true
            },
            'user@honden.nl': {
                password: 'User123!',
                isAdmin: false
            }
        };
        
        const user = users[email];
        
        if (user && user.password === password) {
            // Sla gebruiker op
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', 'user-' + Date.now());
            localStorage.setItem('isAdmin', user.isAdmin.toString());
            
            return {
                success: true,
                user: {
                    email: email,
                    role: user.isAdmin ? 'admin' : 'user'
                }
            };
        }
        
        return {
            success: false,
            error: 'Ongeldige inloggegevens'
        };
    },
    
    // Logout
    logout: function() {
        console.log('Uitloggen...');
        
        // Verwijder alle user data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        
        // Ga terug naar login pagina
        window.location.href = 'index.html';
    },
    
    // Update user display in app
    updateUserDisplay: function() {
        const userDisplay = document.getElementById('currentUser');
        if (userDisplay) {
            const user = this.getCurrentUser();
            if (user) {
                // Toon email en admin badge
                userDisplay.innerHTML = `
                    ${user.email}
                    ${this.isAdmin() ? '<span class="badge bg-warning ms-1">Admin</span>' : ''}
                `;
            }
        }
    },
    
    // Controleer sessie bij laden app
    checkSession: function() {
        if (!this.isLoggedIn()) {
            console.log('Niet ingelogd, ga naar login');
            window.location.href = 'index.html';
        }
    }
};

// Maak beschikbaar voor andere bestanden
window.auth = auth;

// Controleer sessie wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    auth.checkSession();
    auth.updateUserDisplay();
    
    console.log('Auth geladen. Ingeldigd:', auth.isLoggedIn());
    console.log('Admin:', auth.isAdmin());
    console.log('User:', auth.getCurrentUser());
});