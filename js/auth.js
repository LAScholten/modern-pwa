/**
 * Authenticatie Systeem - Rolgebaseerde Autorizatie
 * Werkt met Supabase profiles tabel + role kolom
 */

const auth = {
    // Basis configuratie
    supabase: null,
    
    // Initialiseer Supabase
    initSupabase: function() {
        if (!window.supabase) {
            console.error('Supabase is niet geladen!');
            return false;
        }
        this.supabase = window.supabase;
        return true;
    },
    
    // Login functie - gebruikt Supabase
    login: async function(email, password) {
        try {
            console.log('Auth: Proberen in te loggen...', email);
            
            // 1. Authenticatie via Supabase Auth
            const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (authError) {
                console.error('Auth fout:', authError);
                return { 
                    success: false, 
                    error: 'Ongeldige inloggegevens of wachtwoord' 
                };
            }
            
            console.log('Auth: Ingelogd bij Supabase Auth, user ID:', authData.user.id);
            
            // 2. Haal profielgegevens op uit profiles tabel (met role!)
            const { data: profileData, error: profileError } = await this.supabase
                .from('profiles')
                .select('id, email, username, role, created_at')
                .eq('id', authData.user.id)
                .single();
            
            if (profileError) {
                console.error('Profiel ophalen fout:', profileError);
                return { 
                    success: false, 
                    error: 'Kon profielgegevens niet ophalen' 
                };
            }
            
            console.log('Auth: Profiel gevonden:', profileData);
            
            // 3. Sla gebruikersdata op in localStorage
            localStorage.setItem('userEmail', profileData.email || email);
            localStorage.setItem('userId', profileData.id);
            localStorage.setItem('userRole', profileData.role || 'viewer');
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            localStorage.setItem('sessionTimestamp', Date.now().toString());
            
            // 4. Update UI
            this.updateUserDisplay();
            
            return { 
                success: true, 
                user: {
                    id: profileData.id,
                    email: profileData.email || email,
                    role: profileData.role || 'viewer',
                    username: profileData.username || email.split('@')[0]
                }
            };
            
        } catch (error) {
            console.error('Login catch error:', error);
            return { 
                success: false, 
                error: 'Er ging iets mis tijdens het inloggen: ' + error.message 
            };
        }
    },
    
    // Logout functie
    logout: async function() {
        console.log('Auth: Uitloggen gestart...');
        
        try {
            // Supabase uitloggen
            if (this.supabase) {
                const { error } = await this.supabase.auth.signOut();
                if (error) console.error('Supabase logout error:', error);
            }
        } catch (e) {
            console.warn('Supabase logout exception:', e);
        }
        
        // Verwijder ALLE lokale data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('sessionTimestamp');
        localStorage.removeItem('isAdmin'); // Oude key verwijderen
        
        console.log('Auth: Login data verwijderd');
        
        // Redirect naar login pagina
        window.location.href = 'index.html';
    },
    
    // Check of ingelogd
    isLoggedIn: function() {
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        const sessionTime = localStorage.getItem('sessionTimestamp');
        
        if (!userEmail || !userRole) return false;
        
        // Optioneel: Check sessie timeout (24 uur)
        if (sessionTime) {
            const sessionAge = Date.now() - parseInt(sessionTime);
            const maxAge = 24 * 60 * 60 * 1000; // 24 uur
            if (sessionAge > maxAge) {
                console.log('Auth: Sessie verlopen');
                this.logout();
                return false;
            }
        }
        
        return true;
    },
    
    // Haal huidige gebruiker op
    getCurrentUser: function() {
        if (!this.isLoggedIn()) return null;
        
        try {
            const profileStr = localStorage.getItem('userProfile');
            if (profileStr) {
                const profile = JSON.parse(profileStr);
                return {
                    id: profile.id,
                    email: profile.email || localStorage.getItem('userEmail'),
                    role: profile.role || localStorage.getItem('userRole'),
                    username: profile.username || localStorage.getItem('userEmail')?.split('@')[0] || 'Gebruiker'
                };
            }
        } catch (e) {
            console.warn('Kon userProfile niet parsen:', e);
        }
        
        // Fallback naar localStorage
        return {
            email: localStorage.getItem('userEmail'),
            id: localStorage.getItem('userId'),
            role: localStorage.getItem('userRole') || 'viewer',
            username: localStorage.getItem('userEmail')?.split('@')[0] || 'Gebruiker'
        };
    },
    
    // === NIEUWE ROL FUNCTIES ===
    
    // Check specifieke rol
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },
    
    // Check of admin
    isAdmin: function() {
        return this.hasRole('admin');
    },
    
    // Check of editor (kan bewerken)
    canEdit: function() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'editor');
    },
    
    // Check of delete toegestaan (alleen admin)
    canDelete: function() {
        return this.hasRole('admin');
    },
    
    // Check of viewer (alleen bekijken)
    isViewer: function() {
        return this.hasRole('viewer');
    },
    
    // Haal alle mogelijke rollen op (voor UI)
    getAvailableRoles: function() {
        return ['admin', 'editor', 'viewer'];
    },
    
    // Format rol voor display
    getRoleDisplayName: function(role) {
        const roleNames = {
            'admin': 'Administrator',
            'editor': 'Editor',
            'viewer': 'Viewer'
        };
        return roleNames[role] || role;
    },
    
    // === UI FUNCTIES ===
    
    // Update user display in navbar
    updateUserDisplay: function() {
        const userDisplay = document.getElementById('currentUser');
        if (userDisplay) {
            const user = this.getCurrentUser();
            if (user) {
                const roleName = this.getRoleDisplayName(user.role);
                const roleClass = {
                    'admin': 'bg-warning',
                    'editor': 'bg-info',
                    'viewer': 'bg-secondary'
                }[user.role] || 'bg-secondary';
                
                userDisplay.innerHTML = `
                    ${user.email}
                    <span class="badge ${roleClass} ms-1">${roleName}</span>
                `;
            }
        }
    },
    
    // Setup logout buttons
    setupLogoutButtons: function() {
        console.log('Auth: Setup logout buttons...');
        
        const logoutButtons = [
            'logoutBtn',
            'logoutBtnMobile',
            'logoutBtnSidebar',
            'btn-logout'
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
                    console.log(`Auth: Logout knop ${btnId} geklikt`);
                    this.logout();
                });
            }
        });
        
        // Zoek op klasse
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
    
    // Sessie controle
    checkSession: function() {
        if (!this.isLoggedIn() && window.location.pathname.includes('app.html')) {
            console.log('Auth: Niet ingelogd, redirect naar login');
            window.location.href = 'index.html';
        }
    },
    
    // Automatische sessie verlenging
    refreshSession: function() {
        if (this.isLoggedIn()) {
            localStorage.setItem('sessionTimestamp', Date.now().toString());
        }
    },
    
    // Initialiseer alles
    init: async function() {
        console.log('Auth: Initialiseren...');
        
        // Init Supabase
        if (!this.initSupabase()) {
            console.warn('Auth: Supabase niet beschikbaar, auth beperkt');
        }
        
        // Controleer sessie
        this.checkSession();
        
        // Update user display
        this.updateUserDisplay();
        
        // Setup logout buttons
        setTimeout(() => {
            this.setupLogoutButtons();
        }, 500);
        
        // Sessie auto-refresh elke 5 minuten
        setInterval(() => this.refreshSession(), 5 * 60 * 1000);
        
        // Maak functies globaal beschikbaar
        window.globalLogout = () => this.logout();
        window.getCurrentUserRole = () => this.getCurrentUser()?.role;
        window.hasPermission = (action) => {
            switch(action) {
                case 'edit': return this.canEdit();
                case 'delete': return this.canDelete();
                case 'admin': return this.isAdmin();
                default: return this.isLoggedIn();
            }
        };
        
        console.log('Auth: Initialisatie voltooid. User:', this.getCurrentUser());
        console.log('Auth: Rol:', this.getCurrentUser()?.role);
        console.log('Auth: Kan bewerken?', this.canEdit());
        console.log('Auth: Kan verwijderen?', this.canDelete());
    }
};

// Maak globaal beschikbaar
window.auth = auth;

// Automatisch initialiseren wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        auth.init();
    }, 300);
});

// Compatibiliteit voor oude code
window.logoutUser = function() {
    auth.logout();
    return false;
};

window.handleLogout = function() {
    auth.logout();
};

// Nieuwe API voor modules
window.getUserRole = () => auth.getCurrentUser()?.role;
window.canUserEdit = () => auth.canEdit();
window.canUserDelete = () => auth.canDelete();