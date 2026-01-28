// ⭐ installatie-wizard.js - DE ENIGE VERSIE
// Laatste update: 2024-01-29

(function() {
    'use strict';
    
    console.log('🔧 Installatie Wizard laden...');
    
    // 1. VERWIJDER ALLE OUDE VERSIES
    const cleanup = () => {
        // Verwijder wizards uit DOM
        const elements = document.querySelectorAll(
            '.installatie-wizard, .wizard-overlay, [id*="wizard"], [style*="fixed"][style*="z-index: 999"]'
        );
        elements.forEach(el => el.remove());
        
        // Verwijder oude instance
        if (window.installatieWizard) {
            try { window.installatieWizard.close(); } catch(e) {}
            delete window.installatieWizard;
        }
        
        console.log('🧹 Oude versies verwijderd');
    };
    
    // Direct cleanup
    cleanup();
    
    // 2. HOOFD KLASSE
    class InstallWizard {
        constructor() {
            this.prompt = null;
            this.init();
        }
        
        init() {
            // PWA event
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.prompt = e;
                console.log('📱 PWA installatie beschikbaar');
            });
            
            // App geïnstalleerd
            window.addEventListener('appinstalled', () => {
                console.log('✅ App geïnstalleerd');
                this.markInstalled();
            });
            
            // Koppel knoppen
            this.bindButtons();
            
            // Maak globaal
            window.installatieWizard = this;
            
            console.log('🎯 Wizard klaar voor gebruik');
        }
        
        bindButtons() {
            const buttonIds = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
            
            buttonIds.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    // Clone om oude events te verwijderen
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    
                    // Nieuwe event
                    newBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.show();
                    });
                }
            });
        }
        
        show() {
            // Eerst schoonmaken
            this.close();
            
            // Maak wizard
            const wizard = document.createElement('div');
            wizard.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 10000;
                    width: 350px;
                    max-width: 90vw;
                ">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 18px; font-weight: bold; color: #333;">
                            📲 Snelkoppeling maken
                        </div>
                        <div style="
                            display: inline-flex;
                            align-items: center;
                            padding: 15px;
                            background: #f8f9fa;
                            border-radius: 12px;
                            margin-top: 15px;
                        ">
                            <img src="/modern-pwa/img/icons/icon-192x192.png?${Date.now()}" 
                                 alt="App" 
                                 style="width: 50px; height: 50px; border-radius: 10px; margin-right: 15px;">
                            <div style="text-align: left;">
                                <div style="font-weight: bold;">${document.title || 'Mijn App'}</div>
                                <div style="font-size: 12px; color: #666;">Website snelkoppeling</div>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="window.installatieWizard.install()" 
                            style="
                                width: 100%;
                                background: #007bff;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                margin-bottom: 15px;
                                font-weight: bold;
                                cursor: pointer;
                            ">
                        ⚡ Direct installeren
                    </button>
                    
                    <div style="font-size: 14px; color: #666; margin-bottom: 15px;">
                        Of kies je apparaat:
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>Android telefoon</span>
                            <button onclick="window.installatieWizard.help('android')" 
                                    style="background: #28a745; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;">
                                Uitleg
                            </button>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>iPhone/iPad</span>
                            <button onclick="window.installatieWizard.help('ios')" 
                                    style="background: #28a745; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;">
                                Uitleg
                            </button>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                            <span>Windows/Mac</span>
                            <button onclick="window.installatieWizard.help('desktop')" 
                                    style="background: #28a745; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;">
                                Uitleg
                            </button>
                        </div>
                    </div>
                    
                    <button onclick="window.installatieWizard.close()" 
                            style="
                                width: 100%;
                                background: #6c757d;
                                color: white;
                                border: none;
                                padding: 10px;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                        Sluiten
                    </button>
                </div>
                
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                " onclick="window.installatieWizard.close()"></div>
            `;
            
            document.body.appendChild(wizard);
        }
        
        install() {
            if (this.prompt) {
                this.prompt.prompt();
                this.prompt.userChoice.then((result) => {
                    if (result.outcome === 'accepted') {
                        localStorage.setItem('pwaInstalled', 'true');
                        this.markInstalled();
                    }
                    this.prompt = null;
                });
            } else {
                alert('🔧 Instructie:\n\nZoek in je browser menu naar:\n• "Installeren"\n• "Toevoegen aan beginscherm"\n• "Add to Home Screen"');
            }
            this.close();
        }
        
        help(type) {
            const messages = {
                android: '📱 Android:\n1. Tik op menu (⋮)\n2. Kies "Toevoegen aan beginscherm"\n3. Tik "Toevoegen"',
                ios: '🍎 iPhone/iPad:\n1. Open in Safari\n2. Tik op deel-icoon (📤)\n3. Tik "Toevoegen aan beginscherm"\n4. Tik "Toevoegen"',
                desktop: '💻 Windows/Mac:\n1. Klik op menu (⋮)\n2. Klik "Installeren"\n3. Klik "Installeren"'
            };
            
            alert(messages[type] || 'Kijk in je browser menu');
            this.close();
        }
        
        markInstalled() {
            ['pwaInstallBtn', 'pwaInstallBtnMobile'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.innerHTML = '✅ Geïnstalleerd';
                    btn.className = 'btn btn-success';
                    btn.disabled = true;
                }
            });
        }
        
        close() {
            // Verwijder wizard
            document.querySelectorAll('[style*="fixed"][style*="z-index: 10000"], [style*="fixed"][style*="z-index: 9999"]').forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        }
    }
    
    // 3. START
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new InstallWizard());
    } else {
        new InstallWizard();
    }
})();