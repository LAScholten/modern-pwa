/**
 * Installatie Wizard voor PWA snelkoppeling maken
 * Bestand: js/installatie-wizard.js
 * EENVOUDIG: Toont alleen apparaten en "Klik hier" knoppen
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('meta[name="application-name"]')?.content || 'Mijn App';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showDeviceButtons();
        this.checkIfInstalled();
    }
    
    setupEventListeners() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });
        
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.updateButtons();
        });
    }
    
    showDeviceButtons() {
        // Verwijder bestaande buttons
        const existing = document.getElementById('pwa-device-buttons');
        if (existing) existing.remove();
        
        // Maak container
        const container = document.createElement('div');
        container.id = 'pwa-device-buttons';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 250px;
        `;
        
        // Detecteer apparaten
        const devices = this.detectDevices();
        
        // Bouw HTML
        container.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold;">
                Snelkoppeling maken voor:
            </div>
            ${devices.map(device => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                ">
                    <div>${device.name}</div>
                    <button 
                        onclick="installatieWizard.createShortcut('${device.id}')"
                        style="
                            background: #007bff;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        "
                    >
                        Klik hier
                    </button>
                </div>
            `).join('')}
        `;
        
        document.body.appendChild(container);
    }
    
    detectDevices() {
        const ua = navigator.userAgent;
        const devices = [];
        
        // iOS
        if (/iPhone|iPad|iPod/i.test(ua)) {
            devices.push({ id: 'ios', name: 'iPhone/iPad' });
        }
        
        // Android
        if (/Android/i.test(ua)) {
            devices.push({ id: 'android', name: 'Android' });
        }
        
        // Windows
        if (/Windows/i.test(ua)) {
            devices.push({ id: 'windows', name: 'Windows' });
        }
        
        // Mac
        if (/Mac/i.test(ua)) {
            devices.push({ id: 'mac', name: 'Mac' });
        }
        
        // Chrome
        if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) {
            devices.push({ id: 'chrome', name: 'Chrome' });
        }
        
        // Firefox
        if (/Firefox/i.test(ua)) {
            devices.push({ id: 'firefox', name: 'Firefox' });
        }
        
        return devices;
    }
    
    createShortcut(deviceId) {
        if (this.isInstalled) {
            alert('Snelkoppeling bestaat al!');
            return;
        }
        
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.isInstalled = true;
                    this.updateButtons();
                    alert('Snelkoppeling gemaakt!');
                }
                this.deferredPrompt = null;
            });
        } else {
            // Als geen native prompt, toon eenvoudige instructie
            alert(`Voor ${deviceId}: Gebruik het menu van je browser om een snelkoppeling te maken.`);
        }
    }
    
    updateButtons() {
        if (!this.isInstalled) return;
        
        const container = document.getElementById('pwa-device-buttons');
        if (!container) return;
        
        // Update alle knoppen
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.textContent = 'Gemaakt ✓';
            btn.style.background = '#28a745';
            btn.disabled = true;
        });
    }
    
    checkIfInstalled() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            this.updateButtons();
        }
    }
}

// Start automatisch
document.addEventListener('DOMContentLoaded', () => {
    window.installatieWizard = new InstallatieWizard();
});