class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.iconsPath = '/modern-pwa/img/icons/';
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });
        
        // Toon direct de wizard
        setTimeout(() => {
            this.showWizard();
        }, 500);
    }
    
    showWizard() {
        const html = `
            <div class="installatie-wizard" style="position:fixed;top:20px;right:20px;background:white;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:10000;width:300px;">
                <div style="margin-bottom:15px;text-align:center;">
                    <strong style="font-size:14px;display:block;margin-bottom:8px;">Zo zal de snelkoppeling er uit zien:</strong>
                    <div style="display:inline-flex;align-items:center;padding:8px 15px;background:#f5f5f5;border-radius:8px;">
                        <img src="${this.iconsPath}icon-192x192.png" alt="App Icon" style="width:32px;height:32px;margin-right:10px;border-radius:6px;">
                        <span style="font-size:13px;">Mijn App</span>
                    </div>
                </div>
                
                <div style="margin-bottom:10px;"><strong>Snelkoppeling maken voor:</strong></div>
                
                <!-- ALLE apparaten staan hier onder elkaar -->
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">iPhone/iPad</span>
                    <button onclick="window.installatieWizard.createIOSShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Android</span>
                    <button onclick="window.installatieWizard.createAndroidShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Windows</span>
                    <button onclick="window.installatieWizard.createWindowsShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Mac</span>
                    <button onclick="window.installatieWizard.createMacShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Chrome</span>
                    <button onclick="window.installatieWizard.createChromeShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Firefox</span>
                    <button onclick="window.installatieWizard.createFirefoxShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:13px;">Safari</span>
                    <button onclick="window.installatieWizard.createSafariShortcut()" style="background:#007bff;color:white;border:none;padding:4px 10px;border-radius:3px;cursor:pointer;font-size:12px;">
                        Klik hier
                    </button>
                </div>
                
                <button onclick="window.installatieWizard.closeWizard()" style="margin-top:15px;width:100%;background:#6c757d;color:white;border:none;padding:6px;border-radius:4px;cursor:pointer;font-size:12px;">
                    Sluiten
                </button>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    createIOSShortcut() {
        // Trigger PWA install of toon instructies
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor iPhone/iPad: Tik op deel-icoon (📤) en kies "Toevoegen aan beginscherm"');
        }
    }
    
    createAndroidShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Android: Tik op menu (⋮) en kies "Toevoegen aan beginscherm"');
        }
    }
    
    createWindowsShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Windows: Klik op menu (⋮) en kies "Installeren"');
        }
    }
    
    createMacShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Mac: Kies in Safari "Bestand" > "Toevoegen aan Dock"');
        }
    }
    
    createChromeShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Chrome: Klik op menu (⋮) en kies "Installeren"');
        }
    }
    
    createFirefoxShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Firefox: Klik op menu (☰) en kies "Toevoegen aan beginscherm"');
        }
    }
    
    createSafariShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Voor Safari: Kies "Bestand" > "Toevoegen aan Dock"');
        }
    }
    
    closeWizard() {
        const wizard = document.querySelector('.installatie-wizard');
        if (wizard) wizard.remove();
    }
}

// Start de wizard
document.addEventListener('DOMContentLoaded', () => {
    window.installatieWizard = new InstallatieWizard();
});