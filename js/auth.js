/**
 * Authenticatie Systeem
 * Twee gebruikersrollen: Administrator en Gebruiker
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 uur
        this.init();
    }
    
    init() {
        // Controleer of er een actieve sessie is
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
    }
    
    login(username, password) {
        // Hardcoded gebruikers (in productie vervangen door server-side auth)
        const users = {
            'admin': { username: 'admin', password: 'admin1903', role: 'admin' },
            'user': { username: 'user', password: 'user123', role: 'user' }
        };
        
        const user = users[username];
        
        if (user && user.password === password) {
            this.currentUser = {
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            
            // Sla sessie op
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateSessionTimestamp();
            
            // Audit log
            this.logAction('login', `Gebruiker ${username} ingelogd`);
            
            return { success: true, user: this.currentUser };
        }
        
        this.logAction('login_failed', `Mislukte login poging voor ${username}`);
        return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
    }
    
    logout() {
        if (this.currentUser) {
            this.logAction('logout', `Gebruiker ${this.currentUser.username} uitgelogd`);
        }
        
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimestamp');
        
        // Redirect naar login pagina
        window.location.href = 'index.html';
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
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
            user: this.currentUser ? this.currentUser.username : 'system',
            action: action,
            details: details,
            ip: 'local' // In productie zou dit het echte IP zijn
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
}

const auth = new AuthSystem();

// Sessie controle elke minuut
setInterval(() => auth.checkSession(), 60000);