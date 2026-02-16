// Initialiseer dashboard module
function initDashboardModule() {
    console.log('Initializing dashboard module...');
    return `
        <div id="dashboardContent">
            <div class="card">
                <div class="card-header bg-light">
                    <h4 class="mb-0"><i class="bi bi-house-door"></i> <span class="app-text" data-key="dashboard">Dashboard</span></h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-success">
                        <h5><i class="bi bi-check-circle"></i> <span class="app-text" data-key="welcomeTitle">Welkom bij de Eurasier Friends International PWA</span></h5>
                        <p class="mb-0"><span class="app-text" data-key="digitalHub">De digitale hub voor Eurasier eigenaren en liefhebbers</span></p>
                    </div>
                    
                    <!-- Over deze applicatie -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5><i class="bi bi-dog"></i> <span class="app-text" data-key="aboutAppTitle">Over deze applicatie:</span></h5>
                        </div>
                        <div class="card-body">
                            <p class="app-text" data-key="aboutAppDesc">Deze Progressive Web App is een platform voor de Eurasier gemeenschap - een plek waar rasliefhebbers alles vinden over de Eurasier.</p>
                        </div>
                    </div>
                    
                    <!-- Kerninhoud & functionaliteiten -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5><i class="bi bi-card-checklist"></i> <span class="app-text" data-key="coreFeaturesTitle">Kerninhoud & functionaliteiten:</span></h5>
                        </div>
                        <div class="card-body">
                            <ul class="mb-0">
                                <li class="app-text" data-key="feature1"><strong>Rasprofiel</strong> - Diepgaande informatie over de Eurasier: karakter, geschiedenis, FCI-rasstandaard</li>
                                <li class="app-text" data-key="feature2"><strong>Database en Galerij</strong> – Stambomen en  foto's van Eurasiers, Dekreuen en Nest aankondigingen</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Voor de ware Eurasier liefhebber -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5><i class="bi bi-heart"></i> <span class="app-text" data-key="forEnthusiastsTitle">Voor de ware Eurasier liefhebber:</span></h5>
                        </div>
                        <div class="card-body">
                            <ul class="mb-0">
                                <li class="app-text" data-key="enthusiast1"><strong>Nieuw eigenaar?</strong> → Leer alles over je nieuwe viervoeter, ook via de facebook pagina</li>
                                <li class="app-text" data-key="enthusiast2"><strong>Fokker?</strong> → Word Gebruiker+ om je eigen honden en nesten in te voeren in de Database</li>
                                <li class="app-text" data-key="enthusiast4"><strong>Overweeg je een Eurasier?</strong> → Ontdek of dit ras bij je levensstijl past, ook via de facebook pagina</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Waarom als PWA -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5><i class="bi bi-stars"></i> <span class="app-text" data-key="pwaBenefitsTitle">Waarom als PWA:</span></h5>
                        </div>
                        <div class="card-body">
                            <ul class="mb-0">
                                <li class="app-text" data-key="benefit1"><strong>Altijd toegankelijk</strong> - Installeer als app op je telefoon of computer, direct vanaf de browser</li>
                                <li class="app-text" data-key="benefit3"><strong>Platform-onafhankelijk</strong> - Werkt op iOS, Android, Windows, macOS</li>
                                <li class="app-text" data-key="benefit4"><strong>Geen app store nodig</strong> - Direct installeren, altijd up-to-date</li>
                                <li class="app-text" data-key="benefit5"><strong>Spaart opslagruimte</strong> - Lichtgewicht maar volledig functioneel</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Hoe te gebruiken -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h5><i class="bi bi-phone"></i> <span class="app-text" data-key="howToUseTitle">Hoe te gebruiken:</span></h5>
                        </div>
                        <div class="card-body">
                            <p class="app-text" data-key="howToUseDesc">Bezoek de website → Blader door rasinformatie → Installeer met één klik → Heb altijd je Eurasier gids bij de hand, waar je ook bent!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Functie om dashboard te tonen
function showDashboard() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('mainContent element niet gevonden');
        return;
    }
    
    mainContent.innerHTML = initDashboardModule();
    
    // Update vertalingen
    const currentLang = localStorage.getItem('appLanguage') || 'nl';
    translateDashboardModule(currentLang);
}

// Vertaal dashboard module
function translateDashboardModule(lang) {
    const translations = {
        nl: {
            dashboard: "Dashboard",
            welcomeTitle: "Welkom bij de Eurasier Friends International PWA",
            digitalHub: "De digitale hub voor Eurasier eigenaren en liefhebbers",
            aboutAppTitle: "🐕 Over deze applicatie:",
            aboutAppDesc: "Deze Progressive Web App is een platform voor de Eurasier gemeenschap - een plek waar rasliefhebbers alles vinden over de Eurasier.",
            coreFeaturesTitle: "📋 Kerninhoud & functionaliteiten:",
            feature1: "• Rasprofiel - Diepgaande informatie over de Eurasier: karakter, geschiedenis, FCI-rasstandaard",
            feature2: "• Database en Galerij – Stambomen en  foto's van Eurasiers, Dekreuen en Nest aankondigingen",
            forEnthusiastsTitle: "❤️ Voor de ware Eurasier liefhebber:",
            enthusiast1: "• Nieuw eigenaar? → Leer alles over je nieuwe viervoeter, ook via de facebook pagina",
            enthusiast2: "• Fokker? → Word Gebruiker+ om je eigen honden en nesten in te voeren in de Database",
            enthusiast4: "• Overweeg je een Eurasier? → Ontdek of dit ras bij je levensstijl past, ook via de facebook pagina",
            pwaBenefitsTitle: "✨ Waarom als PWA:",
            benefit1: "• Altijd toegankelijk - Installeer als app op je telefoon of computer, direct vanaf de browser",
            benefit3: "• Platform-onafhankelijk - Werkt op iOS, Android, Windows, macOS",
            benefit4: "• Geen app store nodig - Direct installeren, altijd up-to-date",
            benefit5: "• Spaart opslagruimte - Lichtgewicht maar volledig functioneel",
            howToUseTitle: "📱 Hoe te gebruiken:",
            howToUseDesc: "Bezoek de website → Blader door rasinformatie → Installeer met één klik → Heb altijd je Eurasier gids bij de hand, waar je ook bent!"
        },
        en: {
            dashboard: "Dashboard",
            welcomeTitle: "Welcome to the Eurasier Friends International PWA",
            digitalHub: "The digital hub for Eurasier owners and enthusiasts",
            aboutAppTitle: "🐕 About this application:",
            aboutAppDesc: "This Progressive Web App is a platform for the Eurasier community - a place where breed enthusiasts can find everything about the Eurasier.",
            coreFeaturesTitle: "📋 Core content & functionalities:",
            feature1: "• Breed Profile - In-depth information about the Eurasier: character, history, FCI breed standard",
            feature2: "• Database and Gallery – Pedigrees and photos of Eurasiers, Stud dogs and Litter announcements",
            forEnthusiastsTitle: "❤️ For the true Eurasier enthusiast:",
            enthusiast1: "• New owner? → Learn everything about your new four-legged friend, also on the facebook page",
            enthusiast2: "• Breeder? → Become User+ to enter your own dogs and litters in the Database",
            enthusiast4: "• Considering a Eurasier? → Discover if this breed fits your lifestyle, also on the facebook page",
            pwaBenefitsTitle: "✨ Why as a PWA:",
            benefit1: "• Always accessible - Install as an app on your phone or computer, directly from the browser",
            benefit3: "• Platform-independent - Works on iOS, Android, Windows, macOS",
            benefit4: "• No app store needed - Install directly, always up-to-date",
            benefit5: "• Saves storage space - Lightweight yet fully functional",
            howToUseTitle: "📱 How to use:",
            howToUseDesc: "Visit the website → Browse breed information → Install with one click → Always have your Eurasier guide at hand, wherever you are!."
        },
        de: {
            dashboard: "Dashboard",
            welcomeTitle: "Willkommen bei der Eurasier Friends International PWA",
            digitalHub: "Die digitale Drehscheibe für Eurasier-Besitzer und -Liebhaber",
            aboutAppTitle: "🐕 Über diese Anwendung:",
            aboutAppDesc: "Diese Progressive Web App ist eine Plattform für die Eurasier-Gemeinschaft - ein Ort, an dem Rassenliebhaber alles über den Eurasier finden können.",
            coreFeaturesTitle: "📋 Kerninhalte & Funktionalitäten:",
            feature1: "• Rasseprofil - Tiefgehende Informationen über den Eurasier: Charakter, Geschichte, FCI-Rassestandard",
            feature2: "• Datenbank und Galerie – Ahnentafel und Fotos von Eurasier, Deckrüden und Wurf Ankündigungen",
            forEnthusiastsTitle: "❤️ Für den echten Eurasier-Liebhaber:",
            enthusiast1: "• Neuer Besitzer? → Erfahren Sie alles über Ihren neuen Vierbeiner, auch über die Facebook-Seite",
            enthusiast2: "• Züchter? → Werden Sie Benutzer+, um Ihre eigenen Hunde und Würfe in die Datenbank einzutragen",
            enthusiast4: "• Überlegen Sie einen Eurasier? → Entdecken Sie, ob diese Rasse zu Ihrem Lebensstil passt, auch über die Facebook-Seite",
            pwaBenefitsTitle: "✨ Warum als PWA:",
            benefit1: "• Immer zugänglich - Als App auf Ihrem Telefon oder Computer installieren, direkt über den Browser",
            benefit3: "• Plattformunabhängig - Funktioniert auf iOS, Android, Windows, macOS",
            benefit4: "• Kein App Store nötig - Direkt installieren, immer aktuell",
            benefit5: "• Spart Speicherplatz - Leichtgewichtig aber voll funktionsfähig",
            howToUseTitle: "📱 Wie zu verwenden:",
            howToUseDesc: "Besuchen Sie die Website → Durchsuchen Sie Rasseinformationen → Mit einem Klick installieren → Haben Sie Ihren Eurasier-Guide immer zur Hand, wo immer Sie sind!"
        }
    };
    
    const elements = document.querySelectorAll('#dashboardContent .app-text');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}