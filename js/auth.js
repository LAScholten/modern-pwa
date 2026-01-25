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
                // Als er geen profiel is, maak er dan een aan
                const { data: newProfile, error: createError } = await this.supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email: email,
                            role: 'viewer', // Default rol
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select()
                    .single();
                
                if (createError) {
                    console.error('Profiel aanmaken fout:', createError);
                    return { 
                        success: false, 
                        error: 'Kon profiel niet aanmaken' 
                    };
                }
                
                profileData = newProfile;
            }
            
            console.log('Auth: Profiel gevonden:', profileData);
            
            // 3. Sla gebruikersdata op in localStorage
            localStorage.setItem('userEmail', profileData.email || email);
            localStorage.setItem('userId', profileData.id);
            localStorage.setItem('userRole', profileData.role || 'viewer');
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            localStorage.setItem('sessionTimestamp', Date.now().toString());
            
            // 4. DEBUG: Log wat er is opgeslagen
            console.log('DEBUG: Data opgeslagen in localStorage:');
            console.log('- userEmail:', localStorage.getItem('userEmail'));
            console.log('- userRole:', localStorage.getItem('userRole'));
            console.log('- userId:', localStorage.getItem('userId'));
            console.log('- sessionTimestamp:', localStorage.getItem('sessionTimestamp'));
            
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
    
    // Check of ingelogd - SIMPELE VERSIE
    isLoggedIn: function() {
        const userEmail = localStorage.getItem('userEmail');
        const hasEmail = userEmail && userEmail.trim() !== '';
        
        console.log('DEBUG isLoggedIn:');
        console.log('- userEmail:', userEmail);
        console.log('- hasEmail:', hasEmail);
        
        // Eenvoudige check: alleen op email
        return hasEmail;
    },
    
    // Haal huidige gebruiker op
    getCurrentUser: function() {
        if (!this.isLoggedIn()) {
            console.log('DEBUG getCurrentUser: Niet ingelogd');
            return null;
        }
        
        try {
            const profileStr = localStorage.getItem('userProfile');
            if (profileStr) {
                const profile = JSON.parse(profileStr);
                const user = {
                    id: profile.id,
                    email: profile.email || localStorage.getItem('userEmail'),
                    role: profile.role || localStorage.getItem('userRole') || 'viewer',
                    username: profile.username || localStorage.getItem('userEmail')?.split('@')[0] || 'Gebruiker'
                };
                console.log('DEBUG getCurrentUser:', user);
                return user;
            }
        } catch (e) {
            console.warn('Kon userProfile niet parsen:', e);
        }
        
        // Fallback naar localStorage
        const user = {
            email: localStorage.getItem('userEmail'),
            id: localStorage.getItem('userId'),
            role: localStorage.getItem('userRole') || 'viewer',
            username: localStorage.getItem('userEmail')?.split('@')[0] || 'Gebruiker'
        };
        console.log('DEBUG getCurrentUser (fallback):', user);
        return user;
    },
    
    // === NIEUWE ROL FUNCTIES ===
    
    // Check specifieke rol
    hasRole: function(role) {
        const user = this.getCurrentUser();
        const hasRole = user && user.role === role;
        console.log(`DEBUG hasRole(${role}):`, hasRole, 'user role:', user?.role);
        return hasRole;
    },
    
    // Check of admin
    isAdmin: function() {
        return this.hasRole('admin');
    },
    
    // Check of editor (kan bewerken)
    canEdit: function() {
        const user = this.getCurrentUser();
        const canEdit = user && (user.role === 'admin' || user.role === 'editor');
        console.log('DEBUG canEdit:', canEdit, 'user role:', user?.role);
        return canEdit;
    },
    
    // Check of delete toegestaan (alleen admin)
    canDelete: function() {
        const canDelete = this.hasRole('admin');
        console.log('DEBUG canDelete:', canDelete);
        return canDelete;
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
            } else {
                userDisplay.innerHTML = 'Niet ingelogd';
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
    
    // Sessie controle - FIXED VERSION
    checkSession: function() {
        console.log('DEBUG checkSession:');
        console.log('- Pathname:', window.location.pathname);
        console.log('- Is app.html?', window.location.pathname.includes('app.html'));
        console.log('- Is logged in?', this.isLoggedIn());
        console.log('- User email in localStorage:', localStorage.getItem('userEmail'));
        
        // Alleen redirect als we op app.html zijn EN niet ingelogd
        if (window.location.pathname.includes('app.html') && !this.isLoggedIn()) {
            console.log('DEBUG: Niet ingelogd op app.html, redirect naar index.html');
            window.location.href = 'index.html';
            return true; // Redirect uitgevoerd
        }
        
        // Als we op index.html zijn EN ingelogd, redirect naar app.html
        if (window.location.pathname.includes('index.html') && this.isLoggedIn()) {
            console.log('DEBUG: Ingelogd op index.html, redirect naar app.html');
            window.location.href = 'app.html';
            return true; // Redirect uitgevoerd
        }
        
        console.log('DEBUG: Geen redirect nodig');
        return false; // Geen redirect
    },
    
    // Laad profiel vanuit Supabase (voor sessie herstel)
    loadProfileFromSupabase: async function(userId) {
        try {
            const { data: profileData, error } = await this.supabase
                .from('profiles')
                .select('id, email, username, role')
                .eq('id', userId)
                .single();
            
            if (error) {
                console.error('loadProfileFromSupabase error:', error);
                return false;
            }
            
            if (profileData) {
                localStorage.setItem('userEmail', profileData.email || '');
                localStorage.setItem('userId', profileData.id);
                localStorage.setItem('userRole', profileData.role || 'viewer');
                localStorage.setItem('userProfile', JSON.stringify(profileData));
                localStorage.setItem('sessionTimestamp', Date.now().toString());
                console.log('DEBUG: Profiel geladen vanuit Supabase');
                return true;
            }
        } catch (e) {
            console.error('loadProfileFromSupabase catch:', e);
        }
        return false;
    },
    
    // Initialiseer alles
    init: async function() {
        console.log('Auth: Initialiseren...');
        console.log('DEBUG init start - location:', window.location.pathname);
        
        // Init Supabase
        if (!this.initSupabase()) {
            console.warn('Auth: Supabase niet beschikbaar, auth beperkt');
        }
        
        // Controleer Supabase sessie (voor als localStorage leeg is)
        if (this.supabase && !this.isLoggedIn()) {
            const { data: session } = await this.supabase.auth.getSession();
            console.log('DEBUG: Supabase session:', session);
            
            if (session?.session?.user?.id) {
                console.log('DEBUG: Supabase sessie gevonden, laad profiel');
                await this.loadProfileFromSupabase(session.session.user.id);
            }
        }
        
        // Controleer sessie (dit kan redirect doen)
        const redirected = this.checkSession();
        
        // Als er geen redirect was, setup UI
        if (!redirected) {
            // Update user display
            this.updateUserDisplay();
            
            // Setup logout buttons
            setTimeout(() => {
                this.setupLogoutButtons();
            }, 500);
            
            // Sessie auto-refresh elke 5 minuten
            setInterval(() => {
                if (this.isLoggedIn()) {
                    localStorage.setItem('sessionTimestamp', Date.now().toString());
                }
            }, 5 * 60 * 1000);
            
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
            
            console.log('Auth: Initialisatie voltooid.');
            console.log('Auth: User:', this.getCurrentUser());
            console.log('Auth: Rol:', this.getCurrentUser()?.role);
            console.log('Auth: Kan bewerken?', this.canEdit());
            console.log('Auth: Kan verwijderen?', this.canDelete());
        }
    }
};

// Maak globaal beschikbaar
window.auth = auth;

// Automatisch initialiseren wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - start auth init');
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