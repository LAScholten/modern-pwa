/**
 * Authenticatie Systeem voor Supabase
 * Vervangt de oude hardcoded authenticatie
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 uur
        
        // Check of supabase bestaat (wordt geladen via supabase-honden.js)
        if (typeof supabase === 'undefined') {
            console.warn('Supabase client niet gevonden. Gebruik localStorage fallback.');
        }
        
        this.init();
    }
    
    init() {
        // Check of er al een gebruiker in localStorage staat
        const savedUser = localStorage.getItem('currentUser');
        const savedTimestamp = localStorage.getItem('sessionTimestamp');
        
        if (savedUser && savedTimestamp) {
            const sessionAge = Date.now() - parseInt(savedTimestamp);
            if (sessionAge < this.sessionTimeout) {
                this.currentUser = JSON.parse(savedUser);
                this.updateSessionTimestamp();
            } else {
                this.logout();
            }
        }
        
        // Controleer Supabase sessie (indien beschikbaar)
        this.checkSupabaseSession();
        
        // Start sessie check interval
        setInterval(() => this.checkSession(), 60000);
    }
    
    async checkSupabaseSession() {
        if (typeof supabase === 'undefined') return;
        
        try {
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                console.warn('Supabase sessie check fout:', error);
                return;
            }
            
            if (data.session) {
                // Gebruiker heeft actieve Supabase sessie
                await this.setCurrentUserFromSupabase(data.session.user);
                this.updateSessionTimestamp();
            }
        } catch (error) {
            console.log('Supabase sessie check mislukt:', error.message);
        }
    }
    
    async setCurrentUserFromSupabase(supabaseUser) {
        if (!supabaseUser) {
            this.currentUser = null;
            return;
        }
        
        // Haal profiel op om admin status te bepalen
        let isAdmin = false;
        try {
            if (typeof supabase !== 'undefined') {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('user_id', supabaseUser.id)
                    .single();
                    
                if (!error && profile) {
                    isAdmin = profile.is_admin === true;
                }
            }
        } catch (error) {
            console.warn('Profiel ophalen mislukt:', error);
        }
        
        this.currentUser = {
            id: supabaseUser.id,
            email: supabaseUser.email,
            username: supabaseUser.email.split('@')[0],
            role: isAdmin ? 'admin' : 'user',
            loginTime: new Date().toISOString(),
            supabaseUser: supabaseUser
        };
        
        // Sla in localStorage op voor snelle toegang
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('isAdmin', isAdmin.toString());
        localStorage.setItem('userEmail', supabaseUser.email);
        localStorage.setItem('userId', supabaseUser.id);
    }
    
    async login(email, password) {
        try {
            console.log('Probeer in te loggen met:', email);
            
            // Gebruik Supabase als beschikbaar
            if (typeof supabase !== 'undefined') {
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (authError) {
                    this.logAction('login_failed', `Mislukte login voor ${email}: ${authError.message}`);
                    return { 
                        success: false, 
                        error: authError.message 
                    };
                }
                
                // Gebruiker succesvol ingelogd
                await this.setCurrentUserFromSupabase(authData.user);
                this.updateSessionTimestamp();
                
                this.logAction('login', `Gebruiker ${email} ingelogd`);
                
                return { 
                    success: true, 
                    user: this.currentUser 
                };
            } else {
                // Fallback naar localStorage (voor ontwikkeling)
                return this.localLogin(email, password);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    localLogin(email, password) {
        // Fallback voor ontwikkeling (hardcoded gebruikers)
        const users = {
            'admin@voorbeeld.nl': { 
                email: 'admin@voorbeeld.nl', 
                password: 'Admin123!', 
                role: 'admin',
                id: 'local-admin-id'
            },
            'user@voorbeeld.nl': { 
                email: 'user@voorbeeld.nl', 
                password: 'User123!', 
                role: 'user',
                id: 'local-user-id'
            },
            'leoneurasier@gmail.com': {
                email: 'leoneurasier@gmail.com',
                password: 'admin1903',
                role: 'admin',
                id: 'leoneurasier-id'
            }
        };
        
        const user = users[email];
        
        if (user && user.password === password) {
            this.currentUser = {
                email: user.email,
                username: user.email.split('@')[0],
                role: user.role,
                id: user.id,
                loginTime: new Date().toISOString()
            };
            
            // Sla sessie op
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.id);
            this.updateSessionTimestamp();
            
            // Audit log
            this.logAction('login', `Gebruiker ${email} ingelogd (local)`);
            
            return { success: true, user: this.currentUser };
        }
        
        this.logAction('login_failed', `Mislukte login voor ${email}`);
        return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
    }
    
    async logout() {
        try {
            const userEmail = this.currentUser?.email;
            
            // Logout van Supabase als beschikbaar
            if (typeof supabase !== 'undefined') {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Supabase logout error:', error);
                }
            }
            
            // Local opschonen
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionTimestamp');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            
            // Audit log
            if (userEmail) {
                this.logAction('logout', `Gebruiker ${userEmail} uitgelogd`);
            }
            
            // Redirect naar login pagina
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isAdmin() {
        if (!this.currentUser) {
            // Check localStorage fallback
            return localStorage.getItem('isAdmin') === 'true';
        }
        return this.currentUser.role === 'admin';
    }
    
    isLoggedIn() {
        return this.currentUser !== null || localStorage.getItem('userEmail') !== null;
    }
    
    updateSessionTimestamp() {
        localStorage.setItem('sessionTimestamp', Date.now().toString());
    }
    
    checkSession() {
        const savedTimestamp = localStorage.getItem('sessionTimestamp');
        if (!savedTimestamp) {
            this.logout();
            return false;
        }
        
        const sessionAge = Date.now() - parseInt(savedTimestamp);
        if (sessionAge > this.sessionTimeout) {
            this.logout();
            return false;
        }
        
        this.updateSessionTimestamp();
        return true;
    }
    
    logAction(action, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: this.currentUser ? this.currentUser.email : 'system',
            action: action,
            details: details,
            ip: 'local'
        };
        
        // Sla log op in localStorage
        const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
        logs.push(logEntry);
        
        // Beperk logs tot laatste 100 entries
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('auditLogs', JSON.stringify(logs));
    }
    
    getAuditLogs() {
        return JSON.parse(localStorage.getItem('auditLogs') || '[]');
    }
    
    // Helper om gebruikersprofiel bij te werken
    async updateUserProfile(profileData) {
        if (!this.currentUser) {
            throw new Error('Niet ingelogd');
        }
        
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase niet beschikbaar');
        }
        
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                user_id: this.currentUser.id,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (error) throw error;
        return data;
    }
}

// Initialiseer auth systeem
const auth = new AuthSystem();

// Initialiseer wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    // Wacht kort om zeker te weten dat supabase geladen is
    setTimeout(() => {
        auth.init();
    }, 500);
});

// Exporteer voor gebruik in andere bestanden
window.auth = auth;