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
        
        // Voeg een knop toe aan de pagina om de wizard te tonen
        this.addOpenButton();
    }
    
    addOpenButton() {
        const buttonHTML = `
            <button id="openWizardBtn" style="position:fixed;bottom:20px;right:20px;background:#007bff;color:white;border:none;padding:10px 15px;border-radius:5px;cursor:pointer;z-index:9999;box-shadow:0 2px 5px rgba(0,0,0,0.2);">
                📲 Snelkoppeling maken
            </button>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = buttonHTML;
        document.body.appendChild(div);
        
        document.getElementById('openWizardBtn').addEventListener('click', () => {
            this.showWizard();
        });
    }
    
    showWizard() {
        // Verwijder bestaande wizard als die er is
        this.closeWizard();
        
        const html = `
            <div class="installatie-wizard" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.2);z-index:10000;width:320px;">
                <div style="text-align:center;margin-bottom:20px;">
                    <strong style="font-size:16px;display:block;margin-bottom:10px;">Zo zal de snelkoppeling er uit zien:</strong>
                    <div style="display:inline-flex;align-items:center;padding:10px 20px;background:#f8f9fa;border-radius:10px;">
                        <img src="${this.iconsPath}icon-192x192.png" alt="App Icon" style="width:40px;height:40px;margin-right:12px;border-radius:8px;">
                        <span style="font-size:14px;font-weight:500;">Mijn App</span>
                    </div>
                </div>
                
                <div style="margin-bottom:15px;"><strong>Snelkoppeling maken voor:</strong></div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">iPhone/iPad</span>
                    <button onclick="window.installatieWizard.createIOSShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Android</span>
                    <button onclick="window.installatieWizard.createAndroidShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Windows</span>
                    <button onclick="window.installatieWizard.createWindowsShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Mac</span>
                    <button onclick="window.installatieWizard.createMacShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Chrome</span>
                    <button onclick="window.installatieWizard.createChromeShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">Firefox</span>
                    <button onclick="window.installatieWizard.createFirefoxShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                    <span style="font-size:14px;">Safari</span>
                    <button onclick="window.installatieWizard.createSafariShortcut()" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        Klik hier
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;margin-top:20px;">
                    <button onclick="window.installatieWizard.closeWizard()" style="background:#6c757d;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;font-size:13px;width:48%;">
                        Sluiten
                    </button>
                    <button onclick="window.installatieWizard.createAllShortcuts()" style="background:#28a745;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;font-size:13px;width:48%;">
                        Voor alle apparaten
                    </button>
                </div>
            </div>
            <div class="wizard-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;" onclick="window.installatieWizard.closeWizard()"></div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    createIOSShortcut() {
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
    
    createAllShortcuts() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert('Probeer de installatieoptie in je browser menu te vinden. Meestal onder: ⋮ → "Installeren" of "Toevoegen aan beginscherm"');
        }
    }
    
    closeWizard() {
        const wizard = document.querySelector('.installatie-wizard');
        const overlay = document.querySelector('.wizard-overlay');
        if (wizard) wizard.remove();
        if (overlay) overlay.remove();
    }
}

// Start alleen de wizard als er op de knop wordt geklikt
document.addEventListener('DOMContentLoaded', () => {
    window.installatieWizard = new InstallatieWizard();
});