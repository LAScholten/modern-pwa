/**
 * Installatie Wizard voor PWA snelkoppeling maken
 * Bestand: js/installatie-wizard.js
 * Eenvoudige versie - alleen snelkoppelingen maken voor apparaten
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('meta[name="application-name"]')?.content || 'Mijn App';
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        this.setupEventListeners();
        this.createSimpleUI();
        this.checkIfInstalled();
    }
    
    setupEventListeners() {
        // Voor browsers die beforeinstallprompt ondersteunen
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallUI();
        });
        
        // Wanneer app is geïnstalleerd
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            localStorage.setItem('pwaInstalled', 'true');
            this.updateUI();
        });
        
        // Check display mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            this.updateUI();
        }
    }
    
    createSimpleUI() {
        // Verwijder bestaande UI als die er is
        const existingUI = document.getElementById('pwa-simple-install');
        if (existingUI) existingUI.remove();
        
        // Maak simpele container
        const container = document.createElement('div');
        container.id = 'pwa-simple-install';
        container.style.cssText = `
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 20px;
            z-index: 1000;
            min-width: 300px;
            max-width: 400px;
        `;
        
        container.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 15px; color: #333;">
                <i class="bi bi-link-45deg"></i> Snelkoppeling maken
            </h4>
            
            <div style="margin-bottom: 15px; text-align: center;">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 10px;
                    background: #f0f0f0;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: #666;
                ">
                    <i class="bi bi-app"></i>
                </div>
                <div style="font-weight: 500;">${this.appName}</div>
            </div>
            
            <div style="margin: 20px 0;">
                <div style="
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                " onclick="installatieWizard.installForDevice('auto')">
                    <div>
                        <div style="font-weight: 500;">Automatisch</div>
                        <div style="font-size: 12px; color: #666;">Laat je browser kiezen</div>
                    </div>
                    <button style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 6px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Klik hier</button>
                </div>
                
                <div id="pwa-device-options" style="
                    max-height: 300px;
                    overflow-y: auto;
                    margin-top: 10px;
                ">
                    <!-- Apparaat opties worden hier ingevoegd -->
                </div>
            </div>
            
            <button onclick="document.getElementById('pwa-simple-install').style.display='none'" style="
                width: 100%;
                padding: 8px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 5px;
                cursor: pointer;
            ">
                Sluiten
            </button>
        `;
        
        document.body.appendChild(container);
        
        // Maak vlotterende knop
        this.createFloatingButton();
    }
    
    createFloatingButton() {
        const existingBtn = document.getElementById('pwa-floating-btn');
        if (existingBtn) existingBtn.remove();
        
        const btn = document.createElement('button');
        btn.id = 'pwa-floating-btn';
        btn.innerHTML = '<i class="bi bi-plus"></i> Snelkoppeling';
        btn.style.cssText = `
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(0,123,255,0.3);
            z-index: 999;
        `;
        
        btn.onclick = () => this.showInstallUI();
        document.body.appendChild(btn);
    }
    
    showInstallUI() {
        if (this.isInstalled) return;
        
        const container = document.getElementById('pwa-simple-install');
        const floatingBtn = document.getElementById('pwa-floating-btn');
        const deviceOptions = document.getElementById('pwa-device-options');
        
        if (!container || !deviceOptions) return;
        
        // Toon floating button
        if (floatingBtn) {
            floatingBtn.style.display = 'block';
        }
        
        // Detecteer apparaten
        const devices = this.detectDevices();
        
        // Update device opties
        deviceOptions.innerHTML = devices.map(device => `
            <div style="
                padding: 10px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
            " onclick="installatieWizard.installForDevice('${device.id}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                        width: 30px;
                        height: 30px;
                        background: #f0f0f0;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #666;
                    ">
                        <i class="bi ${device.icon}"></i>
                    </div>
                    <div>
                        <div style="font-size: 14px; font-weight: 500;">${device.name}</div>
                        <div style="font-size: 12px; color: #666;">${device.type}</div>
                    </div>
                </div>
                <button style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 5px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                ">Klik hier</button>
            </div>
        `).join('');
        
        // Toon container
        container.style.display = 'block';
    }
    
    detectDevices() {
        const ua = navigator.userAgent;
        const devices = [];
        
        // iOS
        if (/iPhone|iPad|iPod/.test(ua)) {
            devices.push({
                id: 'ios',
                name: 'iPhone/iPad',
                type: 'Apple iOS',
                icon: 'bi-phone'
            });
        }
        
        // Android
        if (/Android/.test(ua)) {
            devices.push({
                id: 'android',
                name: 'Android',
                type: 'Telefoon/Tablet',
                icon: 'bi-phone'
            });
        }
        
        // Windows
        if (/Windows/.test(ua)) {
            devices.push({
                id: 'windows',
                name: 'Windows',
                type: 'Computer',
                icon: 'bi-windows'
            });
        }
        
        // Mac
        if (/Mac/.test(ua)) {
            devices.push({
                id: 'mac',
                name: 'Mac',
                type: 'Apple Computer',
                icon: 'bi-apple'
            });
        }
        
        // Chrome
        if (/Chrome/.test(ua) && !/Edge/.test(ua)) {
            devices.push({
                id: 'chrome',
                name: 'Chrome',
                type: 'Browser',
                icon: 'bi-browser-chrome'
            });
        }
        
        // Firefox
        if (/Firefox/.test(ua)) {
            devices.push({
                id: 'firefox',
                name: 'Firefox',
                type: 'Browser',
                icon: 'bi-browser-firefox'
            });
        }
        
        // Safari
        if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
            devices.push({
                id: 'safari',
                name: 'Safari',
                type: 'Browser',
                icon: 'bi-browser-safari'
            });
        }
        
        return devices;
    }
    
    installForDevice(deviceId) {
        if (this.isInstalled) {
            this.showInstalledMessage();
            return;
        }
        
        console.log(`📱 Snelkoppeling maken voor: ${deviceId}`);
        
        if (deviceId === 'auto' && this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.isInstalled = true;
                    localStorage.setItem('pwaInstalled', 'true');
                    this.updateUI();
                    this.showSuccessMessage();
                }
                this.deferredPrompt = null;
            });
        } else {
            // Voor specifieke apparaten, gebruik standaard methode
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        this.isInstalled = true;
                        localStorage.setItem('pwaInstalled', 'true');
                        this.updateUI();
                        this.showSuccessMessage();
                    }
                    this.deferredPrompt = null;
                });
            }
        }
    }
    
    updateUI() {
        const container = document.getElementById('pwa-simple-install');
        const floatingBtn = document.getElementById('pwa-floating-btn');
        
        if (this.isInstalled) {
            if (container) container.style.display = 'none';
            if (floatingBtn) {
                floatingBtn.innerHTML = '<i class="bi bi-check"></i> Gemaakt';
                floatingBtn.style.background = '#28a745';
                floatingBtn.disabled = true;
            }
        }
    }
    
    checkIfInstalled() {
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
            this.updateUI();
        }
        
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            this.updateUI();
        }
        
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            this.updateUI();
        }
    }
    
    showSuccessMessage() {
        const msg = document.createElement('div');
        msg.innerHTML = '<i class="bi bi-check-circle"></i> Snelkoppeling gemaakt!';
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1001;
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 3000);
    }
    
    showInstalledMessage() {
        const msg = document.createElement('div');
        msg.innerHTML = '<i class="bi bi-info-circle"></i> Snelkoppeling bestaat al';
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffc107;
            color: #333;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1001;
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 2000);
    }
}

// Auto-initialisatie
document.addEventListener('DOMContentLoaded', () => {
    new InstallatieWizard();
});