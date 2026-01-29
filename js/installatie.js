// modern-pwa/js/instalatie.js

// PWA Installer
const SimpleInstaller = {
    translations: {
        nl: {
            title: "Snelkoppeling Maken",
            howToInstall: "Hoe maak je een snelkoppeling op je apparaat:",
            ios: "iPhone/iPad",
            android: "Android",
            windows: "Windows (Chrome/Edge)",
            mac: "Mac (Safari/Chrome)",
            iosSteps: [
                "Open Safari en ga naar deze pagina",
                "Tik op het <strong>deel icoon</strong> onderaan (vierkant met pijl omhoog)",
                "Scroll naar beneden en selecteer <strong>'Zet op beginscherm'</strong>",
                "Geef de snelkoppeling een naam (bijv. 'Eurasier Friends')",
                "Tik op <strong>'Toevoegen'</strong> in de rechterbovenhoek",
                "De app verschijnt nu op je beginscherm!"
            ],
            androidSteps: [
                "Open Chrome of Firefox en ga naar deze pagina",
                "Tik op het <strong>menu icoon</strong> (drie puntjes) rechtsboven",
                "Selecteer <strong>'Toevoegen aan beginscherm'</strong> of 'Installeer app'",
                "Geef de snelkoppeling een naam",
                "Tik op <strong>'Toevoegen'</strong> of 'Installeren'",
                "De app verschijnt nu op je beginscherm!"
            ],
            windowsSteps: [
                "Open Chrome of Microsoft Edge",
                "Ga naar deze pagina",
                "Klik op het <strong>installatie icoon</strong> rechts in de adresbalk (vierkant met pijl)",
                "Klik op <strong>'Installeren'</strong>",
                "De app wordt geïnstalleerd en verschijnt in je startmenu",
                "Je kunt ook een snelkoppeling op je bureaublad maken"
            ],
            macSafariSteps: [
                "Ga naar deze pagina in Safari",
                "Klik op 'Bestand' in de menubalk",
                "Selecteer <strong>'Toevoegen aan Dock'</strong>"
            ],
            macChromeSteps: [
                "Ga naar deze pagina in Chrome",
                "Klik op het installatie icoon rechts in de adresbalk",
                "Klik op <strong>'Installeren'</strong>"
            ],
            benefitTitle: "Voordeel van een snelkoppeling:",
            benefitText: "De app werkt als een normale app!",
            close: "Sluiten"
        },
        en: {
            title: "Create Shortcut",
            howToInstall: "How to create a shortcut on your device:",
            ios: "iPhone/iPad",
            android: "Android",
            windows: "Windows (Chrome/Edge)",
            mac: "Mac (Safari/Chrome)",
            iosSteps: [
                "Open Safari and go to this page",
                "Tap the <strong>share icon</strong> at the bottom (square with arrow up)",
                "Scroll down and select <strong>'Add to Home Screen'</strong>",
                "Give the shortcut a name (e.g. 'Eurasier Friends')",
                "Tap <strong>'Add'</strong> in the top right corner",
                "The app will now appear on your home screen!"
            ],
            androidSteps: [
                "Open Chrome or Firefox and go to this page",
                "Tap the <strong>menu icon</strong> (three dots) in the top right",
                "Select <strong>'Add to Home Screen'</strong> or 'Install App'",
                "Give the shortcut a name",
                "Tap <strong>'Add'</strong> or 'Install'",
                "The app will now appear on your home screen!"
            ],
            windowsSteps: [
                "Open Chrome or Microsoft Edge",
                "Go to this page",
                "Click the <strong>install icon</strong> in the address bar (square with arrow)",
                "Click <strong>'Install'</strong>",
                "The app will be installed and appear in your start menu",
                "You can also create a desktop shortcut"
            ],
            macSafariSteps: [
                "Go to this page in Safari",
                "Click 'File' in the menu bar",
                "Select <strong>'Add to Dock'</strong>"
            ],
            macChromeSteps: [
                "Go to this page in Chrome",
                "Click the install icon in the address bar",
                "Click <strong>'Install'</strong>"
            ],
            benefitTitle: "Benefit of a shortcut:",
            benefitText: "The app works like a normal app!",
            close: "Close"
        },
        de: {
            title: "Verknüpfung erstellen",
            howToInstall: "So erstellen Sie eine Verknüpfung auf Ihrem Gerät:",
            ios: "iPhone/iPad",
            android: "Android",
            windows: "Windows (Chrome/Edge)",
            mac: "Mac (Safari/Chrome)",
            iosSteps: [
                "Öffnen Sie Safari und gehen Sie zu dieser Seite",
                "Tippen Sie auf das <strong>Teilen-Symbol</strong> unten (Quadrat mit Pfeil nach oben)",
                "Scrollen Sie nach unten und wählen Sie <strong>'Zum Home-Bildschirm'</strong>",
                "Geben Sie der Verknüpfung einen Namen (z.B. 'Eurasier Friends')",
                "Tippen Sie auf <strong>'Hinzufügen'</strong> in der oberen rechten Ecke",
                "Die App erscheint jetzt auf Ihrem Home-Bildschirm!"
            ],
            androidSteps: [
                "Öffnen Sie Chrome oder Firefox und gehen Sie zu dieser Seite",
                "Tippen Sie auf das <strong>Menüsymbol</strong> (drei Punkte) oben rechts",
                "Wählen Sie <strong>'Zum Startbildschirm hinzufügen'</strong> oder 'App installieren'",
                "Geben Sie der Verknüpfung einen Namen",
                "Tippen Sie auf <strong>'Hinzufügen'</strong> oder 'Installieren'",
                "Die App erscheint jetzt auf Ihrem Startbildschirm!"
            ],
            windowsSteps: [
                "Öffnen Sie Chrome oder Microsoft Edge",
                "Gehen Sie zu dieser Seite",
                "Klicken Sie auf das <strong>Installationssymbol</strong> in der Adressleiste (Quadrat mit Pfeil)",
                "Klicken Sie auf <strong>'Installieren'</strong>",
                "Die App wird installiert und erscheint im Startmenü",
                "Sie können auch eine Desktop-Verknüpfung erstellen"
            ],
            macSafariSteps: [
                "Gehen Sie in Safari zu dieser Seite",
                "Klicken Sie in der Menüleiste auf 'Datei'",
                "Wählen Sie <strong>'Zum Dock hinzufügen'</strong>"
            ],
            macChromeSteps: [
                "Gehen Sie in Chrome zu dieser Seite",
                "Klicken Sie auf das Installationssymbol in der Adressleiste",
                "Klicken Sie auf <strong>'Installieren'</strong>"
            ],
            benefitTitle: "Vorteil einer Verknüpfung:",
            benefitText: "Die App funktioniert wie eine normale App!",
            close: "Schließen"
        }
    },

    init: function() {
        console.log('🔧 SimpleInstaller initialiseren...');
        
        // Laad taal voorkeur
        const savedLang = localStorage.getItem('appLanguage');
        const defaultLang = savedLang || 'nl';
        
        this.setupEventListeners();
        console.log(`✅ SimpleInstaller setup voltooid (taal: ${defaultLang})`);
    },

    setupEventListeners: function() {
        console.log('🔗 Event listeners instellen...');
        
        // Desktop knop
        const desktopBtn = document.getElementById('pwaInstallBtn');
        if (desktopBtn) {
            desktopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📱 pwaInstallBtn geklikt');
                this.openDialog();
            });
        }
        
        // Mobile knop
        const mobileBtn = document.getElementById('pwaInstallBtnMobile');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📱 pwaInstallBtnMobile geklikt');
                this.openDialog();
            });
        }
        
        console.log('✅ Knoppen gebonden');
    },

    openDialog: function() {
        console.log('🪟 Dialog openen...');
        
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = this.translations[currentLang];
        
        // Verwijder bestaande modal als die er is
        const existingModal = document.getElementById('pwaInstallModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Creëer modal HTML
        const modalHTML = `
        <div class="modal fade" id="pwaInstallModal" tabindex="-1" aria-labelledby="pwaInstallModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="pwaInstallModalLabel">
                            <i class="bi bi-link"></i> ${translations.title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <div class="mb-3">
                                <div style="width: 80px; height: 80px; background: #0d6efd; border-radius: 20px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-database text-white" style="font-size: 2rem;"></i>
                                </div>
                            </div>
                            <h5>Eurasier Friends International</h5>
                            <p class="text-muted">Installeer deze app op je apparaat</p>
                        </div>
                        
                        <div id="installSteps">
                            <h6>${translations.howToInstall}:</h6>
                            
                            <div class="accordion" id="installAccordion">
                                <!-- iPhone/iPad -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#iosSteps">
                                            <i class="bi bi-phone me-2"></i> ${translations.ios}
                                        </button>
                                    </h2>
                                    <div id="iosSteps" class="accordion-collapse collapse show" data-bs-parent="#installAccordion">
                                        <div class="accordion-body">
                                            <ol>
                                                ${translations.iosSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Android -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#androidSteps">
                                            <i class="bi bi-phone me-2"></i> ${translations.android}
                                        </button>
                                    </h2>
                                    <div id="androidSteps" class="accordion-collapse collapse" data-bs-parent="#installAccordion">
                                        <div class="accordion-body">
                                            <ol>
                                                ${translations.androidSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Windows -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#windowsSteps">
                                            <i class="bi bi-laptop me-2"></i> ${translations.windows}
                                        </button>
                                    </h2>
                                    <div id="windowsSteps" class="accordion-collapse collapse" data-bs-parent="#installAccordion">
                                        <div class="accordion-body">
                                            <ol>
                                                ${translations.windowsSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Mac -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#macSteps">
                                            <i class="bi bi-laptop me-2"></i> ${translations.mac}
                                        </button>
                                    </h2>
                                    <div id="macSteps" class="accordion-collapse collapse" data-bs-parent="#installAccordion">
                                        <div class="accordion-body">
                                            <h6>Safari:</h6>
                                            <ol>
                                                ${translations.macSafariSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ol>
                                            
                                            <h6>Chrome:</h6>
                                            <ol>
                                                ${translations.macChromeSteps.map(step => `<li>${step}</li>`).join('')}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-info mt-3">
                            <i class="bi bi-info-circle"></i> 
                            <strong>${translations.benefitTitle}</strong> ${translations.benefitText}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            ${translations.close}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Voeg modal toe aan DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Initialiseer Bootstrap modal
        const modalElement = document.getElementById('pwaInstallModal');
        const modal = new bootstrap.Modal(modalElement);
        
        // Event listeners voor modal
        modalElement.addEventListener('hidden.bs.modal', () => {
            console.log('🔒 Dialog sluiten...');
            setTimeout(() => {
                if (modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
                console.log('✅ Dialog gesloten');
            }, 300);
        });
        
        // Toon modal
        modal.show();
        console.log(`✅ Dialog geopend (taal: ${currentLang})`);
    }
};

// Exporteer als globale functie
window.showPWAInstallModal = function() {
    SimpleInstaller.openDialog();
};

// Initialiseer bij DOM ready
document.addEventListener('DOMContentLoaded', function() {
    SimpleInstaller.init();
});

// OF als het script later wordt geladen
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => SimpleInstaller.init(), 100);
}