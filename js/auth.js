/**
 * Authenticatie Systeem voor Supabase
 * Twee gebruikersrollen: Administrator en Gebruiker
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 uur
        
        // Controleer of supabase bestaat
        if (typeof supabase === 'undefined') {
            console.error('Supabase client niet gevonden');
        }
    }
    
    init() {
        // Nu wordt sessie door Supabase zelf beheerd
        this.checkSupabaseSession();
        
        // Start sessie check interval
        setInterval(() => this.checkSupabaseSession(), 60000);
    }
    
    async checkSupabaseSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Sessie check fout:', error);
                this.currentUser = null;
                return;
            }
            
            if (data.session) {
                // Sessie bestaat, update gebruiker
                await this.setCurrentUserFromSupabase(data.session.user);
                this.updateSessionTimestamp();
            } else {
                // Geen sessie
                this.currentUser = null;
            }
        } catch (error) {
            console.error('Fout bij sessie check:', error);
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
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('user_id', supabaseUser.id)
                .single();
                
            if (!error && profile) {
                isAdmin = profile.is_admin === true;
            }
        } catch (error) {
            console.warn('Profiel ophalen mislukt:', error);
        }
        
        this.currentUser = {
            id: supabaseUser.id,
            email: supabaseUser.email,
            username: supabaseUser.email.split('@')[0], // Afgeleid van email
            role: isAdmin ? 'admin' : 'user',
            loginTime: new Date().toISOString(),
            supabaseUser: supabaseUser // Bewaar origineel object voor extra data
        };
        
        // Sla in localStorage op voor snelle toegang
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('isAdmin', isAdmin.toString());
    }
    
    async login(email, password) {
        try {
            console.log('Probeer in te loggen met:', email);
            
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
            
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    async logout() {
        try {
            const userEmail = this.currentUser?.email;
            
            // Logout van Supabase
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('Logout error:', error);
            }
            
            // Local opschonen
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionTimestamp');
            localStorage.removeItem('isAdmin');
            
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
        if (!this.currentUser) return false;
        return this.currentUser.role === 'admin';
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    updateSessionTimestamp() {
        localStorage.setItem('sessionTimestamp', Date.now().toString());
    }
    
    checkSession() {
        const savedTimestamp = localStorage.getItem('sessionTimestamp');
        if (!savedTimestamp) {
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
        
        const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
        logs.push(logEntry);
        
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

// Initialiseer wanneer supabase geladen is
document.addEventListener('DOMContentLoaded', () => {
    // Wacht kort om zeker te weten dat supabase geladen is
    setTimeout(() => {
        auth.init();
    }, 500);
});

// Exporteer voor gebruik in andere bestanden
window.auth = auth;