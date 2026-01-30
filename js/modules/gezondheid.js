/**
 * Gezondheid Module voor Eurasier Friends International
 * Dit bestand bevat de functionaliteit voor de Gezondheid module
 */

/**
 * Initialiseer de Gezondheid module
 * @returns {string} HTML voor de gezondheid module
 */
function initGezondheidModule() {
    console.log('Initializing Gezondheid module...');
    
    const moduleHTML = `
        <div class="health-module">
            <div class="card">
                <div class="card-header bg-light">
                    <h4 class="mb-0" id="healthTitle">
                        <i class="bi bi-heart-pulse"></i> Gezondheid
                    </h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <h5><i class="bi bi-info-circle"></i> <span id="healthIntroText">Gezondheid</span></h5>
                    </div>
                    
                    <div class="health-content">
                        <p id="healthContentText">
                            gezondheid
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return moduleHTML;
}

/**
 * Vertaal de Gezondheid module
 * @param {string} lang - De taalcode (nl, en, de)
 */
function translateGezondheidModule(lang) {
    console.log('Translating Gezondheid module to:', lang);
    
    // Vertalingen voor de gezondheid module
    const translations = {
        nl: {
            healthTitle: "Gezondheid",
            healthIntroText: "Gezondheid",
            healthContentText: "gezondheid"
        },
        en: {
            healthTitle: "Health",
            healthIntroText: "Health",
            healthContentText: "health"
        },
        de: {
            healthTitle: "Gesundheit",
            healthIntroText: "Gesundheit",
            healthContentText: "gesundheit"
        }
    };
    
    // Selecteer de juiste vertalingen
    const t = translations[lang] || translations.nl;
    
    // Pas alle teksten aan in de module
    const titleElement = document.getElementById('healthTitle');
    if (titleElement) {
        titleElement.innerHTML = `<i class="bi bi-heart-pulse"></i> ${t.healthTitle}`;
    }
    
    const introElement = document.getElementById('healthIntroText');
    if (introElement) {
        introElement.textContent = t.healthIntroText;
    }
    
    const contentElement = document.getElementById('healthContentText');
    if (contentElement) {
        contentElement.textContent = t.healthContentText;
    }
}

// Exporteer de functies zodat ze beschikbaar zijn voor andere scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGezondheidModule,
        translateGezondheidModule
    };
}