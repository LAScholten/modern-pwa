/**
 * Karakter Module - In 3 talen (NL, EN, DE)
 * Bevat alleen het woord "karakter"
 */

// Module vertalingen
const karakterTranslations = {
    nl: {
        title: "Karakter",
        content: "karakter"
    },
    en: {
        title: "Character",
        content: "character"
    },
    de: {
        title: "Charakter",
        content: "charakter"
    }
};

// Initialisatie functie voor de module
function initKarakterModule() {
    const currentLang = localStorage.getItem('appLanguage') || 'nl';
    const translations = karakterTranslations[currentLang] || karakterTranslations.nl;
    
    return `
        <div id="karakterContent">
            <div class="card">
                <div class="card-header bg-info text-white">
                    <h3 class="mb-0" id="karakterTitle">
                        <i class="bi bi-person-heart"></i> ${translations.title}
                    </h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 text-center">
                            <h1>${translations.content}</h1>
                        </div>
                        
                        <!-- Terug knop -->
                        <div class="col-12 mt-4">
                            <button class="btn btn-secondary" onclick="window.showDashboard()">
                                <i class="bi bi-arrow-left"></i> Terug naar Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Vertaal functie voor de module
function translateKarakterModule(lang) {
    const translations = karakterTranslations[lang] || karakterTranslations.nl;
    
    // Update titel
    const titleElement = document.getElementById('karakterTitle');
    if (titleElement) {
        titleElement.innerHTML = `<i class="bi bi-person-heart"></i> ${translations.title}`;
    }
    
    // Update content
    const contentElement = document.querySelector('#karakterContent h1');
    if (contentElement) {
        contentElement.textContent = translations.content;
    }
}

// Maak functies globaal beschikbaar
window.initKarakterModule = initKarakterModule;
window.translateKarakterModule = translateKarakterModule;