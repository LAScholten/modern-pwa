class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showButtons();
        });
    }
    
    showButtons() {
        const devices = this.getDevices();
        
        const html = `
            <div style="position:fixed;top:20px;right:20px;background:white;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:1000;">
                <div style="margin-bottom:10px;"><strong>Snelkoppeling maken voor:</strong></div>
                ${devices.map(device => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;">
                        <span>${device}</span>
                        <button onclick="window.installatieWizard.createShortcut()" style="background:#007bff;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;font-size:12px;">
                            Klik hier
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    getDevices() {
        const ua = navigator.userAgent;
        const devices = [];
        
        if (/iPhone|iPad|iPod/i.test(ua)) devices.push('iPhone/iPad');
        if (/Android/i.test(ua)) devices.push('Android');
        if (/Windows/i.test(ua)) devices.push('Windows');
        if (/Mac/i.test(ua)) devices.push('Mac');
        if (/Chrome/i.test(ua)) devices.push('Chrome');
        if (/Firefox/i.test(ua)) devices.push('Firefox');
        if (/Safari/i.test(ua)) devices.push('Safari');
        
        return devices;
    }
    
    createShortcut() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.installatieWizard = new InstallatieWizard();
});