class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });
    } 
    
    // Deze functie wordt aangeroepen door de knop in de header
    showWizard() {
        // Verwijder eerst eventuele bestaande wizard
        this.closeWizard();
        
        const html = `
            <div class="installatie-popup" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.2);z-index:10000;width:320px;">
                <div style="margin-bottom:15px;text-align:center;">
                    <strong style="font-size:16px;display:block;margin-bottom:10px;">Zo zal de snelkoppeling er uit zien:</strong>
                    <div style="display:inline-flex;align-items:center;padding:10px 15px;background:#f8f9fa;border-radius:8px;">
                        <img src="/modern-pwa/img/icons/icon-192x192.png" alt="App Icon" style="width:32px;height:32px;margin-right:10px;border-radius:6px;">
                        <span style="font-size:14px;">Mijn App</span>
                    </div>
                </div>
                
                <div style="margin-bottom:10px;"><strong>SnelDDDkoppeling maken voor:</strong></div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">iPhone/iPad</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Android</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Windows</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Mac</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Chrome</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Firefox</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                    <span style="font-size:14px;">Safari</span>
                    <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <button onclick="window.installatieWizard.closeWizard()" style="margin-top:15px;width:100%;background:#6c757d;color:white;border:none;padding:8px;border-radius:4px;cursor:pointer;font-size:13px;">
                    Sluiten
                </button>
            </div>
            <div class="installatie-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;" onclick="window.installatieWizard.closeWizard()"></div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    createShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        }
    }
    
    closeWizard() {
        const popup = document.querySelector('.installatie-popup');
        const overlay = document.querySelector('.installatie-overlay');
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }
}

// Maak het object beschikbaar
document.addEventListener('DOMContentLoaded', () => {
    window.installatieWizard = new InstallatieWizard();
});