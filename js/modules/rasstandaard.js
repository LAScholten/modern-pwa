// modules/rasstandaard.js

// Rasstandaard module vertalingen
const rasstandaardTranslations = {
    nl: {
        title: "Rasstandaard",
        content: "Rasstandaard"
    },
    en: {
        title: "Breed Standard",
        content: "Breed Standard"
    },
    de: {
        title: "Rassestandard",
        content: "Rassestandard"
    }
};

// Functie om rasstandaard module te initialiseren
function initRasstandaardModule() {
    console.log('Rasstandaard module initialiseren...');
    
    // Creëer de module HTML
    const rasstandaardHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-file-earmark-text"></i> 
                        <span id="rasstandaardTitle">Rasstandaard</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <h4 id="rasstandaardContent">Rasstandaard</h4>
            </div>
        </div>
    `;
    
    return rasstandaardHTML;
}

// Functie om rasstandaard module te vertalen
function translateRasstandaardModule(lang) {
    const rasstandaardTitle = document.getElementById('rasstandaardTitle');
    const rasstandaardContent = document.getElementById('rasstandaardContent');
    
    if (rasstandaardTitle && rasstandaardTranslations[lang]) {
        rasstandaardTitle.textContent = rasstandaardTranslations[lang].title;
    }
    
    if (rasstandaardContent && rasstandaardTranslations[lang]) {
        rasstandaardContent.textContent = rasstandaardTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRasstandaardModule,
        translateRasstandaardModule,
        rasstandaardTranslations
    };
}