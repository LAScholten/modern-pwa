class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.iconsPath = '/modern-pwa/img/icons/';
        this.currentLanguage = this.detectLanguage();
        this.translations = this.getTranslations();
        this.supportedBrowsers = ['chrome', 'edge', 'opera', 'android', 'samsung'];
        this.wizardId = 'installatie-wizard-' + Date.now(); // Unieke ID
        this.init();
    }
    
    detectLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('nl')) return 'nl';
        if (lang.startsWith('de')) return 'de';
        return 'en';
    }
    
    getTranslations() {
        return {
            nl: {
                title: "Zo zal de snelkoppeling er uit zien:",
                pwaTitle: "Snelkoppeling in 2 stappen geregeld",
                unsupportedTitle: "Uitleg voor het maken van de snelkoppeling voor:",
                ios: "iPhone/iPad",
                android: "Android",
                windows: "Windows",
                mac: "Mac",
                chrome: "Chrome",
                firefox: "Firefox",
                safari: "Safari",
                clickHere: "Klik hier",
                close: "Sluiten",
                allDevices: "Voor alle apparaten",
                iosAlert: "Voor iPhone/iPad:\n\n1. Tik op het deel-icoon (📤) onderin Safari\n2. Scroll naar 'Toevoegen aan beginscherm'\n3. Tik op 'Toevoegen'",
                androidAlert: "Voor Android:\n\n1. Tik op menu (⋮) in Chrome\n2. Kies 'Toevoegen aan beginscherm'\n3. Tik op 'Toevoegen'",
                windowsAlert: "Voor Windows:\n\n1. Klik op menu (⋮) in Chrome/Edge\n2. Kies 'App installeren'\n3. Klik op 'Installeren'",
                macAlert: "Voor Mac:\n\nIn Safari:\n1. Kies 'Bestand' > 'Toevoegen aan Dock'\n\nIn Chrome:\n1. Klik op menu (⋮) > 'App installeren'",
                chromeAlert: "Voor Chrome:\n\n1. Klik op menu (⋮) rechtsboven\n2. Kies 'App installeren'\n3. Klik op 'Installeren'",
                firefoxAlert: "Voor Firefox:\n\n1. Klik op menu (☰) rechtsboven\n2. Kies 'Toevoegen aan beginscherm'\n3. Bevestig de installatie",
                safariAlert: "Voor Safari:\n\n1. Kies 'Bestand' in de menubalk\n2. Selecteer 'Toevoegen aan Dock'\n3. De app verschijnt nu in je Dock",
                allAlert: "Platform-specifieke instructies:\n\n• iPhone/iPad: Deel-icoon (📤) > Toevoegen aan beginscherm\n• Android: Menu (⋮) > Toevoegen aan beginscherm\n• Desktop: Browser menu > Installeren/Toevoegen"
            },
            de: {
                title: "So wird die Verknüpfung aussehen:",
                pwaTitle: "Verknüpfung in 2 Schritten erledigt",
                unsupportedTitle: "Anleitung zum Erstellen der Verknüpfung für:",
                ios: "iPhone/iPad",
                android: "Android",
                windows: "Windows",
                mac: "Mac",
                chrome: "Chrome",
                firefox: "Firefox",
                safari: "Safari",
                clickHere: "Hier klicken",
                close: "Schließen",
                allDevices: "Für alle Geräte",
                iosAlert: "Für iPhone/iPad:\n\n1. Tippe auf das Teilen-Symbol (📤) unten in Safari\n2. Scrolle zu 'Zum Home-Bildschirm hinzufügen'\n3. Tippe auf 'Hinzufügen'",
                androidAlert: "Für Android:\n\n1. Tippe auf Menü (⋮) in Chrome\n2. Wähle 'Zum Startbildschirm hinzufügen'\n3. Tippe auf 'Hinzufügen'",
                windowsAlert: "Für Windows:\n\n1. Klicke auf Menü (⋮) in Chrome/Edge\n2. Wähle 'App installieren'\n3. Klicke auf 'Installieren'",
                macAlert: "Für Mac:\n\nIn Safari:\n1. Wähle 'Datei' > 'Zum Dock hinzufügen'\n\nIn Chrome:\n1. Klicke auf Menü (⋮) > 'App installieren'",
                chromeAlert: "Für Chrome:\n\n1. Klicke auf Menü (⋮) oben rechts\n2. Wähle 'App installieren'\n3. Klicke auf 'Installeren'",
                firefoxAlert: "Für Firefox:\n\n1. Klicke auf Menü (☰) oben rechts\n2. Wähle 'Zum Startbildschirm hinzufügen'\n3. Bestätige die Installation",
                safariAlert: "Für Safari:\n\n1. Wähle 'Datei' in der Menüleiste\n2. Wähle 'Zum Dock hinzufügen'\n3. Die App erscheint jetzt in deinem Dock",
                allAlert: "Plattformspezifische Anleitungen:\n\n• iPhone/iPad: Teilen-Symbol (📤) > Zum Home-Bildschirm hinzufügen\n• Android: Menü (⋮) > Zum Startbildschirm hinzufügen\n• Desktop: Browser-Menü > Installieren/Hinzufügen"
            },
            en: {
                title: "This is how the shortcut will look:",
                pwaTitle: "Shortcut in 2 steps arranged",
                unsupportedTitle: "Instructions for creating the shortcut for:",
                ios: "iPhone/iPad",
                android: "Android",
                windows: "Windows",
                mac: "Mac",
                chrome: "Chrome",
                firefox: "Firefox",
                safari: "Safari",
                clickHere: "Click here",
                close: "Close",
                allDevices: "For all devices",
                iosAlert: "For iPhone/iPad:\n\n1. Tap the share icon (📤) at the bottom in Safari\n2. Scroll to 'Add to Home Screen'\n3. Tap 'Add'",
                androidAlert: "For Android:\n\n1. Tap menu (⋮) in Chrome\n2. Choose 'Add to Home Screen'\n3. Tap 'Add'",
                windowsAlert: "For Windows:\n\n1. Click menu (⋮) in Chrome/Edge\n2. Choose 'Install app'\n3. Click 'Install'",
                macAlert: "For Mac:\n\nIn Safari:\n1. Choose 'File' > 'Add to Dock'\n\nIn Chrome:\n1. Click menu (⋮) > 'Install app'",
                chromeAlert: "For Chrome:\n\n1. Click menu (⋮) top right\n2. Choose 'Install app'\n3. Click 'Install'",
                firefoxAlert: "For Firefox:\n\n1. Click menu (☰) top right\n2. Choose 'Add to Home Screen'\n3. Confirm installation",
                safariAlert: "For Safari:\n\n1. Choose 'File' in the menu bar\n2. Select 'Add to Dock'\n3. The app will now appear in your Dock",
                allAlert: "Platform-specific instructions:\n\n• iPhone/iPad: Share icon (📤) > Add to Home Screen\n• Android: Menu (⋮) > Add to Home Screen\n• Desktop: Browser menu > Install/Add"
            }
        };
    }
    
    detectBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('chrome') && !ua.includes('edge') && !ua.includes('opera')) return 'chrome';
        if (ua.includes('edg')) return 'edge';
        if (ua.includes('opera') || ua.includes('opr')) return 'opera';
        if (ua.includes('firefox')) return 'firefox';
        if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
        if (ua.includes('samsung')) return 'samsung';
        if (/android/.test(ua)) return 'android';
        return 'unknown';
    }
    
    isPwaSupported() {
        const browser = this.detectBrowser();
        return this.supportedBrowsers.includes(browser);
    }
    
    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });
        
        window.addEventListener('appinstalled', () => {
            this.markButtonsAsInstalled();
        });
        
        this.bindToExistingButtons();
        window.installatieWizard = this;
    }
    
    bindToExistingButtons() {
        // DIRECT binden, niet wachten op DOMContentLoaded als al geladen
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.setupButtonListeners();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.setupButtonListeners());
        }
    }
    
    setupButtonListeners() {
        // Verwijder eerst eventuele oude listeners
        const buttons = [
            document.getElementById('pwaInstallBtn'),
            document.getElementById('pwaInstallBtnMobile')
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                // Clone en replace om oude listeners te verwijderen
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWizard();
                });
                
                // Forceer reflow
                void newBtn.offsetWidth;
            }
        });
    }
    
    markButtonsAsInstalled() {
        const buttons = [
            document.getElementById('pwaInstallBtn'),
            document.getElementById('pwaInstallBtnMobile')
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> ' + 
                    (this.currentLanguage === 'nl' ? 'Geïnstalleerd' : 
                     this.currentLanguage === 'de' ? 'Installiert' : 'Installed');
                btn.classList.remove('btn-warning', 'btn-primary');
                btn.classList.add('btn-success');
                btn.disabled = true;
                btn.onclick = null;
            }
        });
    }
    
    showWizard() {
        // VERWIJDER ALLE bestaande wizards eerst
        this.closeWizard();
        
        const t = this.translations[this.currentLanguage];
        const isSupported = this.isPwaSupported();
        const appName = document.title || 'Mijn App';
        
        // Voeg timestamp aan icon URL voor cache busting
        const iconUrl = `${this.iconsPath}icon-192x192.png?t=${Date.now()}`;
        
        const html = `
            <div id="${this.wizardId}" class="installatie-wizard" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.2);z-index:10000;width:340px;max-width:90vw;">
                <div style="text-align:center;margin-bottom:20px;">
                    <strong style="font-size:16px;display:block;margin-bottom:10px;">${t.title}</strong>
                    <div style="display:inline-flex;align-items:center;padding:10px 20px;background:#f8f9fa;border-radius:10px;">
                        <img src="${iconUrl}" alt="App Icon" style="width:40px;height:40px;margin-right:12px;border-radius:8px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNDA3M0I4Ii8+PHRleHQgeD0iMjAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QXBwPC90ZXh0Pjwvc3ZnPg==';">
                        <span style="font-size:14px;font-weight:500;">${appName}</span>
                    </div>
                </div>
                
                <div style="margin-bottom:15px;">
                    <strong>${isSupported ? t.pwaTitle : t.unsupportedTitle}</strong>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.ios}</span>
                    <button onclick="window.installatieWizard.createShortcut('ios')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.android}</span>
                    <button onclick="window.installatieWizard.createShortcut('android')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.windows}</span>
                    <button onclick="window.installatieWizard.createShortcut('windows')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.mac}</span>
                    <button onclick="window.installatieWizard.createShortcut('mac')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.chrome}</span>
                    <button onclick="window.installatieWizard.createShortcut('chrome')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;">
                    <span style="font-size:14px;">${t.firefox}</span>
                    <button onclick="window.installatieWizard.createShortcut('firefox')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
                    <span style="font-size:14px;">${t.safari}</span>
                    <button onclick="window.installatieWizard.createShortcut('safari')" style="background:#007bff;color:white;border:none;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:13px;">
                        ${t.clickHere}
                    </button>
                </div>
                
                <div style="display:flex;justify-content:space-between;margin-top:20px;">
                    <button onclick="window.installatieWizard.closeWizard()" style="background:#6c757d;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;font-size:13px;width:48%;">
                        ${t.close}
                    </button>
                    <button onclick="window.installatieWizard.createAllShortcuts()" style="background:#28a745;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;font-size:13px;width:48%;">
                        ${t.allDevices}
                    </button>
                </div>
            </div>
            <div id="${this.wizardId}-overlay" class="wizard-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;" onclick="window.installatieWizard.closeWizard()"></div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div.firstElementChild);
        document.body.appendChild(div.lastElementChild);
    }
    
    createShortcut(platform) {
        const t = this.translations[this.currentLanguage];
        
        if (this.deferredPrompt && this.isPwaSupported()) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    localStorage.setItem('pwaInstalled', 'true');
                    this.markButtonsAsInstalled();
                }
                this.deferredPrompt = null;
            });
        } else {
            const alerts = {
                'ios': t.iosAlert,
                'android': t.androidAlert,
                'windows': t.windowsAlert,
                'mac': t.macAlert,
                'chrome': t.chromeAlert,
                'firefox': t.firefoxAlert,
                'safari': t.safariAlert
            };
            alert(alerts[platform] || t.allAlert);
        }
        this.closeWizard();
    }
    
    createAllShortcuts() {
        const t = this.translations[this.currentLanguage];
        
        if (this.deferredPrompt && this.isPwaSupported()) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    localStorage.setItem('pwaInstalled', 'true');
                    this.markButtonsAsInstalled();
                }
                this.deferredPrompt = null;
            });
        } else {
            alert(t.allAlert);
        }
        this.closeWizard();
    }
    
    closeWizard() {
        // Verwijder ALLE wizards en overlays
        const wizards = document.querySelectorAll('.installatie-wizard, [id^="installatie-wizard-"], .wizard-overlay');
        wizards.forEach(element => {
            element.remove();
        });
    }
}

// Forceer nieuwe instantie bij elke load
if (window.installatieWizard) {
    window.installatieWizard.closeWizard();
    delete window.installatieWizard;
}

// Start met vertraging om zeker te zijn dat DOM klaar is
setTimeout(() => {
    window.installatieWizard = new InstallatieWizard();
}, 100);