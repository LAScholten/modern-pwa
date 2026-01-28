class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.createDeviceButtons();
        });
        
        // Toon ook als er al een PWA is
        setTimeout(() => this.createDeviceButtons(), 1000);
    }
    
    createDeviceButtons() {
        // Verwijder oude
        const old = document.getElementById('device-buttons');
        if (old) old.remove();
        
        const devices = this.getDevices();
        
        const div = document.createElement('div');
        div.id = 'device-buttons';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        div.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">Apparaten:</div>
            ${devices.map(device => `
                <div style="margin: 5px 0; display: flex; justify-content: space-between; align-items: center;">
                    <span>${device}</span>
                    <button 
                        onclick="window.installWizard.makeShortcut('${device}')"
                        style="
                            background: #007bff;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 3px;
                            cursor: pointer;
                            font-size: 12px;
                        "
                    >
                        Klik hier
                    </button>
                </div>
            `).join('')}
        `;
        
        document.body.appendChild(div);
        window.installWizard = this;
    }
    
    getDevices() {
        const ua = navigator.userAgent.toLowerCase();
        const devices = [];
        
        if (/iphone|ipad|ipod/.test(ua)) devices.push('iPhone/iPad');
        if (/android/.test(ua)) devices.push('Android');
        if (/windows/.test(ua)) devices.push('Windows');
        if (/mac/.test(ua)) devices.push('Mac');
        
        if (devices.length === 0) {
            devices.push('Je apparaat');
        }
        
        return devices;
    }
    
    makeShortcut(device) {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            alert(`Voor ${device}: Open browser menu en kies "Toevoegen aan beginscherm"`);
        }
    }
}

new InstallatieWizard();