/**
 * Authenticatie Systeem - Backward compatible met rollen systeem
 * Werkt volledig zelfstandig - GEEN Supabase auth nodig
 */

const auth = {
    // Hardcoded gebruikersaccounts met rollen
    hardcodedUsers: {
        'leoneurasier@gmail.com': { 
            password: 'admin1903', 
            role: 'admin',
            isAdmin: true  // Backward compatible
        },
        'admin@honden.nl': { 
            password: 'Admin123!', 
            role: 'admin',
            isAdmin: true  // Backward compatible
        },
        'editor@honden.nl': { 
            password: 'Editor123!', 
            role: 'editor',
            isAdmin: false  // Backward compatible
        },
        'user@honden.nl': { 
            password: 'User123!', 
            role: 'viewer',
            isAdmin: false  // Backward compatible
        }
    },

    // Rollen hiërarchie (wie heeft toegang tot wat)
    rolePermissions: {
        admin: ['admin', 'editor', 'viewer'],    // Admin kan alles
        editor: ['editor', 'viewer'],            // Editor kan bewerken en bekijken
        viewer: ['viewer']                       // Viewer kan alleen bekijken
    },

    // ---------- BESTAANDE FUNCTIES (ONVERANDERD) ----------
    
    isLoggedIn: function() {
        return localStorage.getItem('userEmail') !== null;
    },
    
    isAdmin: function() {
        // Backward compatible: check localStorage en role
        return localStorage.getItem('isAdmin') === 'true' || 
               this.getCurrentUserRole() === 'admin';
    },
    
    getCurrentUser: function() {
        if (!this.isLoggedIn()) return null;
        
        const email = localStorage.getItem('userEmail');
        const role = this.getCurrentUserRole();
        
        return {
            email: email,
            id: localStorage.getItem('userId'),
            username: email?.split('@')[0] || 'Gebruiker',
            role: role,
            // Backward compatible properties
            isAdmin: role === 'admin'
        };
    },
    
    // Login (aangepast voor rollen)
    login: function(email, password) {
        // Check hardcoded users eerst
        const user = this.hardcodedUsers[email];
        
        if (user && user.password === password) {
            // Sla op in localStorage
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', 'user-' + Date.now());
            localStorage.setItem('userRole', user.role);  // NIEUW: sla rol op
            localStorage.setItem('isAdmin', user.isAdmin.toString());  // Backward compatible
            
            console.log(`Auth: ${email} ingelogd als ${user.role}`);
            
            return { 
                success: true, 
                user: { 
                    email: email, 
                    role: user.role,
                    isAdmin: user.isAdmin  // Backward compatible
                } 
            };
        }
        
        // Later kun je hier Supabase auth toevoegen
        return { success: false, error: 'Ongeldige inloggegevens' };
    },
    
    // UITLOGGEN - Onveranderd
    logout: function() {
        console.log('Auth: Uitloggen gestart...');
        
        // Verwijder ALLE login data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userRole');  // NIEUW: verwijder rol
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimestamp');
        
        console.log('Auth: Login data verwijderd');
        
        // Naar login pagina
        window.location.href = 'index.html';
    },
    
    updateUserDisplay: function() {
        const userDisplay = document.getElementById('currentUser');
        if (userDisplay) {
            const user = this.getCurrentUser();
            if (user) {
                const roleBadges = {
                    admin: '<span class="badge bg-danger ms-1">Admin</span>',
                    editor: '<span class="badge bg-warning ms-1">Editor</span>',
                    viewer: '<span class="badge bg-info ms-1">Viewer</span>'
                };
                
                userDisplay.innerHTML = `
                    ${user.email}
                    ${roleBadges[user.role] || '<span class="badge bg-secondary ms-1">Gebruiker</span>'}
                `;
            }
        }
    },
    
    setupLogoutButtons: function() {
        console.log('Auth: Setup logout buttons...');
        
        const logoutButtons = [
            'logoutBtn', 'logoutBtnMobile', 'logoutBtnSidebar', 'btn-logout'
        ];
        
        logoutButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                console.log(`Auth: Vond logout knop: ${btnId}`);
                
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logout();
                });
                
                newBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logout();
                    return false;
                };
            }
        });
        
        const logoutByClass = document.querySelectorAll('.btn-logout, .logout-btn, [data-action="logout"]');
        logoutByClass.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.logout();
            });
        });
    },
    
    checkSession: function() {
        if (!this.isLoggedIn() && window.location.pathname.includes('app.html')) {
            console.log('Auth: Niet ingelogd, redirect naar login');
            window.location.href = 'index.html';
        }
    },
    
    // ---------- NIEUWE ROL FUNCTIES ----------
    
    /**
     * Get de huidige rol van de ingelogde gebruiker
     * @returns {string} 'admin', 'editor', 'viewer', of null
     */
    getCurrentUserRole: function() {
        if (!this.isLoggedIn()) return null;
        
        // Check eerst localStorage
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) return storedRole;
        
        // Fallback: check email tegen hardcoded users
        const email = localStorage.getItem('userEmail');
        const user = this.hardcodedUsers[email];
        
        return user ? user.role : 'viewer';  // Default naar viewer
    },
    
    /**
     * Check of gebruiker een specifieke rol heeft
     * @param {string} role - Rol om te checken
     * @returns {boolean}
     */
    hasRole: function(role) {
        const currentRole = this.getCurrentUserRole();
        if (!currentRole) return false;
        
        return this.rolePermissions[currentRole].includes(role);
    },
    
    /**
     * Check of gebruiker kan bewerken
     * @returns {boolean} true voor admin en editor
     */
    canEdit: function() {
        return this.hasRole('admin') || this.hasRole('editor');
    },
    
    /**
     * Check of gebruiker kan verwijderen
     * @returns {boolean} true alleen voor admin
     */
    canDelete: function() {
        return this.hasRole('admin');
    },
    
    /**
     * Check of gebruiker admin is (alternatief voor isAdmin())
     * @returns {boolean}
     */
    isAdminRole: function() {
        return this.hasRole('admin');
    },
    
    /**
     * Get alle rollen voor dropdown of selectie
     * @returns {Array} Lijst van beschikbare rollen
     */
    getAvailableRoles: function() {
        return ['admin', 'editor', 'viewer'];
    },
    
    // ---------- INITIALISATIE ----------
    
    init: function() {
        console.log('Auth: Initialiseren met rollen systeem...');
        
        // Controleer sessie
        this.checkSession();
        
        // Update user display
        this.updateUserDisplay();
        
        // Setup logout buttons
        setTimeout(() => {
            this.setupLogoutButtons();
        }, 500);
        
        // Voeg global functions toe
        window.globalLogout = () => this.logout();
        
        // Log user info
        const user = this.getCurrentUser();
        console.log('Auth: Initialisatie voltooid. User:', user);
        console.log('Auth: Rechten - Edit:', this.canEdit(), 'Delete:', this.canDelete());
    }
};

// Maak globaal beschikbaar
window.auth = auth;

// Automatisch initialiseren
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        auth.init();
    }, 300);
});

// Backward compatible globale functies
window.logoutUser = function() {
    auth.logout();
    return false;
};

window.handleLogout = function() {
    auth.logout();
};

// NIEUWE globale functies voor rollen
window.canEdit = function() {
    return auth.canEdit();
};

window.canDelete = function() {
    return auth.canDelete();
};

window.getCurrentUserRole = function() {
    return auth.getCurrentUserRole();
};