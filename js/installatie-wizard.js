class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            // Niet automatisch tonen - alleen als de gebruiker op de knop klikt
        });
    } 
    
    // Deze functie wordt aangeroepen door de knop in de header
    showWizard() {
        const devices = this.getDevices();
        
        const html = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.2);z-index:10000;width:320px;">
                <div style="margin-bottom:15px;text-align:center;">
                    <strong style="font-size:16px;display:block;margin-bottom:10px;">Zo zal de snelkoppeling er uit zien:</strong>
                    <div style="display:inline-flex;align-items:center;padding:10px 15px;background:#f8f9fa;border-radius:8px;">
                        <img src="/modern-pwa/img/icons/icon-192x192.png" alt="App Icon" style="width:32px;height:32px;margin-right:10px;border-radius:6px;">
                        <span style="font-size:14px;">Mijn App</span>
                    </div>
                </div>
                
                <div style="margin-bottom:10px;"><strong>Snelkoppeling maken voor:</strong></div>
                ${devices.map(device => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                        <span style="font-size:14px;">${device}</span>
                        <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                            Klik hier
                        </button>
                    </div>
                `).join('')}
                
                <button onclick="window.installatieWizard.closeWizard()" style="margin-top:15px;width:100%;background:#6c757d;color:white;border:none;padding:8px;border-radius:4px;cursor:pointer;font-size:13px;">
                    Sluiten
                </button>
            </div>
            <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;" onclick="window.installatieWizard.closeWizard()"></div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    getDevices() {
        // Toon ALLE apparaten altijd
        return [
            'iPhone/iPad',
            'Android', 
            'Windows',
            'Mac',
            'Chrome',
            'Firefox',
            'Safari'
        ];
    }
    
    createShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        }
    }
    
    closeWizard() {
        const wizard = document.querySelector('div[style*="position:fixed;top:50%"]');
        const overlay = document.querySelector('div[style*="position:fixed;top:0"]');
        if (wizard) wizard.remove();
        if (overlay) overlay.remove();
    }
}

// Maak het object beschikbaar
window.installatieWizard = new InstallatieWizard();