// ⭐ installatie.js - DE ENIGE VERSIE
// LAATSTE - 29 januari 2024

console.log('🔧 Installatie script laden...');

// 1. VERWIJDER ALLES WAT AL BESTAAT
(function() {
    'use strict';
    
    // Verwijder alle wizards en overlays
    const elements = document.querySelectorAll(
        '[style*="fixed"][style*="z-index: 9"], ' +
        '[style*="fixed"][style*="transform: translate(-50%, -50%)"], ' +
        '.wizard-overlay, .installatie-wizard'
    );
    
    elements.forEach(el => {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Verwijder oude globale functies
    delete window.installatieWizard;
    delete window.showWizard;
    delete window.openWizard;
    
    console.log('🧹 Oude elementen verwijderd');
})();

// 2. NIEUWE WIZARD KLASSE
class SimpleInstaller {
    constructor() {
        this.prompt = null;
        this.setup();
    }
    
    setup() {
        // PWA event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.prompt = e;
            console.log('📱 PWA prompt ready');
        });
        
        // Bind knoppen
        this.bindButtons();
        
        // Maak globaal
        window.simpleInstaller = this;
    }
    
    bindButtons() {
        // Bind pwaInstallBtn
        const btn = document.getElementById('pwaInstallBtn');
        const btnMobile = document.getElementById('pwaInstallBtnMobile');
        
        [btn, btnMobile].forEach(button => {
            if (button) {
                // Verwijder alle oude events
                const newBtn = button.cloneNode(true);
                button.parentNode.replaceChild(newBtn, button);
                
                // Nieuwe simpele event
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openDialog();
                });
            }
        });
    }
    
    openDialog() {
        // Verwijder eerst eventuele oude dialoog
        this.closeDialog();
        
        // Maak overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
        `;
        overlay.onclick = () => this.closeDialog();
        
        // Maak dialoog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            z-index: 9999;
            width: 400px;
            max-width: 90%;
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin-top: 0; color: #333;">📱 App Installeren</h2>
            
            <div style="margin: 25px 0;">
                <img src="/modern-pwa/img/icons/icon-192x192.png?${Date.now()}" 
                     alt="App" 
                     style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 15px;">
                <div style="font-size: 18px; font-weight: bold;">${document.title || 'Mijn App'}</div>
                <div style="color: #666; margin-top: 5px;">Maak een snelkoppeling</div>
            </div>
            
            <button id="installBtn" 
                    style="
                        background: linear-gradient(135deg, #007bff, #0056b3);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: bold;
                        width: 100%;
                        margin-bottom: 15px;
                        cursor: pointer;
                    ">
                ⚡ Direct Installeren
            </button>
            
            <div style="color: #666; font-size: 14px; margin: 20px 0;">
                Of kies platform:
            </div>
            
            <div style="display: grid; gap: 10px; margin-bottom: 20px;">
                <button onclick="simpleInstaller.showHelp('android')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
                    📱 Android
                </button>
                <button onclick="simpleInstaller.showHelp('ios')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
                    🍎 iPhone/iPad
                </button>
                <button onclick="simpleInstaller.showHelp('desktop')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
                    💻 Computer
                </button>
            </div>
            
            <button onclick="simpleInstaller.closeDialog()" 
                    style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        width: 100%;
                        cursor: pointer;
                    ">
                Sluiten
            </button>
        `;
        
        // Voeg toe aan pagina
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Bind install knop
        setTimeout(() => {
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.onclick = () => this.install();
            }
        }, 100);
        
        console.log('✅ Dialoog geopend');
    }
    
    install() {
        if (this.prompt) {
            this.prompt.prompt();
            this.prompt.userChoice.then(result => {
                if (result.outcome === 'accepted') {
                    localStorage.setItem('appInstalled', 'true');
                    this.markAsInstalled();
                }
                this.prompt = null;
            });
        } else {
            alert('🔧 Instructies:\n\n1. Open browser menu (⋮)\n2. Zoek "Installeren" of "Toevoegen aan beginscherm"\n3. Klik en bevestig');
        }
        
        this.closeDialog();
    }
    
    showHelp(type) {
        const messages = {
            android: '📱 Android:\n\n1. Open menu (⋮)\n2. Kies "Toevoegen aan beginscherm"\n3. Klik "Toevoegen"',
            ios: '🍎 iPhone/iPad:\n\n1. Open in Safari\n2. Tik deel-icoon (📤)\n3. Tik "Toevoegen aan beginscherm"\n4. Tik "Toevoegen"',
            desktop: '💻 Computer:\n\n1. Klik menu (⋮)\n2. Klik "Installeren"\n3. Klik "Installeren"'
        };
        
        alert(messages[type] || 'Kijk in je browser menu');
        this.closeDialog();
    }
    
    markAsInstalled() {
        const buttons = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = '✅ Geïnstalleerd';
                btn.className = 'btn btn-success';
                btn.disabled = true;
            }
        });
    }
    
    closeDialog() {
        // Verwijder ALLE dialoog elementen
        document.querySelectorAll('[style*="z-index: 9998"], [style*="z-index: 9999"]').forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        console.log('🔒 Dialoog gesloten');
    }
}

// 3. START DE INSTALLER
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM ready - Installer starten');
        window.simpleInstaller = new SimpleInstaller();
    });
} else {
    console.log('⚡ DOM al klaar - Installer direct starten');
    window.simpleInstaller = new SimpleInstaller();
}