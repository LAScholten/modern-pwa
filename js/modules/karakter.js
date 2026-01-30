/**
 * Karakter Module - In 3 talen (NL, EN, DE)
 * Identieke styling als boek.js module
 */

// Module vertalingen
const karakterTranslations = {
    nl: {
        title: "Karakter",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h1 class="display-1 fw-bold">karakter</h1>
                        <p class="lead mt-3">De essentie van het karakter van de Eurasier</p>
                    </div>
                </div>
            </div>
        `
    },
    en: {
        title: "Character",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h1 class="display-1 fw-bold">character</h1>
                        <p class="lead mt-3">The essence of the Eurasier character</p>
                    </div>
                </div>
            </div>
        `
    },
    de: {
        title: "Charakter",
        content: `
            <div class="karakter-content">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h1 class="display-1 fw-bold">charakter</h1>
                        <p class="lead mt-3">Die Essenz des Eurasier-Charakters</p>
                    </div>
                </div>
            </div>
        `
    }
};

// Functie om karakter module te initialiseren
function initKarakterModule() {
    console.log('Karakter module initialiseren...');
    
    // Creëer de module HTML - exact dezelfde structuur als boek.js
    const karakterHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-person-heart"></i> 
                        <span id="karakterTitle">Karakter</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <div id="karakterContent">${karakterTranslations.nl.content}</div>
            </div>
        </div>
    `;
    
    return karakterHTML;
}

// Functie om karakter module te vertalen
function translateKarakterModule(lang) {
    const karakterTitle = document.getElementById('karakterTitle');
    const karakterContent = document.getElementById('karakterContent');
    
    if (karakterTitle && karakterTranslations[lang]) {
        karakterTitle.textContent = karakterTranslations[lang].title;
    }
    
    if (karakterContent && karakterTranslations[lang]) {
        karakterContent.innerHTML = karakterTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initKarakterModule,
        translateKarakterModule,
        karakterTranslations
    };
} else {
    // Maak functies globaal beschikbaar voor browser gebruik
    window.initKarakterModule = initKarakterModule;
    window.translateKarakterModule = translateKarakterModule;
}