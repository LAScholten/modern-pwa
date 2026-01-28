/**
 * Installatie Wizard voor PWA
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        // Luister naar install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showDeviceList();
        });
        
        // Toon direct
        this.showDeviceList();
    }
    
    showDeviceList() {
        // Verwijder bestaande
        const old = document.getElementById('pwa-devices');
        if (old) old.remove();
        
        // Apparaten lijst
        const devices = ['iPhone/iPad', 'Android', 'Windows', 'Mac'];
        
        // Maak HTML
        const div = document.createElement('div');
        div.id = 'pwa-devices';
        div.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            font-family: sans-serif;
        `;
        
        div.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">Snelkoppeling</div>
            ${devices.map(device => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0;">
                    <span>${device}</span>
                    <button 
                        style="background: blue; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;"
                        onclick="document.installWizard.install()"
                    >
                        Klik hier
                    </button>
                </div>
            `).join('')}
        `;
        
        document.body.appendChild(div);
        document.installWizard = this;
    }
    
    install() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        }
    }
}

// Start
new InstallatieWizard();